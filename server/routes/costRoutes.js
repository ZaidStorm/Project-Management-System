const express = require('express');
const router = express.Router({ mergeParams: true });
const costController = require('../controllers/costController');

router.get('/estimates', costController.getEstimates);
router.post('/estimates', costController.saveEstimate);

router.get('/expenses', costController.getExpenses);
router.post('/expenses', costController.createExpense);
router.delete('/expenses/:id', costController.deleteExpense);

router.get('/evm', costController.getEVM);

module.exports = router;
