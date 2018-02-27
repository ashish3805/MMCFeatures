let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let fmTrackSchema = new Schema({
  title: String,
  artist: String,
  mood: Number,
  mbid: String,
  done: {
    type: Boolean,
    default: false,
  },
  features: {},
  analysis: {},
  id: String,
});

let FmTrack = mongoose.model('FmTrack', fmTrackSchema);
module.exports = FmTrack;
