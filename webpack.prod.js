const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
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
            },
            {
                test: /\.(scss|sass)$/,
                /*include: [
                    path.resolve(__dirname, "src")
                ],*/
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    publicPath: '../../',
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'resolve-url-loader'
                        },
                        {
                            loader: 'postcss-loader'
                        },
                        {
                            loader: 'sass-loader?sourceMap'
                        }
                    ]
                })
            },
            {
                test: /\.(css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {minimize: true}
                        },
                        {
                            loader: 'resolve-url-loader'
                        },
                        {
                            loader: 'postcss-loader'
                        },
                    ]
                })
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin('dist', {})
    ]
});