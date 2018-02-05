let SpTrack = require('./models/SpTrack');
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mmc');

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected to db!!');
  doTasks();
});

let hash = {};
function test (data) {
  let dups = 0;
  let count = 0;
  for (let i = 0; i<data.length; i++) {
    count++;
    if (hash[data[i].id] !== undefined) {
      console.log(dups, 'dups:', hash[data[i].id].title, data[i].title);
      dups++;
      SpTrack.findByIdAndRemove(data[i]._id).then(console.log, console.log);
    } else {
      hash[data[i].id] = data[i];
    }
  }
  console.log(count, dups);
}

function doTasks () {
  SpTrack.find({}).then(test, console.log);
}
