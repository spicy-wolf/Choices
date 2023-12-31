/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import * as StatementTypes from '../Types';

export type ExecuteHelpersType = {
  defaultNextStatementId: string | null | undefined;
  setSaveData: React.Dispatch<React.SetStateAction<StatementTypes.SaveDataType>>;
  setPauseComponent: React.Dispatch<React.SetStateAction<StatementTypes.FinComponentType>>;
};

