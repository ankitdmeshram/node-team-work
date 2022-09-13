const mysql = require('mysql');

const con = mysql.createConnection({
host: "185.217.125.241",
user: "bro_teamwork",
password: "1z99fwO1$"
});

con.connect(function(err) {
if (err) throw err;
console.log("Connected!");
});