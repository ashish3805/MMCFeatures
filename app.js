let APIClinet = require('./API');
let client = new APIClinet('https://api.spotify.com');
let fs = require('fs');
const readline = require('readline');

let log = function (data) {
  console.log(JSON.stringify(data));
  fs.writeFileSync('./lastResponse.json', JSON.stringify(data));
  console.log('\nSaved the output at:'+__dirname+'/lastResponse.json');
};

function getMe () {
  let url = '/v1/users/jmperezperez';
  client.requestGet(url).then(log, log);
}

function searchSong (song) {
  let url = '/v1/search?q='+song+'&type=track';
  client.requestGet(url).then(log, log);
}

// https://developer.spotify.com/web-api/console/tracks/
// http://docs.echonest.com.s3-website-us-east-1.amazonaws.com/_static/AnalyzeDocumentation.pdf

function getFeatures (trackId) {
  let url = '/v1/audio-features/'+trackId;
  client.requestGet(url).then(log, log);
}

function getAnalysis (trackId) {
  let url = '/v1/audio-analysis/'+trackId;
  client.requestGet(url).then(log, log);
}

let trackId = '4lUnFLtn8w3W76FiYDRzmO';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Choose One using keyboard: \n1)Analyze Song \n2)Get Features \n3)exit\n', (answer) => {
  switch (answer) {
    case '1':
      getAnalysis(trackId);
      console.log(`Doing:  ${answer}`);
      break;
    case '2':
      getFeatures(trackId);
      console.log(`Doing:  ${answer}`);
      break;
    case '3':
      process.exit(0);
      break;
    default:
      console.log(`Wrong option:  ${answer}`);
      break;
  }
  rl.close();
});
