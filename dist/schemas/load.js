'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.load = load;

var _fs = require('fs');

var _path = require('path');

function load(fn) {
    return (0, _fs.readFileSync)((0, _path.join)(__dirname, fn)).toString();
}