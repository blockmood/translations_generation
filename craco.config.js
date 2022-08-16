const webpack = require('webpack');
const path = require('path');
const CracoAntDesignPlugin = require('craco-antd');


module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      if(process.env.NODE_ENV !== 'development'){
        webpackConfig.output.publicPath = './'
      }
      return webpackConfig;
    }
  },
  plugins: [
    {
      plugin: CracoAntDesignPlugin
    },
  ],
};
