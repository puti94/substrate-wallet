// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

const ApiContext = React.createContext({});
const ApiConsumer = ApiContext.Consumer;
const ApiProvider = ApiContext.Provider;

export default ApiContext;

export {ApiConsumer, ApiProvider};
