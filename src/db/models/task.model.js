import { Sequelize } from "sequelize";

export function makeTaskImage ({ sequelize, modelName }) {
  return sequelize.define(modelName, {
    uuid: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
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
      type: Sequelize.INTEGER,
      allowNull: true
    },
    task_header: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    task_description: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    task_priority: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: modelName
  })
}