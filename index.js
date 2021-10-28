import './src/index.css';
import './src/main.scss';

import './assets/fonts/iconfont.css';
import logo from './assets/images/404.png';

const img = new Image();
img.src = logo;

document.getElementById('box').appendChild(img);

// 新增装饰器的使用
@log('hi')
class MyClass {}

function log(text) {
  return function (target) {
    target.prototype.logger = () => `${text}，${target.name}`;
  };
}

const test = new MyClass();
test.logger();

// 按需加载
img.addEventListener('click', () => {
  /**prefetch (预获取)：浏览器空闲的时候进行资源的拉取 */
  import(/*webpackPrefetch: true */ '@/desc').then(({ default: element }) => {
    console.log(element);
    document.body.appendChild(element);
  });
});
