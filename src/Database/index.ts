import * as Interfaces from './Interfaces';

declare var __USE_FAKE_DB__: boolean;
let DbContext = require('./IndexedDB');
if (__USE_FAKE_DB__) {
  DbContext = require('./FakeDB');
}

export { DbContext, Interfaces };
