/**
 * passport-google.js
 *
 * Passport setup for Google OAUTH authentication.
 */

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(config, app, db_conn, passport) {
	var User = db_conn.model('User');

	// Use the GoogleStrategy within Passport.
	//   Strategies in Passport require a `verify` function, which accept
	//   credentials (in this case, an accessToken, refreshToken, and GitHub
	//   profile), and invoke a callback with a user object.
	passport.use(new GoogleStrategy({
		    clientID: config.google.id,
		    clientSecret: config.google.secret,
		    callbackURL: "http://" + config.node.hostname + ":" + config.node.port + "/auth/google/callback"
	  	},
	  	function(accessToken, refreshToken, profile, done) {
		    process.nextTick(function () {
		    	User.findOne({ 'accounts.uid': profile.id, 'accounts.provider': 'google' }, function(err, olduser) {
		    		console.log("User.findOne(): callback profile.emails[0]=" + profile.emails[0].value + " profile.id=" + profile.id);
					if(olduser) {
						// We have an existing user record matching the same provider ID, so just return it
						done(null, olduser);
					} else {
						// This user has not logged in with this provider before
						User.findOne({ 'email': profile.emails[0].value }, function(err, olduser) {
							if (olduser) {
								// We have an existing user record with the same email address that hasn't logged in with this provider, yet.
								// Always over-write existing user properties with new user properties from the latest provider. Is this the
								// right thing to do?
								var account = { provider: "google", uid: profile.id };
								olduser.accounts.push(account);
								olduser.displayName = profile.displayName;
								olduser.name.first = profile.name.givenName;
								olduser.name.last = profile.name.familyName;
								olduser.save(function(err) {
									if(err) { throw err; }
									done(null, olduser);
								});							
							} else {
								// We need to create a new user record
								var newuser = new User();
								var account = { provider: "google", uid: profile.id };
								newuser.accounts.push(account);
								newuser.displayName = profile.displayName;
								newuser.name.first = profile.name.givenName;
								newuser.name.last = profile.name.familyName;
								newuser.email = profile.emails[0].value;

								newuser.save(function(err) {
									if(err) { throw err; }
									done(null, newuser);
								});
							}
						});
					}
		    	});
		  	});
		}));

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
