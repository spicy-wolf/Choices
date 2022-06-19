import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const LoadingIndicatorModal = (props: { loadingLabel: string }) => {
  return (
    <Modal show={!!props.loadingLabel} backdrop="static" size="lg" centered>
      <Modal.Header>
        <Modal.Title>Loading</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>{props.loadingLabel}</p>
      </Modal.Body>
    </Modal>
  );
};

export default LoadingIndicatorModal;
