const mysql = require("mysql");

    const connection =  mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "todolist",
        password: ""
    });
    module.exports = connection;


