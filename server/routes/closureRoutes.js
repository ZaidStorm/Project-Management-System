const express = require('express');
const router = express.Router({ mergeParams: true });
const closureController = require('../controllers/closureController');
const { validate } = require('../middleware/validationMiddleware');
const { validateClosureInput } = require('../validators/closureValidator');

router.get('/', closureController.getClosure);
router.post('/', validate(validateClosureInput), closureController.saveClosure);
router.put('/', validate(validateClosureInput), closureController.saveClosure);

module.exports = router;
