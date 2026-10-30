const express = require('express');
const router = express.Router({ mergeParams: true });
const managementPlanController = require('../controllers/managementPlanController');
const { validate } = require('../middleware/validationMiddleware');
const { validatePlanInput } = require('../validators/planValidator');

router.get('/', managementPlanController.getPlan);
router.post('/', validate(validatePlanInput), managementPlanController.savePlan);
router.put('/', validate(validatePlanInput), managementPlanController.savePlan);

module.exports = router;
