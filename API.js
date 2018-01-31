let fs = require('fs');
let request = require('request');

class APIClient {
  constructor (baseURL) {
    this.BASE = baseURL;
    this.config = JSON.parse(fs.readFileSync('./config.json'));
    if (this.config.token == null) {
      console.log('getting new token....');
      this.getNewToken().then((token)=>{
        this.config.token = token;
        this._saveToken(token);
      }, console.log);
    } else {
      console.log('using existing token.');
    }
  }

  requestGet (url) {
    let options = {
      url: this.BASE+url,
      headers: {
        'Authorization': 'Bearer ' + this.config.token,
      },
      json: true,
    };
    return new Promise((resolve, reject) =>{
      request.get(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          resolve(body);
        } else {
          reject(response);
        }
      });
    });
  }

  getNewToken () {
    return new Promise((resolve, reject) => {
      request.post(this._getAuthOptions(), function (error, response, body) {
        if (!error && response.statusCode === 200) {
          let token = body.access_token;
          resolve(token);
        } else {
          reject(response);
        }
      });
    });
  }

  _saveToken (token) {
    console.log('saving token for future use....');
    let config = {
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
      token: token,
    };
    fs.writeFileSync('./config.json', JSON.stringify(config));
  }

  _getAuthOptions () {
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (new Buffer(this.config.clientId + ':' + this.config.clientSecret).toString('base64')),
      },
      form: {
        grant_type: 'client_credentials',
      },
      json: true,
    };
    return authOptions;
  }
}

module.exports = APIClient;
