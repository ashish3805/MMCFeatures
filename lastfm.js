let LastFmNode = require('lastfm').LastFmNode;
let fs = require('fs');

let lastfm = new LastFmNode({
  api_key: '3e062051971fc1353aa069226ee9928b',
  secret: 'f2624348d624ae272c6993d8dfa8a1fd',
  useragent: 'MMC/v1.1 MMC',
});

let log = function (data) {
  if (log.count == undefined) {
    log.count = 0;
  }

  let dir = __dirname + '/lastResponse';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFileSync(dir + '/response' + log.count + '.json',
    JSON.stringify(data));
  console.log('Saved the response at ' + dir + '/response' + log.count +
    '.json');
  ++log.count;
};


function getTaggedTracks (tag, limit = 50) {
  let pagesCount = limit % 500 == 0 ? limit / 500 : limit / 500 + 1;
  console.log('Total pages: ', pagesCount);
  let options = {
    'tag': tag,
    'limit': 500,
    'page': 1,
  };

  let task = function (pagesCount) {
    if (task.count == undefined) {
      task.count = 1;
    }
    console.log('making call:', task.count);
    options.page = task.count;
    let r = lastfm.request('tag.getTopTracks', options);
    r.on('success', (data) => {
      console.log('success:');
      log(data);
    });
    r.on('error', (err) => {
      console.log('error:');
      log(err);
    });
    task.count++;
    if (task.count > pagesCount) {
      clearInterval(intervalObj);
      task.count = undefined;
    }
  };
  const intervalObj = setInterval(task, 1000, pagesCount);
}

getTaggedTracks(tagToFetch, noOfSongsToFetch);

// configure these:
let tagToFetch = 'Party';
let noOfSongsToFetch = 15000;
