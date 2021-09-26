import { useSetting } from '@src/Context';
import React from 'react';
import { Form, Row } from 'react-bootstrap';
import FontSizeSlider from './FontSizeSlider';
import ThemePalette from './ThemePalette';

type SettingPanelProps = {};
const SettingPanel = (props: SettingPanelProps) => {
  const setting = useSetting();
  const setSetting = setting.setSetting;

  return (
    <>
      <Form className="m-3">
        <Row>
          <ThemePalette
            value={setting.themeName}
            onChange={(selectedTheme) => setSetting('themeName', selectedTheme)}
          />
        </Row>
        <Row>
          <FontSizeSlider
            value={setting.fontSize}
            onChange={(e) => setSetting('fontSize', +e.target.value)}
          />
        </Row>
      </Form>
    </>
  );
};

export default SettingPanel;
