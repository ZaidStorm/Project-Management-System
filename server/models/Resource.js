const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    resourceId: {
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
    name: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    availability: {
      type: Number, // percentage or hours per week, e.g. 100%
      default: 100
    },
    hourlyRate: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Active', 'Unavailable', 'Assigned'],
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Resource', resourceSchema);
