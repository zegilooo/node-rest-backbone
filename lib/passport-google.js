/**
 * passport-google.js
 *
 * Passport setup for Google OAUTH authentication.
 */

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(app, db_conn, passport) {
	//var User = db_conn.model('User');

	// API Access link for creating client ID and secret:
	// https://code.google.com/apis/console/
	var GOOGLE_CLIENT_ID = "--insert-google-client-id-here--";
	var GOOGLE_CLIENT_SECRET = "--insert-google-client-secret-here--";

	// Use the GitHubStrategy within Passport.
	//   Strategies in Passport require a `verify` function, which accept
	//   credentials (in this case, an accessToken, refreshToken, and GitHub
	//   profile), and invoke a callback with a user object.
	passport.use(new GoogleStrategy({
	    clientID: GOOGLE_CLIENT_ID,
	    clientSecret: GOOGLE_CLIENT_SECRET,
	    callbackURL: "http://localhost:3000/auth/google/callback"
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

	// GET /auth/google
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  The first step in Google authentication will involve
	//   redirecting the user to google.com.  After authorization, Google
	//   will redirect the user back to this application at /auth/google/callback
	app.get('/auth/google',
	  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
	                                            'https://www.googleapis.com/auth/userinfo.email'] }),
	  function(req, res){
	    // The request will be redirected to Google for authentication, so this
	    // function will not be called.
	  });

	// GET /auth/google/callback
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  If authentication fails, the user will be redirected back to the
	//   login page.  Otherwise, the primary route function function will be called,
	//   which, in this example, will redirect the user to the home page.
	app.get('/auth/google/callback', 
	  passport.authenticate('google', { failureRedirect: '/signin' }),
	  function(req, res) {
	    res.redirect('/app');
	  });

	return passport;
}