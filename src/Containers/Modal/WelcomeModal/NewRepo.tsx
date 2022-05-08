import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

enum SourceFromEnum {
  RepoUrl = 1,
  File = 2,
}

const NewRepo = () => {
  const [selectedSourceFrom, setSelectedSourceFrom] = useState<SourceFromEnum>(
    SourceFromEnum.RepoUrl
  );
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event: {
    currentTarget: any;
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    const form = event.currentTarget;
    const isValid = form.checkValidity();
    setValidated(isValid);
    if (isValid) {
    }

    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Author</Form.Label>
        <Form.Control type="text" required />
        <Form.Control.Feedback type="invalid">Required</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Repo</Form.Label>
        <Form.Control type="text" required />
        <Form.Control.Feedback type="invalid">Required</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          inline
          label="Repo Url"
          name="SourceFrom"
          type="radio"
          value={SourceFromEnum.RepoUrl}
          checked={selectedSourceFrom === SourceFromEnum.RepoUrl}
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

      {selectedSourceFrom === SourceFromEnum.RepoUrl && (
        <Form.Group className="mb-3 ">
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

export default NewRepo;
