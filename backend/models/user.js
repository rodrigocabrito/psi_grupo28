const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {type: String, required: true, max: 100},
    pet: [{type: Schema.Types.ObjectId, ref: 'Pet'}]
  }
);

UserSchema
  .virtual('url')
  .get(function () {
    return '/user/' + this._id;
  });

  module.exports = mongoose.model('User', UserSchema);