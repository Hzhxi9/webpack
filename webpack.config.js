const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

console.log('process.env.NODE_ENV=', process.env.NODE_ENV); // 打印环境变量

const config = {
  // 打包入口地址
  entry: './src/index.js',

  // 打包输入地址
  output: {
    // 输出文件名
    filename: 'bundle.js',
    // 输出文件目录
    path: path.join(__dirname, 'dist'),
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
    port: 8086,
    // 是否自动打开浏览器
    open: true,
  },
  // 配置loader
  module: {
    rules: [
      {
        // 匹配所有的css文件
        // test: /.css$/,

        // 匹配所有的sass/scss/css文件
        test: /\.(s[ac]|c)ss$/i,
        // use: 对应的loader名称
        // Loader 的执行顺序是固定从后往前，即按 css-loader --> style-loader 的顺序执行
        // postcss-loader: 自动添加 CSS3 部分属性的浏览器前缀
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  // 配置插件
  plugins: [
    // 编译html文件, 自动的引入了打包好的 bundle.js
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    // 打包前将打包目录清空
    new CleanWebpackPlugin(),
  ],
};

module.exports = (env, argv) => {
  // 打印 mode(模式) 值
  console.log('argv=', argv.mode);
  // 这里可以通过不同的模式修改 config 配置
  return config;
};
