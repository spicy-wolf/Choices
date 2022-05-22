import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

enum SourceFromEnum {
  Url = 1,
  File = 2,
}

const AddNewRepoModal = (props: { onLoad: () => Promise<void> }) => {
  const [selectedSourceFrom, setSelectedSourceFrom] = useState<SourceFromEnum>(
    SourceFromEnum.Url
  );
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event: {
    currentTarget: any;
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    const form = event.currentTarget;
    const isValid = form.checkValidity();
    setValidated(isValid);
    if (isValid) {
      await props.onLoad();
    }

    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
        <Form.Group controlId="formSrc" className="mb-3 ">
          <Form.Label>Release Zip URL</Form.Label>
          <Form.Control type="text" required />
        </Form.Group>
      )}
      {selectedSourceFrom === SourceFromEnum.File && (
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Zip File</Form.Label>
          <Form.Control type="file" required />
        </Form.Group>
      )}
      <Button variant="primary" type="submit">
        Go
      </Button>
    </Form>
  );
};

export default AddNewRepoModal;
