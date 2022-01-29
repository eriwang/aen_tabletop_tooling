const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    target: 'web',
    entry: './src/index.tsx',
    devServer: {
        historyApiFallback: true,  // plays nicer with react routing
        client: {
            overlay: false,
        },
    },
    resolve: {
        extensions: ['.tsx', '.jsx', '.ts', '.js'],
        modules: [path.join(__dirname, 'src'), 'node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                include: /src/,
                exclude: /node_modules/,
                loader: MiniCssExtractPlugin.loader
            },
            {
                test: /\.css$/i,
                loader: require.resolve('css-loader')
            },
            {
                test: /\.(ts|js)x?$/,
                include: /src/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                type: 'asset',
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: './public/index.html'}),
        new MiniCssExtractPlugin({filename: 'static/css/[name].css'}),
        new CopyWebpackPlugin({
            patterns: [{
                from: 'public',
                globOptions: {
                    ignore: ['**/*.html']
                }
            }]
        }),
    ],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    }
};