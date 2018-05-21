const EthController = require('../../../lib/controllers/eth.controller');
const DatabaseSvc = require('../../../lib/services/database.service');


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

  describe('can handle balance inquiry request :: fetchBalance()', function () {

    context('on success', function () {

      it('should call handle request properly', (done) => {
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

      it('should call handle request properly', (done) => {
        stubFuncs.push(stub(EthController, '_handleRequest', () => Promise.reject()));

        req.query = {
          address: '5a8fc0bf4357fa3530a8188',
        };

        EthController.fetchBalance(req, res)
          .catch(() => {
            expect(EthController._handleRequest).to.have.been.calledWith(match.object, res);
            done();
          });
      });

      it('should finalize with `res` object', function () {
        stubFuncs.push(stub(EthController, '_handleRequest', () => Promise.reject()));

        req.query = {
          address: '5a8fc0bf4357fa3530a8188',
        };

        return expect(EthController.fetchBalance(req, res)).to.eventually.deep.equal(res);
      });

    });

  });

  // [TODO]
  context('can handle sync request :: upsertInfo()', function () {

  });

  // [TODO]
  context('can handle transactions inquiry request :: fetchTransactions()', function () {

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
      return expect(promise).to.eventually.deep.equal(expectedError);
    });

  });

});
