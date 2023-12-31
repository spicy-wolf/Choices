/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { generateLibraryPath } from './PathGenerators/generateMainPath';
import { generateReadPath } from './PathGenerators/generateReadPath';
import { generateSettingPath } from './PathGenerators/generateSettingPath';
import { generateColorFromStr } from './generateColorFromStr';
import { generateId } from './generateId';
import { combinePath } from './combinePath';
import { digestString } from './digestString';
import { useQuery } from './useQuery';
import { useDebounce } from './useDebounce';
import { propertyOf } from './propertyOf';

export {
  useQuery,
  useDebounce,
  combinePath,
  digestString,
  generateColorFromStr,
  generateLibraryPath,
  generateReadPath,
  generateSettingPath,
  generateId,
  propertyOf,
};

