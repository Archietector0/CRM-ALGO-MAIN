import { Sequelize } from "sequelize";
import { makeTaskImage } from "./models/task.model.js";
// import { make_payment_image } from "./payments.model.js";
// import { make_string_image } from "./strings.model.js";
// import { make_logs_image } from "./logs.model.js";

class DataBase {
  // Private vars

  // Public vars

  // Constructor
  constructor () {}

  getConnection ({ DB_NAME, DB_USERNAME, DB_PASS, DB_DIALECT, DB_HOST, DB_PORT }) {
    return new Sequelize(DB_NAME, DB_USERNAME, DB_PASS, {
      dialect: DB_DIALECT,
      host: DB_HOST,
      port: DB_PORT
    })
  }

  getImage ({ sequelize, modelName }) {
    if (modelName === 'tasks') {
      return makeTaskImage({ sequelize, modelName })
    }
    // if (DB_TABLE_NAME === 'payments') {
    //   this.image = make_payment_image({ sequelize, DB_TABLE_NAME })
    // } else if (DB_TABLE_NAME === 'strings') {
    //   this.image = make_string_image({ sequelize, DB_TABLE_NAME })
    // } else if (DB_TABLE_NAME === 'logs') {
    //   this.image = make_logs_image({ sequelize, DB_TABLE_NAME })
    // } else {
    //   console.log('ERROR: in make_image func');
    // }
  }
}

export const db = new DataBase()