// Copyright 2017-2019 @polkadot/example-react authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable no-global-assign */
process.browser = true;

if (typeof global.Buffer !== 'undefined') {
  // running on VSCode debugger
  global.Buffer = undefined;
}

// require('crypto');

// Set global process variable expected by some classes.
global.process = require('process');
global.navigator.userAgent = '';
