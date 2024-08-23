const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');

/**
 * Webpack configuration for building the Node.js application.
 * 
 * @file webpack.config.js
 * @description This file configures Webpack for bundling the Node.js application, specifying
 * entry points, output settings, and external modules.
 * 
 * @type {import('webpack').Configuration}
 */
module.exports = {
    /**
     * The mode to use for the build. In production mode, Webpack optimizes the build for performance.
     * 
     * @type {string}
     */
    mode: 'production',

    /**
     * Entry point for the application. Webpack starts building from this file.
     * 
     * @type {Array<string>}
     */
    entry: [path.join(__dirname, 'index.js')],

    /**
     * Output configuration for the built files.
     * 
     * @type {Object}
     * @property {string} path - The output directory for the bundled files.
     * @property {string} publicPath - The public URL of the output directory when referenced in a browser.
     * @property {string} filename - The name of the output bundle file.
     */
    output: {
        path: path.join(__dirname, 'dist'), // Directory to output the bundled files
        publicPath: '/', // Public URL for the bundle
        filename: 'bundle.js', // Name of the output bundle file
    },

    /**
     * Exclude node modules from being bundled. This allows Node.js to handle them.
     * 
     * @type {Array<Function>}
     */
    externals: [webpackNodeExternals()],

    /**
     * Target environment for the build. This configuration is intended for Node.js.
     * 
     * @type {string}
     */
    target: 'node',
};
