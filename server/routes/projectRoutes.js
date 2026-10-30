const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { validate } = require('../middleware/validationMiddleware');
const { validateProjectInput } = require('../validators/projectValidator');

router.get('/', projectController.getProjects);
router.post('/', validate(validateProjectInput), projectController.createProject);
router.get('/:id', projectController.getProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;
