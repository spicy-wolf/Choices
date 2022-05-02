import React from 'react';
import { Button, Form, Modal, Tab, Tabs } from 'react-bootstrap';
import NewRepo from './NewRepo';

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
            <History />
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

const History = () => {
  return <></>;
};

export default WelcomeModal;
