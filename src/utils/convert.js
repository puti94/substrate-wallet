/**
 * User: puti.
 * Time: 2019-12-17 09:27.
 */
import {GenericCall} from '@polkadot/types';
import map from '@polkadot/jsonrpc';
import {
  TYPE_ADDRESS,
  TYPE_ADDRESS_WITHBOOK,
  TYPE_INPUT,
  TYPE_NUMBER,
  TYPE_VOTE,
} from '../components/Forms';

/**
 * 转化块的交易数据
 * @param block getBlock的数据
 */
export function convertExtrinsics(
  block,
): [{method: string, section: string, args: Object}] {
  return block.block.extrinsics.map(t => {
    const {method, section} = GenericCall.findFunction(t.method.callIndex);
    return {
      method,
      section,
      args: t.method.args.toString(),
    };
  });
}

export function convertGetTimeStamp(
  block,
): [{method: string, section: string, args: Object}] {
  let extrinsic = convertExtrinsics(block).filter(
    t => t.section === 'timestamp' && t.method === 'set',
  )[0];
  return extrinsic ? parseInt(extrinsic.args) : Date.now();
}

export function createRpcSectionOptions(api) {
  return Object.keys(api.rpc)
    .sort()
    .filter(section => Object.keys(api.rpc[section]).length !== 0);
}

export function createRpcMethodOptions(api, sectionName) {
  const section = map[sectionName];
  if (!section || Object.keys(api.rpc[sectionName]).length === 0) {
    return [];
  }
  return Object.keys(api.rpc[sectionName])
    .sort()
    .filter(value => {
      const {isDeprecated, isHidden, isSubscription} = section.methods[value];

      return !isDeprecated && !isHidden && !isSubscription;
    })
    .map(value => {
      const {description, params} = section.methods[value];
      return {
        description: description,
        params: params,
        value,
      };
    });
}

export function createTxSectionOptions(api) {
  return Object.keys(api.tx)
    .sort()
    .filter(section => Object.keys(api.tx[section]).length !== 0);
}

export function createTxMethodOptions(api, sectionName) {
  const section = api.tx[sectionName];

  if (!section || Object.keys(section).length === 0) {
    return [];
  }

  return Object.keys(section)
    .sort()
    .map(value => {
      const method = section[value];
      const params = method.meta.args
        .filter(arg => arg.type.toString() !== 'Origin')
        .map(t => ({
          name: t.name.toString(),
          type: t.type.toString(),
          isOptional: true,
        }));
      return {
        description: method.meta.documentation[0] || value,
        params: params,
        value,
      };
    });
}

export function createConstsMethodOptions(api, sectionName) {
  const section = api.consts[sectionName];

  if (!section || Object.keys(section).length === 0) {
    return [];
  }

  return Object.keys(section)
    .sort()
    .map(value => {
      const method = section[value];

      return {
        description: (
          method.meta.documentation[0] || method.meta.name
        ).toString(),
        params: [],
        value: value,
      };
    });
}

export function createConstsSectionOptions(api) {
  return Object.keys(api.consts)
    .sort()
    .filter(name => Object.keys(api.consts[name]).length);
}

export function createQuerySectionOptions(api) {
  return Object.keys(api.query)
    .sort()
    .filter(name => Object.keys(api.query[name]).length);
}

export function createQueryMethodOptions(api, sectionName) {
  const section = api.query[sectionName];

  if (!section || Object.keys(section).length === 0) {
    return [];
  }

  return Object.keys(section)
    .sort()
    .map(value => {
      const method = section[value];
      const type = method.meta.type;
      const params = (type.isMap
        ? [{name: type.asMap.key.toString(), type: type.asMap.key.toString()}]
        : type.isDoubleMap
        ? [
            {name: type.asDoubleMap.key1, type: type.asDoubleMap.key1},
            {name: type.asDoubleMap.key2, type: type.asDoubleMap.key2},
          ]
        : []
      ).map(({type}) => {
        let array;
        if (type.startsWith('(')) {
          array = type
            .replace('(', '')
            .replace(')', '')
            .split(',');
        }
        const value = {
          name: type,
          type: type,
        };
        if (array) {
          value.type = 'form';
          value.items = array.map(t => ({
            name: t,
            type: t,
          }));
        }
        return value;
      });
      return {
        description: (
          method.meta.documentation[0] || method.meta.name
        ).toString(),
        params: params,
        value,
      };
    });
}

export function getTxOptions(api) {
  const obj = {};
  const sectionOptions = createTxSectionOptions(api);
  sectionOptions.forEach(t => (obj[t] = createTxMethodOptions(api, t)));
  return obj;
}

export function getQueryOptions(api) {
  const obj = {};
  const sectionOptions = createQuerySectionOptions(api);
  sectionOptions.forEach(t => (obj[t] = createQueryMethodOptions(api, t)));
  return obj;
}

export function getRpcOptions(api) {
  const obj = {};
  const sectionOptions = createRpcSectionOptions(api);
  sectionOptions.forEach(t => (obj[t] = createRpcMethodOptions(api, t)));
  return obj;
}

export function getConstsOptions(api) {
  const obj = {};
  const sectionOptions = createConstsSectionOptions(api);
  sectionOptions.forEach(t => (obj[t] = createConstsMethodOptions(api, t)));
  return obj;
}

export function mapInputType(interfaceType) {
  switch (interfaceType) {
    case 'AccountId':
    case 'Address':
    case 'ValidatorId':
      return TYPE_ADDRESS_WITHBOOK;
    case 'Compact<Balance>':
      return TYPE_NUMBER;
    case 'Vote':
      return TYPE_VOTE;
    default:
      return TYPE_INPUT;
  }
}
