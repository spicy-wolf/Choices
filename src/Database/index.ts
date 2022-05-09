import * as Interfaces from './Interfaces';

declare var __USE_FAKE_DB__: boolean;
let DbContext = require('./DbContext/IndexedDB');
if (__USE_FAKE_DB__) {
  DbContext = require('./DbContext/FakeDB');
}

export { DbContext, Interfaces };
