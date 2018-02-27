let Driver = require('./lib/Driver');
let Util = require('./lib/Util');
let config = require('./config');

Util.connectToDB(config.dbName).then(()=>{
  let driver = new Driver();
  try {
    driver.run();
  } catch (err) {
    console.log(err);
  }
}, console.log);
