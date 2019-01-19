const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./src/js/tag-slider.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'tag-slider.js'
    },
    module: {
        rules: [
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets/fonts'
                    }
                }]
            }
        ]
    },
    resolve: {
        alias: {
            jquery: 'jquery/src/jquery', // resolve to dist folder
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            hash: false,
            template: './src/index.html',
            filename: 'index.html'
        }),
        new ExtractTextPlugin({
            filename: 'tag-slider.css',
            disable: false,
            allChunks: true
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })/*,
        new CopyWebpackPlugin([
            {from: './src/icons/fonts', to: 'icons/fonts'}
        ]),
        new CopyWebpackPlugin([
            {from: './src/favicon', to: 'favicon'}
        ])*/
    ]
}
;