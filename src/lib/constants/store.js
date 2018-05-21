exports.ERROR_NAMES = {
  CAUGHT_ERROR_IN_DATABASE_SERVICE: 'CAUGHT_ERROR_IN_DATABASE_SERVICE',
  STORAGE_TYPE_NOT_FOUND: 'STORAGE_TYPE_NOT_FOUND',
  INTERFACE_NOT_IMPLEMENTED: 'INTERFACE_NOT_IMPLEMENTED',
  RECORD_NOT_FOUND_IN_STORE: 'RECORD_NOT_FOUND_IN_STORE',
};

exports.ERROR_MSG = {
  CAUGHT_ERROR_IN_DATABASE_SERVICE: 'There is an error being caught in Database Service.',
  STORAGE_TYPE_NOT_FOUND: 'The requesting storage type is not found.',
  INTERFACE_NOT_IMPLEMENTED: 'The implementation for the requested interface is not found.',
  RECORD_NOT_FOUND_IN_STORE: 'No record is found for the provided query.',
};

exports.TYPES = {
  MONGO_DB: 'mongo-store',
  POSTGRES: 'postgres-store',
};

exports.OPERATIONS = {
  INSERT: 'insert',
  SELECT: 'select',
  UPDATE: 'update',
  DELETE: 'delete',
  UPSERT: 'upsert',
};

exports.TABLE_NAMES = {
  ADDRESS_INFO: 'AddressInfo',
};
