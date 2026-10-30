const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: [true, 'Project ID is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    projectName: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    projectManager: {
      type: String,
      required: [true, 'Project manager is required'],
      trim: true
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required']
    },
    approvedBudget: {
      type: Number,
      required: [true, 'Approved budget is required'],
      min: [0, 'Budget must be non-negative']
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
    originalDeadline: {
      type: Date
    },
    originalDuration: {
      type: String,
      trim: true,
      default: '16 Weeks'
    },
    changeCost: {
      type: Number,
      default: 0
    },
    revisedBudget: {
      type: Number,
      default: function () {
        return this.approvedBudget + (this.changeCost || 0);
      }
    },
    changeDuration: {
      type: String,
      trim: true,
      default: '0 Weeks'
    },
    revisedDuration: {
      type: String,
      trim: true,
      default: '16 Weeks'
    },
    revisedDeadline: {
      type: Date
    },
    pv: {
      type: Number,
      default: 0
    },
    ev: {
      type: Number,
      default: 0
    },
    ac: {
      type: Number,
      default: 0
    },
    cpi: {
      type: Number,
      default: 1.0
    },
    spi: {
      type: Number,
      default: 1.0
    },
    status: {
      type: String,
      enum: ['Planning', 'In Progress', 'On Hold', 'At Risk', 'Completed', 'Cancelled'],
      default: 'Planning'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Project', projectSchema);
