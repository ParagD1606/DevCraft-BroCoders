const express = require('express');
const Notification = require('../models/Notification');
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

function toNotificationResponse(notification) {
  const sender = notification.sender || {};
  const project = notification.project || {};
  const senderId = sender?._id || sender;
  const projectId = project?._id || project;

  return {
    id: String(notification._id),
    type:
      notification.type === 'project_invite'
        ? 'invite'
        : notification.type === 'project_application'
        ? 'application'
        : 'alert',
    rawType: notification.type,
    title: notification.title || 'Notification',
    message: notification.message || '',
    time: notification.createdAt,
    isRead: Boolean(notification.isRead),
    status: notification.status || 'pending',
    inviteRole: notification.inviteRole || 'Contributor',
    roleTitle: notification.roleTitle || '',
    sender: {
      id: senderId ? String(senderId) : '',
      name: sender?.name || sender?.email || 'Unknown',
    },
    project: {
      id: projectId ? String(projectId) : '',
      title: project?.title || 'Project',
    },
    createdAt: notification.createdAt,
    updatedAt: notification.updatedAt,
  };
}

// @desc    Fetch current user's notifications
// @route   GET /api/notification
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name email')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    const payload = notifications.map(toNotificationResponse);
    const unreadCount = payload.filter((notification) => !notification.isRead).length;

    return res.status(200).json({ notifications: payload, unreadCount });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notification/mark-all-read
// @access  Private
router.patch('/mark-all-read', protect, async (req, res) => {
  try {
    const now = new Date();
    const updateResult = await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true, readAt: now } }
    );

    return res.status(200).json({
      message: 'All notifications marked as read',
      modifiedCount: updateResult.modifiedCount || 0,
    });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Mark notification as read
// @route   PATCH /api/notification/:id/read
// @access  Private
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.isRead = true;
    notification.readAt = notification.readAt || new Date();
    await notification.save();
    await notification.populate('sender', 'name email');
    await notification.populate('project', 'title');

    return res.status(200).json({
      message: 'Notification marked as read',
      notification: toNotificationResponse(notification),
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Accept a project invite/application notification
// @route   POST /api/notification/:id/accept
// @access  Private
router.post('/:id/accept', protect, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (!['project_invite', 'project_application'].includes(notification.type)) {
      return res.status(400).json({ error: 'This notification cannot be accepted' });
    }

    if (notification.status !== 'pending') {
      return res.status(400).json({ error: `Invite is already ${notification.status}` });
    }

    const project = await Project.findById(notification.project);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (notification.type === 'project_invite') {
      const isOwner = String(project.owner) === String(req.user._id);
      const isAlreadyMember = (project.members || []).some(
        (member) => String(member.user) === String(req.user._id)
      );

      if (!isOwner && !isAlreadyMember) {
        project.members.push({
          user: req.user._id,
          role: notification.inviteRole || 'Contributor',
          joinedAt: new Date(),
        });
        project.teamSize = 1 + project.members.length;
        await project.save();
      }
    }

    if (notification.type === 'project_application') {
      if (String(project.owner) !== String(req.user._id)) {
        return res.status(403).json({ error: 'Only the project owner can accept applications' });
      }

      const applicantId = String(notification.sender);
      const isAlreadyMember = (project.members || []).some(
        (member) => String(member.user) === applicantId
      );

      if (!isAlreadyMember) {
        const requestedRoleTitle = String(notification.roleTitle || '').trim();
        const matchedRole = requestedRoleTitle
          ? (project.roles || []).find(
              (role) =>
                String(role?.title || '').trim().toLowerCase() ===
                requestedRoleTitle.toLowerCase()
            )
          : null;

        if (matchedRole && (Number(matchedRole.spots) || 0) < 1) {
          return res.status(400).json({ error: 'No spots left for this role' });
        }

        project.members.push({
          user: notification.sender,
          role: requestedRoleTitle || 'Contributor',
          joinedAt: new Date(),
        });

        if (matchedRole) {
          matchedRole.spots = Math.max(0, (Number(matchedRole.spots) || 0) - 1);
        }

        project.teamSize = 1 + project.members.length;
        await project.save();
      }

      const ownerName = req.user.name || req.user.email || 'Project Owner';
      await Notification.create({
        recipient: notification.sender,
        sender: req.user._id,
        type: 'project_application',
        project: project._id,
        roleTitle: notification.roleTitle || '',
        title: 'Application Accepted',
        message: `${ownerName} accepted your application for "${notification.roleTitle || 'Contributor'}" in "${project.title}".`,
        status: 'accepted',
        isRead: false,
      });
    }

    const now = new Date();
    notification.status = 'accepted';
    notification.isRead = true;
    notification.readAt = now;
    notification.actedAt = now;
    await notification.save();
    await notification.populate('sender', 'name email');
    await notification.populate('project', 'title');

    return res.status(200).json({
      message:
        notification.type === 'project_application'
          ? 'Application accepted successfully'
          : 'Invite accepted successfully',
      projectId: String(project._id),
      notification: toNotificationResponse(notification),
    });
  } catch (error) {
    console.error('Accept invite error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Reject a project invite/application notification
// @route   POST /api/notification/:id/reject
// @access  Private
router.post('/:id/reject', protect, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (!['project_invite', 'project_application'].includes(notification.type)) {
      return res.status(400).json({ error: 'This notification cannot be rejected' });
    }

    if (notification.status !== 'pending') {
      return res.status(400).json({ error: `Invite is already ${notification.status}` });
    }

    const now = new Date();
    notification.status = 'rejected';
    notification.isRead = true;
    notification.readAt = now;
    notification.actedAt = now;
    await notification.save();
    await notification.populate('sender', 'name email');
    await notification.populate('project', 'title');

    return res.status(200).json({
      message:
        notification.type === 'project_application'
          ? 'Application rejected'
          : 'Invite rejected',
      notification: toNotificationResponse(notification),
    });
  } catch (error) {
    console.error('Reject invite error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
