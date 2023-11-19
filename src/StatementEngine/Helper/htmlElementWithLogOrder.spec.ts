import { describe, expect, test } from '@jest/globals';
import * as Constants from '../Constants';
import { getLogOrderFromElement } from './htmlElementWithLogOrder';

describe('test getLogOrderFromElement', () => {
  test('should return null when no order is set in element', () => {
    // arrange
    const div = document.createElement('div');
    // act
    const actual = getLogOrderFromElement(div);
    // asset
    expect(actual).toBeNull();
  });

  test('should return value when element has order attribute', () => {
    // arrange
    const expected = 1;
    const div = document.createElement('div');
    div.setAttribute(Constants.HtmlElementAttribute.LOG_ORDER_ATTRIBUTE, expected.toString());
    // act
    const actual = getLogOrderFromElement(div);
    // asset
    expect(actual).toEqual(expected);
  });
});