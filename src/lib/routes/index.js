/**
 * This is the place for exposing module(s) for route component.
 */

const ethRoutes = require('./eth/');
const constants = require('../constants/');
const packageJson = require('../../../package.json');
const errorHandler = require('errorhandler');
const { Router } = require('express');


const serverStartTimestamp = new Date();
const containerId = process.env.HOSTNAME;

function setupRoutes(app) {
  const version = packageJson.version;
  const majorVersion = packageJson.version.slice(0, version.indexOf('.'));

  app.get('/ping', (req, res) => res.json({
    uptimeInSec: ((new Date()).getTime() - serverStartTimestamp.getTime()) / 1000,
    hostname: containerId || 'N/A',
  }));
  app.get('/health', (req, res) => res.json({
    version: packageJson.version,
    self: {
      name: packageJson.name,
      version: packageJson.version,
      status: constants.SYSTEM.HTTP_STATUS_CODES.OK,
      serverDateStamp: (new Date()).toString(),
      hostname: containerId,
    },
    dependencies: {
      http: [],
    },
  }));

  app.use(`/api/v${majorVersion}`, setupApiRoutes());

  // All not-found API endpoints should return a custom 404 page.
  app.route('/:url(api)/*')
    .get((req, res) => res.render('404', (err) => {
      if (err) {
        return res.status(constants.SYSTEM.HTTP_STATUS_CODES.NOT_FOUND)
          .json(err);
      }
      return res.status(constants.SYSTEM.HTTP_STATUS_CODES.NOT_FOUND)
        .render('404');
    }));

  if (app.get('env') !== 'production') {
    app.use(errorHandler()); // Error handler - has to be the last.
  }

  return app;
}

function setupApiRoutes() {
  const router = Router();

  router.use('/eth', ethRoutes);

  return router;
}

module.exports = exports = setupRoutes;
