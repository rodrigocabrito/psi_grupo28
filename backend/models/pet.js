const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PetSchema = new Schema(
  {
    name: {type: String, required: true, max: 100},
  }
);

PetSchema
  .virtual('url')
  .get(function () {
    return '/Pet/' + this._id;
  });

module.exports = mongoose.model('Pet', PetSchema);