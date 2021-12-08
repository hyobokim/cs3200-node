

let data = [
  {"name": "Hyoboem Kim", "nuid": "001552834"},
  {"name": "Logan Pfahler", "nuid": "024529481"},
  {"name": "Marques Brownlee", "nuid": "920484534"}
]

const mysql = require('mysql2');

const con = mysql.createConnection({
  host : "localhost",
  user: "root",
  password: "Comets1283648",
  database: "huskies_ultimate"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = (app) => {
  app.get('/hello', (req, res) => {
    // res.send(JSON.stringify(data));
    res.json(data);
  });

  // app.get('/data', (req, res) => {
  //   res.send("hello");
  // })


  app.get('/api/teams/:teamId/players', (req, res) => {
    con.query("CALL getTeamPlayers(" + req.params["teamId"] + ")", function (err, result) {
      if (err) throw err;
      res.send(result[0]);
    })
  })

  app.get('/api/teams/:teamId/events', (req, res) => {
    con.query("CALL getTeamEvents(" + req.params["teamId"] + ")", function (err, result) {
      if (err) throw err;
      res.send(result[0]);
    })
  })

  app.get('/api/teams/:teamId', (req, res) => {
    con.query("SELECT * FROM team WHERE teamId = " + req.params["teamId"], function (err, result) {
      if (err) throw err;
      res.send(result);
    })
  })

  app.get('/api/teams', (req, res) => {
    con.query("SELECT * FROM team", function (err, result) {
      if (err) throw err;
      res.send(result);
    })
  })
}


