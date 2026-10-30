const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema(
  {
    requirementId: {
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
      required: [true, 'Requirement title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['Functional', 'Non-Functional', 'Business', 'Technical', 'Regulatory'],
      default: 'Functional'
    },
    priority: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Draft', 'Under Review', 'Approved', 'Rejected', 'Implemented', 'Deferred'],
      default: 'Draft'
    },
    requestedBy: {
      type: String,
      trim: true,
      default: ''
    },
    assignedTo: {
      type: String,
      trim: true,
      default: ''
    },
    justification: {
      type: String,
      trim: true,
      default: ''
    },
    approvalStatus: {
      type: String,
      enum: ['Draft', 'Under Review', 'Approved', 'Rejected'],
      default: 'Draft',
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

module.exports = mongoose.model('Requirement', requirementSchema);
