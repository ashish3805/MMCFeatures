let CSVWriter = require('./CSVWriter');
let Util = require('./Util');
let FmTrack = require('../models/FmTrack');
let Spotify = require('./Spotify');
let config = require('../config');
let fs = require('fs');

class Driver {
  constructor () {
    this.schema = JSON.parse(fs.readFileSync(config.csvSchema));
    this.writer = new CSVWriter(Object.keys(this.schema), config.csvPath,
      config.csvFlags);
    this.sp = new Spotify(config.clientId, config.clientSecret);
  }

  async processASong (song) {
    /**
     * get analysis.
     * get features.
     * flatten the object as per schema.
     * write to csv.
     * mark it done in db.
     */
    console.log('Title:', song.title, 'Artist:', song.artist);
    song.analysis = await this.sp.getAnalysis(song.title, song.artist);
    song.features = await this.sp.getFeatures(song.title, song.artist);
    let flatData = Util.flattenTheObject(song.toJSON(), this.schema);
    this.writer.write(flatData);

    if (config.saveFeaturesToDB) {
      await FmTrack.findByIdAndUpdate(song._id, {$set: {
        'features': song.features,
        'analysis': song.analysis,
        'done': true,
        'id': song.features.id,
      }});
    } else if (config.saveStatusInDB) {
      await FmTrack.findByIdAndUpdate(song._id, {
        $set: {
          'done': true,
        },
      });
    }
    return true;
  }

  async processAListOfSongs (list) {
    /**
     * await processASong()
     * remove it from current list.
     */

    let startTime = new Date();

    for (let i = 0; i<list.length; i++) {
      console.log('\n', i+1, 'of', list.length);
      Util.logMetric(startTime, list.length, i);
      try {
        await this.processASong(list[i]);
        delete list[i];
      } catch (err) {
        console.log('Error:', err);
        if (err.statusCode == 404) continue;
        // userDefined error code start from 1001
        if (err.statusCode == 1001) continue;
        else process.exit(-1);
      }
    }
    return true;
  }

  async run () {
    let songs = await FmTrack.find({done: false});
    await this.processAListOfSongs(songs);
    console.log('Done.');
  }
}

module.exports = Driver;
