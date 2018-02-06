let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let spTrackSchema = new Schema({
  title: String,
  artist: String,
  mood: Number,
  id: String,
  done: {
    type: Boolean,
    default: false,
  },
  features: {},
  analysis: {},
});

let SpTrack = mongoose.model('SpTrack', spTrackSchema);
module.exports = SpTrack;
