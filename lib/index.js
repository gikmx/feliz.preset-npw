'use strict';

const FelizPlug  = require('feliz.plug');
const FelizUtil  = require('feliz.util')();

const Config    = require('./config');
const Package   = require('../package.json');

module.exports = function(options){

    if (!FelizUtil.is(options).object()) options = {};
    if (!FelizUtil.is(options.plugins).object()) options.plugins = { deps:{} };
    if (!FelizUtil.is(options.config).object()) options.config = {};

    options.plugins = FelizUtil
        .object({ deps: Package.dependencies })
        .merge(options.plugins);

    options.config  = FelizUtil
        .object(Config(options.config.root))
        .merge(options.config)

    return FelizPlug(options.plugins)
        .do(plugin => console.log(`${Package.name}» plugin»`, plugin.name))
        .toArray()
        .map(plugins => Object.assign(options.config, {plugins}))
}
