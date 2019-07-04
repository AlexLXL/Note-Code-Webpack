const HtmlWebpackPlugin = require('html-webpack-plugin');
const {resolve} = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
/**
 * 生产的webpack配置在开发的基础上:(生产开发的webpack都放在config文件夹下)
 *    1、模式改为 production
 *    2、删掉开发中和热模替换
 *    3、有__dirname的路径都要回退一层( 而entry和plugins那些都不用，因为这些是配置，是按运行命令的路径为基础 )
 *    4、命令改为"webpack-dev-server --config ./config/webpack.dev.js"
 *       "webpack --config ./config/webpack.prod.js"
 *
 *
 * https://www.npmjs.com/package/mini-css-extract-plugin 提取css文件 ( 1、按文档位置放，名字加[hash:8]  2、option删 )
 *        3、全部改为url路径: ·output: {加 publicPath: '/'}
 *                           ·把filename的./都去掉，使用url地址
 *                           ·url-load、file-load自己写outputPath: 'image', publicPath: '/media', 覆盖output的publicPath
 *        outputPath: 输出路径
 *        publicPath: 寻址路径
 *        filename: 跟在寻址路径后面
 *        服务器运行: 安装:npm i serve -g  使用: serve -s build
 *
 * https://www.webpackjs.com/loaders/postcss-loader/ 加前缀 (兼容代码)( 1、选完整option那个，按文档放css-loader下面   2、加package.json配置)
 *
 * https://www.npmjs.com/package/optimize-css-assets-webpack-plugin 压缩css代码    ```ExtractTextPlugin不加, 正则改成css结尾```
 *
 * HTML压缩，用之前的html-webpack-plugin  创建HTML的时候就压缩( 这配置点进去详细就可以找到 ) ( 加配置minify:{collapseWhitespace: true, removeComments: true,})
 *
 * https://www.npmjs.com/package/img-loader 压缩图片(选第二个，放url-loader下面)
 *
 */



module.exports = {
  entry: './src/js/index.js',
  output: {
    path: resolve(__dirname, '../build'),
    publicPath: '/',
    filename: 'js/build.js'
  },
  module: {
    rules:[
      {
        test: /\.less$/,
        // 多个loader -- use:[]
        // 一个loader -- use:{}或不用use
        // loader没配置 -- use:["eslint-loader"]
        use: [{
          loader: MiniCssExtractPlugin.loader,
        }, {
          loader: "css-loader" // translates CSS to JS strings into CommonJS
        }, {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: (loader) => [
              require('postcss-import')({ root: loader.resourcePath }),
              require('postcss-cssnext')(),
              // require('autoprefixer')(),
              require('cssnano')()
            ]
          }
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
              outputPath: 'image',
              publicPath: '/image',
              name: '[hash:8].[ext]'
            }
          },
          {
            loader: 'img-loader',
            options: {
              plugins: [
                require('imagemin-gifsicle')({
                  interlaced: false
                }),
                require('imagemin-mozjpeg')({
                  progressive: true,
                  arithmetic: false
                }),
                require('imagemin-pngquant')({
                  floyd: 0.5,
                  speed: 2
                }),
                require('imagemin-svgo')({
                  plugins: [
                    { removeTitle: true },
                    { convertPathData: false }
                  ]
                })
              ]
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
              publicPath: '/media',
              name: '[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css',
      chunkFilename: '[id].[hash:8].css',
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    })
  ],

  mode: 'production'
};

/**
 * entry: 脚手架的入口文件
 * output: {
 *    path:绝对路径,Loader的输出路径都是以这个为基础
 *    filename:filename js文件输出路径和名字
 * }
 * module: {
 *    rules: [  // 下包 --- 开发环境(-D)，不指定版本
 *
 *        // 解析js (第五步使用html-webpack-plugin才会开始自动引入js)
 *       { https://www.webpackjs.com/loaders/less-loader/ 处理less},
 *       { https://www.webpackjs.com/loaders/url-loader/ 处理less图片( 加option:{ publicPath: 打包后图片寻址路径(开发时理解为less路径+publicPath，生产打包时publicPath改为url地址，不受less路径影响), outputPath: 图片输出路径, name: '[hash:8].[ext]重命名'})}
 *       { https://www.npmjs.com/package/eslint-loader/ 语法检测( paskage.json加eslint配置 )}
 *       { https://www.webpackjs.com/loaders/babel-loader/ ES6语法转换
 *
 *        // 解析HTML(图片名字)
 *       { https://www.webpackjs.com/loaders/html-loader/ 处理HTML里图片名字,option可删}
 *
 *       // 其他文件(复制一份)
 *       { https://www.webpackjs.com/loaders/file-loader/ 处理其他文件,eot|svg|ttf|woff|mp3|mp4}
 *
 *    ]
 * }
 * plugins:[
 *   https://www.webpackjs.com/plugins/html-webpack-plugin/ 以xx模板创建HTML文件，自动引入打包后的js (不能解析html的图片名字，结合html-loader使用),
 * ]
 *
 * devServer: {
 *      https://www.webpackjs.com/configuration/dev-server/ 开发中( 改resolve()，加open:tru，运行出错该路径 )
 *      https://www.webpackjs.com/guides/hot-module-replacement/ 热模替换( 网页变化模块自动刷新 )(加入口文件index.html,不然html改变不自动刷新)
 * }
 *
 * mode: 模式
 *
 */