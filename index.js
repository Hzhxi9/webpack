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
