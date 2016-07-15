'use strict';

const FelizPreset = require('feliz.preset');
const Package     = require('../package.json');
const Config      = require('./config');

module.exports = function(options){
    return FelizPreset(Package, Config, options);
}
