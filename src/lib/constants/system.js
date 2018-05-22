const packageJson = require('../../../package.json');


const sources = {
  ETH_SCANNER: packageJson.name,
};
const httpStatusCodes = {
  OK: 200,
  FOUND: 302,
  PERMANENT_REDIRECT: 308,
  BAD_REQUEST: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
};

exports.SOURCES = sources;

exports.HTTP_STATUS_CODES = httpStatusCodes;

exports.COMMON = {
  CURRENT_SOURCE: sources.ETH_SCANNER,
};

exports.DEFAULT_CONFIG = {};

// This is the only place aggregating all error codes.
exports.ERROR_CODES = Object.assign({}, httpStatusCodes, {
  UNKNOWN_ERROR: 1000,
  INVALID_RESPONSE_INTERFACE: 1001,
  INVALID_ERROR_INTERFACE: 1002,
  CAUGHT_ERROR: 1003,
  DATABASE_OPERATION_ERROR: 1004,

});

exports.ERROR_NAMES = {
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  RESPONSE_OBJ_PARSE_ERROR: 'RESPONSE_OBJ_PARSE_ERROR',
  ERROR_OBJ_PARSE_ERROR: 'RESPONSE_OBJ_PARSE_ERROR',
  CAUGHT_ERROR_IN_ETH_CONTROLLER: 'CAUGHT_ERROR_IN_ETH_CONTROLLER',
};

exports.ERROR_MSG = {
  RESPONSE_OBJ_PARSE_ERROR: 'The response object is not able to deserialize back to an instance of Standard Response Wrapper.',
  ERROR_OBJ_PARSE_ERROR: 'The error object is not able to deserialize back to an instance of Standard Error Wrapper.',
  CAUGHT_ERROR_IN_ETH_CONTROLLER: 'There is an error being caught in Eth Controller.',
};

exports.RESPONSE_NAMES = {
  SYNC: 'SYNC',
  FETCH_BALANCE: 'FETCH_BALANCE',
  FETCH_TRANSACTIONS: 'FETCH_TRANSACTIONS',
};
