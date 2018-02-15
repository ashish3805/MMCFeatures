let SpTrack = require('./models/SpTrack');
let fs = require('fs');

let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mmc');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected to db!!');
  doTasks();
});

let log = function (data) {
  console.log(JSON.stringify(data));
  fs.writeFileSync('./lastResponse.json', JSON.stringify(data));
  console.log('\nSaved the output at:' + __dirname + '/lastResponse.json');
};

function getDoneRecords () {
  console.log('Getting records.');
  return new Promise((resolve, reject) => {
    SpTrack.find({
      done: true,
    }).then(resolve, reject);
  });
}

function makecsv (data) {
  let dataSchema = {};
  dataSchema.keys = {};

  Object.keys(data).forEach((k) => dataSchema.keys[k] = typeof (data[k]));

  Object.keys(data.features).forEach((k) => dataSchema.keys['features_' + k] =
    typeof (data.features[k]));

  Object.keys(data.analysis).forEach((k) => dataSchema.keys['analysis_' + k] =
    typeof (data.analysis[k]));

  Object.keys(data.analysis.track).forEach((k) => dataSchema
    .keys['analysis_track_' + k] = typeof (data.analysis.track[k]));

  Object.keys(data.analysis.bars[0]).forEach((k) => dataSchema
    .keys['analysis_bars_' + k] = typeof (data.analysis.bars[0][k]));

  Object.keys(data.analysis.beats[0]).forEach((k) => dataSchema
    .keys['analysis_beats_' + k] = typeof (data.analysis.beats[0][k]));

  Object.keys(data.analysis.tatums[0]).forEach((k) => dataSchema
    .keys['analysis_tatums_' + k] = typeof (data.analysis.tatums[0][k]));

  Object.keys(data.analysis.sections[0]).forEach((k) => dataSchema
    .keys['analysis_sections_' + k] = typeof (data.analysis.sections[0][k]));

  Object.keys(data.analysis.segments[0]).forEach((k) => dataSchema
    .keys['analysis_segments_' + k] =
    typeof (data.analysis.segments[0][k]));

    Object.keys(data.analysis.segments[0].pitches).forEach((k) => dataSchema
    .keys['analysis_segments_pitches_' + k] =
    typeof (data.analysis.segments[0].pitches[k]));

  Object.keys(data.analysis.segments[0].timbre).forEach((k) => dataSchema
    .keys['analysis_segments_timbre_' + k] =
    typeof (data.analysis.segments[0].timbre[k]));

  console.log(JSON.stringify(dataSchema));
  fs.writeFileSync('./dataSchema.json', JSON.stringify(dataSchema));
}

function doTasks () {
  let data = JSON.parse(fs.readFileSync('./lastResponse.json'));
  // console.log(Object.keys(data.analysis.track));
  makecsv(data);
}
