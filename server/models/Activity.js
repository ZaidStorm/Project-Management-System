const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    activityId: {
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
      required: [true, 'Associated WBS Work Package is required'],
      trim: true,
      ref: 'WBSNode'
    },
    name: {
      type: String,
      required: [true, 'Activity name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    assignedResources: {
      type: [String],
      default: []
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    duration: {
      type: Number, // days
      default: 1
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'Delayed'],
      default: 'Not Started'
    },
    estimatedHours: {
      type: Number,
      default: 0
    },
    actualHours: {
      type: Number,
      default: 0
    },
    priority: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'Medium'
    }
  },
  {
    timestamps: true
  }
);

// Auto-calculate duration from dates if not provided
activitySchema.pre('save', function (next) {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(new Date(this.endDate) - new Date(this.startDate));
    this.duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  }
  next();
});

module.exports = mongoose.model('Activity', activitySchema);
