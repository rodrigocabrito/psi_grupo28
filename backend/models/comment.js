const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true },
    game: { type: Schema.Types.ObjectId, required: true },
    rate: { type: Number, required: true},
    description: { type: String, required: true, max:1000}
});

module.exports = mongoose.model('Comment', CommentSchema);