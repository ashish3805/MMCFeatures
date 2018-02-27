let mongoose = require('mongoose');

class Util {
  static getArrayContents (data) {
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

  static getColumnsFrom2DArray (data) {
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

  static flattenTheObject (data, schema) {
    let res = {};
    let bars = Util.getArrayContents(data.analysis.bars);
    let beats = Util.getArrayContents(data.analysis.beats);
    let sections = Util.getArrayContents(data.analysis.sections);
    let tatums = Util.getArrayContents(data.analysis.tatums);
    let segments = Util.getArrayContents(data.analysis.segments);
    let timbre = Util.getColumnsFrom2DArray(segments.timbre);
    let pitches = Util.getColumnsFrom2DArray(segments.pitches);

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

  static connectToDB (dbName) {
    return new Promise((resolve, reject)=>{
      mongoose.connect('mongodb://localhost/' + dbName);
      let db = mongoose.connection;
      db.on('error', function (err) {
        console.error.bind(console, 'connection error:');
        reject(err);
      });
      db.once('open', function () {
        console.log('connected to db!!');
        resolve();
      });
    });
  }

  static logMetric (startTime, length, i) {
    let timeDiff = (new Date - startTime) / 1000;
    let rate = timeDiff / (i + 1);
    let remaining = (length - i) * rate;
    console.log('Time Elapsed:', timeDiff, 'seconds', 'Remaining:',
      remaining, 'seconds', 'Rate:', rate);
  }
}

module.exports = Util;
