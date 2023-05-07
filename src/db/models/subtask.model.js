import { Sequelize } from "sequelize";

export function makeSubTaskImage ({ sequelize, modelName }) {
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
    subTask_header: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    subTask_description: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    subTask_priority: {
      type: Sequelize.STRING,
      allowNull: true
    },
    assistant_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    performer_id: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: modelName
  })
}