module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdByUsername: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  
    return Post;
  };