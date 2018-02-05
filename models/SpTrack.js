let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let spTrackSchema = new Schema({
  title: String,
  artist: String,
  mood: Number,
  id: String,
});

let SpTrack = mongoose.model('SpTrack', spTrackSchema);
module.exports = SpTrack;
