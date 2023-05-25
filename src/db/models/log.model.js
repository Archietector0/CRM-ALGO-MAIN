import { Sequelize } from "sequelize";

export function makeLogImage ({ sequelize, modelName }) {
  return sequelize.define(modelName, {
    uuid: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    user_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    telegram_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    action: {
      type: Sequelize.STRING,
      allowNull: true
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true
    },
    msg_text: {
      type: Sequelize.STRING,
      allowNull: true
    },
    json_data: {
      type: Sequelize.STRING,
      allowNull: true
    },
    user_session: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: modelName
  })
}