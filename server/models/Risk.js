const mongoose = require('mongoose');

const riskSchema = new mongoose.Schema(
  {
    riskId: {
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
    title: {
      type: String,
      required: [true, 'Risk title is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    likelihood: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 3
    },
    impact: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 3
    },
    riskScore: {
      type: Number,
      default: 9
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    owner: {
      type: String,
      trim: true,
      default: 'Project Manager'
    },
    responseStrategy: {
      type: String,
      enum: ['Mitigate', 'Avoid', 'Transfer', 'Accept'],
      default: 'Mitigate'
    },
    preventiveAction: {
      type: String,
      trim: true,
      default: ''
    },
    correctiveAction: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['Identified', 'Analyzing', 'Mitigated', 'Closed'],
      default: 'Identified'
    },
    reviewDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Calculate score and level before saving
riskSchema.pre('save', function (next) {
  const l = Number(this.likelihood) || 1;
  const i = Number(this.impact) || 1;
  const score = l * i;
  this.riskScore = score;

  if (score >= 17) {
    this.riskLevel = 'Critical';
  } else if (score >= 10) {
    this.riskLevel = 'High';
  } else if (score >= 5) {
    this.riskLevel = 'Medium';
  } else {
    this.riskLevel = 'Low';
  }
  next();
});

module.exports = mongoose.model('Risk', riskSchema);
