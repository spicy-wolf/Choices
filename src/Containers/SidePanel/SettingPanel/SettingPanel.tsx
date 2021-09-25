import { ThemeList, useSetting } from '@src/Context';
import React, { useState } from 'react';
import { Button, ButtonGroup, Col, Form, Row } from 'react-bootstrap';

type SettingPanelProps = {};
const SettingPanel = (props: SettingPanelProps) => {
  const setting = useSetting();
  const setSetting = setting.setSetting;

  const ThemePalette = () => {
    const paletteElements = Object.keys(ThemeList).map((key) => {
      let isSelected = setting?.themeName === key;
      return (
        <div
          key={key}
          className="rounded-circle m-2"
          style={{
            width: '3rem',
            height: '3rem',
            borderStyle: 'solid',
            backgroundColor: ThemeList[key].contentBgColor,
            borderColor: ThemeList[key].contentFontColor,
            borderWidth: isSelected ? '2px' : '0px',
          }}
          onClick={() => setSetting('themeName', key)}
        ></div>
      );
    });

    return <>{paletteElements}</>;
  };

  return (
    <>
      <Form>
        <Form.Group className="m-3">
          <Form.Label>Theme</Form.Label>
          <Row>
            <ThemePalette />
          </Row>
        </Form.Group>
      </Form>
    </>
  );
};

export default SettingPanel;
