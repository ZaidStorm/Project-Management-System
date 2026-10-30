const mongoose = require('mongoose');

const changeRequestSchema = new mongoose.Schema(
  {
    changeRequestId: {
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
    title: {
      type: String,
      required: [true, 'Change request title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    justification: {
      type: String,
      trim: true,
      default: ''
    },
    requestedBy: {
      type: String,
      required: true,
      trim: true
    },
    requestedDate: {
      type: Date,
      default: Date.now
    },
    affectedRequirements: {
      type: [String],
      default: []
    },
    costImpact: {
      type: Number,
      default: 0
    },
    scheduleImpact: {
      type: Number, // in days
      default: 0
    },
    resourceImpact: {
      type: String,
      trim: true,
      default: ''
    },
    riskImpact: {
      type: String,
      trim: true,
      default: ''
    },
    priority: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Draft', 'Under Review', 'Approved', 'Rejected'],
      default: 'Draft'
    },
    approvalStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true
    },
    approvedBy: {
      type: String,
      trim: true,
      default: ''
    },
    approvedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ChangeRequest', changeRequestSchema);
