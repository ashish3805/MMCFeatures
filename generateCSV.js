let json2csv = require('json2csv');
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

function getCSV (data, schema) {
  try {
    let result = json2csv({
      data: data,
      fields: schema,
    });
    return result;
  } catch (err) {
    console.error(err);
  }
}


function getArrayContents (data) {
  let keys = Object.keys(data[0]);
  let res = {};
  for (let j = 0; j < keys.length; j++) {
    res[keys[j]] = [];
  }
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < keys.length; j++) {
      res[keys[j]].push(data[i][keys[j]]);
    }
  }
  return res;
}

function getColumnsFrom2DArray (data) {
  let res = {};
  for (let i = 0; i < data[0].length; i++) {
    let col = [];
    for (let j = 0; j < data.length; j++) {
      col.push(data[j][i]);
    }
    res[i] = col;
  }
  return res;
}

function testGetArrayContents () {
  let fs = require('fs');
  let data = JSON.parse(fs.readFileSync('./lastResponse.json'));
  let schema = JSON.parse(fs.readFileSync('./schema.json'));
  let res = flattenTheObject(data, schema);
  fs.writeFileSync('./testData.json', JSON.stringify(res));
  let csv = getCSV([res], Object.keys(schema));
  fs.writeFileSync('./testData.csv', csv);
}

function flattenTheObject (data, schema) {
  let res = {};
  let bars = getArrayContents(data.analysis.bars);
  let beats = getArrayContents(data.analysis.beats);
  let sections = getArrayContents(data.analysis.sections);
  let tatums = getArrayContents(data.analysis.tatums);
  let segments = getArrayContents(data.analysis.segments);
  let timbre = getColumnsFrom2DArray(segments.timbre);
  let pitches = getColumnsFrom2DArray(segments.pitches);

  function processsKey (k, pre, data) {
    // console.log('checking ', pre + k);
    if (schema[pre + k]) {
      // console.log('found ', pre + k);
      res[pre + k] = data;
    }
  }

  Object.keys(data).forEach((k) => {
    processsKey(k, '', data[k]);
  });

  Object.keys(data.features).forEach((k) => {
    // console.log('features');
    processsKey(k, '', data.features[k]);
  });

  // it might be useless.
  Object.keys(data.analysis).forEach((k) => {
    processsKey(k, '', data.analysis[k]);
  });

  Object.keys(data.analysis.track).forEach((k) => {
    processsKey(k, 'track_', data.analysis.track[k]);
  });

  Object.keys(data.analysis.bars[0]).forEach((k) => {
    processsKey(k, 'bars_', bars[k]);
  });

  Object.keys(data.analysis.beats[0]).forEach((k) => {
    processsKey(k, 'beats_', beats[k]);
  });

  Object.keys(data.analysis.tatums[0]).forEach((k) => {
    processsKey(k, 'tatums_', tatums[k]);
  });

  Object.keys(data.analysis.sections[0]).forEach((k) => {
    processsKey(k, 'sections_', sections[k]);
  });

  Object.keys(data.analysis.segments[0]).forEach((k) => {
    processsKey(k, 'segments_', segments[k]);
  });

  Object.keys(data.analysis.segments[0].pitches).forEach((k) => {
    processsKey(k, 'segments_pitches_', pitches[k]);
  });

  Object.keys(data.analysis.segments[0].timbre).forEach((k) => {
    processsKey(k, 'segments_timbre_', timbre[k]);
  });

  return res;
}

// testGetArrayContents();


function doTasks () {
  let data = [];
  let noOfRecords = 400;
  let schema = JSON.parse(fs.readFileSync('./schema.json'));
  SpTrack.find({
    done: true,
    mood: 1,
  }).limit(noOfRecords).then((happy) => {
    console.log('Fetched ', happy.length, 'happy records.');
    data = happy;
    SpTrack.find({
      done: true,
      mood: 0,
    }).limit(noOfRecords).then((sad) => {
      console.log('Fetched ', sad.length, 'sad records.');
      data = data.concat(sad);
      data = data.map((record) => {
        return flattenTheObject(record.toJSON(), schema);
      });
      let csv = getCSV(data, Object.keys(schema));
      fs.writeFileSync('./data.csv', csv);
      console.log('CSV written, check:', './data.csv');
      process.exit(0);
    }, (err) => {
      console.log(err);
    });
  }, (err) => {
    console.log(err);
  });
}
