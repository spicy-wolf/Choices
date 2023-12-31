/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import React from 'react';
import '@testing-library/jest-dom';
import { describe, test } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import { YesNoModal } from './YesNoModal';

describe('test YesNoModal', () => {
  test('should not render when open is false', () => {
    // arrange
    const title = 'title';
    const body = 'body';

    // act
    const { queryByText } = render(<YesNoModal
      open={false}
      title={title}
      body={body}
      onClose={jest.fn()}
      onConfirm={jest.fn()}
    />);

    // asset
    expect(queryByText(title)).not.toBeInTheDocument();
    expect(queryByText(body)).not.toBeInTheDocument();
  });

  test('should render title and body when open is true', async () => {
    // arrange
    const title = 'title';
    const body = 'body';

    // act
    const { findByText } = render(<YesNoModal
      open={true}
      title={title}
      body={body}
      onClose={jest.fn()}
      onConfirm={jest.fn()}
    />);

    // asset
    expect(await findByText(title)).toBeInTheDocument();
    expect(await findByText(body)).toBeInTheDocument();
  });

  test('should call onClose when click close button', async () => {
    // arrange
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    const title = 'title';
    const body = 'body';

    // act
    const { findByText } = render(<YesNoModal
      open={true}
      title={title}
      body={body}
      onClose={onClose}
      onConfirm={onConfirm}
    />);
    const noButton = await findByText('yesNoModal.cancelBtn.label');
    expect(noButton).toBeInTheDocument();
    fireEvent.click(noButton);

    // asset
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });


  test('should call onConfirm when click confirm button', async () => {
    // arrange
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    const title = 'title';
    const body = 'body';

    // act
    const { findByText } = render(<YesNoModal
      open={true}
      title={title}
      body={body}
      onClose={onClose}
      onConfirm={onConfirm}
    />);
    const yesButton = await findByText('yesNoModal.confirmBtn.label');
    expect(yesButton).toBeInTheDocument();
    fireEvent.click(yesButton);

    // asset
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });
});
