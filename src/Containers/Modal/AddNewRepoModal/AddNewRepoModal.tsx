import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import * as Utils from '@src/Utils';

enum SourceFromEnum {
  Url = 1,
  File = 2,
}

type AddNewRepoModalProps = {
  show: boolean;
  onHide: () => void;
  onLoadFromUrl: (url: string, urlAccessToken: string) => Promise<void>;
  onLoadFromFile: (sourceFile: Blob) => Promise<void>;
};
const SOURCE_URL_FIELD = 'sourceUrl';
const URL_ACCESS_TOKEN_FIELD = 'urlAccessToken';
const SOURCE_FILE_FIELD = 'sourceFile';

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

  const onHideWrapper = () => {
    setSourceUrl('');
    setUrlAccessToken('');
    setSourceFile(null);
    props.onHide();
  };

  return (
    <Modal
      show={!!props.show}
      backdrop="static"
      size="lg"
      centered
      onHide={onHideWrapper}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Check
              inline
              label="Url"
              name="SourceFrom"
              type="radio"
              value={SourceFromEnum.Url}
              checked={selectedSourceFrom === SourceFromEnum.Url}
              onChange={(e) => setSelectedSourceFrom(+e.currentTarget.value)}
            />
            <Form.Check
              inline
              label="Upload File"
              name="SourceFrom"
              type="radio"
              value={SourceFromEnum.File}
              checked={selectedSourceFrom === SourceFromEnum.File}
              onChange={(e) => setSelectedSourceFrom(+e.currentTarget.value)}
            />
          </Form.Group>

          {selectedSourceFrom === SourceFromEnum.Url && (
            <>
              <Form.Group controlId={SOURCE_URL_FIELD} className="mb-3">
                <Form.Label>URL</Form.Label>
                <Form.Control
                  type="text"
                  value={sourceUrl}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const value = event.currentTarget.value;
                    setSourceUrl(value);
                  }}
                  isInvalid={!isValidUrl}
                  isValid={isValidUrl}
                />
                <Form.Text className="text-muted">
                  <a href="https://docs.github.com/cn/rest/repos/contents#get-repository-content">
                    Use github api to get contents
                  </a>
                </Form.Text>
                {!!sourceUrl && (
                  <Form.Control.Feedback type="invalid">
                    Invalid url
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Form.Group controlId={URL_ACCESS_TOKEN_FIELD} className="mb-3">
                <Form.Label>Access Token (optional)</Form.Label>
                <Form.Control
                  type="text"
                  value={urlAccessToken}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const value = event.currentTarget.value;
                    setUrlAccessToken(value);
                  }}
                />
                <Form.Text className="text-muted">
                  <p>
                    Github{' '}
                    <a href="https://github.com/settings/tokens/new">
                      generate an access token
                    </a>
                  </p>
                </Form.Text>
              </Form.Group>
              <Button
                variant="primary"
                disabled={!isValidUrl}
                onClick={onLoadFromUrl}
              >
                Go
              </Button>
            </>
          )}
          {selectedSourceFrom === SourceFromEnum.File && (
            <>
              <Form.Group controlId={SOURCE_FILE_FIELD} className="mb-3">
                <Form.Label>Script File</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const value = event.currentTarget.files?.[0];
                    setSourceFile(value);
                  }}
                  isInvalid={!isValidFile}
                  isValid={isValidFile}
                />
                {!!sourceFile && (
                  <Form.Control.Feedback type="invalid">
                    Invalid file
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={!isValidFile}
                onClick={onLoadFromFile}
              >
                Go
              </Button>
            </>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddNewRepoModal;
