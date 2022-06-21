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
      <DialogTitle>Add New</DialogTitle>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedSourceFrom}
          onChange={(event, newValue) => setSelectedSourceFrom(newValue)}
        >
          <Tab label="Url" value={SourceFromEnum.Url} />
          <Tab label="Upload File" value={SourceFromEnum.File} />
        </Tabs>
      </Box>
      <TabPanel show={selectedSourceFrom === SourceFromEnum.Url}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              required
              error={!isValidUrl}
              label="URL"
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value)}
            />
            <FormHelperText>
              How to{' '}
              <Link
                href="https://docs.github.com/cn/rest/repos/contents#get-repository-content"
                rel="noreferrer"
                target="_blank"
              >
                use github api to get contents
              </Link>
            </FormHelperText>
            <TextField
              label="Token"
              value={urlAccessToken}
              onChange={(event) => setUrlAccessToken(event.target.value)}
            />
            <FormHelperText>
              Github{' '}
              <Link
                href="https://github.com/settings/tokens/new"
                rel="noreferrer"
                target="_blank"
              >
                generate an access token
              </Link>
            </FormHelperText>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button onClick={onLoadFromUrl} disabled={!isValidUrl}>
            Add
          </Button>
        </DialogActions>
      </TabPanel>
      <TabPanel show={selectedSourceFrom === SourceFromEnum.File}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              disabled
              label="Selected file"
              value={sourceFile?.name ?? ''}
            />
            <Button variant="contained" component="label">
              Select a file
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
          <Button onClick={props.onClose}>Cancel</Button>
          <Button onClick={onLoadFromFile} disabled={!isValidFile}>
            Add
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
