/**
 * passport-twitter.js
 *
 * Passport setup for Twitter OAUTH authentication.
 */

var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function(config, app, db_conn, passport) {
	//var User = db_conn.model('User');

	// Use the TwitterStrategy within Passport.
	//   Strategies in Passport require a `verify` function, which accept
	//   credentials (in this case, an accessToken, refreshToken, and Twitter
	//   profile), and invoke a callback with a user object.
	passport.use(new TwitterStrategy({
	    clientID: config.twitter.id,
	    clientSecret: config.twitter.secret,
	    callbackURL: "http://" + config.node.hostname + ":" + config.node.port + "/auth/twitter/callback"
	},
	function(token, tokenSecret, profile, done) {
	    process.nextTick(function () {
	      return done(null, profile);
	    });
	}));

	// Passport session setup.
	//   To support persistent login sessions, Passport needs to be able to
	//   serialize users into and deserialize users out of the session.  Typically,
	//   this will be as simple as storing the user ID when serializing, and finding
	//   the user by ID when deserializing.  However, since this example does not
	//   have a database of user records, the complete Twitter profile is serialized
	//   and deserialized.
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});

	// GET /auth/twitter
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  The first step in Twitter authentication will involve redirecting
	//   the user to twitter.com.  After authorization, Twitter will redirect the user
	//   back to this application at /auth/twitter/callback
	app.get('/auth/twitter',
	  passport.authenticate('twitter'),
	  function(req, res){
	    // The request will be redirected to Twitter for authentication, so this
	    // function will not be called.
	  });

	// GET /auth/twitter/callback
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  If authentication fails, the user will be redirected back to the
	//   login page.  Otherwise, the primary route function will be called,
	//   which, in this example, will redirect the user to the home page.
	app.get('/auth/twitter/callback', 
	  passport.authenticate('twitter', { failureRedirect: '/signin' }),
	  function(req, res) {
	    res.redirect('/app');
	  });
	return passport;
}
