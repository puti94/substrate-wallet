// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {ApiPromise, WsProvider} from '@polkadot/api';
import {formatBalance, isTestChain} from '@polkadot/util';
import {TypeRegistry} from '@polkadot/types';
import ApiContext from './ApiContext';
import typesSpec from './overrides/spec';
import addressDefaults from '@polkadot/util-crypto/address/defaults';
import keyring from '@polkadot/ui-keyring';
import KeyringStore from '../utils/KeyringStore';
const DEFAULT_DECIMALS = 12;
const DEFAULT_SS58 = addressDefaults.prefix;
const register = new TypeRegistry();
let api, node;

export {api, node};

export default class Api extends React.PureComponent {
  state = {};

  constructor(props) {
    super(props);

    const {url} = props;
    const provider = new WsProvider(url);

    const setApi = async provider => {
      api = this.createApi(provider);
      node = provider.endpoint;
      this.unsubscribeEvents();
      this.setState(
        {api, endpoint: provider.endpoint, isApiReady: false},
        () => {
          this.subscribeEvents();
        },
      );
      return api.isReady;
    };
    const setApiUrl = url => setApi(new WsProvider(url));
    api = this.createApi(provider);
    node = url;
    this.state = {
      api,
      endpoint: url,
      isApiConnected: false,
      isApiConnectedError: false,
      isApiReady: false,
      isSubstrateV2: true,
      ss58Format: DEFAULT_SS58,
      setApiUrl,
    };
  }

  createApi(provider) {
    return new ApiPromise({provider, register, typesSpec});
  }

  componentDidMount() {
    this.subscribeEvents();
  }

  connectHandler = () => {
    console.log('节点connected');
    this.setState({isApiConnected: true, isApiConnectedError: false});
  };
  disconnectedHandler = () => {
    console.log('节点disconnected');
    this.setState({isApiConnected: false, isApiConnectedError: true});
  };

  readyHandler = async () => {
    try {
      await this.loadOnReady(api);
      console.log('节点ready');
    } catch (error) {
      console.error('Unable to load chain', error);
    }
  };

  errorHandler = error => {
    console.log('节点', error);
    this.setState({isApiConnected: false, isApiConnectedError: true});
  };

  unsubscribeEvents() {
    const {api} = this.state;
    api.off('connected', this.connectHandler);
    api.off('disconnected', this.disconnectedHandler);
    api.off('ready', this.readyHandler);
    api.off('error', this.errorHandler);
  }

  subscribeEvents() {
    const {api} = this.state;
    api.on('connected', this.connectHandler);
    api.on('disconnected', this.disconnectedHandler);
    api.on('ready', this.readyHandler);
    api.on('error', this.errorHandler);
  }

  componentWillUnmount() {
    this.unsubscribeEvents();
  }

  async loadOnReady(api) {
    const [
      properties,
      _systemChain,
      _systemName,
      _systemVersion,
      _,
    ] = await Promise.all([
      api.rpc.system.properties(),
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version(),
    ]);
    const ss58Format = properties.ss58Format.unwrapOr(DEFAULT_SS58);
    const tokenSymbol = properties.tokenSymbol.unwrapOr('DEV').toString();
    const tokenDecimals = properties.tokenDecimals.unwrapOr(DEFAULT_DECIMALS);
    const systemChain = _systemChain ? _systemChain.toString() : 'unknown';
    const isDevelopment = isTestChain(systemChain);
    console.log(
      'api: found chain',
      systemChain,
      tokenSymbol,
      JSON.stringify(properties),
    );
    // first setup the UI helpers
    formatBalance.setDefaults({
      decimals: tokenDecimals,
      unit: tokenSymbol,
    });
    // // finally load the keyring
    keyring.loadAll({
      addressPrefix: ss58Format,
      genesisHash: api.genesisHash,
      isDevelopment,
      ss58Format,
      type: 'sr25519',
      store: KeyringStore,
    });

    const defaultSection = Object.keys(api.tx)[0];
    const defaultMethod = Object.keys(api.tx[defaultSection])[0];
    const apiDefaultTx = api.tx[defaultSection][defaultMethod];
    const apiDefaultTxSudo =
      (api.tx.system && api.tx.system.setCode) || // 2.x
      (api.tx.consensus && api.tx.consensus.setCode) || // 1.x
      apiDefaultTx; // other
    const isSubstrateV2 = !!Object.keys(api.consts).length;
    this.setState({
      apiDefaultTx,
      apiDefaultTxSudo,
      isApiReady: true,
      isApiConnectedError: false,
      ss58Format,
      isDevelopment,
      isSubstrateV2,
      systemChain,
      systemName: _systemName.toString(),
      systemVersion: _systemVersion.toString(),
    });
  }

  render() {
    const {
      api,
      apiDefaultTx,
      apiDefaultTxSudo,
      isApiConnected,
      isApiReady,
      isDevelopment,
      isSubstrateV2,
      isWaitingInjected,
      setApiUrl,
      systemChain,
      systemName,
      systemVersion,
      endpoint,
      ss58Format,
      isApiConnectedError,
    } = this.state;
    return (
      <ApiContext.Provider
        value={{
          api,
          endpoint,
          apiDefaultTx,
          apiDefaultTxSudo,
          isApiConnected,
          isApiReady: isApiReady && !!systemChain,
          isApiConnectedError,
          isDevelopment,
          isSubstrateV2,
          isWaitingInjected,
          setApiUrl,
          systemChain,
          systemName,
          systemVersion,
          ss58Format,
        }}>
        {this.props.children}
      </ApiContext.Provider>
    );
  }
}
