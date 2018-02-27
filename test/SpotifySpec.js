let Spotify =require('../lib/Spotify');
let expect = require('chai').expect;

describe('Spotify', function () {
  this.timeout(30000);
  it('should fetch analysis', async () => {
    let sp = new Spotify('039c8da16d764b958b9da7a0bb1381b3',
      '41769a9a05a7435ca81dd2831d933b5d');
    let analysis = await sp.getAnalysis('Wait', 'Maroon 5');
    expect(Object.keys(analysis)).to.contain('track');
  });

  it('should fetch features', async () => {
    let sp = new Spotify('039c8da16d764b958b9da7a0bb1381b3',
      '41769a9a05a7435ca81dd2831d933b5d');
    let features = await sp.getFeatures('Wait', 'Maroon 5');
    expect(Object.keys(features)).to.contain('danceability');
  });
});
