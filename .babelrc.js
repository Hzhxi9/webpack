module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // 配置tree-shaking
        modules: false,
        // useBuiltIns: false 默认值，无视浏览器兼容配置，引入所有 polyfill
        // useBuiltIns: entry 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill
        // useBuiltIns: usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加
        useBuiltIns: 'entry',
        corejs: '3.9.1', // 是 core-js 版本号
        targets: {
          chrome: '58',
          ie: '11',
        },
      },
    ],
  ],
  // 兼容装饰器用法
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
  ],
};
