let SpotifyWebApi = require('spotify-web-api-node');
let SpTrack = require('./models/SpTrack');
let fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mmc');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected to db!!');
  doTasks();
});

let config = JSON.parse(fs.readFileSync('./config.json'));
let spotifyApi = new SpotifyWebApi({
  clientId: config.clientId,
  clientSecret: config.clientSecret,
  redirectUri: 'http://localhost:8080/callback',
});

function wait (seconds) {
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

function handleError (err) {
  return new Promise((resolve, reject) => {
    if (err.statusCode == 401) {
      console.log('Error Identified: Token has Expired');
      getAccessToken().then(resolve, reject);
    } else if (err.statusCode == 429) {
      console.log('Error Identified: Rate Limit Reached.');
      wait(err.headers['retry-after']).then(resolve, reject);
    } else if (err.statusCode == undefined) {
      console.log('Looks like Internet not working.', err);
      console.log('Will retry after 5 seconds.');
      wait(5).then(resolve, reject);
    } else {
      console.log('Error Not Identified.', err);
      reject(err);
    }
  });
}

// Ex. spId '4iV5W9uYEdYUVa79Axb7Rh'
function getAnalysis (spId) {
  return new Promise((resolve, reject) => {
    spotifyApi.getAudioAnalysisForTrack(spId)
      .then((data) => {
        // save data;
        console.log('Analysis fetched.');
        resolve(data.body);
      }, function (err) {
        handleError(err).then(() => {
          console.log('Trying again to get the analysis.');
          getAnalysis(spId);
        }, reject);
      });
  });
}

function getFeatures (spId) {
  return new Promise((resolve, reject) => {
    spotifyApi.getAudioFeaturesForTrack(spId)
      .then((data) => {
        // save data;
        console.log('Features fetched.');
        resolve(data.body);
      }, function (err) {
        handleError(err).then(() => {
          console.log('Trying again to get the features.');
          getFeatures(spId);
        }, reject);
        reject();
      });
  });
}

function saveData (id, analysis, features) {
  return new Promise((resolve, reject) => {
    console.log('Saving data in database.');
    SpTrack.findByIdAndUpdate(id, {
      $set: {
        'analysis': analysis,
        'features': features,
        'done': true,
      },
    }).then(resolve, reject);
  });
}

function getRecords (limit, filter) {
  return new Promise((resolve, reject) => {
    let doneCount = 0;
    if (filter == undefined) filter = {};
    SpTrack.find(filter).then((data) => {
      console.log('Found ', data.length, ' no of records.');
      for (let i = 0; i < data.length; i++) {
        if (data[i].done == true) {
          console.log('Already Done:', data[i].id, data[i].title);
          ++doneCount;
          data.splice(i, 1);
          // To counter the effect of splice on i.
          --i;
        }
      }
      console.log('Found ', doneCount, ' records already done.');
      if (limit != undefined && data.length > limit) {
        data.splice(limit);
      }
      resolve(data);
    }, (err) => {
      console.log('Error retrieving records:', err);
      reject();
    });
  });
};

function setAccessToken () {
  return new Promise((resolve, reject) => {
    spotifyApi.clientCredentialsGrant()
      .then(function (data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
        resolve();
      }, function (err) {
        console.log('Something went wrong when retrieving access token', err);
        reject();
      });
  });
}

function processRecords (records, i) {
  if (i == 0) {
    processRecords.startTime = new Date();
  }
  if (i >= records.length) {
    console.log('All records processed.');
    process.exit(0);
  }
  console.log('Processing ' + (i + 1) + ' of ' + records.length);
  console.log('id' + records[i].id + ' Title:' + records[i].title);
  let timeDiff = (new Date - processRecords.startTime)/1000;
  let rate = timeDiff / (i+1);
  let remaining = (records.length - i) * rate;
  console.log('Time Elapsed:', timeDiff, 'seconds', 'Remaining:',
    remaining, 'seconds', 'Rate:', rate);
  getAnalysis(records[i].id)
    .then((analysis) => {
      getFeatures(records[i].id)
        .then((features) => {
          // Pass local db id( i.e. _id), not Spotifie's one.
          saveData(records[i]._id, analysis, features)
            .then(() => {
              processRecords(records, ++i);
            }, (savingErr) => {
              console.log('Data could not be saved for:', records[i].title);
              console.log(savingErr);
              console.log('Please check mongodb.');
              rl.question('Continue(Y/N):', (answer) => {
                if (answer == 'Y' || answer == 'y' || answer == 'Yes') {
                  processRecords(records, i);
                } else {
                  console.log('Stopping Program.');
                  process.exit(0);
                }
              });
            });
        }, (featuresErr) => {
          console.log('Features could not be retrieved for:', records[i].title);
          console.log('Skipping:', records[i].title);
          processRecords(records, ++i);
        });
    }, (analysisErr) => {
      console.log('Analysis could not be retrieved for:', records[i].title);
      console.log('Skipping:', records[i].title);
      processRecords(records, ++i);
    });
}

function doTasks () {
  setAccessToken()
    .then(() => {
      getRecords(noOfRecordsToProcess, recordFilter)
      .then((records) => {
        console.log(records.length, ' records to process.');
        processRecords(records, 0);
      });
    })
    .catch((err) => {
      console.log('Some error happened.');
      if (err != undefined) console.log(err);
    });
}

// Configure the following:
let recordFilter = {
  mood: 0,
};

let noOfRecordsToProcess = 500;
