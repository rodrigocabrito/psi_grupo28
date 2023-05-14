const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    name: { type: String, unique: true, required: true, max: 100 },
    type: { type: String, required: true },
    description: { type: String, required: false, max:1000},
    supported_platform: { type: [String], required: false, max: 100 },
    supported_languages: { type: [String], required: false, max: 100 },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true },
    rates: { type: [Number], required: true},
    dlc: { type:[ Schema.Types.ObjectId], ref :"dlc" },
    main_game: {type: Schema.Types.ObjectId, ref : "main" },
    image_p: { type: String, required:true },
    image_s: { type: [String], required: false },
    video_link: { type: String, required: false },
    comments: {type:[String], ref :"comments" },
    date: {type: Date}
});
GameSchema
  .virtual('url')
  .get(function () {
    return '/game/' + this._id;
  });

module.exports = mongoose.model('Game', GameSchema);