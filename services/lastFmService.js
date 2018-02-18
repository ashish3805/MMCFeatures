let LastFmNode = require('lastfm').LastFmNode;
let FmTrack = require('../models/FmTrack');

class LastFmWorker {
  constructor (apiKey, apiSecret) {
    this.lastfm = new LastFmNode({
      api_key: apiKey,
      secret: apiSecret,
      useragent: 'MMC/v1.1 MMC',
    });
    this._allData ={};
  }

  getTaggedTracks (tagToFetch, noOfSongsToFetch) {
    /**
     * 1) Calculate number of pages.
     * 2) Make API calls at intervals of 1 second to be within rate-limit.
     * 3) On completion of a call save the responses to database.
     * 4) On completion of all calls resolve the promise.
     */

    return new Promise((resolve, reject) => {
      let pagesCount = noOfSongsToFetch % 500 == 0 ? noOfSongsToFetch / 500 :
        noOfSongsToFetch / 500 + 1;
      console.log('Total pages: ', pagesCount);

      let options = {
        'tag': tagToFetch,
        'limit': 500,
        'page': 1,
      };

      let counter = 1;
      let cbCounter = 0;
      const intervalObj = setInterval(() => {
        console.log('making call:', counter);
        options.page = counter;
        let r = this.lastfm.request('tag.getTopTracks', options);
        r.on('success', (data) => {
          this._saveResponse(data, tagToFetch).then(()=>{
            cbCounter++;
            if (cbCounter >= pagesCount ) {
              resolve(this._allData);
            }
          }, reject);
        });
        r.on('error', (err) => {
          console.log('error:' + err);
        });
        counter++;
        if (counter > pagesCount) {
          clearInterval(intervalObj);
        }
      }, 1000);
    });
  }
  _saveResponse (data, tag, saveToDb = true) {
    return new Promise((resolve, reject)=>{
      let counter = 0;
      for (let i = 0; i < data.tracks.track.length; i++) {
        let newSong = {
          'title': data.tracks.track[i].name,
          'mbid': data.tracks.track[i].mbid,
          'artist': data.tracks.track[i].artist.name,
          'tag': tag,
          'done': false,
        };
        let key = newSong.title + newSong.artist;
        if (this._allData[key] == undefined) {
          this._allData[key] = newSong;
          if (saveToDb == true) {
            FmTrack.save(newSong).then((savedTrack) => {
              this._allData[key] = savedTrack;
              counter++;
              if (counter >= data.tracks.track.length) {
                resolve();
              }
            }, reject);
          } else {
            counter++;
            if (counter >= data.tracks.track.length) {
              resolve();
            }
          }
        }
      }
    });
  }
}

module.exports = LastFmWorker;
