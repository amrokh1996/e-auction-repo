const { Client } = require("pg");
require("dotenv").config();

const dbConfig = {
  user: "postgres",
  host: "localhost",
  database: process.env.DATABASE_NAME,
  password: process.env.PASSWORD_POSTGRES,
  port: process.env.PORT,
};

const db = new Client(dbConfig);

db.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

// Export the function to create and connect to the database
module.exports = db;
