// Libs
import aos from 'aos';
import lazy from 'vanilla-lazyload';

// components
import header from './components/header/header';
import mobileMenu from './components/mobile-menu/mobile-menu';
import about from './components/about/about';
import main from './components/main/main';
import articles from './components/articles/articles';

// styles
import './index.scss';

// helpers
import getSvg from './common/js/getSvg';
import smoothScroll from './common/js/smoothScroll';

getSvg(require.context('./assets/', true, /\.svg$/));
smoothScroll();

document.addEventListener('DOMContentLoaded', () => {
  header();
  mobileMenu();
  about();
  main();
  articles();
  // Libs
  aos.init({
    disable: 'phone',
  });
  const lazyInstance = new lazy({
    threshold: -50,
  });
});
