const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = function override(config, env) {
    config.plugins.push(new TsconfigPathsPlugin({ configFile: "./tsconfig.json" }))
    return config
}