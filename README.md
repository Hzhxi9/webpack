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

四、 SourceMap 配置选择

> SourceMap 是一种映射关系，当项目运行后，如果出现错误，我们可以利用 SourceMap 反向定位到源码位置

1. 配置

```js
const config = {
  devtool: 'source-map',
};
```

2. 除了 source-map 这种类之外, 还有很多种类型可以用

   - eval
   - eval-source-map
   - cheap-source-map
   - inline-source-map
   - cheap-module-source-map
   - inline-cheap-source-map
   - cheap-module-eval-source-map
   - inline-cheap-module-source-map
   - hidden-source-map
   - nosources-source-map

3. 配置项的差异

   - eval 模式

     - 生成代码通过 eval 执行
     - 源代码位置通过@sourceURL 注明
     - 无法定位到错误位置
     - 不用生成 SourceMap 文件, 只能定位到某个文件

   - source-map 模式

     - 生成了对应的 SourceMap 文件, 打包速度慢
     - 在源代码中定位到错误所在行列信息

   - eval-source-map 模式

     - 生成代码通过 eval 执行
     - 包含 dataURL 形式的 SourceMap 文件
     - 可以在编译后的代码中定位到错误所在行列信息
     - 生成 dataURL 形式的 SourceMap, 打包速度慢

   - eval-cheap-source-map 模式

     - 生成代码通过 eval 执行
     - 包含 dataURL 形式的 sourceMap 文件
     - 可以在编译后的代码中定位到错误所在行信息
     - 不需要定位列信息, 打包速度较快

   - eval-cheap-module-source-map 模式

     - 生成代码通过 eval 执行
     - 包含 dataURL 形式的 SourceMap 文件
     - 可以在编译后的代码中定位到错误所在行信息
     - 不需要定位列信息, 打包速度较快
     - 在源代码中定位到错误所在行信息

   - inline-source-map 模式

     - 通过 dataURL 的形式引入 sourceMap 文件
     - 余下和 source-map 一样

   - hidden-source-map 模式

     - 看不到 SourceMap 效果, 但是生成了 SourceMap 文件

   - nosource-source-map 模式

     - 能看到错误出现的位置
     - 但是没有办法显示对应的源码

4. 总结

| devtool                      | build | rebuild     | 显示代码 | SourceMap   | 描述           |
| ---------------------------- | ----- | ----------- | -------- | ----------- | -------------- |
| (none)                       | 很快  | 很快        | 无       | 无          | 无法定位错误   |
| eval                         | 快    | 很快(cache) | 编译后   | 无          | 定位到文件     |
| source-map                   | 很慢  | 很慢        | 源代码   | 有          | 定位到行列     |
| eval-source-map              | 很慢  | 一般(cache) | 编译后   | 有(dataURL) | 定位到行列     |
| eval-cheap-source-map        | 一般  | 快(cache)   | 编译后   | 有(dataURL) | 定位到行       |
| eval-cheap-module-source-map | 慢    | 快(cache)   | 源代码   | 有(dataURL) | 定位到行       |
| inline-source-map            | 很慢  | 很慢        | 源代码   | 有(dataURL) | 定位到行列     |
| hidden-source-map            | 很慢  | 很慢        | 源代码   | 有          | 无法定位到错误 |
| nosource-source-map          | 很慢  | 很慢        | 源代码   | 无          | 定位到文件     |

- 对照一下校验规则 `^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$ `分析一下关键字

| 关键字    | 描述                                                    |
| --------- | ------------------------------------------------------- |
| inline    | 代码内通过 dataURL 形式引入 sourceMap                   |
| hidden    | 生成 SourceMap 文件，但不使用                           |
| eval      | eval(...) 形式执行代码, 通过 dataURL 形式引入 SourceMap |
| nosources | 不生成 SourceMap                                        |
| cheap     | 只需要定位行信息, 不需要列信息                          |
| module    | 展示源代码中的错误位置                                  |

5. 推荐配置

- 本地开发

  推荐: eval-cheap-module-source-map

  理由:

      - 本地开发首次打包慢点没关系，因为 eval 缓存的原因，rebuild 会很快
      - 开发中，我们每行代码不会写的太长，只需要定位到行就行，所以加上 cheap
      - 我们希望能够找到源代码的错误，而不是打包后的，所以需要加上 modele

- 生产环境

  推荐: (none)

  理由:

      - 就是不想别人看到我的源代码

五、 三种 hash 值

> Webpack 文件指纹策略是将文件名后面加上 hash 值
> 特别在使用 CDN 的时候，缓存是它的特点与优势，但如果打包的文件名，没有 hash 后缀的话，你肯定会被缓存折磨的够呛

例如在基础配置中用到的 `filename: "[name][hash:8][ext]"`

这里里面[]包起来的, 就叫占位。

| 占位符      | 解释                       |
| ----------- | -------------------------- |
| ext         | 文件后缀名                 |
| name        | 文件名                     |
| path        | 文件相对路径               |
| folder      | 文件所在文件夹             |
| hash        | 每次构建生成的唯一 hash 值 |
| chunkhash   | 根据 chunk 生成的 hash 值  |
| contenthash | 根据文件内容生成的 hash 值 |

- 关于 hash、chunkhash、contenthash

  - hash: 任何一个文件改动，整个项目的构建 hash 值都会改变
  - chunkhash: 文件的改动只会影响其所在 chunk 的 hash 值
  - contenthash: 每个文件都有单独的 hash 值, 文件的改动之后影响自身的 hash 值

六、 Webpack 进阶

1. 优化构建速度

- 构建费时分析(插件: speed-measure-webpack-plugin)

  ```shell
  npm install speed-measure-webpack-plugin -D
  ```

  ```js
  // 费时分析
  const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
  const smp = new SpeedMeasurePlugin();

  const config = {
    // ...
  };

  module.exports = (env, argv) => {
    return smp.wrap(config);
  };
  ```

  - 使用这个插件的弊端: 有些 Loader 或者 Plugin 新版本会不兼容，需要进行降级处理

  - 解决:

    - mini-css-extract-plugin 进行一下降级处理: ^2.1.0 -> 1.3.6
    - 给配置加上 publicPath: './'

  - **注意: 在 webpack5.x 中为了使用费时分析去对插件进行降级或者修改配置写法是非常不划算的，这里因为演示需要，我后面会继续使用，但是在平时开发中，建议还是不要使用。**

2. 优化 resolve 配置

- alias

  alias 用的创建 import 或 require 的别名，用来简化模块引用，项目中基本都需要进行配置。

  ```js
  const path = require('path');

  // 路径处理方法
  function resolve(dir) {
    return path.join(__dirname, dir);
  }
  const config = {
    // ...
    resolve: {
      // 配置别名
      alias: {
        '~': resolve('src'),
        '@': resolve('src'),
        components: resolve('src/components'),
      },
    },
  };
  ```

  ```js
  // 在项目中
  // 使用 src 别名 ~
  import '~/fonts/iconfont.css';

  // 使用 src 别名 @
  import '@/fonts/iconfont.css';

  // 使用 components 别名
  import footer from 'components/footer';
  ```

- extensions

webpack 默认配置

```js
const config = {
  //...
  resolve: {
    extensions: ['.js', '.json', '.wasm'],
  },
};
```

如果用户引入模块时不带扩展名, 例如

```js
import file from '../path/to/file';
```

那么 webpack 就会按照 extensions 配置的数组从左往右的顺序去尝试解析模块

需要注意:

- 高频文件后缀名放前面
- 手动配置后, 默认配置会被覆盖

如果想暴露默认配置, 可以用`...`扩展运算符代表默认配置, 例如

```js
const config = {
  // ...
  resolve: {
    extensions: ['.ts', '...'],
  },
};
```

- modules

告诉 webpack 解析模块时应该搜索的目录, 常见配置如下:

```js
const path = require('path');

// 路径处理方法
function resolve(dir) {
  return path.join(__dirname, dir);
}

const config = {
  // ...
  resolve: {
    // 告诉 webpack 优先 src 目录下查找需要解析的文件，会大大节省查找时间
    modules: [resolve('src'), 'node_modules'],
  },
};
```

- resolveLoader

  resolveLoader 与上面的 resolve 对象的属性集合相同， 但仅用于解析 webpack 的 loader 包。

  一般情况下保持默认配置就可以了，但如果你有自定义的 Loader 就需要配置一下，不配可能会因为找不到 loader 报错

  - 例如在 loader 文件夹下, 有自定义 loader

    ```js
    const path = require('path');

    // 路径处理方法
    function resolve(dir) {
      return path.join(__dirname, dir);
    }

    const config = {
      // ...
      resolveLoader: {
        modules: ['node_modules', resolve('loader')],
      },
    };
    ```

- externals

> externals 配置选项提供了「从输出的 bundle 中排除依赖」的方法。
> 此功能通常对 library 开发人员来说是最有用的，然而也会有各种各样的应用程序用到它。
> 我们可以用这样的方法来剥离不需要改动的一些依赖，大大节省打包构建的时间。

例如: 从 CDN 引入 jQuery，而不是把它打包

```html
<!-- 引入链接 -->
<script src="https://code.jquery.com/jquery-3.1.0.js" integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk=" crossorigin="anonymous"></script>
```

```js
// 配置externals
const config = {
  // ...
  externals: {
    jquery: 'jQuery',
  },
};
```

```js
// 使用jQuery
import $ from 'jquery';
$('.element').animate(/***/);
```
