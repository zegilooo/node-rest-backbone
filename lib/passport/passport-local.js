/**
 * passport.js
 *
 * Passport setup.
 */

var LocalStrategy = require('passport-local').Strategy;

module.exports = function(config, app, db_conn, passport) {
	var User = db_conn.model('User');

	passport.use(new LocalStrategy({
			usernameField: 'email'
		},
		function(email, password, done) {
		    console.log("Passport.authenticate(): email=" + email + " password=" + password);
		    User.authenticate(email, password, function(err, user) {
		    	console.log("User.authenticate() callback: err=" + err + " user.id=" + user.id);
		    	return done(err, user);
		    });
	  	}
	));

	/**
     * GET signup page.
     */
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { user: req.user });
    });

    /**
     * POST signup form.
     */
	app.post('/signup', function (req, res) {
		console.log("Signup:" +
					" email=" + req.param('idEmail', null) +
					" password=" + req.param('idPassword', null) +
					" fname=" + req.param('idFirstName', null) +
					" lname=" + req.param('idLastName', null));

		var User = db_conn.model('User');
		var user = new User();

		user.email = req.param('idEmail');
		user.password = req.param('idPassword');
		user.name.first = req.param('idFirstName');
		user.name.last = req.param('idLastName');
        user.displayName = user.name.first + " " + user.name.last;

		var self = req;
		user.save(function (err) {
			if (err) {
			 	console.log("error:" + err);
			 	// show error message
			} else {
	        	res.render('signin.ejs', { user: req.user });
			}
		});
	});

	/**
	* GET login page.
	*/
	app.get('/login', function (req, res) {
		console.log("GET /login");
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
	    console.log("POST /login callback");
	    res.redirect('/app');
	  });

	return passport;
}
