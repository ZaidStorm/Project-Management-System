const express = require('express');
const router = express.Router({ mergeParams: true });
const milestoneController = require('../controllers/milestoneController');
const { validate } = require('../middleware/validationMiddleware');
const { validateMilestoneInput } = require('../validators/milestoneValidator');

// When mounted on /api/projects/:projectId/milestones
router.get('/', milestoneController.getMilestones);
router.post('/', validate(validateMilestoneInput), milestoneController.createMilestone);

// When mounted or used with id
router.put('/:id', validate(validateMilestoneInput), milestoneController.updateMilestone);
router.delete('/:id', milestoneController.deleteMilestone);

module.exports = router;
