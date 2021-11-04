const path = require('path');

const GasPlugin = require('gas-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/main.ts',
    resolve: {
        extensions: ['.ts'],
        modules: [path.join(__dirname, 'src')],
    },
    output: {
        filename: 'out.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
            test: /\.ts$/,
            include: /src/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    optimization: {
        minimize: false,
    },
    performance: {
        hints: false,
    },

    plugins: [
        new GasPlugin({
            comments: false,
            source: 'digitalinspiration.com',
        }),
    ]
};