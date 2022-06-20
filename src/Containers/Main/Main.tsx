import React, { useEffect } from 'react';
import { RouterPathStrings } from '@src/Constants';
import * as Utils from '@src/Utils';
import useMetadataList from './Hooks/useMetadataList';
import { RepoCard } from './Components/RepoCard';
import { useDbContext } from '@src/Context/DbContext';
import CssBaseline from '@mui/material/CssBaseline/CssBaseline';
import Container from '@mui/material/Container/Container';
import Grid from '@mui/material/Grid/Grid';
import Fab from '@mui/material/Fab/Fab';
import AddIcon from '@mui/icons-material/Add';
import LoadingIndicatorModal from '@src/Containers/LoadingIndicatorModal/LoadingIndicatorModal';
import AddNewRepoModal from './Components/AddNewRepoModal';

const Main = () => {
  const { dbContext } = useDbContext();

  //#region query param
  const query = Utils.useQuery();
  const src = query.get(RouterPathStrings.MAIN_PAGE_SRC_PARAM);
  //#endregion

  //#region state
  const [showAddModal, setShowAddModal] = React.useState<boolean>();
  const [showLoadingModal, setShowLoadingModal] =
    React.useState<boolean>(false);
  const [repoLoadingMsg, setRepoLoadingMsg] = React.useState<string>();
  const [repoLoadingErrorMsg, setRepoLoadingErrorMsg] =
    React.useState<string>();
  //#endregion

  //#region hooks
  const [metadataList, metadataListLoadingError] = useMetadataList();
  //#endregion

  const loadingLabel = React.useMemo(() => {
    let loadingMsg = repoLoadingMsg || '';
    if (!metadataList) {
      loadingMsg = 'Loading reading list.';
    }

    return loadingMsg;
  }, [metadataList, repoLoadingMsg]);

  const loadingError = React.useMemo(() => {
    const errorMsg = metadataListLoadingError || repoLoadingErrorMsg || '';
    return errorMsg;
  }, [metadataListLoadingError, repoLoadingErrorMsg]);

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

    try {
      setRepoLoadingMsg(`Download script`);
      const url = new URL(urlStr);

      if (!url) throw 'Invalid Url';

      let jsonObj: any = null;
      if (url.host === 'api.github.com') {
        // github API
        // https://docs.github.com/cn/rest/repos/contents#get-repository-content
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
    setRepoLoadingMsg(`Parse file`);

    try {
      const json = JSON.parse(await sourceFile.text());
      await onLoadFromJsonObj(json);
    } catch (ex) {
      setRepoLoadingErrorMsg(ex);
    } finally {
      setRepoLoadingMsg('');
    }
  };

  const onLoadFromJsonObj = async (jsonObj: any) => {
    const metadata = jsonObj?.metadata;
    const script = jsonObj?.script;
    if (!metadata || !script) {
      throw `Invalid data. please make sure data has 'metadata' and 'script'`;
    }

    // TODO: validation

    // insert into DB
    setRepoLoadingMsg('Update DB');
    dbContext.addMetadata(metadata, script);
  };

  const metadataElements: JSX.Element[] = React.useMemo(() => {
    let result: JSX.Element[] = [];
    if (metadataList) {
      result = metadataList.map((item) => (
        <Grid key={item.id} item xs={12} md={4}>
          <RepoCard item={item} />
        </Grid>
      ));
    }
    return result;
  }, [metadataList]);

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
      <Container sx={{ pt: 1 }}>
        <Grid container spacing={2} direction="row" alignItems="stretch">
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

export default Main;
