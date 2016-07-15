'use strict';

const PATH = require('path');

const Webpack = require('webpack');
const Futil   = require('feliz.util')();
const Ferror  = require('feliz.error')();
const Package = require('../package.json');

const CssNano         = require('cssnano');
const CssLost         = require('lost');
const CssNext         = require('postcss-cssnext');
const CssImport       = require('postcss-import');
const CssMixins       = require('postcss-mixins');
const CssVars         = require('postcss-simple-vars');
const CssIf           = require('postcss-conditionals');
const CssFor          = require('postcss-for');
const CssPropLookup   = require('postcss-property-lookup');

module.exports = function(root){

    if (!Futil.is(root).string()) throw Ferror.type({
        name: Package.name,
        type: 'string',
        data: !root? root : root.constructor.name
    });

    const preset = { root };
    const isDev  = process.env.NODE_ENV !== 'production';
    const common = PATH.join(root, 'common');
    const master = PATH.join(common, 'master');

    // Enable error logs for server requests
    preset.server = {
        debug: isDev? { request: ['error'] } : undefined
    };

    // Custom paths
    preset.path = {
        'common': { type:'join',  args:[common] },
        'master': { type:'join',  args:[master] }
    };

    // Frontend Html configuration
    preset.views = {
        type   : 'nunjucks',
        engine : { minimize  : !isDev }
    };

    // Frontend JS configuration (for bundles)
    preset.bundle_js = {
        index  : 'view',
        path   : [root],
        engine : {
            devtool: isDev? 'eval' : undefined,
            module: {
                loaders: [
                    {
                        test: /\.jsx?$/,
                        loader: 'babel',
                        query : { presets: [ 'es2015', 'stage-3' ] }
                    }
                ]
            },
            plugins: isDev? [] : [
                new Webpack.optimize.UglifyJsPlugin({
                    compress   : { warnings : false },
                    mangle     : true,
                    comments   : false,
                    sourceMaps : false
                })
            ]
        }
    };

    // CSS configuration (for bundles)
    preset.bundle_css = {
        index: 'view',
        engine: {
            map: isDev? { inline:true } : false
        },
        plugins: [
            CssImport({ path: root }),
            isDev? null : CssNano,
            CssNext,
            CssMixins,
            CssVars({ silent:true }),
            CssPropLookup,
            CssFor,
            CssIf,
            CssLost,
        ].filter(Boolean)
    }

    return preset;
}
