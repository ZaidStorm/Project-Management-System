const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema(
  {
    inspectionId: {
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
    deliverable: {
      type: String,
      required: [true, 'Deliverable title is required'],
      trim: true
    },
    inspectionDate: {
      type: Date,
      default: Date.now
    },
    inspector: {
      type: String,
      required: true,
      trim: true
    },
    result: {
      type: String,
      enum: ['PASS', 'FAIL'],
      default: 'PASS'
    },
    totalTestCases: {
      type: Number,
      default: 0
    },
    passedCases: {
      type: Number,
      default: 0
    },
    failedCases: {
      type: Number,
      default: 0
    },
    criticalDefectsCount: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Inspection', inspectionSchema);
