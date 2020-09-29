import tippy from 'tippy.js';
import Swiper, { Navigation, Pagination } from 'swiper';

Swiper.use([Navigation, Pagination]);

export default async () => {
  const clickShowBtn = (event) => {
    const btn = event.target.closest('.btn[data-action="show-section"]');
    if (btn) {
      const content = btn.closest('.about__content');
      const hidden = btn.closest('.about__hidden');
      if (content) {
        content.classList.add('active');
      }
      if (hidden) {
        hidden.remove();
      }
    }
  };

  const slider = new Swiper('.swiper-about', {
    // Optional parameters
    loop: true,

    // If we need pagination
    pagination: {
      el: '.swiper-pag',
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-next',
      prevEl: '.swiper-prev',
    },
    speed: 400,
  });

  document.addEventListener('click', clickShowBtn);
  tippy('.tooltip', {
    content(ref) {
      return ref.getAttribute('data-tip');
    },
    theme: 'white',
    interactive: true,
  });
};
