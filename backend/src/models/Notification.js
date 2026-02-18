const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['project_invite'],
      default: 'project_invite',
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    inviteRole: {
      type: String,
      trim: true,
      default: 'Contributor',
    },
    title: {
      type: String,
      trim: true,
      default: 'Project Invitation',
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    actedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index(
  { recipient: 1, project: 1, type: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { type: 'project_invite', status: 'pending' },
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
