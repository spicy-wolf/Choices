import React from 'react';
import { Button } from 'react-bootstrap';
import { IoAdd, IoSettingsOutline } from 'react-icons/io5';

export enum FloatingButtonEnum {
  SettingButton = 'setting',
  AddButton = 'add',
}

type FloatingButtonGroupProps = {
  onClick: (buttonName: FloatingButtonEnum) => void;
};
export const FloatingButtonGroup = (props: FloatingButtonGroupProps) => {
  return (
    <>
      <div className="position-absolute bottom-0 end-0 d-flex flex-column">
        <Button
          variant="primary"
          className="m-2 rounded-circle p-0"
          style={{ height: '3rem', width: '3rem' }}
          onClick={() => props.onClick(FloatingButtonEnum.SettingButton)}
        >
          <IoSettingsOutline size="2rem" />
        </Button>
        <Button
          variant="primary"
          className="m-2 rounded-circle p-0"
          style={{ height: '3rem', width: '3rem' }}
          onClick={() => props.onClick(FloatingButtonEnum.AddButton)}
        >
          <IoAdd size="2rem" />
        </Button>
      </div>
    </>
  );
};
