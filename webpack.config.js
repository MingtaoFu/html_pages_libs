module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "dist/bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.(es6|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.(jpg|png)$/,
                loader: "url?limit=8192"
            },
            {
                test: /\.scss$/,
                loader: "style!css!sass"
            }
        ]
    }
};
