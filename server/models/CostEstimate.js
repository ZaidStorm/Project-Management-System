const mongoose = require('mongoose');

const costEstimateSchema = new mongoose.Schema(
  {
    estimateId: {
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
      required: [true, 'Activity reference is required'],
      trim: true,
      ref: 'Activity'
    },
    laborCost: {
      type: Number,
      default: 0
    },
    materialCost: {
      type: Number,
      default: 0
    },
    softwareCost: {
      type: Number,
      default: 0
    },
    otherCost: {
      type: Number,
      default: 0
    },
    totalEstimatedCost: {
      type: Number,
      default: 0
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

costEstimateSchema.pre('save', function (next) {
  this.totalEstimatedCost =
    (Number(this.laborCost) || 0) +
    (Number(this.materialCost) || 0) +
    (Number(this.softwareCost) || 0) +
    (Number(this.otherCost) || 0);
  next();
});

module.exports = mongoose.model('CostEstimate', costEstimateSchema);
