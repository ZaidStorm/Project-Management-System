const express = require('express');
const router = express.Router({ mergeParams: true });
const scheduleController = require('../controllers/scheduleController');

// Activities
router.get('/activities', scheduleController.getActivities);
router.post('/activities', scheduleController.createActivity);
router.get('/activities/:id', scheduleController.getActivity);
router.put('/activities/:id', scheduleController.updateActivity);
router.delete('/activities/:id', scheduleController.deleteActivity);
router.get('/delays', scheduleController.getDelays);

// Resources
router.get('/resources', scheduleController.getResources);
router.post('/resources', scheduleController.createResource);
router.put('/resources/:id', scheduleController.updateResource);
router.delete('/resources/:id', scheduleController.deleteResource);

// Dependencies
router.get('/dependencies', scheduleController.getDependencies);
router.post('/dependencies', scheduleController.createDependency);
router.delete('/dependencies/:id', scheduleController.deleteDependency);

module.exports = router;
