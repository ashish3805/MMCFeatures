let expect = require('chai').expect;
let CSVWriter = require('../lib/CSVWriter');

describe('CSVWriter', function () {
  it('should pass', function () {
    let writer = new CSVWriter(['one', 'two']);
    writer.write([10, 20]);
    writer.write([20, 40]);
    writer.write([20, 30]);
  });
});
