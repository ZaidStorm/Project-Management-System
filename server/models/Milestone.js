const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    milestoneId: {
      type: String,
      required: true,
      trim: true
    },
    projectId: {
      type: String,
      required: [true, 'Project ID is required'],
      ref: 'Project',
      trim: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Milestone title is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    },
    responsiblePerson: {
      type: String,
      required: [true, 'Responsible person is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Delayed'],
      default: 'Pending'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    completedDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// If completed, set completedDate if not set
milestoneSchema.pre('save', function (next) {
  if (this.status === 'Completed' && !this.completedDate) {
    this.completedDate = new Date();
    this.progress = 100;
  }
  next();
});

module.exports = mongoose.model('Milestone', milestoneSchema);
