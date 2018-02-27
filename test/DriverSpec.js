let Driver = require('../Driver');
let expect = require('chai').expect;

describe('Driver', function () {
  this.timeout(30000);

  beforeEach(()=>{
    this.dummySong = {
      '_id': '5a7a0cc95d5af54c5ab0e45c',
      'done': false,
      'title': 'Román Swing',
      'mbid': '10cd1886-f1ef-40c0-9480-0eec33676a83',
      'artist': 'Besh O Drom',
      'mood': 1,
      '__v': 0,
    };

    this.listOfSongs = [{
      '_id': '5a7a0cc95d5af54c5ab0e45e',
      'done': false,
      'title': 'The Wind Blows Your Hair',
      'mbid': 'f8f25a5e-4221-4d5e-89c0-26bcb748c0d1',
      'artist': 'The Seeds',
      'mood': 1,
      '__v': 0,
    }, {
      '_id': '5a7a0cc95d5af54c5ab0e45f',
      'done': false,
      'title': 'Da Beat Goes',
      'mbid': 'a0ac0926-b026-4c08-a048-4ce7bb02030b',
      'artist': 'Red 5',
      'mood': 1,
      '__v': 0,
    }];
  });

  it('should write a song features to csv', async () => {
    let driver = new Driver();
    let returnedValue = await driver.processASong(this.dummySong);
    expect(returnedValue).to.equal(true);
  });

  it.only('should write a list of song features to csv', async () => {
    let driver = new Driver();
    let returnedValue = await driver.processAListOfSongs(this.listOfSongs);
    expect(returnedValue).to.equal(true);
  });
});
