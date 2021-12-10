// import {request} from "express";

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// const mysql = require('mysql2');
//
// const con = mysql.createConnection({
//   host : "localhost",
//   user: "root",
//   password: "16465265437kezami",
//   database: "ap"
// });

// using CORS policy to ensure frontend on localhost:4000 can communicate with backend
// on localhost:3000
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

require('./services/sql-server')(app);

// module.exports = (app) => {
//   // app.get('/data', (req, res) => {
//   //   con.query("SELECT invoice_date from invoices", function(err, result) {
//   //     if (err) throw err;
//   //     res.send(result);
//   //   })
//   //   res.send("hello");
//   // });
//   app.get('/data', (req, res) => {
//     res.send("hello");
//   })
// }

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });
//
// con.query("SELECT * FROM invoices", function(err, result, fields) {
//   if (err) throw err;
//   console.log(result);
// });


app.listen(4000);