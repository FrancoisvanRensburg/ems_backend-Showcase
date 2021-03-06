const Company = require('../models/Company');
const Project = require('../models/Project');
const User = require('../models/User');
const ActionNotification = require('../models/ActionNotification');
const Section = require('../models/Section');

// Create a project
exports.createProject = async (req, res) => {
  const { projectname, projectcode, description, inhouse } = req.body;

  const projectFields = {};
  if (projectname) projectFields.projectname = projectname;
  if (projectcode) projectFields.projectcode = projectcode;
  if (description) projectFields.description = description;
  if (inhouse) projectFields.inhouse = inhouse;
  projectFields.ownercompany = req.data.comp;
  projectFields.projectmanager = req.data.user;

  try {
    const project = new Project(projectFields);
    const company = await Company.findOne({ _id: req.data.comp });
    const user = await User.findOne({ _id: req.data.user });

    user.projects.unshift(project._id);
    company.projects.unshift(project._id);

    user.save();
    project.save();
    company.save();

    res.json({
      projectname: project.projectname,
      projectcode: project.projectcode,
      description: project.description,
      _id: project._id,
    });
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

exports.createProjectName = async (req, res) => {
  const { projectname } = req.body;

  const projectFields = {};
  if (projectname) projectFields.projectname = projectname;
  projectFields.ownercompany = req.data.comp;
  projectFields.projectmanager = req.data.user;

  try {
    const project = new Project(projectFields);
    const company = await Company.findOne({ _id: req.data.comp });
    const user = await User.findOne({ _id: req.data.user });

    user.projects.unshift(project._id);
    company.projects.unshift(project._id);

    user.save();
    project.save();
    company.save();

    res.json({ projectname: project.projectname });
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

exports.getProjectContributors = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId })
      .select('contributors')
      .populate('contributors', 'firstname lastname name');
    res.json(project.contributors);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// Add contributors to created project
// For the POC we will only be able to add individual contributors to the list.
// Will later be able to select a team to project initially, then individual contributors will be able to added
// Will redo backend for MVP to import arrays, i.e. insertMany
exports.addContributors = async (req, res) => {
  const { contributors } = req.body;

  const projectFields = {};

  try {
    let project = await Project.findOne({ _id: req.params.projectId });
    const currentContributors = project.contributors;

    if (contributors) {
      for (c in contributors) {
        const contributor = contributors[c];

        const user = await User.findOne({ _id: contributor });
        user.projects.unshift(req.params.projectId);
        currentContributors.unshift(contributor);
        user.save();
      }

      projectFields.contributors = currentContributors;
    }

    project = await Project.findOneAndUpdate(
      { _id: req.params.projectId },
      { $set: projectFields },
      { new: true }
    ).populate('contributors', 'firstname lastname name');

    res.json(project.contributors);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// Update project manager. Only admin permissions and current project manager will be able to update
exports.changeProjectManager = async (req, res) => {
  const { projectmanager } = req.body;

  const projectFields = {};

  try {
    let project = {};

    if (projectmanager) {
      const project = await Project.findOne({ _id: req.params.projectId });
      const currentPM = project.projectmanager;

      if (projectmanager !== currentPM) {
        const { projects } = await User.findOne({ _id: currentPM });

        const index = projects.indexOf(req.params.projectId);
        if (index > -1) {
          projects.splice(index, 1);
        }

        const orgPM = await User.findOneAndUpdate(
          { _id: currentPM },
          { $set: { projects: projects } },
          { new: true }
        );

        const newPM = await User.findOne({ _id: projectmanager });
        newPM.projects.unshift(req.params.projectId);

        orgPM.save();
        newPM.save();

        const notificationFields = {
          receiver: projectmanager,
          notificationType: 'new project manager',
          notificationProject: req.params.projectId,
        };

        const notification = new ActionNotification(notificationFields);
        newPM.actionnotifications.push(notification);
        notification.save();

        projectFields.projectmanager = projectmanager;
      }
    }

    project = await Project.findOneAndUpdate(
      { _id: req.params.projectId },
      { $set: projectFields },
      { new: true }
    ).populate('projectmanager', 'firstname lastname name');

    res.json(project.projectmanager);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// Update project setup
exports.updateProjectSetup = async (req, res) => {
  const { actualstartdate, actualenddate, tpe, sector, description } = req.body;

  const projectFields = {};
  if (actualstartdate) projectFields.actualstartdate = actualstartdate;
  if (actualenddate) projectFields.actualenddate = actualenddate;
  if (tpe) projectFields.tpe = tpe;
  if (sector) projectFields.sector = sector;
  if (description) projectFields.description = description;

  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.projectId },
      { $set: projectFields },
      { new: true }
    ).select(
      '-contributors -tasks -comments -sections -projectcode -projectname'
    );

    // res.json(project);
    res.json({
      actualstartdate: project.actualstartdate,
      actualenddate: project.actualenddate,
      tpe: project.tpe,
      sector: project.sector,
      description: project.description,
    });
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

exports.getProjectClient = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId })
      .select('client contactname contactnumber contactemail')
      .populate('client', 'name');

    res.json({
      client: project.client,
      contactname: project.contactname,
      contactnumber: project.contactnumber,
      contactemail: project.contactemail,
    });
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// Add a client to the project
exports.addProjectClient = async (req, res) => {
  const { client, contactname, contactemail, contactnumber } = req.body;

  const projectFields = {};
  if (client) projectFields.client = client;
  if (contactname) projectFields.contactname = contactname;
  if (contactnumber) projectFields.contactnumber = contactnumber;
  if (contactemail) projectFields.contactemail = contactemail;

  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.projectId },
      { $set: projectFields },
      { new: true }
    );

    await project.save();

    console.log(project);

    res.json({
      client: project.client,
      contactname: project.contactname,
      contactnumber: project.contactnumber,
      contactemail: project.contactemail,
    });
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// Delete a project
exports.deleteProjectById = async (req, res) => {
  try {
    // Remove project from all squad members
    const { contributors } = await Project.findOne({
      _id: req.params.projectId,
    });
    let userId = '';
    let user = {};
    let index = -1;

    for (c in contributors) {
      userId = contributors[c];

      const { projects } = await User.findOne({ _id: userId });

      index = projects;
    }
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// Get all projects for a company
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ ownercompany: req.data.comp })
      .populate('projectmanager', 'firstname lastname _id')
      .populate('contributors', 'firstname lastname _id')
      .populate(
        'tasks',
        'taskname _id progress effort priority actualstartdate actualenddate'
      )
      .populate('client', 'name');

    res.json(projects);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// Get project by id
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId })
      .populate('contributors', 'firstname lastname _id')
      .populate('projectmanager', 'firstname lastname _id')
      .populate(
        'tasks',
        'taskname _id progress effort priority actualstartdate actualenddate'
      )
      .populate('client', 'name contactperson email description contnumber');

    res.json(project);
    // console.log(project);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// Potentially move to userController
exports.getAllProjectForCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.data.user })
      .select('projects')
      .populate(
        'projects',
        'projectname projectprogress actualstartdate actualenddate'
      );

    res.json(user.projects);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// get all tasks for a project
exports.getAllTasksForProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId })
      .select('tasks')
      .populate({
        path: 'tasks',
        select:
          'taskname progress actualstartdate actualenddate priority ragstatus effort assignee',
        populate: { path: 'assignee', select: 'firstname lastname name' },
      });
    res.json(project.tasks);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

// get all tasks for a project
exports.getAllProjectComments = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId })
      .select('comments')
      .populate({
        path: 'comments',
        select: 'date message author',
        populate: { path: 'author', select: 'firstname lastname name' },
      });
    res.json(project.comments);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

exports.createProjectSections = async (req, res) => {
  const { label } = req.body;
  try {
    const project = await Project.findOne({ _id: req.params.projectId });

    const sectionFields = {};
    sectionFields.project = req.params.projectId;
    if (label) sectionFields.label = label;
    const section = new Section(sectionFields);

    project.sections.push(section);

    await project.save();
    await section.save();

    const prjsects = await Project.findOne({ _id: req.params.projectId })
      .select('sections')
      .populate('sections', 'label');

    res.json(prjsects.sections);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

exports.getAllSectionsInProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId })
      .select('sections')
      .populate({
        path: 'sections',
        select: 'label tasks',
      });

    res.json(project.sections);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};
