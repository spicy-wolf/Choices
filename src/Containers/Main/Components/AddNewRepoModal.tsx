import React, { useState } from 'react';
import * as Utils from '@src/Utils';
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
import Link from '@mui/material/Link';
import { Trans } from 'react-i18next';

enum SourceFromEnum {
  Url = 1,
  File = 2,
}

type AddNewRepoModalProps = {
  open: boolean;
  onClose: () => void;
  onLoadFromUrl: (url: string, urlAccessToken: string) => Promise<void>;
  onLoadFromFile: (sourceFile: Blob) => Promise<void>;
};

const AddNewRepoModal = (props: AddNewRepoModalProps) => {
  const [selectedSourceFrom, setSelectedSourceFrom] = useState<SourceFromEnum>(
    SourceFromEnum.Url
  );

  // Form data
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [urlAccessToken, setUrlAccessToken] = useState<string>('');
  const [sourceFile, setSourceFile] = useState<File>();

  const onLoadFromUrl = (): void => {
    if (!isValidUrl) return;
    props.onLoadFromUrl(sourceUrl, urlAccessToken);
  };

  const onLoadFromFile = (): void => {
    if (!isValidFile) return;
    props.onLoadFromFile(sourceFile);
  };

  const isValidUrl = React.useMemo(() => {
    try {
      // try to create a url to check url format
      const url = new URL(sourceUrl);
      return true;
    } catch (ex) {
      return false;
    }
  }, [sourceUrl]);

  const isValidFile = React.useMemo(() => {
    return !!sourceFile;
  }, [sourceFile]);

  // const onHideWrapper = () => {
  //   setSourceUrl('');
  //   setUrlAccessToken('');
  //   setSourceFile(null);
  //   props.onClose();
  // };

  return (
    <Dialog open={!!props.open} onClose={props.onClose} maxWidth="md" fullWidth>
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
              error={!isValidUrl}
              label={<Trans i18nKey="addNewRepoModal.url.label" />}
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value)}
            />
            <FormHelperText>
              <Trans i18nKey="addNewRepoModal.urlFormat.label" />
              <Link
                href="https://docs.github.com/rest/repos/contents#get-repository-content"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </Link>
            </FormHelperText>
            <TextField
              label={<Trans i18nKey="addNewRepoModal.token.label" />}
              value={urlAccessToken}
              onChange={(event) => setUrlAccessToken(event.target.value)}
            />
            <FormHelperText>
              <Trans i18nKey="addNewRepoModal.generateTokenHelperMsg.label" />
              <Link
                href="https://github.com/settings/tokens/new"
                rel="noreferrer"
                target="_blank"
              >
                Github
              </Link>
            </FormHelperText>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>
            <Trans i18nKey="addNewRepoModal.cancel.label" />
          </Button>
          <Button onClick={onLoadFromUrl} disabled={!isValidUrl}>
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
          <Button onClick={props.onClose}>
            <Trans i18nKey="addNewRepoModal.cancel.label" />
          </Button>
          <Button onClick={onLoadFromFile} disabled={!isValidFile}>
            <Trans i18nKey="addNewRepoModal.confirm.label" />
          </Button>
        </DialogActions>
      </TabPanel>
    </Dialog>
  );
};

const TabPanel = (props: { show: boolean; children: React.ReactNode }) => {
  return (
    <div role="tabpanel" hidden={!props.show}>
      {props.children}
    </div>
  );
};

export default AddNewRepoModal;
