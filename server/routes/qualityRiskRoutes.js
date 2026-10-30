const express = require('express');
const router = express.Router({ mergeParams: true });
const qualityRiskController = require('../controllers/qualityRiskController');

// Defects
router.get('/defects', qualityRiskController.getDefects);
router.post('/defects', qualityRiskController.createDefect);
router.put('/defects/:id', qualityRiskController.updateDefect);
router.delete('/defects/:id', qualityRiskController.deleteDefect);

// Checklists
router.get('/checklists', qualityRiskController.getChecklists);
router.post('/checklists', qualityRiskController.createChecklist);
router.put('/checklists/:id', qualityRiskController.updateChecklist);

// Inspections
router.get('/inspections', qualityRiskController.getInspections);
router.post('/inspections', qualityRiskController.createInspection);

// Risks
router.get('/risks', qualityRiskController.getRisks);
router.post('/risks', qualityRiskController.createRisk);
router.put('/risks/:id', qualityRiskController.updateRisk);
router.delete('/risks/:id', qualityRiskController.deleteRisk);

module.exports = router;
