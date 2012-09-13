/**
 * index.js
 *
 * Requires all configured Passport modules. Assumes that modules are named 'passport-<OAUTH Provider Name>.js'
 */
 
var fs = require('fs');

module.exports = function(config, app, db_conn, passport) {
    var User = db_conn.model('User');

    fs.readdirSync(__dirname).forEach(function(file) {
        if (file === "index.js" || file.substr(file.lastIndexOf('.') + 1) !== 'js')
            return;

        var name = file.substr(0, file.indexOf('.'));
        console.log("Found passport library: " + name);

        var provider = name.substr(name.lastIndexOf("-")+1);
        console.log("Checking configuration for provider " + provider);

        // Only require the library if the config object has a property containing credentials for that library
        if (provider === "local" || config.hasOwnProperty(provider)) {
            console.log("Requiring passport library for provider " + provider);
            require('./' + name)(config, app, db_conn, passport);
        }
    });

    
    /**
     * Passport session setup.
     */
    passport.serializeUser(function(user, done) {
        console.log("serializeUser(): user.id=" + user.id + " user.provider=" + user.provider);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        console.log("deserializeUser(): id=" + id);
        User.findById(id, function (err, user) {
            if (err) {
                console.log("User.findByID() callback: err=" + err);                
            } else {
                console.log("User.findByID() callback: user.id=" + user.id);                
            }
            done(err, user);
        });
    });

    /**
     * GET logout page.
     */
    app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
    });

    return(passport);
}
