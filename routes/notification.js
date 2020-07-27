const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  getActionNotificationsUser,
  getActionNotificationById,
  getActionNotificationsCount,
} = require('../controllers/notificationController');

router.get('/', auth, getActionNotificationsUser);
router.get('/count', auth, getActionNotificationsCount);

router.get('/:notificationId', auth, getActionNotificationById);

module.exports = router;
