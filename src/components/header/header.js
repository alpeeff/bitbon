export default async () => {
  const header = document.querySelector('.header');
  const nav = document.querySelector('.nav');

  const fixHeader = () => {
    if (window.pageYOffset > 250 && !header.classList.contains('fixed')) {
      header.classList.add('fixed');
      nav.classList.add('white');
    } else if (
      header.classList.contains('fixed') &&
      window.pageYOffset <= 250
    ) {
      header.classList.remove('fixed');
      nav.classList.remove('white');
    }
  };
  const controlHeader = () => {
    if (
      window.outerWidth >= 1200 &&
      document.documentElement.clientWidth >= 1200
    ) {
      document.addEventListener('scroll', fixHeader);
    } else {
      document.removeEventListener('scroll', fixHeader);
      header.classList.remove('fixed');
      nav.classList.remove('white');
    }
  };
  controlHeader();
  window.addEventListener('resize', controlHeader);
};
