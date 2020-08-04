const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  registerCompany,
  registerUser,
  addNewUsersArray,
} = require('../controllers/registerController');

const {
  companySignUpValidator,
  userRegistrationValidator,
} = require('../validators/auth');

const { runValidation } = require('../validators/index');

router.post('/company', companySignUpValidator, runValidation, registerCompany);

router.post(
  '/user',
  auth,
  userRegistrationValidator,
  runValidation,
  registerUser
);

router.post(
  '/newuser',
  auth,
  userRegistrationValidator,
  runValidation,
  addNewUsersArray
);

module.exports = router;
