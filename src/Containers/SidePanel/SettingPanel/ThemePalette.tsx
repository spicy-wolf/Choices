import { ThemeList } from '@src/Context';
import React from 'react';
import { Form, Row } from 'react-bootstrap';

type ThemePaletteProps = {
  value: string;
  onChange: (selectedTheme: string) => void;
};

const ThemePalette = (props: ThemePaletteProps) => {
  const paletteElements = Object.keys(ThemeList).map((key) => {
    let isSelected = props.value === key;
    return (
      <div
        key={key}
        className="rounded-circle m-2"
        style={{
          width: '2.5rem',
          height: '2.5rem',
          borderStyle: 'solid',
          backgroundColor: ThemeList[key].contentBgColor,
          borderColor: ThemeList[key].contentFontColor,
          borderWidth: isSelected ? '0.20rem' : '0rem',
        }}
        onClick={() => props.onChange(key)}
      ></div>
    );
  });

  return (
    <>
      <Form.Label>
        <b>Theme</b>
      </Form.Label>
      <Row>{paletteElements}</Row>
    </>
  );
};

export default ThemePalette;
