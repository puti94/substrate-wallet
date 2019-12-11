// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default function withMulti(Component, ...hocs) {
  // NOTE: Order is reversed so it makes sense in the props, i.e. component
  // after something can use the value of the preceding version
  return hocs.reverse().reduce((Component, hoc) => hoc(Component), Component);
}
