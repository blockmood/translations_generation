const webpack = require('webpack');
const path = require('path');
const CracoAntDesignPlugin = require('craco-antd');


module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin
    },
  ],
};
