/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require('passport');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/server/views');
    app.set('view engine', 'ejs');
    app.engine('ejs', require('ejs-locals'));
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({secret:'something'}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'client')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

var config = "TBD";

/**
 * Models
 */
var db_conn = require('./server/models')(config);

/**
 * Register routes with the app
 */
require('./server/routes')(app, db_conn);

/**
 * Setup Passport persistent sessions
 */
passport.serializeUser(function(user, done) {
    done(null, user.email);
});

passport.deserializeUser(function(email, done) {
    User.findOne({email:email}, function(err, user) {
        done(err, user);
    });
});

/*
app.use(express.session({
    secret:'awesome unicorns',
    maxAge: new Date(Date.now() + 3600000),
    store: new MongoStore(
        {db:mongoose.connection.db},
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        })
}));
*/

/**
 * Start the server
 */
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
