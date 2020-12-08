const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('myapp', '', '', {
  dialect: 'sqlite',
  storage: 'db.sqlite3'
})

const User = sequelize.define(
  'User',
  {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.TEXT, allowNull: false }
  },
  {}
)

User.sync({ alter: true })

module.exports = { User, sequelize }
