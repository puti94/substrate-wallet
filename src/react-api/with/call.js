// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {assert, isNull, isUndefined} from '@polkadot/util';

import {isEqual, triggerChange} from '../util';
import echoTransform from '../transform/echo';
import withApi from './api';

const NOOP = () => {
  // ignore
};

// a mapping of actual error messages that has already been shown
const errorred = {};

export default function withCall(
  endpoint,
  {
    at,
    atProp,
    callOnResult,
    fallbacks,
    isMulti = false,
    params = [],
    paramName,
    paramPick,
    paramValid = false,
    propName,
    transform = echoTransform,
  } = {},
) {
  return Inner => {
    class WithPromise extends React.Component {
      state = {
        callResult: null,
        callUpdated: false,
        callUpdatedAt: 0,
        callErrorMessage: null,
      };

      destroy;

      isActive = false;

      propName;

      timerId = -1;

      constructor(props) {
        super(props);

        const [, section, method] = endpoint.split('.');

        this.propName = `${section}_${method}`;
      }

      componentDidUpdate(prevProps) {
        const oldParams = this.getParams(prevProps);
        const newParams = this.getParams(this.props);

        if (
          (this.isActive && !isEqual(newParams, oldParams)) ||
          prevProps.endpoint !== this.props.endpoint
        ) {
          this.subscribe(newParams)
            .then(NOOP)
            .catch(NOOP);
        }
      }

      componentDidMount() {
        this.isActive = true;
        this.timerId = setInterval(() => {
          const elapsed = Date.now() - (this.state.callUpdatedAt || 0);
          const callUpdated = elapsed <= 1500;

          if (callUpdated !== this.state.callUpdated) {
            this.nextState({callUpdated});
          }
        }, 500);

        // The attachment takes time when a lot is available, set a timeout
        // to first handle the current queue before subscribing
        setTimeout(() => {
          this.subscribe(this.getParams(this.props))
            .then(NOOP)
            .catch(NOOP);
        }, 0);
      }

      componentWillUnmount() {
        this.isActive = false;

        this.unsubscribe()
          .then(NOOP)
          .catch(NOOP);

        if (this.timerId !== -1) {
          clearInterval(this.timerId);
        }
      }

      nextState(state) {
        if (this.isActive) {
          this.setState(state);
        }
      }

      getParams(props) {
        const paramValue = paramPick
          ? paramPick(props)
          : paramName
          ? props[paramName]
          : null;

        if (atProp) {
          at = props[atProp];
        }

        // When we are specifying a param and have an invalid, don't use it. For 'params',
        // we default to the original types, i.e. no validation (query app uses this)
        if (
          !paramValid &&
          paramName &&
          (isUndefined(paramValue) || isNull(paramValue))
        ) {
          return [false, []];
        }

        const values = isUndefined(paramValue)
          ? params
          : params.concat(
              Array.isArray(paramValue) && !paramValue.toU8a
                ? paramValue
                : [paramValue],
            );
        return [true, values];
      }

      constructApiSection = endpoint => {
        const {api} = this.props;
        const [area, section, method] = endpoint.split('.');

        // assert(area.length && section.length && method.length && others.length === 0, `Invalid API format, expected <area>.<section>.<method>, found ${endpoint}`);
        // assert(['consts', 'rpc', 'query', 'derive'].includes(area), `Unknown api.${area}, expected consts, rpc, query or derive`);
        // assert(!at || area === 'query', 'Only able to do an \'at\' query on the api.query interface');

        const apiSection = api[area][section];

        return [apiSection, area, section, method];
      };

      getApiMethod(newParams) {
        if (endpoint === 'subscribe') {
          const [fn, ...params] = newParams;

          return [fn, params, 'subscribe'];
        }
        const endpoints = [endpoint].concat(fallbacks || []);
        const expanded = endpoints.map(this.constructApiSection);
        const [apiSection, area, section, method] = expanded.find(
          ([apiSection]) => !!apiSection,
        ) || [{}, expanded[0][1], expanded[0][2], expanded[0][3]];
        assert(
          apiSection && apiSection[method],
          `Unable to find api.${area}.${section}.${method}`,
        );

        const meta = apiSection[method].meta;

        if (area === 'query' && meta && meta.type.isMap) {
          const arg = newParams[0];

          assert(
            (!isUndefined(arg) && !isNull(arg)) ||
              meta.type.asMap.linked.isTrue,
            `${meta.name} expects one argument`,
          );
        }
        return [
          apiSection[method],
          newParams,
          method.startsWith('subscribe') ? 'subscribe' : area,
        ];
      }

      async subscribe([isValid, newParams]) {
        if (!isValid) {
          return;
        }
        const {api} = this.props;
        let info;

        await api.isReady;

        try {
          assert(
            at || !atProp,
            'Unable to perform query on non-existent at hash',
          );

          info = this.getApiMethod(newParams);
        } catch (error) {
          // don't flood the console with the same errors each time, just do it once, then
          // ignore it going forward
          if (!errorred[error.message]) {
            console.error(endpoint, '::', error);

            errorred[error.message] = true;
          }
        }

        if (!info) {
          return;
        }

        const [apiMethod, params, area] = info;
        const updateCb = value => this.triggerUpdate(this.props, value);

        await this.unsubscribe();

        try {
          if (
            ['derive', 'subscribe'].includes(area) ||
            (area === 'query' && (!at && !atProp))
          ) {
            this.destroy = isMulti
              ? await apiMethod.multi(params, updateCb)
              : await apiMethod(...params, updateCb);
          } else if (area === 'consts') {
            updateCb(apiMethod);
          } else {
            updateCb(
              at
                ? await apiMethod.at(at, ...params)
                : await apiMethod(...params),
            );
          }
        } catch (error) {
          console.warn(endpoint, '::', error);
          this.nextState({callErrorMessage: error});
        }
      }

      //
      // // eslint-disable-next-line @typescript-eslint/require-await
      async unsubscribe() {
        if (this.destroy) {
          this.destroy();
          this.destroy = null;
        }
      }

      //
      triggerUpdate(props, value) {
        try {
          const callResult = (props.transform || transform)(value);

          if (!this.isActive || isEqual(callResult, this.state.callResult)) {
            return;
          }

          triggerChange(callResult, callOnResult, props.callOnResult);

          this.nextState({
            callResult,
            callUpdated: true,
            callUpdatedAt: Date.now(),
          });
        } catch (error) {
          // console.warn(endpoint, '::', error.message);
        }
      }

      render() {
        const {
          callUpdated,
          callUpdatedAt,
          callResult,
          callErrorMessage,
        } = this.state;
        const _props = {
          ...this.props,
          callUpdated,
          callUpdatedAt,
          callErrorMessage,
          [propName || this.propName]: callResult,
        };

        return <Inner {..._props} />;
      }
    }

    return withApi(WithPromise);
  };
}
