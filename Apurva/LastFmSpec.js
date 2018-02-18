let expect = require('chai').expect;
let LastFm = require('./LastFm');

describe('LastFm', function () {
  describe('Dummy Test', function () {
    it('should pass'), function () {
      expect(false).to.equal(false);
    };
  });

  describe('ifAnyLeft', function () {
    it('should return true if FmTracks in database has any song left undone.');
  });

  describe('getTrack', function () {
    it('should get a undone track from database.');
  });
  describe('_fetchNextPage', function () {
    it('should fetch the next page from lastFm.');
  });

  describe('_checkConsistency', function () {
    it('should check if the stored meta data about tag collections is' +
      'consistent with current config.');
  });
});
