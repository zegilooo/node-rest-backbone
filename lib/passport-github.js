/**
 * passport-github.js
 *
 * Passport setup for Github OAUTH authentication.
 */

var GitHubStrategy = require('passport-github').Strategy;

module.exports = function(app, db_conn, passport) {
	//var User = db_conn.model('User');
	var GITHUB_CLIENT_ID = '6e9d0641927f802d74bf';
	var GITHUB_CLIENT_SECRET = '47b1dc8301d7dd2a1ecf553266e97569f2a294bd';

	// Use the GitHubStrategy within Passport.
	//   Strategies in Passport require a `verify` function, which accept
	//   credentials (in this case, an accessToken, refreshToken, and GitHub
	//   profile), and invoke a callback with a user object.
	passport.use(new GitHubStrategy({
	    clientID: GITHUB_CLIENT_ID,
	    clientSecret: GITHUB_CLIENT_SECRET,
	    callbackURL: "http://localhost:3000/auth/github/callback"
	  },
	  function(accessToken, refreshToken, profile, done) {
	    // asynchronous verification, for effect...
	    process.nextTick(function () {
	      
	      // To keep the example simple, the user's GitHub profile is returned to
	      // represent the logged-in user.  In a typical application, you would want
	      // to associate the GitHub account with a user record in your database,
	      // and return that user instead.
	      return done(null, profile);
	    });
	  }
	));

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

	// GET /auth/github
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  The first step in GitHub authentication will involve redirecting
	//   the user to github.com.  After authorization, GitHub will redirect the user
	//   back to this application at /auth/github/callback
	app.get('/auth/github',
	  passport.authenticate('github'),
	  function(req, res){
	    // The request will be redirected to GitHub for authentication, so this
	    // function will not be called.
	  });

	// GET /auth/github/callback
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  If authentication fails, the user will be redirected back to the
	//   login page.  Otherwise, the primary route function will be called,
	//   which, in this example, will redirect the user to the home page.
	app.get('/auth/github/callback', 
	  passport.authenticate('github', { failureRedirect: '/signin' }),
	  function(req, res) {
	    res.redirect('/app');
	  });

	return passport;
}