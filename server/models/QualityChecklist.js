const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema(
  {
    itemText: { type: String, required: true },
    isChecked: { type: Boolean, default: false }
  },
  { _id: true }
);

const qualityChecklistSchema = new mongoose.Schema(
  {
    checklistId: {
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
    wbsId: {
      type: String,
      trim: true,
      ref: 'WBSNode',
      default: ''
    },
    deliverable: {
      type: String,
      required: [true, 'Deliverable name is required'],
      trim: true
    },
    items: {
      type: [checklistItemSchema],
      default: []
    },
    inspectionDate: {
      type: Date,
      default: Date.now
    },
    inspector: {
      type: String,
      trim: true,
      default: 'QA Lead'
    },
    result: {
      type: String,
      enum: ['PASS', 'FAIL', 'PENDING'],
      default: 'PENDING'
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

module.exports = mongoose.model('QualityChecklist', qualityChecklistSchema);
