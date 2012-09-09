/**
 * index.js
 *
 * Requires all .js files defined in this directory.
 */
var mongoose = require('mongoose');
var fs = require('fs');

module.exports = function(config) {
    var db_conn = mongoose.createConnection('mongodb://localhost/ecomm_database');

    fs.readdirSync(__dirname).forEach(function(file) {
        if (file === "index.js" || file.substr(file.lastIndexOf('.') + 1) !== 'js')
            return;
        var name = file.substr(0, file.indexOf('.'));
        console.log("Requiring models for " + name);
        require('./' + name)(db_conn);
    });

    return(db_conn);
}
