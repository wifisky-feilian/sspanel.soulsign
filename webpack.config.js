const webpack = require("webpack");
let config = [];

function generate(config) {
    return {
        entry: config.entry,
        output: {
            path: __dirname + "/dist/",
            filename: config.name + ".js",
            library: config.name,
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
}

[
    { name: "iott", entry: "./src/iott.js" },
    { name: "applet.support", entry: "./src/support/applet.support.js" },
    { name: "model.support", entry: "./src/support/model.support.js" },
].forEach((item) => {
    config.push(generate(item));
});

module.exports = config;
