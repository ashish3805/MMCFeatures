let path = './localSavedResponses/15000Response/';
let fs = require('fs');

let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mmc');
let FmTrack = require('./models/FmTrack');

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected to db!!');
  doTasks();
});

function processFiles (path, mood) {
  let allData = {};

  let files = fs.readdirSync(path);
  for (let j=0; j<files.length; j++) {
    let data = fs.readFileSync(path + files[j]);
    console.log('Processing:', path+files[j]);
    data = JSON.parse(data);
    for (let i = 0; i < data.tracks.track.length; i++) {
      let newSong = {
        'title': data.tracks.track[i].name,
        'mbid': data.tracks.track[i].mbid,
        'artist': data.tracks.track[i].artist.name,
        'mood': mood,
      };
      let key = newSong.title + newSong.artist;
      if (allData[key] == undefined) {
        allData[key] = newSong;
      } else {
        console.log('Dups:', JSON.stringify(newSong), ': AND :',
          JSON.stringify(allData[key]));
      }
    }
  }
  console.log('Total:', Object.keys(allData).length);
  return allData;
}

function saveRecords (records) {
  let keys = Object.keys(records);
  for (let i = 0; i<keys.length; i++) {
    let newTrack = new FmTrack(records[keys[i]]);
    newTrack.save().then((data)=>{
      console.log('Saved:', data.title);
    }, (err)=>{
      console.log(err);
    });
  }
}

function doTasks () {
  let mood = 0;
  let records = processFiles(path, mood);
  saveRecords(records);
}

