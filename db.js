// db connection
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "185.217.125.241",
  user: "bro_teamwork",
  database: "bro_teamwork",
  password: "1z99fwO1$",
});

module.exports = db;
// db.connect(function (err) {
//   if (err) {
//     console.log("Something Went Wrong");
//   } else {
//     console.log("Connected");
//   }
// });
