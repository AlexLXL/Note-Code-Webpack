const HtmlWebpackPlugin = require('html-webpack-plugin');
const {resolve} = require('path');
const webpack = require('webpack');
/**
 * entry: 脚手架的入口文件
 * output: {
 *    path:绝对路径,Loader的输出路径都是以这个为基础
 *    filename:filename js输出路径和名字
 * }
 * module: {
 *    rules: [  // 下包 --- 开发环境(-D)，不指定版本
 *
 *        // 解析js (第五步使用html-webpack-plugin才会开始自动引入js)
 *       { https://www.webpackjs.com/loaders/less-loader/ 处理less},
 *       { https://www.webpackjs.com/loaders/url-loader/ 处理less图片( 加option:{ publicPath: 打包后图片寻址路径(less路径+publicPath), outputPath: 图片输出路径, name: '[hash:8].[ext]重命名'})}
 *       { https://www.npmjs.com/package/eslint-loader/ 语法检测( paskage.json加eslint配置 )}
 *       { https://www.webpackjs.com/loaders/babel-loader/ ES6语法转换
 *
 *        // 解析HTML
 *       { https://www.webpackjs.com/loaders/html-loader/ 处理HTML里图片的路径,option可删}
 *
 *       // 其他文件(复制一份)
 *       { https://www.webpackjs.com/loaders/file-loader/ 处理其他文件,eot|svg|ttf|woff|mp3|mp4}
 *
 *    ]
 * }
 * plugins:[
 *   https://www.webpackjs.com/plugins/html-webpack-plugin/ 以xx模板创建HTML文件，自动引入打包后的js (不能解析html的图片，结合html-loader使用),
 * ]
 *
 * devServer: { 从这开始改命令，上面是webpack运行，下面用webpack-dev-server
 *      https://www.webpackjs.com/configuration/dev-server/ 开发中( 改resolve()，加open:true，运行出错改路径 )
 *      https://www.webpackjs.com/guides/hot-module-replacement/ 热模替换( 网页变化模块自动刷新 )(加入口文件index.html,不然html改变不自动刷新)
 * }
 *
 * mode: 模式
 *
 */



module.exports = {
  entry: ['./src/js/index.js','./src/index.html'],
  output: {
    path: resolve(__dirname, 'build'),
    filename: './js/build.js'
  },
  module: {
    rules:[
      {
        test: /\.less$/,
        // 多个loader -- use:[]
        // 一个loader -- use:{}或不用use
        // loader没配置 -- use:["eslint-loader"]
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS to JS strings into CommonJS
        }, {
          loader: "less-loader" // compiles Less to CSS
        }]
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 8K以下转换成BASE64
              publicPath: 'image',
              outputPath: 'image',
              name: '[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']  // 使用什么规则解析
          }
        }
      },

      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
        }
      },

      {
        test: /\.(eot|svg|ttf|woff|mp3|mp4)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'media',
              name: '[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
    template: './src/index.html'
  }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],

  /**
   * // devServer开发中(命令"start": "webpack-dev-server") ( 开启特定端口号暴露build，自动监听文件，自动打开页面，但不会自动刷新页面模块 )
   * // 暴露了build，把localhost:4000/看做build文件夹，图片路径出错在url-loader改
   */
  devServer: {  // 开启一个端口号为3003，暴露build文件夹的服务器，执行命令webpack-dev-server"
    contentBase: resolve(__dirname, "build"),
    compress: true, // 压缩
    port: 4000,
    open: true, //自动打开页面
    hot: true
  },

  mode: 'development'
};

