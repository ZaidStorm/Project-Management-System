const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { PORT, CLIENT_URL, NODE_ENV } = require('./config/env');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Module 1 Routes
const projectRoutes = require('./routes/projectRoutes');
const charterRoutes = require('./routes/charterRoutes');
const managementPlanRoutes = require('./routes/managementPlanRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');
const statusRoutes = require('./routes/statusRoutes');
const closureRoutes = require('./routes/closureRoutes');

// Module 2 Routes (Scope & WBS)
const requirementRoutes = require('./routes/requirementRoutes');
const wbsRoutes = require('./routes/wbsRoutes');
const changeRequestRoutes = require('./routes/changeRequestRoutes');
const requirementController = require('./controllers/requirementController');

// Module 3 Routes (Schedule & Resources)
const scheduleRoutes = require('./routes/scheduleRoutes');

// Module 4 Routes (Cost & EVM)
const costRoutes = require('./routes/costRoutes');

// Module 5 Routes (Quality & Risk)
const qualityRiskRoutes = require('./routes/qualityRiskRoutes');

// Module 6 Routes (Integration & Reporting)
const reportingRoutes = require('./routes/reportingRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5174', 'http://127.0.0.1:5174', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    modules: [
      'Module 1: Project Initiation & Integration',
      'Module 2: Scope Management & WBS',
      'Module 3: Schedule & Resource Management',
      'Module 4: Cost Management & EVM',
      'Module 5: Quality Management & Risk Control',
      'Module 6: Integration, Validation & Reporting'
    ]
  });
});

// --- MODULE 1: Initiation & Integration ---
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/charter', charterRoutes);
app.use('/api/projects/:projectId/management-plan', managementPlanRoutes);
app.use('/api/projects/:projectId/milestones', milestoneRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/projects/:projectId/status', statusRoutes);
app.use('/api/projects/:projectId/closure', closureRoutes);

// --- MODULE 2: Scope Management & WBS ---
app.use('/api/projects/:projectId/requirements', requirementRoutes);
app.use('/api/requirements', requirementRoutes);
app.get('/api/projects/:projectId/scope', requirementController.getApprovedScope);
app.use('/api/projects/:projectId/wbs', wbsRoutes);
app.use('/api/wbs', wbsRoutes);
app.use('/api/projects/:projectId/change-requests', changeRequestRoutes);
app.use('/api/change-requests', changeRequestRoutes);

// --- MODULE 3: Schedule & Resources ---
app.use('/api/projects/:projectId/schedule', scheduleRoutes);
app.use('/api/schedule', scheduleRoutes);

// --- MODULE 4: Cost Management & EVM ---
app.use('/api/projects/:projectId/cost', costRoutes);
app.use('/api/cost', costRoutes);

// --- MODULE 5: Quality & Risk Control ---
app.use('/api/projects/:projectId/quality-risk', qualityRiskRoutes);
app.use('/api/quality-risk', qualityRiskRoutes);

// --- MODULE 6: Integration & Reporting ---
app.use('/api/projects/:projectId/integration', reportingRoutes);
app.use('/api/integration', reportingRoutes);

// Static assets from frontend build
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // Client-side SPA routing fallback (for non-API GET routes)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    const indexPath = path.join(clientDistPath, 'index.html');
    res.sendFile(indexPath);
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'PMIS Backend is running on port ' + PORT + '.',
      hint: 'Please launch frontend with npm run dev or start.bat to view the web application at http://localhost:5173'
    });
  });
}

// Error Handling (for unhandled API routes)
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`[Server] Project Management Backend running on http://localhost:${PORT} (${NODE_ENV} mode)`);
});

module.exports = app;
