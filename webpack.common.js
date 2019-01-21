const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractCSS = new ExtractTextPlugin('[name]');

module.exports = {
    entry: {
        'tag-slider.js': "./src/js/tag-slider.js",
        'tag-slider.css': './src/style/tag-slider.scss',
        'tag-slider-theme.css': './src/style/tag-slider-theme.scss'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]'
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
            },
            {
                test: /\.(scss|sass)$/,
                use: ExtractCSS.extract({
                    fallback: 'style-loader',
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
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            hash: false,
            template: './src/index.html',
            filename: 'index.html'
        }),
        ExtractCSS
    ]
}
;