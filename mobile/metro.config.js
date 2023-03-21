/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path')

const blacklist = require('metro-config/src/defaults/exclusionList')

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    blacklistRE: blacklist([/awsmobilejs\/.*/]),
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, '..', 'networking')],
  },
  watchFolders: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, '..', 'networking')]
}
