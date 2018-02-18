let expect = require('chai').expect;
let sinon = require('sinon');
let Utils = require('Utils');
describe('Util', function () {
  describe('wait', function () {
    beforeEach(function () {
      this.clock = sinon.useFakeTimers();
    });

    it('should call the callback after given time.', function () {
      let cb = sinon.spy();
      let givenSecondsToWait = 2;
      // Utils.wait(givenSecondsToWait, cb);
      this.clock.tick(givenSecondsToWait*1000);
      expect(cb.called).to.be.true();
    });
  });
});
