const Controller = require('../../controllers/eth.controller');
const { Router } = require('express');


const router = Router();

router.post('/sync', Controller.upsertInfo);
router.get('/transactions', Controller.fetchTransactions);
router.get('/balance', Controller.fetchBalance);

module.exports = exports = router;
