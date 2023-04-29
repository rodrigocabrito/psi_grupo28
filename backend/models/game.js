const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    name: { type: String, unique:true, required: true, max: 100 },
    type: { type: String, required: true },
    description: { type: String, required: false },
    supported_platform: { type: [String], required: false, max: 100 },
    supported_languages: { type: [String], required: false, max: 100 },
    price: { type: Number, required: true, min: 0 },
    rate: { type: Number, required: true },
    dlc: { type:[ Schema.Types.ObjectId], ref :"dlc"},
    main_game: {type: Schema.Types.ObjectId, ref : "main"}
});
GameSchema
  .virtual('url')
  .get(function () {
    return '/game/' + this._id;
  });

module.exports = mongoose.model('Game', GameSchema);