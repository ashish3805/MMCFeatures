let csvWriter = require('csv-write-stream');
let fs = require('fs');

class CSVWriter {
  constructor (headers, fileName = 'csvWriterOut.csv', flags='w') {
    this.writer = csvWriter({
      separator: ',',
      newline: '\n',
      headers: headers,
      sendHeaders: true,
    });
    this.writer.pipe(fs.createWriteStream(fileName, {flags: flags}));
  }

  write (data) {
    this.writer.write(data);
  }
}

module.exports =CSVWriter;
