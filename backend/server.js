const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const adminRoutes = require('./routes/admin');
const authMiddleware = require('./middleware/auth');
const db = require('./models');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Environment variable checks
if (!process.env.JWT_SECRET) {
  console.warn("⚠️ Warning: JWT_SECRET is not set in .env file");
}
if (!process.env.PORT) {
  console.warn("⚠️ Warning: PORT not set, defaulting to 5000");
}

// Test database connection
console.log("🔌 Testing database connection...");
db.sequelize.authenticate()
  .then(() => console.log('✅ Connected to PostgreSQL database'))
  .catch(err => console.error('❌ Database connection error:', err));

// Sync models with database
console.log("🔄 Syncing database models...");
db.sequelize.sync({ alter: true })
  .then(() => console.log('✅ Database synced'))
  .catch(err => console.error('❌ Database sync error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', authMiddleware, postRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
