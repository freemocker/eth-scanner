const DatabaseService = require('../services/database.service');
const http = require('../utils/http/');
const ProcessSate = require('../process-state/');
const Validator = require('../utils/precondition-validator');
const StandardErrorWrapper = require('../utils/standard-error-wrapper');
const StandardResponseWrapper = require('../utils/standard-response-wrapper');
const constants = require('../constants/');
const packageJson = require('../../../package.json');
const Promise = require('bluebird');


const containerId = process.env.HOSTNAME;
let requestCount = 0;

class EthController {

  static upsertInfo(req, res) {
    requestCount += 1;

    let state;
    let balance;
    let transactions;

    return Promise
      .try(() => {
        const address = req.body.address;

        Validator.shouldNotBeEmpty(address, constants.ETH.ERROR_NAMES.ADDRESS_FIELD_IS_EMPTY);

        const options = {
          address: address.trim(),
        };
        const context = { containerId, requestCount };

        state = ProcessSate.create(options, context);
      })
      .then(() => http.fetchAddressBalance(state.address))
      .then((response) => {
        if (response.data.status !== '1') {
          const err = new StandardErrorWrapper([
            {
              code: constants.SYSTEM.ERROR_CODES.BAD_REQUEST,
              name: constants.ETH.ERROR_NAMES.FETCH_BALANCE_FAILURE,
              source: constants.SYSTEM.COMMON.CURRENT_SOURCE,
              message: response.data.result,
            },
          ]);

          throw err;
        } else {
          balance = response.data.result;
        }

        return http.fetchAddressTransactions(state.address);
      })
      .then((response) => {
        if (
          response.data.status === '1' ||
          (response.data.status === '0' && response.data.message === 'No transactions found')
        ) {
          transactions = response.data.result;
        } else {
          const err = new StandardErrorWrapper([
            {
              code: constants.SYSTEM.ERROR_CODES.BAD_REQUEST,
              name: constants.ETH.ERROR_NAMES.FETCH_TRANSACTIONS_FAILURE,
              source: constants.SYSTEM.COMMON.CURRENT_SOURCE,
              message: response.data.result,
            },
          ]);

          throw err;
        }

        const majorVersion = packageJson.version.slice(0, packageJson.version.indexOf('.'));
        const upsertAddressInfoStrategy = {
          storeType: constants.STORE.TYPES.MONGO_DB,
          operation: {
            type: constants.STORE.OPERATIONS.UPSERT,
            data: [
              { address: state.address },
              {
                balance,
                transactions,
                address: state.address,
                version: majorVersion,
                systemData: {
                  dateCreated: new Date(),
                  createdBy: 'N/A',
                  dateLastModified: null,
                  lastModifiedBy: 'N/A',
                },
              },
            ],
          },
          tableName: constants.STORE.TABLE_NAMES.ADDRESS_INFO,
        };

        return EthController._handleRequest(state, res, DatabaseService, upsertAddressInfoStrategy)
      })
      .then((result) => {
        const response = new StandardResponseWrapper({
          success: true,
          detail: result,
        }, constants.SYSTEM.RESPONSE_NAMES.SYNC);

        return res.status(constants.SYSTEM.HTTP_STATUS_CODES.OK)
          .json(response.format);
      })
      .catch((_err) => {
        const err = new StandardErrorWrapper(_err);
        const resStatusCode = //err.getNthError(0).code ||
          constants.SYSTEM.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

        err.append({
          code: constants.SYSTEM.ERROR_CODES.INTERNAL_SERVER_ERROR,
          name: constants.SYSTEM.ERROR_NAMES.CAUGHT_ERROR_IN_ETH_CONTROLLER,
          source: constants.SYSTEM.COMMON.CURRENT_SOURCE,
          message: constants.SYSTEM.ERROR_MSG.CAUGHT_ERROR_IN_ETH_CONTROLLER,
        });

        return res.status(resStatusCode)
          .json(err.format({
            containerId: state && state.context.containerId,
            requestCount: state && state.context.requestCount,
          }));
      });
  }

  static fetchTransactions(req, res) {
    requestCount += 1;

    let state;

    return Promise
      .try(() => {
        const address = req.query.address;

        Validator.shouldNotBeEmpty(address, constants.ETH.ERROR_NAMES.ADDRESS_FIELD_IS_EMPTY);

        const options = {
          address: address.trim(),
        };
        const context = { containerId, requestCount };

        state = ProcessSate.create(options, context);
      })
      .then(() => {
        const fetchAddressInfoStrategy = {
          storeType: constants.STORE.TYPES.MONGO_DB,
          operation: {
            type: constants.STORE.OPERATIONS.SELECT,
            data: [
              { address: state.address },
            ],
          },
          tableName: constants.STORE.TABLE_NAMES.ADDRESS_INFO,
        };

        return EthController._handleRequest(state, res, DatabaseService, fetchAddressInfoStrategy);
      })
      .then((result) => {
        if (Array.isArray(result) && result.length === 1) {
          const response = new StandardResponseWrapper({
            success: true,
            detail: { tranactions: result[0].transactions },
          }, constants.SYSTEM.RESPONSE_NAMES.SYNC);

          return res.status(constants.SYSTEM.HTTP_STATUS_CODES.OK)
            .json(response.format);
        }

        const err = new StandardErrorWrapper([
          {
            code: constants.SYSTEM.ERROR_CODES.NOT_FOUND,
            name: constants.STORE.ERROR_NAMES.RECORD_NOT_FOUND_IN_STORE,
            source: constants.SYSTEM.COMMON.CURRENT_SOURCE,
            message: constants.STORE.ERROR_MSG.RECORD_NOT_FOUND_IN_STORE,
          },
        ]);

        throw err;
      })
      .catch((_err) => {
        const err = new StandardErrorWrapper(_err);
        const resStatusCode = err.getNthError(0).code ||
          constants.SYSTEM.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

        err.append({
          code: constants.SYSTEM.ERROR_CODES.INTERNAL_SERVER_ERROR,
          name: constants.SYSTEM.ERROR_NAMES.CAUGHT_ERROR_IN_ETH_CONTROLLER,
          source: constants.SYSTEM.COMMON.CURRENT_SOURCE,
          message: constants.SYSTEM.ERROR_MSG.CAUGHT_ERROR_IN_ETH_CONTROLLER,
        });

        return res.status(resStatusCode)
          .json(err.format({
            containerId: state && state.context.containerId,
            requestCount: state && state.context.requestCount,
          }));
      });
  }

  static fetchBalance(req, res) {
    requestCount += 1;

    let state;

    return Promise.try(
      () => {
        const address = req.query.address;

        Validator.shouldNotBeEmpty(address, constants.ETH.ERROR_NAMES.ADDRESS_FIELD_IS_EMPTY);

        const options = {
          address: address.trim(),
        };
        const context = { containerId, requestCount };

        state = ProcessSate.create(options, context);
      })
      .then(() => {
        const fetchAddressInfoStrategy = {
          storeType: constants.STORE.TYPES.MONGO_DB,
          operation: {
            type: constants.STORE.OPERATIONS.SELECT,
            data: [
              { address: state.address },
            ],
          },
          tableName: constants.STORE.TABLE_NAMES.ADDRESS_INFO,
        };

        return EthController._handleRequest(state, res, DatabaseService, fetchAddressInfoStrategy);
      })
      .then((result) => {
        if (Array.isArray(result) && result.length === 1) {
          const response = new StandardResponseWrapper({
            success: true,
            detail: { balance: result[0].balance },
          }, constants.SYSTEM.RESPONSE_NAMES.SYNC);

          return res.status(constants.SYSTEM.HTTP_STATUS_CODES.OK)
            .json(response.format);
        }

        const err = new StandardErrorWrapper([
          {
            code: constants.SYSTEM.ERROR_CODES.NOT_FOUND,
            name: constants.STORE.ERROR_NAMES.RECORD_NOT_FOUND_IN_STORE,
            source: constants.SYSTEM.COMMON.CURRENT_SOURCE,
            message: constants.STORE.ERROR_MSG.RECORD_NOT_FOUND_IN_STORE,
          },
        ]);

        throw err;
      })
      .catch((_err) => {
        const err = new StandardErrorWrapper(_err);
        const resStatusCode = err.getNthError(0).code ||
          constants.SYSTEM.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

        err.append({
          code: constants.SYSTEM.ERROR_CODES.INTERNAL_SERVER_ERROR,
          name: constants.SYSTEM.ERROR_NAMES.CAUGHT_ERROR_IN_ETH_CONTROLLER,
          source: constants.SYSTEM.COMMON.CURRENT_SOURCE,
          message: constants.SYSTEM.ERROR_MSG.CAUGHT_ERROR_IN_ETH_CONTROLLER,
        });

        return res.status(resStatusCode)
          .json(err.format({
            containerId: state && state.context.containerId,
            requestCount: state && state.context.requestCount,
          }));
      });
  }

  static _handleRequest(state, res, Svc, strategy) {
    return Promise.try(() => Svc.execute(state, strategy));
  }

}

module.exports = exports = EthController;
