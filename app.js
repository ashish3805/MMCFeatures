/**
 * 1) Generate CSV.
 * 2) Show Statistics about data.
 * 2) Add More Data to SpDatabase.
 * 3) Get & Save tagged tracks names from LastFm.
 */

let fs = require('fs');

class App {
  constructor (configPath) {
    this._config = JSON.parse(fs.readFileSync(configPath));
  }

  generateCSV () {
    if (fs.existsSync(this._dataPath+'/lastFMResponses/meta.json')) {
      // Do something
    } else {

    }
  }

  showStats () {

  }

  addMoreDataToSpDatabase () {

  }

  getTaggedSongsFromLastFm () {

  }
}

module.exports = App;

