

const mysql = require('mysql2');

const con = mysql.createConnection({
  host : "localhost",
  user: "username",
  password: "password",
  database: "neu_ultimate",
  multipleStatements: true
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

  app.post('/api/teams/:teamId/events', (req, res) => {
    const id = new Date().getTime() % 10000;
    console.log(req.body);
    con.query("INSERT INTO event (eventName, eventId, dateStart, dateEnd, location, eventType)"
        + " VALUES (" + "'" + req.body.eventName + "', " + id + ", " + "'2021-10-20 10:00:00'" + ", " + "'2021-10-21 13:00:00'" + ", '" + req.body.location + "', " + "'Tournament'); "
        + "INSERT INTO team_event (team, event) "
        + "VALUES (" + req.params["teamId"] + ", " + id + ")", function(err, result) {
      if (err) throw err;

      res.json({
        "eventId": id,
        "eventName": req.body.eventName,
        "dateStart": "2021-10-20 10:00:00",
        "dateEnd" : "2021-10-21 10:00:00",
        "eventType" : "Tournament",
        "location": req.body.location
      })
    })
  })

  app.delete('/api/teams/:teamId/events/:eventId', (req, res) => {
    con.query("DELETE from event as e where e.eventId=" + req.params["eventId"] + "; "
        + "DELETE from team_event as te where te.team=" + req.params["teamId"] + " AND te.event=" + req.params["eventId"], function(err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    })
  })

  // adding a game
  app.post('/api/teams/:teamId/events/:eventId/games', (req, res) => {
    const id = new Date().getTime() % 10000;
    console.log(req.body);
    con.query("INSERT INTO game (gameId, start, opponent, tournament, team)"
        + " VALUES (" + id + ", '" + req.body.startDate + "', '" + req.body.opponent + "', " + req.params["eventId"] + ", " + req.params["teamId"] + ")", function(err, result) {
      if (err) throw err;

      res.json({
        "gameId": id,
        "start": req.body.date,
        "tournament": req.params["eventId"],
        "team": req.params["teamId"],
        "opponent": req.body.opponent
      })
    })
  })

  // deleting a game
  app.delete('/api/teams/:teamId/events/:eventId/games/:gameId', (req, res) => {
    con.query("DELETE from game as g where g.gameId=" + req.params["gameId"] + " AND g.tournament=" + req.params["eventId"] + " AND g.team=" + req.params["teamId"]
        , function(err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    })
  })


  // adding a point
  app.post('/api/teams/:teamId/events/:eventId/games/:gameId/points', (req, res) => {
    const id = new Date().getTime() % 10000;
    con.query("INSERT INTO point (oLine, pointScored, pointId, hScore, aScore, game)"
        + " VALUES (" + req.body.oLine + ", '" + req.body.pointScored + "', '" + id + "', " + req.body.hScore + ", " + req.body.aScore + ", " + req.params["gameId"] + ")", function(err, result) {
      if (err) throw err;

      res.json({
        "oLine": req.body.oLine,
        "pointScored": req.body.pointScored,
        "pointId": id,
        "hScore": req.body.hScore,
        "aScore": req.body.aScore,
        "game": req.params["gameId"]
      })
    })
  })

  // deleting a point
  app.delete('/api/teams/:teamId/events/:eventId/games/:gameId/points/:pointId', (req, res) => {
    con.query("DELETE from point as p where p.pointId=" + req.params["pointId"] + " AND p.game=" + req.params["gameId"]
        , function(err, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
        })
  })


  // adding a stat
  app.post('/api/teams/:teamId/events/:eventId/games/:gameId/points/:pointId/stats', (req, res) => {
    con.query("INSERT INTO point_player (player, point, blocks, completions, catches, pointScored, assist)"
        + " VALUES (" + req.body.player + ", '" + req.params["pointId"] + "', '" + req.body.blocks + "', " + req.body.completions + ", " + req.body.catches + ", " + req.body.points + ", " + req.body.assists + ")", function(err, result) {
      if (err) throw err;

      res.json({
        "name": req.body.playerName,
        "player": req.body.player,
        "point": req.params["pointId"],
        "blocks": req.body.blocks,
        "completions": req.body.completions,
        "catches": req.body.catches,
        "assist": req.body.assists,
        "pointScored": req.body.points
      })
    })
  })

  // updating a point
  app.put('/api/teams/:teamId/events/:eventId/games/:gameId/points/:pointId/stats/:statId', (req, res) => {
    con.query("UPDATE point_player SET point=" + req.params["pointId"] + ", blocks=" + req.body.blocks + ", completions=" + req.body.completions + ", catches=" + req.body.catches + ", pointScored=" + req.body.points + ", assist=" + req.body.assist
        + " WHERE player=getPlayerPointNUID(" + req.params["pointId"] + ", '" + req.body.playerName + "')", function(err, result) {
      if (err) throw err;

      console.log(result);
      res.json({
        "name": req.body.playerName,
        "point": req.params["pointId"],
        "blocks": req.body.blocks,
        "completions": req.body.completions,
        "catches": req.body.catches,
        "assist": req.body.assists,
        "pointScored": req.body.points
      })
    })
  })

}


