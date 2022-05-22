import React from 'react';
import { Button, ButtonGroup, Col, Form, Row } from 'react-bootstrap';

type FontSizeSliderProps = {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
};

const FontSizeSlider = (props: FontSizeSliderProps) => {
  return (
    <>
      <Form.Label>
        <b>Font Size</b>
      </Form.Label>
      <Row className="d-flex align-items-center">
        <Col className="flex-grow-0">
          <div style={{ fontSize: '16px' }}>A</div>
        </Col>
        <Col className="flex-grow-1">
          <Form.Range
            step="2"
            min="16"
            max="28"
            onChange={props.onChange}
            value={props.value}
          />
        </Col>
        <Col className="flex-grow-0">
          <div style={{ fontSize: '28px' }}>A</div>
        </Col>
      </Row>
    </>
  );
};

export default FontSizeSlider;
