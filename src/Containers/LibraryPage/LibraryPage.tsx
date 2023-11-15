import React, { useEffect } from 'react';
// import { RouterPathStrings } from '@src/Constants';
// import * as Utils from '@src/Utils';
import useMetadataList from './Hooks/useMetadataList';
import { RepoCard } from './Components/RepoCard';
import CssBaseline from '@mui/material/CssBaseline/CssBaseline';
import Container from '@mui/material/Container/Container';
import Grid from '@mui/material/Grid/Grid';
import Fab from '@mui/material/Fab/Fab';
import AddIcon from '@mui/icons-material/Add';
import { LoadingIndicatorModal } from '@src/Containers/components';
import AddNewRepoModal from './Components/AddNewRepoModal';
import { useTranslation } from 'react-i18next';
import {
  MainPageSidebar,
  MainPageSidebarButtonEnum,
} from '../components/MainPageSidebar';
import * as Database from '@src/Database';

const LibraryPage = () => {
  const { t } = useTranslation();

  //#region query param
  // TODO: load src from URL
  // const query = Utils.useQuery();
  // const src = query.get(RouterPathStrings.LIBRARY_PAGE_SRC_PARAM);
  //#endregion

  //#region state
  const [showAddModal, setShowAddModal] = React.useState<boolean>();
  const [showLoadingModal, setShowLoadingModal] =
    React.useState<boolean>(false);
  const [repoLoadingMsg, setRepoLoadingMsg] = React.useState<string>();
  const [repoLoadingErrorMsg, setRepoLoadingErrorMsg] =
    React.useState<string>('');
  //#endregion

  //#region hooks
  const metadataListLoader = useMetadataList();
  //#endregion

  const loadingLabel = React.useMemo(() => {
    let loadingMsg = repoLoadingMsg || '';
    if (!metadataListLoader?.metadataList) {
      loadingMsg = t('loadingStatus.loadReadingList');
    }

    return loadingMsg;
  }, [metadataListLoader?.metadataList, repoLoadingMsg]);

  const loadingError = React.useMemo(() => {
    const errorMsg = metadataListLoader?.error || repoLoadingErrorMsg || '';
    return errorMsg;
  }, [metadataListLoader?.error, repoLoadingErrorMsg]);

  useEffect(() => {
    if (!!loadingLabel || !!loadingError) {
      setShowLoadingModal(true);
    } else {
      setShowLoadingModal(false);
    }
  }, [loadingLabel, loadingError]);

  const onLoadFromUrl = async (urlStr: string, urlAccessToken: string) => {
    // hide add modal
    setShowAddModal(false);
    // clear prev error
    setRepoLoadingErrorMsg('');

    try {
      setRepoLoadingMsg(t('loadingStatus.downloadScript'));
      const url = new URL(urlStr);

      if (!url) throw t('loadingStatus.invalidUrl');

      let jsonObj: Parameters<typeof onLoadFromJsonObj>[0] = null; //TODO: looks ugly
      if (url.host === 'api.github.com') {
        // github API
        // https://docs.github.com/rest/repos/contents#get-repository-content
        const httpHeader: HeadersInit = {
          Accept: 'application/vnd.github.v3.raw',
        };
        if (urlAccessToken) {
          httpHeader.Authorization = `token ${urlAccessToken}`;
        }

        const response = await fetch(urlStr, {
          method: 'GET',
          mode: 'cors',
          referrerPolicy: 'no-referrer',
          headers: httpHeader,
        });
        jsonObj = await response.json();
      } else {
        const response = await fetch(urlStr, {
          method: 'GET',
        });
        jsonObj = await response.json();
      }

      await onLoadFromJsonObj(jsonObj);
    } catch (ex) {
      setRepoLoadingErrorMsg(ex);
    } finally {
      setRepoLoadingMsg('');
    }
  };

  const onLoadFromFile = async (sourceFile: Blob) => {
    // hide add modal
    setShowAddModal(false);
    // clear prev error
    setRepoLoadingErrorMsg('');

    setRepoLoadingMsg(t('loadingStatus.parseScript'));

    try {
      const json = JSON.parse(await sourceFile.text());
      await onLoadFromJsonObj(json);
    } catch (ex) {
      setRepoLoadingErrorMsg(ex);
    } finally {
      setRepoLoadingMsg('');
    }
  };

  const onLoadFromJsonObj = async (jsonObj: {metadata: Database.Types.RepoMetadataType, script:  Database.Types.ScriptType}) => {
    const metadata = jsonObj?.metadata;
    const script = jsonObj?.script;
    if (!metadata || !script) {
      throw t('loadingStatus.invalidScript');
    }

    // TODO: validation

    // insert into DB
    setRepoLoadingMsg(t('loadingStatus.addToDb'));
    await metadataListLoader?.addMetadata(metadata, script);
  };

  const metadataElements: JSX.Element[] = React.useMemo(() => {
    let result: JSX.Element[] = [];
    if (metadataListLoader?.metadataList) {
      result = metadataListLoader?.metadataList.map((item) => (
        <Grid key={item.id} item xs={12} md={4}>
          <RepoCard
            item={item}
            deleteMetadata={metadataListLoader?.deleteMetadata}
          />
        </Grid>
      ));
    }
    return result;
  }, [metadataListLoader?.metadataList]);

  return (
    <>
      <CssBaseline />
      <LoadingIndicatorModal
        loadingLabel={loadingLabel}
        error={loadingError}
        open={!!showLoadingModal}
        handleClose={() => setShowLoadingModal(false)}
      />
      <AddNewRepoModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onLoadFromUrl={onLoadFromUrl}
        onLoadFromFile={onLoadFromFile}
      />
      <Container sx={{ display: 'flex' }}>
        <MainPageSidebar selected={MainPageSidebarButtonEnum.Library} />
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="stretch"
          sx={{ pt: 1 }}
        >
          {metadataElements}
        </Grid>
      </Container>
      <Fab
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
        }}
        size="small"
        color="secondary"
        aria-label="add"
        onClick={() => setShowAddModal(true)}
      >
        <AddIcon />
      </Fab>
    </>
  );
};

export default LibraryPage;
