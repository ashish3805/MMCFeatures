module.exports = {
  'wait': function wait (seconds) {
    return new Promise((resolve, reject) => {
      try {
        if (seconds == 0) seconds = 1;
        console.log('Will wait for ', seconds, ' seconds.');
        setTimeout(resolve, seconds * 1000);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
};
