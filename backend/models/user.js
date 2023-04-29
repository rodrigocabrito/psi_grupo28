const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {type: String, unique:true, required: true, max: 100},
    password: {type: String, required: true, max: 100},
    followers: {type:[ Schema.Types.ObjectId], ref :"follower"},
    following: {type:[ Schema.Types.ObjectId], ref :"following"},
    games: {type:[ Schema.Types.ObjectId], ref :"games"},
    wallet: {type: number, ref :"wallet"}
  }
);

UserSchema
  .virtual('url')
  .get(function () {
    return '/user/' + this._id;
  });

  module.exports = mongoose.model('User', UserSchema);