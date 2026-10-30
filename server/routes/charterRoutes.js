const express = require('express');
const router = express.Router({ mergeParams: true });
const charterController = require('../controllers/charterController');
const { validate } = require('../middleware/validationMiddleware');
const { validateCharterInput } = require('../validators/charterValidator');

router.get('/', charterController.getCharter);
router.post('/', validate(validateCharterInput), charterController.saveCharter);
router.put('/', validate(validateCharterInput), charterController.saveCharter);

module.exports = router;
