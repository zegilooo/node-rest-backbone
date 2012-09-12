/**
 * passport-twitter.js
 *
 * Passport setup for Twitter OAUTH authentication.
 */

var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function(app, db_conn, passport) {
	//var User = db_conn.model('User');
	var TWITTER_CLIENT_ID = 'bDIHli7KgleE5EGkZ5ug';
	var TWITTER_CLIENT_SECRET = 'RrSInLWPh2SuclYfJ22Q9cWUlr5GY1fpEDY1hMRyGqQ';

	// Use the TwitterStrategy within Passport.
	//   Strategies in Passport require a `verify` function, which accept
	//   credentials (in this case, an accessToken, refreshToken, and GitHub
	//   profile), and invoke a callback with a user object.
	passport.use(new TwitterStrategy({
		consumerKey: TWITTER_CLIENT_ID,
		consumerSecret: TWITTER_CLIENT_ID,
		callbackURL: "http://localhost:3000/auth/twitter/callback"
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
	//   have a database of user records, the complete GitHub profile is serialized
	//   and deserialized.
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});

	// GET /auth/twitter
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  The first step in GitHub authentication will involve redirecting
	//   the user to github.com.  After authorization, GitHub will redirect the user
	//   back to this application at /auth/github/callback
	app.get('/auth/twitter',
	  passport.authenticate('twitter'),
	  function(req, res){
	    // The request will be redirected to GitHub for authentication, so this
	    // function will not be called.
	  });

	// GET /auth/github/callback
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