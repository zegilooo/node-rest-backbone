/**
 * passport.js
 *
 * Passport setup.
 */

var LocalStrategy = require('passport-local').Strategy;

module.exports = function(app, db_conn, passport) {
	var User = db_conn.model('User');

	passport.use(new LocalStrategy({
			usernameField: 'email'
		},
		function(email, password, done) {
			console.log("LocalStrategy(): email=" + email + " password=" + password);
		    User.authenticate(email, password, function(err, user) {
		    	console.log("User.authenticate(): err=" + err + " user=" + user);
		    	return done(err, user);
		    });
	  	}
	));

	// Passport session setup.

	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	/**
     * GET login page.
     */
    app.get('/login', function (req, res) {
        res.render('login.ejs', { user: req.user });
    });

	// POST /login
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  If authentication fails, the user will be redirected back to the
	//   login page.  Otherwise, the primary route function function will be called,
	//   which, in this example, will redirect the user to the home page.
	//
	//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
	app.post('/login', 
	  passport.authenticate('local', { failureRedirect: '/failed', failureFlash: true }),
	  function(req, res) {
	    res.redirect('/app');
	  });

	return passport;
}