let SpotifyWebApi = require('spotify-web-api-node');

class SpotifyWorker {
  constructor (clientId, clientSecret) {
    this.spotifyApi = new SpotifyWebApi({
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUri: 'http://localhost:8080/callback',
    });
  }
  // expects an array of tracks.
  findIdForFmTracks (fmtracks, saveToDb =true) {
    return new Promise((resolve, reject)=>{
      let doneCounter = 0;
    });
  }

  getAccessToken () {
  return new Promise((resolve, reject) => {
    spotifyApi.clientCredentialsGrant()
      .then(function (data) {
        this.expiry = data.body['expires_in'];
        this.tokenIssuedTime =
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
        // Save the access token so that it's used in future calls
        this.spotifyApi.setAccessToken(data.body['access_token']);
        resolve();
      }, function (err) {
        console.log('Something went wrong when retrieving access token', err);
        reject();
      });
  });
}
}
