const express = require('express');
const router = express.Router({ mergeParams: true });
const wbsController = require('../controllers/wbsController');

// Project scoped: /api/projects/:projectId/wbs
router.get('/', wbsController.getWBS);
router.post('/', wbsController.createWBSNode);

// Item specific: /api/wbs/:id
router.get('/:id', wbsController.getWBSNode);
router.put('/:id', wbsController.updateWBSNode);
router.delete('/:id', wbsController.deleteWBSNode);

module.exports = router;
