import gsap from 'gsap';
import Power1 from 'gsap/EasePack';

export default () => {
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!mobileMenu) return;
  const btnMore = document.querySelector('.mobile-menu__item--state');
  const socialsBlock = document.querySelector('.mobile-menu__social');
  const tm = gsap.timeline({
    paused: true,
  });
  let scrolled = 0;
  // Анимация при появлении мобильного меню
  tm.to('.mobile-menu', {
    y: 80,
    ease: Power1.linear,
  });
  tm.duration(0.15);

  const toggleSocial = (e) => {
    e.preventDefault();
    socialsBlock.classList.toggle('active');
  };

  const fixMobileMenu = () => {
    if (window.pageYOffset > scrolled) {
      mobileMenu.classList.remove('fixed');
      tm.play();
      socialsBlock.classList.remove('active');
    } else {
      mobileMenu.classList.add('fixed');
      tm.reverse();
    }
    scrolled = window.pageYOffset;
  };
  const controlMobileMenu = () => {
    document.removeEventListener('scroll', fixMobileMenu);
    if (
      window.outerWidth < 1200 ||
      document.documentElement.clientWidth < 1200
    ) {
      document.addEventListener('scroll', fixMobileMenu);
    }
  };
  controlMobileMenu();
  window.addEventListener('resize', controlMobileMenu);

  btnMore.addEventListener('click', toggleSocial);
};
