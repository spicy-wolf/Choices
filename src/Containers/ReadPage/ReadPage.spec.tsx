/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import * as YesNoModal from '@src/Containers/components/YesNoModal';
import * as ReadPageInner from './ReadPageInner';
import * as useSingletonChecker from './Hooks/useSingletonChecker';
import * as useQuery from '@src/Utils/useQuery';
import ReadPage from './ReadPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('test ReadPage', () => {
  const mockSingletonModalComponent = jest.fn();
  const mockReadPageInnerComponent = jest.fn();

  beforeEach(() => {
    jest.spyOn(YesNoModal, 'YesNoModal').mockImplementation(mockSingletonModalComponent);
    jest.spyOn(ReadPageInner, 'ReadPageInner').mockImplementation(mockReadPageInnerComponent);
    jest.spyOn(useQuery, 'useQuery').mockImplementation(jest.fn().mockReturnValue(new URLSearchParams()));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should renders YesNoModal when the same page is opened', () => {
    //arrange
    jest.spyOn(useSingletonChecker, 'useSingletonChecker').mockReturnValue([false]);

    //act
    render(<ReadPage />);

    // Assert that the YesNoModal component is rendered
    expect(mockSingletonModalComponent).toHaveBeenCalled();
    expect(mockReadPageInnerComponent).not.toHaveBeenCalled();
  });

  test('should renders ReadPageInner when the no same page is opened', () => {
    //arrange
    jest.spyOn(useSingletonChecker, 'useSingletonChecker').mockReturnValue([true]);

    //act
    render(<ReadPage />);

    // Assert that the YesNoModal component is rendered
    expect(mockReadPageInnerComponent).toHaveBeenCalled();
    expect(mockSingletonModalComponent).not.toHaveBeenCalled();
  });
});