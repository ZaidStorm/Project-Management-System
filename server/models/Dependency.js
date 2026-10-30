const mongoose = require('mongoose');

const dependencySchema = new mongoose.Schema(
  {
    dependencyId: {
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
    predecessorActivity: {
      type: String,
      required: [true, 'Predecessor activity is required'],
      trim: true,
      ref: 'Activity'
    },
    successorActivity: {
      type: String,
      required: [true, 'Successor activity is required'],
      trim: true,
      ref: 'Activity'
    },
    dependencyType: {
      type: String,
      enum: ['FS', 'SS', 'FF', 'SF'],
      default: 'FS'
    },
    lag: {
      type: Number, // days
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Dependency', dependencySchema);
