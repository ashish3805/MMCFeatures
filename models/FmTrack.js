let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let fmTrackSchema = new Schema({
  title: String,
  artist: String,
  tag: String,
  mbid: String,
  done: {
    type: Boolean,
    default: false,
  },
});

let FmTrack = mongoose.model('FmTrack', fmTrackSchema);
module.exports = FmTrack;
