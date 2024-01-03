/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack/Stack';
import FormHelperText from '@mui/material/FormHelperText';
import { Trans, useTranslation } from 'react-i18next';
import * as Database from '@src/Database';
import useMetadataList from '../Hooks/useMetadataList';
import { LoadingIndicatorModal } from '@src/Containers/components/LoadingIndicatorModal';
import { YesNoModal } from '@src/Containers/components/YesNoModal';

enum SourceFromEnum {
  Url = 1,
  File = 2,
}

type AddNewRepoProps = {
  openInputModal: boolean;
  closeInputModal: () => void;
  metadataListLoader: ReturnType<typeof useMetadataList>;
};

export const AddNewRepo = (props: AddNewRepoProps) => {
  const { t } = useTranslation();

  const [selectedSourceFrom, setSelectedSourceFrom] = useState<SourceFromEnum>(
    SourceFromEnum.Url
  );
  const [pendingOverwriteRepo, setPendingOverwriteRepo] = React.useState<Database.Types.RepoMetadataType>(null);

  const [repoLoadingMsg, setRepoLoadingMsg] = React.useState<string>();
  const [repoLoadingErrorMsg, setRepoLoadingErrorMsg] = React.useState<string>('');

  // Form data
  const [sourceUrl, setSourceUrl] = useState<string>();
  const [sourceFile, setSourceFile] = useState<File>();

  const onLoadFromUrl = async (): Promise<void> => {
    if (!isValidUrl) return;
    props.closeInputModal();

    try {
      setRepoLoadingErrorMsg('');
      setRepoLoadingMsg(t('loadingStatus.downloadScript'));
      const url = new URL(sourceUrl);

      if (!url) throw t('loadingStatus.invalidUrl');

      const response = await fetch(sourceUrl, {
        method: 'GET',
        mode: 'no-cors'
      });
      const jsonObj: Database.Types.RepoMetadataType = await response.json();

      await onLoadFromJsonObj(jsonObj);
    } catch (ex) {
      setRepoLoadingErrorMsg(ex);
    } finally {
      setRepoLoadingMsg('');
    }
  };

  const onLoadFromFile = async (): Promise<void> => {
    if (!isValidFile) return;
    props.closeInputModal();

    try {
      setRepoLoadingErrorMsg('');
      setRepoLoadingMsg(t('loadingStatus.parseScript'));

      const jsonObj = JSON.parse(await sourceFile.text());
      await onLoadFromJsonObj(jsonObj);
    } catch (ex) {
      setRepoLoadingErrorMsg(ex);
    } finally {
      setRepoLoadingMsg('');
    }
  };

  const onLoadFromJsonObj = async (metadataWithScript: Database.Types.RepoMetadataType) => {
    if (!metadataWithScript) {
      throw t('loadingStatus.invalidScript');
    }

    // TODO: validation

    // insert into DB
    try {
      setRepoLoadingMsg(t('loadingStatus.addToDb'));
      if (props.metadataListLoader?.metadataList?.find(item => item.author === metadataWithScript.author && item.repoName === metadataWithScript.repoName)) {
        setPendingOverwriteRepo(metadataWithScript);
      } else {
        const { script, ...metadata } = metadataWithScript;
        await props.metadataListLoader?.addMetadataWithScript(metadata, script);
      }
    } catch (ex) {
      setRepoLoadingErrorMsg(ex);
    }
  };

  const isValidUrl = React.useMemo(() => {
    try {
      // try to create a url to check url format
      new URL(sourceUrl);
      return true;
    } catch (ex) {
      return false;
    }
  }, [sourceUrl]);

  const isValidFile = React.useMemo(() => {
    return !!sourceFile;
  }, [sourceFile]);

  return (<>
    {/* loading indicator */}
    <LoadingIndicatorModal
      open={!!repoLoadingMsg || !!repoLoadingErrorMsg}
      loadingLabel={repoLoadingMsg}
      error={repoLoadingErrorMsg}
      handleClose={() => {
        setRepoLoadingErrorMsg('');
        setRepoLoadingMsg('');
      }}
    />
    {/* overwrite repo modal */}
    <YesNoModal
      open={!!pendingOverwriteRepo}
      title={t('overwriteRepoModal.title', {
        repoName: pendingOverwriteRepo?.repoName ?? '',
        author: pendingOverwriteRepo?.author ?? ''
      }
      )}
      body={t('overwriteRepoModal.body')}
      onClose={() => setPendingOverwriteRepo(null)}
      onConfirm={async () => {
        try {
          const { script, ...metadata } = pendingOverwriteRepo;
          await props.metadataListLoader?.putMetadataWithScript(metadata, script);
        } catch (ex) {
          setRepoLoadingErrorMsg(ex);
        } finally {
          setPendingOverwriteRepo(null);
        }
      }}
    />
    {/* main modal for url/file input */}
    <Dialog open={!!props.openInputModal} onClose={props.closeInputModal} maxWidth="md" fullWidth>
      <DialogTitle>
        <Trans i18nKey="addNewRepoModal.label" />
      </DialogTitle>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedSourceFrom}
          onChange={(event, newValue) => setSelectedSourceFrom(newValue)}
        >
          <Tab
            label={<Trans i18nKey="addNewRepoModal.url.label" />}
            value={SourceFromEnum.Url}
          />
          <Tab
            label={<Trans i18nKey="addNewRepoModal.uploadFile.label" />}
            value={SourceFromEnum.File}
          />
        </Tabs>
      </Box>
      <TabPanel show={selectedSourceFrom === SourceFromEnum.Url}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              required
              error={!isValidUrl && sourceUrl !== undefined}
              label={<Trans i18nKey="addNewRepoModal.url.label" />}
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value)}
            />
            <FormHelperText>
              <Trans i18nKey="addNewRepoModal.urlFormat.label" />
            </FormHelperText>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeInputModal}>
            <Trans i18nKey="addNewRepoModal.cancel.label" />
          </Button>
          <Button onClick={onLoadFromUrl} disabled={!isValidUrl} variant="contained" >
            <Trans i18nKey="addNewRepoModal.confirm.label" />
          </Button>
        </DialogActions>
      </TabPanel>
      <TabPanel show={selectedSourceFrom === SourceFromEnum.File}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              disabled
              label={
                <Trans i18nKey="addNewRepoModal.selectedFile.noFileSelected" />
              }
              value={sourceFile?.name ?? ''}
            />
            <Button variant="contained" component="label">
              <Trans i18nKey="addNewRepoModal.selectFileBtn.label" />
              <input
                type="file"
                hidden
                multiple={false}
                onChange={(event) => setSourceFile(event.target.files?.[0])}
              />
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeInputModal}>
            <Trans i18nKey="addNewRepoModal.cancel.label" />
          </Button>
          <Button onClick={onLoadFromFile} disabled={!isValidFile} variant="contained" >
            <Trans i18nKey="addNewRepoModal.confirm.label" />
          </Button>
        </DialogActions>
      </TabPanel>
    </Dialog>
  </>
  );
};

const TabPanel = (props: { show: boolean; children: React.ReactNode }) => {
  return (
    <div role="tabpanel" hidden={!props.show}>
      {props.children}
    </div>
  );
};

