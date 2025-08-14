const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    alias: {
      'react-native/Libraries/Utilities/codegenNativeComponent': require.resolve('react-native/Libraries/Utilities/codegenNativeComponent'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
