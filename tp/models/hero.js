const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HeroSchema = new Schema(
  {
    name: {type: String, required: true, max: 100},
    pet: [{type: Schema.Types.ObjectId, ref: 'Pet'}]
  }
);

HeroSchema
  .virtual('url')
  .get(function () {
    return '/hero/' + this._id;
  });

  module.exports = mongoose.model('Hero', HeroSchema);