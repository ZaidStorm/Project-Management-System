const mongoose = require('mongoose');

const wbsNodeSchema = new mongoose.Schema(
  {
    wbsId: {
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
    parentId: {
      type: String,
      default: null,
      trim: true,
      index: true
    },
    requirementId: {
      type: String,
      default: null,
      trim: true,
      ref: 'Requirement'
    },
    code: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'WBS Node name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    nodeType: {
      type: String,
      enum: ['Project', 'Deliverable', 'Work Package', 'Task'],
      default: 'Work Package'
    },
    responsiblePerson: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
      default: 'Not Started'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    estimatedCost: {
      type: Number,
      min: 0,
      default: 0
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('WBSNode', wbsNodeSchema);
