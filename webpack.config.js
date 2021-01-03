const webpack = require("webpack");

module.exports = {
    entry: "./src/iott.js",
    output: {
        path: __dirname + "/dist/",
        filename: "iott.js",
        library: "iott",
        libraryTarget: "umd",
        libraryExport: "default",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
        ],
    },
    mode: "production",
};
