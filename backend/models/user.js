const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UsersSchema = new Schema(
  {
    username: {type: String, unique:true, required: true, max: 100},
    password: {type: String, required: true, max: 100},
    followers: {type:[ Schema.Types.ObjectId], ref :"User"},
    following: {type:[ Schema.Types.ObjectId], ref :"User"},
    games: {type:[ Schema.Types.ObjectId], ref :"Game"},
    wallet: {type: Number}
  }
);

UsersSchema
  .virtual('url')
  .get(function () {
    return '/user/' + this._id;
  });

  module.exports = mongoose.model('User', UsersSchema);