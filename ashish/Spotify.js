let SpotifyWebApi = require('spotify-web-api-node');

class Spotify {
  constructor (clientId, clientSecret) {
    this.spotifyApi = new SpotifyWebApi({
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUri: 'http://localhost:8080/callback',
    });
  }

  getAnalysis (title, artist) {
    return new Promise((resolve, reject) => {
      Spotify._getId(title, artist)
        .then(this.spotifyApi.getAudioAnalysisForTrack, reject)
        .then((data) => {
          console.log('Analysis fetched.');
          resolve(data.body);
        }, function (err) {
          Spotify._handleError(err).then(() => {
            console.log('Trying again to get the analysis.');
            getAnalysis(spId).then(resolve, reject);
          }, reject);
        });
    });
  }

  getFeatures (title, artist) {
    return new Promise((resolve, reject) => {
      Spotify._getId(title, artist)
        .then(this.spotifyApi.getAudioFeaturesForTrack, reject)
        .then((data) => {
          console.log('Features fetched.');
          resolve(data.body);
        }, function (err) {
          Spotify._handleError(err).then(() => {
            console.log('Trying again to get the features.');
            getFeatures(spId).then(resolve, reject);
          }, reject);
        });
    });
  }

  static _getId (title, artist) {
    return new Promise((resolve, reject) => {
      this.spotifyApi.searchTracks('track:' + title + ' artist:' + artist, {
        'limit': 1,
      }).then((data) => {
        if (data.body.tracks.items.length == 0) {
          reject(new Error('Song Not Found'));
        } else {
          resolve(data.body.tracks.items[0].id);
        }
      }, console.log);
    });
  }

  static _handleError (err) {
    return new Promise((resolve, reject) => {
      if (err.statusCode == 401) {
        console.log('Error Identified: Token has Expired');
        getAccessToken().then(resolve, reject);
      } else if (err.statusCode == 429) {
        console.log('Error Identified: Rate Limit Reached.');
        Spotify._wait(err.headers['retry-after']).then(resolve, reject);
      } else if (err.statusCode == undefined) {
        console.log('Looks like Internet not working.', err);
        console.log('Will retry after 5 seconds.');
        Spotify._wait(5).then(resolve, reject);
      } else {
        console.log('Error Not Identified.', err);
        reject(err);
      }
    });
  }
}

module.exports = Spotify;
