/**
 * user.js
 *
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

module.exports = function(mongoose_conn) {
    var Schema = mongoose.Schema; //Schema.ObjectId
    var Email = mongoose.SchemaTypes.Email;
    
    var User = new Schema({
      // email: { type: Email, unique: true },

      // Password
      salt: { type: String, required: true },
      hash: { type: String, required: true },

      // Name
      name: {
        first: { type: String, required: true },
        last: { type: String, required: true }
      }
    });
    
    return mongoose_conn.model('User', User);
}