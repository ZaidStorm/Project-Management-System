const express = require('express');
const router = express.Router({ mergeParams: true });
const requirementController = require('../controllers/requirementController');

// Project scoped: /api/projects/:projectId/requirements
router.get('/', requirementController.getRequirements);
router.post('/', requirementController.createRequirement);

// Item specific: /api/requirements/:id
router.get('/:id', requirementController.getRequirement);
router.put('/:id', requirementController.updateRequirement);
router.delete('/:id', requirementController.deleteRequirement);
router.patch('/:id/approve', requirementController.approveRequirement);
router.patch('/:id/reject', requirementController.rejectRequirement);

module.exports = router;
