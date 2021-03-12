module.exports = {
  transformer: {
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
  resolver: {
    extraNodeModules: require('node-libs-react-native')
  }
};
