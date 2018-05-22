const EthController = require('../../../lib/controllers/eth.controller');
const DatabaseSvc = require('../../../lib/services/database.service');
const StandardErrorWrapper = require('../../../lib/utils/standard-error-wrapper');
const http = require('../../../lib/utils/http/');


describe('Eth controller', function () {
  let req;
  let res;
  let stubFuncs;

  beforeEach(function () {
    res = {};
    res.status = stub().returnsThis;
    res.json = stub().returnsThis;

    req = {};
    stubFuncs = [];
  });

  afterEach(function () {
    for (const stubFunc of stubFuncs) {
      stubFunc.restore();
    }
  });

  context('can handle transactions inquiry request :: fetchTransactions()', function () {

    context('on success', function () {

      it('should handle request properly', function (done) {
        stubFuncs.push(stub(EthController, '_handleRequest', () => Promise.resolve([{ balance: 12300 }])));

        req.query = {
          address: '5a8fc0bf4357fa3530a8188',
        };

        EthController.fetchTransactions(req, res)
          .then(() => {
            expect(EthController._handleRequest).to.have.been.calledWith(match.object, res);
            done();
          });
      });

      it('should finalize with `res` object', function () {
        stubFuncs.push(stub(EthController, '_handleRequest', () => Promise.resolve([{ balance: 12300 }])));

        req.query = {
          address: '5a8fc0bf4357fa3530a8188',
        };

        return expect(EthController.fetchTransactions(req, res)).to.eventually.deep.equal(res);
      });

    });

    context('on error', function () {

      it('should handle request properly', function (done) {
        stubFuncs.push(stub(EthController, '_handleRequest', () => Promise.reject(new StandardErrorWrapper({}))));

        req.query = {
          address: '5a8fc0bf4357fa3530a8188',
        };

        EthController.fetchTransactions(req, res)
          .then(() => {
            expect(EthController._handleRequest).to.have.been.calledWith(match.object, res);
            done();
          });
      });

      it('should finalize with `res` object', function () {
        stubFuncs.push(stub(EthController, '_handleRequest', () => Promise.reject(new StandardErrorWrapper({}))));

        req.query = {
          address: '5a8fc0bf4357fa3530a8188',
        };

        return expect(EthController.fetchTransactions(req, res)).to.eventually.deep.equal(res);
      });

    });

  });

  describe('can handle balance inquiry request :: fetchBalance()', function () {

    context('on success', function () {

      it('should handle request properly', function (done) {
        stubFuncs.push(stub(EthController, '_handleRequest', () => Promise.resolve([{ balance: 12300 }])));

        req.query = {
          address: '5a8fc0bf4357fa3530a8188',
        };

        EthController.fetchBalance(req, res)
          .then(() => {
            expect(EthController._handleRequest).to.have.been.calledWith(match.object, res);
            done();
          });
      });

      it('should finalize with `res` object', function () {
        stubFuncs.push(stub(EthController, '_handleRequest', () => Promise.resolve([{ balance: 12300 }])));

        req.query = {
          address: '5a8fc0bf4357fa3530a8188',
        };

        return expect(EthController.fetchBalance(req, res)).to.eventually.deep.equal(res);
      });

    });

    context('on error', function () {

      it('should handle request properly', function (done) {
        stubFuncs.push(stub(EthController, '_handleRequest', () => Promise.reject(new StandardErrorWrapper({}))));

        req.query = {
          address: '5a8fc0bf4357fa3530a8188',
        };

        EthController.fetchBalance(req, res)
          .then(() => {
            expect(EthController._handleRequest).to.have.been.calledWith(match.object, res);
            done();
          });
      });

      it('should finalize with `res` object', function () {
        stubFuncs.push(stub(EthController, '_handleRequest', () => Promise.reject(new StandardErrorWrapper({}))));

        req.query = {
          address: '5a8fc0bf4357fa3530a8188',
        };

        return expect(EthController.fetchBalance(req, res)).to.eventually.deep.equal(res);
      });

    });

  });

  context('can handle sync request :: upsertInfo()', function () {

    context('on success', function () {

      it('should handle request properly', function (done) {
        stubFuncs.push(stub(http, 'fetchAddressBalance', () => Promise.resolve({ data: { status: '1' } })));
        stubFuncs.push(stub(http, 'fetchAddressTransactions', () => Promise.resolve({ data: { status: '1' } })));
        stubFuncs.push(stub(EthController, '_handleRequest', () => Promise.resolve()));

        req.body = {
          address: '5a8fc0bf4357fa3530a8188',
        };

        EthController.upsertInfo(req, res)
          .then(() => {
            expect(EthController._handleRequest).to.have.been.calledWith(match.object, res);
            done();
          });
      });

      it('should finalize with `res` object', function () {
        stubFuncs.push(stub(http, 'fetchAddressBalance', () => Promise.resolve({ data: { status: '1' } })));
        stubFuncs.push(stub(http, 'fetchAddressTransactions', () => Promise.resolve({ data: { status: '1' } })));
        stubFuncs.push(stub(EthController, '_handleRequest', () => Promise.resolve()));

        req.query = {
          address: '5a8fc0bf4357fa3530a8188',
        };

        return expect(EthController.upsertInfo(req, res)).to.eventually.deep.equal(res);
      });

    });

    context('on error', function () {

      it('should finalize with `res` object', function () {
        stubFuncs.push(stub(http, 'fetchAddressBalance', () => Promise.reject(new StandardErrorWrapper({}))));

        req.query = {
          address: '5a8fc0bf4357fa3530a8188',
        };

        return expect(EthController.upsertInfo(req, res)).to.eventually.deep.equal(res);
      });

    });


  });

  context('can handle general request :: _handleRequest()', function () {

    beforeEach(function () {
      stubFuncs.push(stub(DatabaseSvc, 'execute'));
    });

    it('on success', function () {
      const result = { _id: 123, field1: 'data1' };
      const expectedResult = JSON.parse(JSON.stringify(result));
      const state = {};
      const strategy = {};

      DatabaseSvc.execute.returns(Promise.resolve(result));

      const promise = EthController._handleRequest(state, res, DatabaseSvc, strategy);

      expect(DatabaseSvc.execute).to.have.been.calledWith(state, strategy);
      return expect(promise).to.eventually.deep.equal(expectedResult);
    });

    it('on error', function () {
      const error = new Error();
      const expectedError = JSON.parse(JSON.stringify(error));
      const state = {};
      const strategy = {};

      DatabaseSvc.execute.returns(Promise.reject(error));

      const promise = EthController._handleRequest(state, res, DatabaseSvc, strategy);

      expect(DatabaseSvc.execute).to.have.been.calledWith(state, strategy);
      return expect(promise).to.eventually.rejectedWith(expectedError);
    });

  });

  context('on success', function () {

    it('should handle request properly', function (done) {
      stubFuncs.push(stub(EthController, '_handleRequest', () => Promise.resolve([{ balance: 12300 }])));

      req.query = {
        address: '5a8fc0bf4357fa3530a8188',
      };

      EthController.fetchTransactions(req, res)
        .then(() => {
          expect(EthController._handleRequest).to.have.been.calledWith(match.object, res);
          done();
        });
    });

    it('should finalize with `res` object', function () {
      stubFuncs.push(stub(EthController, '_handleRequest', () => Promise.resolve([{ balance: 12300 }])));

      req.query = {
        address: '5a8fc0bf4357fa3530a8188',
      };

      return expect(EthController.fetchTransactions(req, res)).to.eventually.deep.equal(res);
    });

  });

});
