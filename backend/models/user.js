const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {type: String, unique:true, required: true, max: 100},
    password: {type: String, required: true, max: 100},
    followers: {type:[ Schema.Types.ObjectId], ref :"User"},
    following: {type:[ Schema.Types.ObjectId], ref :"User"},
    games: {type:[ Schema.Types.ObjectId], ref :"Game"},
    wishlist: {type: [Schema.Types.ObjectId], ref:"WishList"},
    wallet: {type: Number},
    cart: {type:[ Schema.Types.ObjectId], ref :"Game"}
  }
);

UserSchema
  .virtual('url')
  .get(function () {
    return '/user/' + this._id;
  });

  module.exports = mongoose.model('User', UserSchema);