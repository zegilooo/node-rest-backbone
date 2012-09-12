/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , flash = require('connect-flash');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.engine('ejs', require('ejs-locals'));
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({secret:'something'}));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

var config = "TBD";

/**
 * Create models
 */
var db_conn = require('./models')(config);

/**
 * Setup Passport authentication
 */
require('./lib/passport-local')(app, db_conn, passport);
require('./lib/passport-github')(app, db_conn, passport);
require('./lib/passport-google')(app, db_conn, passport);
require('./lib/passport-twitter')(app, db_conn, passport);

/**
 * Register routes with the app
 */
require('./routes')(app, db_conn, passport);

/**
 * Start the server
 */
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});