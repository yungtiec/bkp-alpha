const Sequelize = require("sequelize");
require("sequelize-hierarchy")(Sequelize);

const db = new Sequelize(process.env.REMOTE_BKP_ALPHA_DATABASE_URI, {
  dialect: "postgres",
  protocol: "postgres",
  port: 5432,
  host: "ec2-54-221-210-97.compute-1.amazonaws.com",
  logging: false,
  dialectOptions: {
    ssl: true
  }
});
module.exports = db;
