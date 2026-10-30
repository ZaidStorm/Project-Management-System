const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from root or server
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
  PORT: process.env.PORT || 5050,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/project_management_db',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
};
