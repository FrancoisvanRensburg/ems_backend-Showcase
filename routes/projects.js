const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  createProjectValidator,
  setupProjectValidator,
  creatProjectSectionValidator,
} = require('../validators/project');

const { runValidation } = require('../validators/index');

const {
  createProject,
  createProjectName,
  getProjectContributors,
  addContributors,
  changeProjectManager,
  updateProjectSetup,
  getProjectClient,
  addProjectClient,
  deleteProjectById,
  getAllProjects,
  getProjectById,
  getAllProjectForCurrentUser,
  getAllTasksForProject,
  getAllProjectComments,
  createProjectSections,
  getAllSectionsInProject,
} = require('../controllers/projectController');

// POST api/projects
// Private
router.post('/', auth, createProjectValidator, runValidation, createProject);
// router.post('/', auth, createProjectName);

router.get('/contributors/:projectId', auth, getProjectContributors);

router.post('/contributors/:projectId', auth, addContributors);

router.post('/manager/:projectId', auth, changeProjectManager);

router.post(
  '/setup/:projectId',
  auth,
  setupProjectValidator,
  runValidation,
  updateProjectSetup
);

router.get('/client/:projectId', auth, getProjectClient);

router.post('/client/:projectId', auth, addProjectClient);

router.delete('/:projectId', auth, deleteProjectById);

router.get('/company', auth, getAllProjects);

router.get('/:projectId', auth, getProjectById);

router.get('/', auth, getAllProjectForCurrentUser);

router.get('/tasks/:projectId', auth, getAllTasksForProject);

router.get('/comments/:projectId', auth, getAllProjectComments);

router.post('/sections/:projectId', auth, createProjectSections);

router.get('/sections/:projectId', auth, getAllSectionsInProject);

module.exports = router;
