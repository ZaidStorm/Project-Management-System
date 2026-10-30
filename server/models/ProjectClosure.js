const mongoose = require('mongoose');

const projectClosureSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: [true, 'Project ID is required'],
      unique: true,
      ref: 'Project',
      trim: true,
      index: true
    },
    closureDate: {
      type: Date,
      default: Date.now
    },
    finalStatus: {
      type: String,
      enum: ['Completed', 'Terminated', 'Archived'],
      default: 'Completed'
    },
    finalProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    },
    finalBudget: {
      type: Number,
      default: 0
    },
    deliverablesCompleted: {
      type: [String],
      default: []
    },
    pendingItems: {
      type: [String],
      default: []
    },
    lessonsLearned: {
      type: [String],
      default: []
    },
    closureNotes: {
      type: String,
      trim: true,
      default: ''
    },
    approvedBy: {
      type: String,
      trim: true,
      default: ''
    },
    approvalStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ProjectClosure', projectClosureSchema);
