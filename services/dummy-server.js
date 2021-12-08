

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

  app.get('/api/teams', (req, res) => {
    con.query("SELECT * FROM team", function (err, result) {
      if (err) throw err;
      res.send(result);
    })
  })

  app.get('/api/teams/:teamId/events/:tournamentId/games', (req, res) => {
    con.query("CALL getEventGames(" + req.params["tournamentId"] + ", " + req.params["teamId"] + ")" , function (err, result) {
      if (err) throw err;
      res.send(result[0]);
    })
  })

  app.get('/api/teams/:teamId/events/:tournamentId/games/:gameId/points', (req, res) => {
    con.query("CALL getGamePoints(" + req.params["gameId"] + ")" , function (err, result) {
      if (err) throw err;
      res.send(result[0]);
    })
  })

  app.get('/api/teams/:teamId/events/:tournamentId/games/:gameId/points/:pointId/stats', (req, res) => {
    con.query("CALL getPointStats(" + req.params["pointId"] + ")" , function (err, result) {
      if (err) throw err;
      res.send(result[0]);
    })
  })


  app.delete('/api/teams/:teamId/players/:nuid', (req, res) => {
    con.query("DELETE from player as p where p.nuID=" + req.params["nuid"], function(err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    })
  })

  app.post('/api/teams/:teamId/players', (req, res) => {

    console.log(req.body);

    con.query("INSERT INTO player (name, number, captain, team, nuID)"
        + " VALUES (" + "'" + req.body.playerName + "'" + ", " + req.body.playerNumber + ", " + req.body.isCoach + ", " + req.params["teamId"] + ", " + req.body.playernuid + ")",
        function(err, result) {
      if (err) throw err;

      res.json({
        "name": req.body.playerName,
        "number": req.body.playerNumber,
        "captain": req.body.isCoach,
        "team": req.params["teamId"],
        "nuID": req.body.playernuid});
    })
  })

}


