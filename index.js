


const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const bcrypt = require('bcryptjs');
const res = require('express/lib/response');
const app = express();
//HUOMportti pitää muuttaa ennen herokua
const port = 3000;
const posts = require("./routes/posts");
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Skey = require('./key.json');


app.use(bodyParser.json())

app.use("", posts)

const users = []

//Basic auth määrittely/konfis
passport.use(new BasicStrategy(
  function(username, password, done) {

    let user = users.find(user => (user.username === username) && (bcrypt.compareSync(password, user.password)))
    if(user != undefined) {
      done(null, user);
    } else {
      console.log("Invalid username or password");
      done(null, false);
    }

  }));

  //JWT options
  var opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = Skey.jwtKey;

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    const user = users.find(u => u.id === jwt_payload.userId)
    done(null, {user});

}));

  //uuden käyttäjän rekisteröityminen-------------------------------------------------------
  app.post('/login/registration/', (req, res) => {

    var hashedPW = bcrypt.hashSync(req.body.password, 6)
  
    const user = {
      id: uuidv4(),
      username: req.body.username,
      password: hashedPW,
      email: req.body.email
    }
  
    users.push(user);
  
    res.sendStatus(201);
  })

  //testi login-------------------------------------------------------
  app.post('/login', passport.authenticate('basic', { session: false }), (req, res) => {
  
    const payloadData = {userId: req.user.id}
    const token = jwt.sign(payloadData, Skey.jwtKey)
    res.json({token: token })
    
    console.log(`Logged in. Hello ${req.user.username}.`)

  })

  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})