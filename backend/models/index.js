const { Sequelize } = require('sequelize');
const dbConfig = require('../config/config.js')[process.env.NODE_ENV || 'development'];


const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);

// Define relationships
db.User.hasMany(db.Post, { foreignKey: 'userId' });
db.Post.belongsTo(db.User, { foreignKey: 'userId' });

module.exports = db;