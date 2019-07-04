const {resolve} = require('path');
/**
 * entry: 脚手架的入口文件
 * output: { path:绝对路径,
 *          filename: filename生成的js文件 }
 * module: { rules: [] }
 * mode: 模式
 */

module.exports = {
  entry: './src/js/index.js',
  output: {
    path: resolve(__dirname, 'build'),
    filename: './js/build.js'
  },
  module: {
    rules:[

    ]
  },

  mode: 'development'
};

