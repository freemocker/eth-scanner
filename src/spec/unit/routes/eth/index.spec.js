const ethRouter = require('../../../../lib/routes/eth/');


describe('Eth router', function () {

  it('should have all the endpoints registered', function () {
    const routes = [];

    ethRouter.stack.forEach((r) => {
      if (r.route && r.route.path) {
        routes.push(r.route.path);
      }
    });

    expect(routes).to.include('/sync');
    expect(routes).to.include('/transactions');
    expect(routes).to.include('/balance');
  });

});
