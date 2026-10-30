const mongoose = require('mongoose');

const stakeholderSchema = new mongoose.Schema(
  {
    stakeholderId: {
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
    name: {
      type: String,
      required: [true, 'Stakeholder name is required'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true
    },
    organization: {
      type: String,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    responsibility: {
      type: String,
      trim: true,
      default: ''
    },
    influenceLevel: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Stakeholder', stakeholderSchema);
