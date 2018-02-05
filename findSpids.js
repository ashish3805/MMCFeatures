let SpotifyWebApi = require('spotify-web-api-node');
let fs = require('fs');
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mmc');
let SpTrack = require('./models/SpTrack');
let FmTrack = require('./models/FmTrack');
let API = require('./API');

let api = new API('https://api.spotify.com');

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected to db!!');
  // test();
  doTasks();
});

let spotifyApi = new SpotifyWebApi({
  clientId: 'fcecfc72172e4cd267473117a17cbd4d',
  clientSecret: 'a6338157c9bb5ac9c71924cb2940e1a7',
  redirectUri: 'http://localhost:8080/callback',
});

spotifyApi.setAccessToken('BQBQnZuTi9wcJlLNZ7ZlMlMKI8k6terIoHew_n3t92IX29x71MdglRWpfeabTrhBjYttkJdew6g2fIjCwVM');

let log = function (data) {
  console.log(JSON.stringify(data));
  fs.writeFileSync('./lastResponse.json', JSON.stringify(data));
  console.log('\nSaved the output at:' + __dirname + '/lastResponse.json');
};

function getToken () {
  return JSON.parse(fs.readFileSync('./config.json')).token;
}

function updateAPIkey () {

}

function wait (time, callback, records, i) {
  // 'time' is in seconds
  console.log('Wait started.');
  if (time==0) time = 1;
  setTimeout(callback, time*1000, records, i);
}

function processNext (title, artist, mood) {
  return new Promise((resolve, reject) => {
    console.log('Sending Search Request.');
    spotifyApi.searchTracks('track:' + title + ' artist:' + artist, {
      'limit': 1,
    }).then((data) => {
      console.log('Search Request Completed');
      if ( data.statusCode == 401) {
        console.log('Token Expired.', data);
        reject({'msg': data, 'code': 3});
      }
      if (data.statusCode == 429) {
        console.log('Rate Limit Reached.', data);
        reject({'msg': data.headers['retry-after'], 'code': 2});
        return;
      }
      if (data.body.tracks.items.length == 0) {
        reject({'msg': 'Search not found for: '+title+'  '+artist, 'code': 1});
      } else {
        let newTrack = new SpTrack({
          'id': data.body.tracks.items[0].id,
          'artist': data.body.tracks.items[0].artists[0].name,
          'title': data.body.tracks.items[0].name,
          'mood': mood,
        });
        console.log('Saving Search Results.');
        newTrack.save().then((data) => {
          resolve('Saved:', data.title);
        }, (err) => {
          reject(err);
        });
      }
    }, (err) => {
      reject(err);
    });
  });
}

let count = 0;

function findIdForRecords (records, i) {
  if (i >= records.length) {
    console.log('Done Fetching Ids.');
    return;
  }
  console.log(i+'Details:', records[i].title, records[i].artist);
  processNext(records[i].title, records[i].artist, records[i].mood)
    .then((msg) => {
      console.log(msg);
      FmTrack.findByIdAndRemove(records[i]).then((data) => {
        console.log('Removed from fmTrackDatabase.');
        findIdForRecords(records, ++i);
        count++;
      }, (err) => {
        console.log(err);
        findIdForRecords(records, ++i);
      });
    }, (err) => {
      // If rate limit reached.
      if (err.code == 2) {
        wait(err.msg, findIdForRecords, records, i);
      } else if (err.code == 3) {
        console.log('Updating token');
        api.getNewToken().then((token) => {
          spotifyApi.setAccessToken(token);
          console.log('Token Updated.');
          findIdForRecords(records, i);
        }, (err) => {
          console.log(err);
        });
      } else {
        console.log(err);
        FmTrack.findByIdAndRemove(records[i]).then((data) => {
          console.log('Removed from fmTrackDatabase.');
          findIdForRecords(records, ++i);
        }, (err) => {
          console.log(err);
          findIdForRecords(records, ++i);
        });
      }
    });
}

function doTasks () {
  FmTrack.find({}).then((records) => {
    findIdForRecords(records, 0);
  }, (err) => {
    console.log(err);
  });
}

function testProcessNext () {
  processNext('Eminem', 'Mockingbird', 0).then(console.log, console.log);
}

function test () {
  testProcessNext();
}
