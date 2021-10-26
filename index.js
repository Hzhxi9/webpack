import './src/index.css';
import './src/main.scss';

import logo from './assets/images/404.png';

const img = new Image();
img.src = logo;

document.getElementById('box').appendChild(img);
