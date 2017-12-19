'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadSchema = loadSchema;

var _fs = require('fs');

var _path = require('path');

function loadSchema(fn) {
    return (0, _fs.readFileSync)((0, _path.join)(__dirname, fn)).toString();
}