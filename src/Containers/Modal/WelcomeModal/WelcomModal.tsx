import React from 'react';
import { Button, Form, Modal, Tab, Tabs } from 'react-bootstrap';
import NewRepo from './NewRepo';
import { ReadHistory } from './ReadHistory';

const WelcomeModal = (props: { closeModal: () => void }) => {
  const handleClose = () => props.closeModal && props.closeModal();

  return (
    <Modal show={true} onHide={handleClose}>
      <Modal.Body>
        <Tabs defaultActiveKey="new" className="mb-3">
          <Tab eventKey="new" title="New">
            <NewRepo />
          </Tab>
          <Tab eventKey="history" title="History">
            <ReadHistory />
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default WelcomeModal;
