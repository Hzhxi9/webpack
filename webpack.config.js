const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');

const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin');
const glob = require('glob'); // 文件匹配模式

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// 费时分析(在 webpack5.x 中为了使用费时分析去对插件进行降级或者修改配置写法是非常不划算的)
const smp = new SpeedMeasurePlugin();

/**路径处理方法 */
function resolve(dir) {
  return path.join(__dirname, dir);
}

const PATHS = {
  src: resolve('src'),
};

console.log('process.env.NODE_ENV=', process.env.NODE_ENV); // 打印环境变量

const config = {
  // 打包入口地址
  entry: './index.js',

  // 打包输入地址
  output: {
    // 输出文件名
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    // 输出文件目录
    path: path.join(__dirname, './dist'),
    clean: true,
    // publicPath: './'
  },

  // 配置 sourceMap
  devtool: 'source-map',

  // resolve 优化配置
  resolve: {
    // 配置别名
    alias: {
      '~': resolve('src'),
      '@': resolve('src'),
      components: resolve('src/components'),
    },
    /**
     * 配置文件后缀名, 引入文件可以不带扩展名
     * webpack 会按照 extensions 配置的数组从左到右的顺序去尝试解析模块
     * 需要注意:
     *  1. 高频文件后缀名放前面；
     *  2. 手动配置后，默认配置会被覆盖
     *  3. 如果想保留默认配置，可以用 ... 扩展运算符代表默认配置
     */
    extensions: ['.js', '.ts', '.tsx', '.json', '.wasm', '...'],

    /**
     * 告诉 webpack 解析模块时应该搜索的目录
     * 优先 src 目录下查找需要解析的文件，会大大节省查找时间
     */
    modules: [resolve('src'), 'node_modules'],
  },

  // 配置devServer
  devServer: {
    // 静态文件目录
    static: {
      directory: path.join(__dirname, 'public'),
    },
    // 是否启动压缩gzip
    compress: true,
    // 端口号
    port: 8093,
    // 是否自动打开浏览器
    open: true,
    // 热更新
    hot: true,
  },
  /**
   * cache 持久化缓存
   * 通过配置 cache 缓存生成的 webpack 模块和 chunk，来改善构建速度。
   */
  cache: {
    type: 'filesystem',
  },

  optimization: {
    minimize: true,
    minimizer: [
      // 添加css压缩配置
      new OptimizeCssAssetsPlugin({}),
      // 压缩js
      new TerserPlugin({}),
    ],
    /**
     * 为运行时代码创建一个额外的 chunk，减少 entry chunk 体积，提高性能
     */
    runtimeChunk: true,
    // splitChunks 分包配置
    splitChunks: {
      cacheGroups: {
        // 配置提取模块的方案
        default: false,
        styles: {
          name: 'styles',
          test: /\.(s?css|less|sass)$/,
          chunks: 'all',
          enforce: true,
          priority: 10,
        },
        common: {
          name: 'chunk-common',
          chunks: 'all', // 有效值为 `all`，`async` 和 `initial`
          minChunks: 2, // 拆分前必须共享模块的最小 chunks 数。
          maxInitialRequests: 5, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件）
          minSize: 0, // 生成 chunk 的最小体积（≈ 20kb)
          priority: 1,
          enforce: true,
          reuseExistingChunk: true,
        },
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 2,
          enforce: true,
          reuseExistingChunk: true,
        },
      },
    },
  },

  // 配置loader
  module: {
    /**
     * 如果项目不使用 symlinks（例如 npm link 或者 yarn link），
     * 可以设置 resolve.symlinks: false，减少解析工作量。
     */
    // symlinks: false,
    /**
     * 不需要解析依赖的第三方大型类库等，可以通过这个字段进行配置，以提高构建速度
     * 使用 noParse 进行忽略的模块文件中不会解析 import、require 等语法
     */
    noParse: /jquery|lodash/,
    rules: [
      {
        // 匹配所有的css文件
        // test: /.css$/,

        // 匹配所有的sass/scss/css文件
        test: /\.(s[ac]|c)ss$/i,
        // use: 对应的loader名称
        // Loader 的执行顺序是固定从后往前，即按 css-loader --> style-loader 的顺序执行
        // postcss-loader: 自动添加 CSS3 部分属性的浏览器前缀
        // use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          // 缓存一些性能开销比较大的 loader 的处理结果
          'cache-loader',
          // 添加 loader
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        /**webpack5 内置了资源处理模块，file-loader 和 url-loader 都可以不用安装 */
        test: /\.(jpe?g|png|gif)$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          // [ext] 自带 "." 这个与 url-loader 配置不同
          filename: '[name][hash:8][ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024, //超过50kb不转 base64
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          filename: '[name][hash:8][ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 超过100kb不转 base64
          },
        },
      },
      {
        // 配置js兼容性 babel
        test: /\.js$/i,
        // 缩小范围
        // 符合条件的模块进行解析
        include: [resolve('src'), resolve('index.js')],
        // 排除符合条件的模块，不解析(优先级高)
        exclude: /node_modules/,
        use: [
          {
            // 开启多进场打包
            loader: 'thread-loader',
            options: {
              worker: 3,
            },
          },
          {
            // babel-loader 开启缓存
            loader: 'babel-loader',
            options: {
              // 启用缓存
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // 只进行语法转换,不进行类型校验,提高构建速度
              // 指定特定的ts编译配置，为了区分脚本的ts配置
              configFile: path.resolve(__dirname, './tsconfig.json')
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  // 配置插件
  plugins: [
    // 编译进度条, 包含内容、进度条、进度百分比、消耗时间
    new ProgressBarPlugin({
      format: `:msg [:bar] ${chalk.green.bold(':percent')}(:elapsed s)`,
    }),
    // 编译html文件, 自动的引入了打包好的 bundle.js
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    // 分离样式文件
    new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css',
    }),
    // 打包前将打包目录清空
    new CleanWebpackPlugin(),
    /**
     * 目的是将插件中的非中文语音排除掉，这样就可以大大节省打包的体积了
     * 防止在 import 或 require 调用时，生成以下正则表达式匹配的模块：
     *    requestRegExp 匹配(test)资源请求路径的正则表达式。
     *    requestRegExp 匹配(test)资源请求路径的正则表达式。
     */
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    /**构建结果分析 */
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
      generateStatsFile: true, // 是否生成stats.json文件
    }),
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css)$/,
      threshold: 102400, // 对10K以上的数据进行压缩
      minRatio: 0.8, // 只有压缩率比这个值小的资源才会被处理
      deleteOriginalAssets: false, // 是否删除源文件
    }),
    /**使用插件进行类型校验 */
    // new ForkTsCheckerWebpackPlugin(),
    // 清除无用的 CSS
    // new PurgecssWebpackPlugin({
    //   paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    // }),
  ],
};

module.exports = (env, argv) => {
  // 打印 mode(模式) 值
  console.log('argv=', argv.mode);
  // 这里可以通过不同的模式修改 config 配置
  return smp.wrap(config);
};
