import { AbstractDbContext } from './DbContext/DbContext';

/**
 * this part is tricky
 * if __USE_FAKE_DB__ is true, then import ./DbContext/FakeDB
 * else import ./DbContext/IndexedDB
 *
 * __USE_FAKE_DB__ is defined in webpack and value from cli
 */
declare var __USE_FAKE_DB__: boolean;
const { DbContext } = require('./DbContext/' +
  (__USE_FAKE_DB__ ? 'FakeDB' : 'IndexedDB'));

export { DbContext, AbstractDbContext };
