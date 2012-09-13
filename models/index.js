/**
 * index.js
 *
 * Requires all .js files defined in this directory.
 */
 
var mongoose = require('mongoose');
var mongooseTypes = require("mongoose-types");
var fs = require('fs');

var generate_mongo_url = function(obj){
  obj.hostname = (obj.hostname || 'localhost');
  obj.port = (obj.port || 27017);
  obj.db = (obj.db || 'test');

  if(obj.username && obj.password){
    return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
  else{
    return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
}

module.exports = function(config) {
    /**
     * mongodb setup
     */
    if(process.env.VCAP_SERVICES) {
        // Cloudfoundry
        var env = JSON.parse(process.env.VCAP_SERVICES);
        var mongo = env['mongodb-1.8'][0]['credentials'];
    } else {
        // Configuration module
        var mongo = config.mongo;
    }

    var mongourl = generate_mongo_url(mongo);
    console.log("Connecting to mongodb on: " + mongourl);

    var db_conn = mongoose.createConnection(mongourl);
    mongooseTypes.loadTypes(mongoose);

    fs.readdirSync(__dirname).forEach(function(file) {
        if (file === "index.js" || file.substr(file.lastIndexOf('.') + 1) !== 'js')
            return;
        var name = file.substr(0, file.indexOf('.'));
        console.log("Requiring models for " + name);
        require('./' + name)(db_conn);
    });

    return(db_conn);
}
