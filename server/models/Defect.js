const mongoose = require('mongoose');

const defectSchema = new mongoose.Schema(
  {
    defectId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    projectId: {
      type: String,
      required: true,
      ref: 'Project',
      trim: true,
      index: true
    },
    activityId: {
      type: String,
      trim: true,
      ref: 'Activity',
      default: ''
    },
    title: {
      type: String,
      required: [true, 'Defect title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    severity: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'Medium'
    },
    priority: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'Medium'
    },
    assignedTo: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Rejected'],
      default: 'Open'
    },
    reportedBy: {
      type: String,
      trim: true,
      default: 'QA Specialist'
    },
    reportedDate: {
      type: Date,
      default: Date.now
    },
    resolvedDate: {
      type: Date
    },
    resolution: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Defect', defectSchema);
