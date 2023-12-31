/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import * as Constants from '../Constants';

export const getLogOrderFromElement = (element: Element): number | null => {
  if (!element) return null;
  const order = parseInt(
    element.getAttribute(Constants.HtmlElementAttribute.LOG_ORDER_ATTRIBUTE)
  );
  if (isNaN(order)) return null;
  else {
    return order;
  }
};

export const getElementfromLogOrder = (logOrder: number): Element | null => {
  if (logOrder === null || logOrder === undefined) return null;

  return document.querySelector(
    `[${Constants.HtmlElementAttribute.LOG_ORDER_ATTRIBUTE}="${logOrder}"]`
  );
};

