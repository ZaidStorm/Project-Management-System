const mongoose = require('mongoose');

const charterStakeholderSchema = new mongoose.Schema(
  {
    stakeholderId: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    organization: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, default: '' },
    responsibility: { type: String, trim: true, default: '' },
    influenceLevel: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    },
    interest: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'High'
    },
    influence: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'High'
    }
  },
  { _id: true }
);

const projectCharterSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: [true, 'Project ID is required'],
      unique: true,
      ref: 'Project',
      trim: true,
      index: true
    },
    projectType: {
      type: String,
      trim: true,
      default: 'Software Development'
    },
    client: {
      type: String,
      trim: true,
      default: 'Network of Five Hospitals'
    },
    priority: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'High'
    },
    objectives: {
      type: [String],
      default: []
    },
    stakeholders: {
      type: [charterStakeholderSchema],
      default: []
    },
    inScope: {
      type: [String],
      default: []
    },
    outOfScope: {
      type: [String],
      default: []
    },
    assumptions: {
      type: [String],
      default: []
    },
    constraints: {
      type: [String],
      default: []
    },
    approvedBudget: {
      type: Number,
      default: 0
    },
    changeCost: {
      type: Number,
      default: 0
    },
    revisedBudget: {
      type: Number,
      default: 0
    },
    originalDeadline: {
      type: Date
    },
    deadline: {
      type: Date
    },
    originalDuration: {
      type: String,
      default: '16 Weeks'
    },
    changeDuration: {
      type: String,
      default: '0 Weeks'
    },
    revisedDuration: {
      type: String,
      default: '16 Weeks'
    },
    revisedDeadline: {
      type: Date
    },
    projectManager: {
      type: String,
      trim: true,
      default: ''
    },
    approvalStatus: {
      type: String,
      enum: ['Draft', 'Submitted', 'Approved', 'Rejected'],
      default: 'Draft'
    },
    approvalDate: {
      type: Date
    },
    approvedBy: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ProjectCharter', projectCharterSchema);
