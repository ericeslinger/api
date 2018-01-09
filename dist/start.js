'use strict';

var _server = require('./server');

process.on('unhandledRejection', r => console.log(r));
const as = new _server.APIServer();
as.start(true);