/**
 * Module dependencies.
 */

var config = require('config');

var express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , flash = require('connect-flash');

var app = express();

app.configure(function(){
    app.set('port', config.node.port || process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.engine('ejs', require('ejs-locals'));
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({secret:'something'}));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

/**
 * Create models
 */
var db_conn = require('./models')(config);

/**
 * Setup all configured Passport authentication modules. 
 *
 * NOTE: these modules define the routes that they need to function, and some of these routes need to render views,
 * creating a coupling between the Passport modules and the rest of the application that I'd rather avoid. Need to
 * figure out how to deal with this.
 */
require('./lib/passport')(config, app, db_conn, passport);

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
