const jsonServer = require('json-server')
const server = jsonServer.create()
const middlewares = jsonServer.defaults()

var passport = require('passport');
var Strategy = require('passport-http').BasicStrategy;
var db = require('./db/index');

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

server.get('/entitlements/:user',
  passport.authenticate('basic', { session: false }),
  function(req, res) {
    res.json(db.entitlements);
  });

server.use(middlewares)

server.listen(3000, () => {
  console.log('JSON Server is running on 3000')
})

