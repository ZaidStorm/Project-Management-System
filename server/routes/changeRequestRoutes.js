const express = require('express');
const router = express.Router({ mergeParams: true });
const changeRequestController = require('../controllers/changeRequestController');

// Project scoped: /api/projects/:projectId/change-requests
router.get('/', changeRequestController.getChangeRequests);
router.post('/', changeRequestController.createChangeRequest);

// Item specific: /api/change-requests/:id
router.get('/:id', changeRequestController.getChangeRequest);
router.put('/:id', changeRequestController.updateChangeRequest);
router.patch('/:id/approve', changeRequestController.approveChangeRequest);
router.patch('/:id/reject', changeRequestController.rejectChangeRequest);

module.exports = router;
