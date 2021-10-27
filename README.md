一、 关于 Webpack 的面试题

1. Webpack 配置中用过哪些 Loader ？都有什么作用？
2. Webpack 配置中用过哪些 Plugin ？都有什么作用？
3. Loader 和 Plugin 有什么区别？
4. 如何编写 Loader ? 介绍一下思路？
5. 如何编写 Plugin ? 介绍一下思路？
6. Webpack optimize 有配置过吗？可以简单说说吗？
7. Webpack 层面如何性能优化？
8. Webpack 打包流程是怎样的？
9. tree-shaking 实现原理是怎样的？
10. Webpack 热更新（HMR）是如何实现？
11. Webpack 打包中 Babel 插件是如何工作的？
12. Webpack 和 Rollup 有什么相同点与不同点？
13. Webpack5 更新了哪些新特性？

二、 学习 Webpack 的知识体系

![webpack 知识体系](/images/webpack.awebp)

三、 Webpack 基础

> 需要掌握:
>
> 1. Webpack 常规配置项有哪些？
> 2. 常用 Loader 有哪些？如何配置？
> 3. 常用插件（Plugin）有哪些？如何的配置？
> 4. Babel 的如何配置？Babel 插件如何使用？

1. 安装

```shell
$ npm install webpack webpack-cli -D # 安装到本地依赖
```

2. 工作模式

> 模式: 供 mode 配置选项,  告知 webpack 使用相应模式的内置优化,  默认值为 production, 另外还有 development、none。
>
> development: 开发模式, 打包更加快速, 省了代码优化步骤
> production: 生产模式, 打包比较慢, 会开启 tree-shaking 和压缩代码
> none: 不使用任何默认优化选项

- 只需在配置对象中提供 mode 选项：

  ```js
  module.exports = {
    mode: 'development',
  };
  ```

- 从 cli 参数中传递

  ```shell
  $ webpack --mode=development
  ```

3. 配置文件

- 根路径下新建一个配置文件 webpack.config.js
- 新增基本配置信息

  ```js
  const path = require('path');

  module.exports = {
    mode: 'development', // 模式
    entry: './src/index.js', // 打包入口地址
    output: {
      filename: 'bundle.js', // 输入文件名
      path: path.join(__dirname, 'dist'), // 输出文件目录
    },
  };
  ```

  4. Loader

  > webpack 默认支持处理 js 文件，其他类型都处理不了，这里必须借助 Loader 来对不同类型的文件的进行处理。
  > Loader 就是将 Webpack 不认识的内容转化为认识的内容

  - 安装 css-loader 处理 css

  ```shell
  npm install css-loader -D
  ```

  - 配置资源加载模块

  ```js
  const path = require('paht');
  module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.join(__dirname, 'dist'),
    },
    module: {
      // 转换规则
      rules: [
        {
          // 匹配所有css文件
          test: /.css$/,
          // use: 对应的loader名称
          use: 'css-loader',
        },
      ],
    },
  };
  ```

  5. 插件(plugin)

  > 与 loader 用于转换特定类型的文件不同, 插件可以贯穿 webpack 打包的生命周期, 执行不同的任务
  > ·

  - html-webpack-plugin: 打包后的资源文件, 例如 js 或者 css 文件可以自动引入到 html 中

    - 安装

      ```shell
      npm install html-webpack-plugin -D
      ```

    - 配置插件

      ```js
      const path = require('path');
      const HtmlWebpackPlugin = require('html-webpack-plugin');

      module.exports = {
        mode: 'development',
        entry: './src/index.js',
        output: {
          filename: 'bundle.js',
          path: path.join(__dirname, 'dist'),
        },
        modules: {
          rules: [
            {
              test: /.css$/,
              use: 'css-loader',
            },
          ],
        },
        // 配置插件
        plugin: [
          new HtmlWebpackPlugin({
            template: './index.html',
          }),
        ],
      };
      ```

  - clean-webpack-plugin: 每次打包的时候，打包目录都会遗留上次打包的文件，为了保持打包目录的纯净，我们需要在打包前将打包目录清空

    - 安装

    ```shell
    npm install clean-webpack-plugin -D
    ```

    - 配置

    ```js
    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const { CleanWebpackPlugin } = require('clean-webpack-plugin');

    module.exports = {
      // ....
      plugins: [
        // 配置插件
        new HtmlWebpackPlugin({
          template: './index.html',
        }),
        // 引入插件
        new CleanWebpackPlugin(),
      ],
    };
    ```

  6. 区分环境

  - 本地开发和部署线上, 肯定是有不同的需求

    - 本地环境

      - 需要更快的构建速度
      - 需要打印 debug 信息
      - 需要 live reload 或 hot reload 功能
      - 需要 sourcemap 方便定位问题

    - 生产环境

      - 需要更小的包体积，代码压缩+tree-shaking
      - 需要进行代码分割
      - 需要压缩图片体积

  - 做好环境的区分

    - 安装 cross-env

      ```shell
      npm install cross-env -D
      ```

    - 配置启动命令(package.json)

      ```json
      "scripts": {
        "dev": "cross-env NODE_ENV=dev webpack serve --mode development",
        "test": "cross-env NODE_ENV=test webpack --mode production",
        "build": "cross-env NODE_ENV=prod webpack --mode production"
      }
      ```

    - 在 webpack 配置文件中获取环境变量

      ```js
      const path = require('paht');
      const HtmlWebpackPlugin = require('html-webpack-plugin');

      console.log(process.env.NODE_ENV); // 打印环境变量

      const config = {
        entry: './src/index.js',

        output: {
          filename: 'bundle.js',
          path: path.join(__dirname, 'dist'),
        },
        module: {
          rules: [
            {
              test: /.css$/,
              use: 'css-loader',
            },
          ],
        },
        plugins: [
          new HtmlWebpackPlugin({
            template: './index.html',
          }),
        ],
      };

      module.exports = (env, argv) => {
        // 打印mode值
        console.log('argv.mode=', argv.mode);
        return config;
      };
      ```

    7. 启动 devServer

    - 安装 webpack-dev-server

      ```shell
      npm install webpack-dev-server -D
      ```

    - 配置本地服务

      ```js
      const config = {
        //...
        devServer: {
          // 静态文件目录
          contentBase: path.resolve(__dirname, 'public'),
          // webpack5 contentBase用不了需要使用 static: { directory: path.join(__dirname, 'public') },
          // 是否开启gzip压缩
          compress: true
          // 端口号
          port: 8080,
          // 是否自动打开浏览器
          open: true
        },
      };
      module.exports = (env, argv) => {
        // 打印 mode(模式) 值
        console.log('argv.mode=',argv.mode)
        // 这里可以通过不同的模式修改 config 配置
        return config;
      }
      ```

    > 为什么要配置 contentBase
    > 因为 webpack 在进行打包的时候，对静态文件的处理，例如图片，都是直接 copy 到 dist 目录下面。但是对于本地开发来说，这个过程太费时，也没有必要，所以在设置 contentBase 之后，就直接到对应的静态目录下面去读取文件，而不需对文件做任何移动，节省了时间和性能开销。

    8. 引入 CSS

    > 单靠 css-loader 是没有办法将样式加载到页面上。
    > style-loader 就是将处理好的 css 通过 style 标签的形式添加到页面上

    - 安装 style-loader

      ```shell
      npm install style-loader -D
      ```

    - 配置 Loader

      ```js
      const config = {
        // ...
        module: {
          rules: [
            {
              test: /.css$/, // 匹配所有css文件
              use: ['style-loader', 'css-loader'],
            },
          ],
        },
      };
      ```

      > 注意: Loader 的执行顺序是固定从后往前，即按 css-loader --> style-loader 的顺序执行

    - style-loader 核心逻辑: 通过动态添加 style 标签的方式，将样式引入页面

      ```js
      const content = `${样式内容}`;
      const style = document.createElement('style');
      style.innerHTML = content;
      document.head.appendChild(style);
      ```

    9. CSS 兼容性

    > 使用 postcss-loader，自动添加 CSS3 部分属性的浏览器前缀

    - 安装

    ```shell
    # 参考官方文档会报错
    npm install postcss-loader postcss -D
    # 正确的打开方式
    npm install postcss postcss-loader postcss-preset-env -D
    ```

    - 配置 webpack.config.js

    ```js
    const config = {
      // ...
      module: {
        rules: [
          {
            test: /.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader'],
          },
        ],
      },
    };
    ```

    - 创建 postcss 配置文件 postcss.config.js

    ```js
    module.exports = {
      plugins: [require('postcss-preset-env')],
    };
    ```

    - 创建 postcss-preset-env 配置文件 .browserslistrc

    ```yaml
    # 换行相当于 and
    last 2 versions # 回退两个浏览器版本
    > 0.5% # 全球超过0.5%人使用的浏览器，可以通过 caniuse.com 查看不同浏览器不同版本占有率
    IE 10 # 兼容IE 10
    ```

    10. 引入 Less 或者 Sass

    > less 和 sass 同样是 webpack 无法识别的, 需要使用对应的 loader 来处理
    > less: less-loader
    > sass: sass-loader、node-sass or dart-sass

    - 安装

    ```shell
    npm install sass-loader -D
    # 淘宝镜像
    npm i node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
    ```

    - 配置

    ```js
    const config = {
      // ...
      module: {
        rules: [
          {
            test: /.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
          },
        ],
      },
    };
    ```

    11. 分离样式文件

    > 希望可以通过 CSS 文件的形式引入到页面上

    - 安装 mini-css-extract-plugin

    ```shell
    npm install mini-css-extract-plugin
    ```

    - 配置

    ```js
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');

    const config = {
      // ...
      module: {
        rules: [
          // ...
          {
            test: /\.(s[ac]|c)ss$/i, //匹配所有的 sass/scss/css 文件
            use: [
              // 'style-loader',
              MiniCssExtractPlugin.loader, // 添加 loader
              'css-loader',
              'postcss-loader',
              'sass-loader',
            ],
          },
        ],
      },
      plugins: [
        // ...
        new MiniCssExtractPlugin({
          // 添加插件
          filename: '[name].[hash:8].css',
        }),
      ],
    };
    ```

    12. 图片和字体文件

    > webpack5 不能使用 file-loader、url-loader
    > webpack 无法识别图片文件, 需要打包的时候处理一下
    > 常用的处理图片文件的 Loader 包含:
    > file-loader: 解决图片引入问题, 并将图片 copy 到指定目录, 默认为 dist
    > url-loader: 依赖 file-loader, 当图片小于 limit 值的时候, 会将图片转为 base64 编码, 大于 limit 值的时候依然是使用 file-loader 进行拷贝
    > img-loader: 压缩图片

    - file-loader

      - 安装

      ```shell
      npm install file-loader -D
      ```

      - 修改配置

      ```js
      const config = {
        // ...
        modules: {
          rules: [
            {
              // ...
            },
            {
              // 匹配图片文件
              test: /\.(jpe?g|png|gif|awebp)$/i,
              // 使用 file-loader
              // use: ['file-loader'],
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    name: '[name][hash:8].[ext]',
                  },
                },
              ],
            },
            {
              loader: 'file-loader',
              options: {
                name: '[name][hash:8].[ext]',
              },
            },
          ],
        },
      };
      ```

    - url-loader

      - 安装

      ```shell
      npm install url-loader -D
      ```

      - 配置 url-loader

      ```js
      const config = {
        //...
        module: {
          rules: [
            {
              // ...
            },
            {
              test: /\.(jpe?g|png|gif)$/i,
              use: [
                {
                  loader: 'url-loader',
                  options: {
                    name: '[name][hash:8].[ext]',
                    // 文件小于 50k 会转换为 base64，大于则拷贝文件
                    limit: 50 * 1024,
                  },
                },
              ],
            },
          ],
        },
        // ...
      };
      ```

    - 配置字体图标

      ```js
      const config = {
        // ...
        {
          // 匹配字体文件
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$)/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                // 体积大于 10KB 打包到 fonts 目录下
                name: 'fonts/[name][hash:8].[ext]',
                limit: 10 * 1024
              }
            }
          ]
        }
      }
      ```

    13. 资源模块使用

    > webpack5 新增资源模块(asset module)，允许使用资源文件（字体，图标等）而无需配置额外的 loader。

    > 资源模块支持以下四个配置：
    >
    > 1. asset/resource 将资源分割为单独的文件，并导出 url，类似之前的 file-loader 的功能.
    > 2. asset/inline 将资源导出为 dataUrl 的形式，类似之前的 url-loader 的小于 limit 参数时功能.
    > 3. asset/source 将资源导出为源码（source code）. 类似的 raw-loader 功能
    > 4. asset 会根据文件大小来选择使用哪种类型，当文件小于 8 KB（默认） 的时候会使用 asset/inline，否则会使用 asset/resource

    ```js
    const config = {
      // ...
      module: {
        rules: [
          // ...
          {
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
        ],
      },
      // ...
    };
    module.exports = (env, argv) => {
      console.log('argv.mode=', argv.mode); // 打印 mode(模式) 值
      // 这里可以通过不同的模式修改 config 配置
      return config;
    };
    ```

  14. js 兼容性(Babel)

  > 在开发中我们想使用最新的 Js 特性，但是有些新特性的浏览器支持并不是很好，所以 Js 也需要做兼容处理，常见的就是将 ES6 语法转化为 ES5。

  - 安装 Babel

  ```shell
  npm install babel-loader @babel-core @babel/preset-env -D
  ```

      - babel-loader 使用 Babel 加载 ES2015+ 代码并将其转换为 ES5
      - @babel/core Babel 编译的核心包
      - @babel/preset-env Babel 编译的预设，可以理解为 Babel 插件的超集

  - 配置 Babel 预设

  ```js
  const config = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.join(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.js$/i,
          use: [
            {
              loader: 'babel-loader',
              options: {
                preset: ['@babel/preset-env'],
              },
            },
          ],
        },
      ],
    },
  };
  ```

  - 为了避免 webpack.config.js 太臃肿, 建议将 Babel 配置文件提取出来

  ```js
  // 根目录新增 .babelrc.js
  module.exports = {
    presets: [
      [
        '@babel/preset-env',
        {
          // useBuiltIns: false; 默认值, 无视浏览器兼容配置, 引入所有polyfill
          // useBuildIns: entry; 根据配置的浏览器兼容, 引入浏览器不兼容的polyfill
          // useBuildIns: usage; 会根据配置的浏览器兼容, 以及你代码中用到API来进行polyfill, 实现了按需添加
          useBuildIns: 'entry',
          corejs: '3.9.1',
          target: {
            chrome: '58',
            ie: '11',
          },
        },
      ],
    ],
  };
  ```

  - 常见 Babel 插件

    - @babel/preset-flow
    - @babel/preset-react
    - @babel/preset-typescript

  - 配置 Babel 插件

    对于正在提案中, 还未进入 ECMA 规范中的新特性, Babel 是无法进行处理的, 必须要安装对应的插件

    - @babel/plugin-proposal-decorators
    - @babel/plugin-proposal-class-properties

    - 安装

    ```shell
    npm install babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D
    ```

    ```js
    // 对应新增装饰器的使用 .babelrc.js
    module.exports = {
      presets: [
        '@babel/preset-env',
        {
          useBuildIns: 'entry',
          corejs: '3.9.1',
          target: {
            chrome: '58',
            ie: '11',
          },
        },
      ],
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
      ],
    };
    ```
