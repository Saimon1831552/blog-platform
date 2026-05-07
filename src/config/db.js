const mysql = require('mysql2/promise');
require('dotenv').config()

const db = mysql.createPool({
    host:process.env.DB_Host,
    user:process.env.DB_User,
    password:process.env.DB_password,
    database:process.env.DB_Name
})

module.exports = db;
