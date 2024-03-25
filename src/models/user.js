const constant = require("../constants/constant");

module.exports = (sequelize, DataType) => {
  const User = sequelize.define(
    constant.DB.table.USER_MASTER,
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataType.BIGINT,
      },
      name: {
        type: DataType.STRING,
        allowNull: false,
      },
      email: {
        type: DataType.STRING,
        allowNull: false
      },
      emailVerified: {
        type: DataType.INTEGER,
        defaultValue: 0,
      },
      mobileNo: {
        type: DataType.BIGINT,
        allowNull: false,
        unique: true
      },
      isActive: {
        type: DataType.INTEGER,
        defaultValue: 1,
      },
      createdAt: {
        allowNull: false,
        type: DataType.BIGINT,
      },
      updatedAt: {
        allowNull: false,
        type: DataType.BIGINT,
      },
    },
    {
      hooks: {
        beforeCreate: async (user, options) => {
          user.createdAt = Math.floor(Date.now());
          user.updatedAt = Math.floor(Date.now());
        },
        beforeUpdate: async (user, options) => {
          user.updatedAt = Math.floor(Date.now());
        }
      },
    }
  );

  return User;
};
