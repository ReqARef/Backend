var bunyan = require('bunyan');

var Logger = bunyan.createLogger({ name: 'ReqARef Backend' });

module.exports = Logger;
