const mongoose = require('mongoose');

const scopePlanSchema = new mongoose.Schema(
  {
    projectScopeDefinition: { type: String, default: '' },
    deliverables: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    scopeApprovalProcess: { type: String, default: '' }
  },
  { _id: false }
);

const schedulePlanSchema = new mongoose.Schema(
  {
    developmentStart: { type: Date },
    developmentEnd: { type: Date },
    testingStart: { type: Date },
    testingEnd: { type: Date },
    deploymentDate: { type: Date },
    scheduleNotes: { type: String, default: '' }
  },
  { _id: false }
);

const costPlanSchema = new mongoose.Schema(
  {
    developmentCost: { type: Number, default: 0 },
    hardwareCost: { type: Number, default: 0 },
    softwareCost: { type: Number, default: 0 },
    otherCost: { type: Number, default: 0 },
    contingency: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    costNotes: { type: String, default: '' }
  },
  { _id: false }
);

const qualityPlanSchema = new mongoose.Schema(
  {
    qualityStandards: { type: [String], default: [] },
    testingStrategy: { type: String, default: '' },
    codeReviewProcess: { type: String, default: '' },
    acceptanceCriteria: { type: [String], default: [] },
    qualityMetrics: { type: [String], default: [] }
  },
  { _id: false }
);

const managementPlanSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: [true, 'Project ID is required'],
      unique: true,
      ref: 'Project',
      trim: true,
      index: true
    },
    scopePlan: {
      type: scopePlanSchema,
      default: () => ({})
    },
    schedulePlan: {
      type: schedulePlanSchema,
      default: () => ({})
    },
    costPlan: {
      type: costPlanSchema,
      default: () => ({})
    },
    qualityPlan: {
      type: qualityPlanSchema,
      default: () => ({})
    }
  },
  {
    timestamps: true
  }
);

// Auto-calculate total cost before saving
managementPlanSchema.pre('save', function (next) {
  if (this.costPlan) {
    const dev = Number(this.costPlan.developmentCost) || 0;
    const hw = Number(this.costPlan.hardwareCost) || 0;
    const sw = Number(this.costPlan.softwareCost) || 0;
    const other = Number(this.costPlan.otherCost) || 0;
    const contingency = Number(this.costPlan.contingency) || 0;
    this.costPlan.totalCost = dev + hw + sw + other + contingency;
  }
  next();
});

module.exports = mongoose.model('ManagementPlan', managementPlanSchema);
