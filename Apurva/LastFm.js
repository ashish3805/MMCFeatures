class LastFm {
  constructor () {

  }
  ifAnyLeft (tag) {
    console.log('Checking for more data');
  }
  getTrack (tag) {
    console.log('getting new track');
  }
  // By convention private Methods start with '_'
  _fetchNextPage () {
    console.log('fetching next page');
  }
  _checkConsistency () {
    console.log('checking consistency');
  }
}

module.exports = LastFm;
