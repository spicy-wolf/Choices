import { AbstractDbContext } from './DbContext/DbContext';
import * as Types from './DbContext/Types';

/**
 * this part is tricky
 * if __USE_FAKE_DB__ is true, then import ./DbContext/FakeDB
 * else import ./DbContext/IndexedDB
 *
 * __USE_FAKE_DB__ is defined in webpack, and the value is from cli
 */
declare var __USE_FAKE_DB__: boolean;
const { DbContext } = require('./DbContext/' +
  (__USE_FAKE_DB__ ? 'FakeDB' : 'IndexedDB'));

export { DbContext, AbstractDbContext, Types };
