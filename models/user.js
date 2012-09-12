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
      email: { type: Email, unique: true },

      // Password
      salt: { type: String, required: true },
      hash: { type: String, required: true },

      // Name
      name: {
        first: { type: String, required: true },
        last: { type: String, required: true }
      }
    });

    User.virtual('password').get(function () {
      return this._password;
    }).set(function (password) {
      this._password = password;
      var salt = this.salt = bcrypt.genSaltSync(10);
      this.hash = bcrypt.hashSync(password, salt);
    });

    User.method('checkPassword', function (password, callback) {
      bcrypt.compare(password, this.hash, callback);
    });

    User.static('authenticate', function (email, password, callback) {
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure.  Otherwise, return the authenticated `user`.
      this.findOne({ email: email }, function(err, user) {
        if (err)
          return callback(err);

        if (!user)
          return callback(null, false);

        user.checkPassword(password, function(err, passwordCorrect) {
          if (err)
            return callback(err);

          if (!passwordCorrect)
            return callback(null, false);

          return callback(null, user);
        });
      });
    });

    return mongoose_conn.model('User', User);
}