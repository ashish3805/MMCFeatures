let expect = require('chai').expect;
let LastFm = require('./LastFm');
let FmTrack = require('../models/FmTrack');
let sinon = require('sinon');
describe('LastFm', function () {
  beforeEach(function () {
    sinon.stub(FmTrack, 'find');
  });
  afterEach(function () {
    FmTrack.find.restore();
  });
  describe('Dummy Test', function () {
    it('should pass'), function () {
      expect(false).to.equal(false);
    };
  });

  describe('ifAnyLeft', function () {
    it('should return true if FmTracks in database has any song left undone.',
      async ()=>{
        let track1 = {
          title: 'Cosmogony',
          artist: 'Björk',
          mood: 1,
          mbid: 'e05802d4-39c5-47b8-a74c-c07522a2340b',
          done: false,
          tag: 'happy',
        };
        let track2 = {
          title: 'Her Eyes Are Underneath the Ground',
          artist: 'Antony and the Johnsons',
          mood: 0,
          mbid: 'ea4edd37-b87b-480b-80e5-19a6f701a9cd',
          done: false,
          tag: 'sad',
        };
        let expectedModels = [track1, track2];
        FmTrack.find.yields(null, expectedModels);
        let lastFm = new LastFm();
        let returnedValue = await lastFm.ifAnyLeft('sad');
        expect(returnedValue).to.equal(false);
      });
  });

  describe('getTrack', function () {
    it('should get a undone track from database.', async ()=>{

    });
  });
  describe('_fetchNextPage', function () {
    it('should fetch the next page from lastFm.');
  });

  describe('_checkConsistency', function () {
    it('should check if the stored meta data about tag collections is' +
      'consistent with current config.');
  });
});
