let SpotifyWebApi = require('spotify-web-api-node');

class Spotify {
  constructor (clientId, clientSecret) {
    if (clientId == null || clientSecret ==null) {
      throw new Error('client id and secret required.');
    }
    this.spotifyApi = new SpotifyWebApi({
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUri: 'http://localhost:8080/callback',
    });
    this.savedIds = {};
  }

  getAnalysis (title, artist) {
    return new Promise((resolve, reject) => {
      let that = this;
      this._getId(title, artist)
        .then((id)=>{
          that.spotifyApi.getAudioAnalysisForTrack(id).then((data) => {
            console.log('Analysis fetched.');
            resolve(data.body);
          }, function (err) {
            that._handleError(err).then(() => {
              console.log('Trying again to get the analysis.');
              that.getAnalysis(title, artist).then(resolve, reject);
            }, reject);
          });
        }, reject);
    });
  }

  getFeatures (title, artist) {
    return new Promise((resolve, reject) => {
      let that = this;
      this._getId(title, artist)
        .then((id)=>{
          that.spotifyApi.getAudioFeaturesForTrack(id).then((data) => {
            console.log('Features fetched.');
            resolve(data.body);
          }, function (err) {
            that._handleError(err).then(() => {
              console.log('Trying again to get the features.');
              that.getFeatures(title, artist).then(resolve, reject);
            }, reject);
          });
        }, reject);
    });
  }

  _getId (title, artist) {
    return new Promise((resolve, reject) => {
      let that = this;
      // check in cache first
      if (this.savedIds[title + artist] != undefined ||
        this.savedIds[title + artist] != null) {
        resolve(this.savedIds[title+artist]);
      } else {
        this.spotifyApi.searchTracks('track:' + title + ' artist:' + artist, {
          'limit': 1,
        }).then((data) => {
          if (data.body.tracks.items.length == 0) {
            console.log('Song not found.');
            reject({'statusCode': 1001});
          } else {
            // save it for future.
            this.savedIds[title + artist] = data.body.tracks.items[0].id;
            console.log('Id found:', this.savedIds[title + artist]);
            resolve(data.body.tracks.items[0].id);
          }
        }, (err)=>{
          that._handleError(err).then(() => {
            console.log('Trying again to get the Id.');
            that._getId(title, artist).then(resolve, reject);
          }, reject);
        });
      }
    });
  }

  _handleError (err) {
    return new Promise((resolve, reject) => {
      if (err.statusCode == 401) {
        console.log('Error Identified: Token has Expired');
        this.getAccessToken().then(resolve, reject);
      } else if (err.statusCode == 429) {
        console.log('Error Identified: Rate Limit Reached.');
        this._wait(err.headers['retry-after']).then(resolve, reject);
      } else if (err.statusCode == undefined) {
        console.log('Err Status code is not defined.', err);
        reject(err);
      } else {
        console.log('Error Not Identified.', err);
        reject(err);
      }
    });
  }

  getAccessToken () {
    return new Promise((resolve, reject) => {
      let that = this;
      this.spotifyApi.clientCredentialsGrant()
        .then(function (data) {
          console.log('The access token expires in ' + data.body['expires_in']);
          console.log('The access token is ' + data.body['access_token']);
          // Save the access token so that it's used in future calls
          that.spotifyApi.setAccessToken(data.body['access_token']);
          console.log('Access Token Set');
          resolve(data.body['access_token']);
        }, function (err) {
          console.log('Something went wrong when retrieving access token', err);
          reject();
        });
    });
  }

  _wait (seconds) {
    return new Promise((resolve, reject) => {
      try {
        if (seconds == 0) seconds = 1;
        console.log('Will wait for ', seconds, ' seconds.');
        setTimeout(resolve, seconds * 1000);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}

module.exports = Spotify;
