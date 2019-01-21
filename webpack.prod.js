const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: "production",
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false
            })
        ]
    },
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
                                    "debug": false,
                                    "targets": {
                                        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
                                    },
                                    "useBuiltIns": "usage",
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
    plugins: [
        new CleanWebpackPlugin('dist', {})
    ]
});