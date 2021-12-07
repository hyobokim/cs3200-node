

let data = [
  {"name": "Hyoboem Kim", "nuid": "001552834"},
  {"name": "Logan Pfahler", "nuid": "024529481"},
  {"name": "Marques Brownlee", "nuid": "920484534"}
]

const mysql = require('mysql2');

const con = mysql.createConnection({
  host : "localhost",
  user: "root",
  password: "16465265437kezami",
  database: "neu_ultimate"
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

  app.get('/api/a-players', (req, res) => {
    con.query("SELECT * FROM player where team=0", function (err, result) {
      if (err) throw err;
      res.send(result);
    })
  })

  app.get('/api/players/:teamId', (req, res) => {
    con.query("Call getTeamPlayers(" + req.params["teamId"] + ")", function (err, result) {
      if (err) throw err;
      res.send(result);
    })
  })

  app.get('/api/c-players', (req, res) => {
    con.query("SELECT * FROM player where team=2", function (err, result) {
      if (err) throw err;
      res.send(result);
    })
  })

  app.get('/api/team/:teamId/players', (req, res) => {
    con.query("CALL getTeamPlayers(" + req.params["teamId"] + ")", function (err, result) {
      if (err) throw err;
      res.send(result[0]);
    })
  })
}


