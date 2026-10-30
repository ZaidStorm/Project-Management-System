const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    expenseId: {
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
    description: {
      type: String,
      required: [true, 'Expense description is required'],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0
    },
    date: {
      type: Date,
      default: Date.now
    },
    category: {
      type: String,
      enum: ['Labor', 'Software', 'Hardware', 'Operations', 'Other'],
      default: 'Other'
    },
    recordedBy: {
      type: String,
      trim: true,
      default: 'Financial Lead'
    },
    reference: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
