const path = require('path');

module.exports = {
    target: 'node',
    entry: './src/index.ts',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: [path.join(__dirname, 'src'), 'node_modules'],
    },
    module: {
        rules: [{
            test: /\.(ts|js)x?$/,
            include: /src/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    externals: ['firebase-admin'],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs',
    }
};