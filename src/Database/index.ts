import { AbstractDbContext } from './DbContext/DbContext';
import * as Types from './DbContext/Types';

/**
 * this part is tricky
 * if __USE_FAKE_DB__ is true, then import ./DbContext/FakeDB
 * else import ./DbContext/IndexedDB
 *
 * __USE_FAKE_DB__ is defined in webpack, and the value is from cli
 */
declare let __USE_FAKE_DB__: boolean;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DbContext } = require('./DbContext/' + (__USE_FAKE_DB__ ? 'FakeDB' : 'IndexedDB'));

export { DbContext, AbstractDbContext, Types };
