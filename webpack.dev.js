const ExtractTextPlugin = require('extract-text-webpack-plugin');

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        "presets": [
                            ["@babel/env",
                                {
                                    "debug": true,
                                    "targets": {
                                        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
                                    },
                                    "useBuiltIns": 'usage',
                                    "modules": 'commonjs'
                                }
                            ]
                        ],
                        "plugins": [
                            "@babel/plugin-proposal-class-properties"
                        ]
                    }
                }
            }
        ]
    },
});