import { Sequelize } from "sequelize";

export function makeSubTaskStorageImage ({ sequelize, modelName }) {
  return sequelize.define(modelName, {
    uuid: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    link_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    senior_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    senior_nickname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    performer_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    performer_nickname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    subtask_header: {
      type: Sequelize.STRING,
      allowNull: true
    },
    subtask_desc: {
      type: Sequelize.STRING,
      allowNull: true
    },
    subTask_priority: {
      type: Sequelize.STRING,
      allowNull: true
    },
    subtask_status: {
      type: Sequelize.STRING,
      allowNull: true
    },
  }, {
    timestamps: false,
    tableName: modelName
  })
}