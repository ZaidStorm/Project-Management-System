const mongoose = require('mongoose');

const earnedValueSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      ref: 'Project',
      unique: true,
      trim: true,
      index: true
    },
    pv: {
      type: Number, // Planned Value
      default: 0
    },
    ev: {
      type: Number, // Earned Value
      default: 0
    },
    ac: {
      type: Number, // Actual Cost
      default: 0
    },
    cpi: {
      type: Number, // Cost Performance Index = EV / AC
      default: 1
    },
    spi: {
      type: Number, // Schedule Performance Index = EV / PV
      default: 1
    },
    costVariance: {
      type: Number, // EV - AC
      default: 0
    },
    scheduleVariance: {
      type: Number, // EV - PV
      default: 0
    },
    costStatus: {
      type: String,
      enum: ['Under Budget', 'On Budget', 'Over Budget', 'Critical Overrun'],
      default: 'On Budget'
    },
    scheduleStatus: {
      type: String,
      enum: ['Ahead of Schedule', 'On Schedule', 'Behind Schedule', 'Critical Delay'],
      default: 'On Schedule'
    },
    warnings: {
      type: [String],
      default: []
    },
    calculatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('EarnedValue', earnedValueSchema);
