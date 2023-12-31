/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { useLocation } from 'react-router-dom';

// https://reactrouter.com/web/example/query-parameters
export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

