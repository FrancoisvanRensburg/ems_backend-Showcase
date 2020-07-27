const ActionNotification = require('../models/ActionNotification');
const User = require('../models/User');

exports.getActionNotificationsUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.data.user })
      .select('actionnotifications')
      .populate({
        path: 'actionnotifications',
        select: 'date notificationType notificationTask',
      });
    res.json(user.actionnotifications);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

exports.getActionNotificationById = async (req, res) => {
  try {
    const notification = await ActionNotification.findOne({
      _id: req.params.notificationId,
    })
      .populate(
        'notificationTask',
        'taskname description actualstartdate actualenddate effort created updated section'
      )
      .populate(
        'notificationProject',
        'projectname projectcode actualstartdate actualenddate description created'
      );
    res.json(notification);
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};

exports.getActionNotificationsCount = async (req, res) => {
  try {
    const notifications = await User.findOne({ _id: req.data.user }).select(
      'actionnotifications'
    );
    // .populate('actionnotifications');

    const notcount = notifications.actionnotifications.length;

    console.log(notcount);
    res.json({ notcount });
    // ActionNotification.aggregate
  } catch (error) {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
};
