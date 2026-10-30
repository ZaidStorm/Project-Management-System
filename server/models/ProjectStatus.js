const mongoose = require('mongoose');

const responsibilityItemSchema = new mongoose.Schema(
  {
    person: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    responsibility: { type: String, required: true, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Blocked'],
      default: 'Pending'
    }
  },
  { _id: true }
);

const projectStatusSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: [true, 'Project ID is required'],
      unique: true,
      ref: 'Project',
      trim: true,
      index: true
    },
    overallStatus: {
      type: String,
      enum: ['Planning', 'In Progress', 'On Hold', 'At Risk', 'Completed', 'Cancelled'],
      default: 'Planning'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    currentPhase: {
      type: String,
      default: 'Initiation'
    },
    currentIssues: {
      type: [String],
      default: []
    },
    achievements: {
      type: [String],
      default: []
    },
    risks: {
      type: [String],
      default: []
    },
    nextActions: {
      type: [String],
      default: []
    },
    responsibilities: {
      type: [responsibilityItemSchema],
      default: []
    },
    updatedBy: {
      type: String,
      trim: true,
      default: 'Project Manager'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ProjectStatus', projectStatusSchema);
