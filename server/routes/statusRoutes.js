const express = require('express');
const router = express.Router({ mergeParams: true });
const statusController = require('../controllers/statusController');

router.get('/', statusController.getStatus);
router.put('/', statusController.updateStatus);
router.post('/', statusController.updateStatus);

module.exports = router;
