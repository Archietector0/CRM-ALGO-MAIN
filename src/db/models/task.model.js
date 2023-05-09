import { Sequelize } from "sequelize";

export function makeTaskStorageImage ({ sequelize, modelName }) {
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
    project_name: {
      type: Sequelize.STRING,
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
    task_header: {
      type: Sequelize.STRING,
      allowNull: true
    },
    task_desc: {
      type: Sequelize.STRING,
      allowNull: true
    },
    task_priority: {
      type: Sequelize.STRING,
      allowNull: true
    },
    task_status: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: modelName
  })
}