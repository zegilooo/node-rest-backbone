/**
 * pages.js
 *
 * Routes to site pages.
 */

module.exports = function(app, db_conn, passport) {
    /**
     * GET home page.
     */
    app.get('/', function (req, res) {
        res.render('index.ejs', { user: req.user });
    });

    /**
     * GET about page.
     */
    app.get('/about', function (req, res) {
        res.render('about.ejs', { user: req.user });
    });

    /**
     * GET contact page.
     */
    app.get('/contact', function (req, res) {
        res.render('contact.ejs', { user: req.user });
    });

	/**
     * GET signin page.
     */
    app.get('/signin', function (req, res) {
        res.render('signin.ejs', { user: req.user });
    });

	/**
     * GET signup page.
     */
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { user: req.user });
    });

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
     * POST local login page.
     */
     /*
    app.post('/login', passport.authenticate('local'), function(req, res) {
	    // If this function gets called, authentication was successful.
	    // `req.user` property contains the authenticated user.
	    res.render('app.ejs', { user: req.user });
	});
	*/

    /**
     * GET logout page.
     */
	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});

    /**
     * GET Backbone app container page.
     */
    app.get('/app', function (req, res) {
        res.render('app.ejs', { user: req.user });
    });

    // Simple route middleware to ensure user is authenticated.
	//   Use this route middleware on any resource that needs to be protected.  If
	//   the request is authenticated (typically via a persistent login session),
	//   the request will proceed.  Otherwise, the user will be redirected to the
	//   login page.
	function isAuthenticated(req, res, next) {
		if (req.isAuthenticated()) { return next(); }
		res.redirect('/login');
	}
}
