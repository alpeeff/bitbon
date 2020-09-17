import isDesktop from '../../../common/js/isDesktop';

import gsap from 'gsap';
import { Power0 } from 'gsap/gsap-core';

const offset = -100;

const observeInSection = (section) => {
  if (!!section) {
    const { top, height } = section.getBoundingClientRect();
    const itemStart = top + window.pageYOffset + offset - 10;
    const itemEnd = top + height + window.pageYOffset + offset - 10;
    return window.pageYOffset >= itemStart && window.pageYOffset < itemEnd;
  }
};

const desktopMenu = () => {
  const menu = document.querySelector('.about__menu-wrapper');
  const tm = gsap.timeline({
    paused: true,
  });
  tm.from('.about__menu-wrapper', {
    x: -100,
    opacity: 0,
    duration: 0.15,
    ease: Power0.easeIn(1),
  });
  return {
    show: () => tm.play(),
    hide: () => tm.reverse(),
    menu,
  };
};

const mobileMenu = () => {
  const menu = document.querySelector('.about__menu-wrapper');
  return {
    show: () => {
      if (menu) {
        menu.classList.add('active');
      }
    },
    hide: () => {
      if (menu) {
        menu.classList.remove('active');
      }
    },
    menu,
  };
};

function positionateMenu(menu) {
  let content = document.querySelector('.about__section');
  if (content) {
    content = content.querySelector('.about__content');
  }

  const timeout = window.setTimeout(() => {
    const {
      height: menuHeight,
      width: menuWidth,
    } = menu.getBoundingClientRect();
    let { left } = content.getBoundingClientRect();
    let x = left - menuWidth / 2 - 20;
    menu.style.top = `calc(50% - ${menuHeight / 2}px)`;
    menu.style.left = `${x}px`;
    window.clearTimeout(timeout);
  }, 1000);
}

const renderMenu = (menuHtml, menuTemplate, sections) => {
  let openBtn = document.querySelector('.about__menu-btn');
  let closeBtn = document.querySelector('.about__menu-close');
  let is = isDesktop();

  let { menu, hide, show } = isDesktop() ? desktopMenu() : mobileMenu();
  let positionate = null;

  let list = [];

  sections.forEach((item) => {
    let sectionName = item.querySelector('.about__heading');
    if (sectionName) {
      sectionName = sectionName.textContent.toLowerCase();
      sectionName = sectionName.replace(
        sectionName[0],
        sectionName[0].toUpperCase()
      );
    }

    const listItem = document.createElement('li');
    listItem.classList.add('about__menu-item');
    listItem.textContent = sectionName;
    listItem.setAttribute(
      'data-section-name',
      item.getAttribute('data-section-name')
    );
    list.push(listItem);
  });

  const renderList = () => {
    const node = menu.querySelector('.about__menu-list') || null;
    if (node) {
      node.innerHTML = '';
      list.forEach((item) => node.append(item));
    }
  };

  const onListItemClick = (event) => {
    const listItem = list.filter((item) => event.path.includes(item))[0];
    if (listItem) {
      const name = listItem.getAttribute('data-section-name');
      const to =
        sections.filter(
          (section) => section.getAttribute('data-section-name') === name
        )[0] || null;
      if (is) {
        window.smoothScrollTo(
          0,
          to.getBoundingClientRect().top + window.pageYOffset + offset,
          400
        );
      } else {
        hide();
        const timeout = window.setTimeout(() => {
          window.smoothScrollTo(
            0,
            to.getBoundingClientRect().top + window.pageYOffset + offset,
            400
          );
          window.clearTimeout(timeout);
        }, 400);
      }
    }
  };

  const changeAnchors = () => {
    sections.forEach((item) => {
      if (observeInSection(item)) {
        const name = item.getAttribute('data-section-name');
        if (list.length) {
          const toMarkActive = list.filter(
            (listItem) => listItem.getAttribute('data-section-name') === name
          )[0];
          list.forEach((listItem) => {
            listItem.classList.remove('active');
          });
          toMarkActive.classList.add('active');
        }
      }
    });
  };

  const controlDesktopMenu = () => {
    if (pageYOffset > sections[0].getBoundingClientRect().top + pageYOffset) {
      show();
    } else {
      hide();
    }
  };

  // Обновить методы управления меню: Comp or Mobile
  const updateMenuVariant = () => {
    const tmp = isDesktop() ? desktopMenu() : mobileMenu();
    menu = tmp.menu;
    show = tmp.show;
    hide = tmp.hide;
  };

  const render = () => {
    const newIs = isDesktop();
    // Если предидущее значение !== новому, то выполняем блок кода
    if (newIs !== is) {
      // Очищаем меню и вставляем шаблон
      menuHtml.innerHTML = '';
      menuHtml.innerHTML = menuTemplate;
      // Если была мобилка, а сейчас стал комп
      if (is !== newIs && newIs) {
        // Удаляем старые слушатели
        openBtn.removeEventListener('click', show);
        closeBtn.removeEventListener('click', hide);
        // Получаем новые кнопки, т.к. старые были удалены
        openBtn = document.querySelector('.about__menu-btn');
        closeBtn = document.querySelector('.about__menu-close');
        // Получаем новые методы меню
        updateMenuVariant();
        window.addEventListener('scroll', controlDesktopMenu);
        // Для компа нужно позиционировать меню рядом с контентом
        positionate = positionateMenu.bind(null, menu);
        positionate();
        window.addEventListener('resize', positionate);
      } else {
        window.removeEventListener('scroll', controlDesktopMenu);

        // Получаем новые методы меню
        updateMenuVariant();
        // Получаем новые кнопки
        openBtn = document.querySelector('.about__menu-btn');
        closeBtn = document.querySelector('.about__menu-close');
        // Привязываем слушателей
        openBtn.addEventListener('click', show);
        closeBtn.addEventListener('click', hide);
        window.removeEventListener('click', positionate);
        positionate = null;
      }
      is = newIs;
    }

    renderList();
    return {
      hide,
      show,
      render,
      menu,
    };
  };

  if (!is) {
    openBtn.addEventListener('click', show);
    closeBtn.addEventListener('click', hide);
  } else {
    positionate = positionateMenu.bind(null, menu);
    positionate();
    controlDesktopMenu();
    window.addEventListener('scroll', controlDesktopMenu);
    window.addEventListener('resize', positionate);
  }
  renderList();
  document.addEventListener('scroll', changeAnchors);
  document.addEventListener('click', onListItemClick);
  return {
    hide,
    show,
    render,
    menu,
  };
};

export default () => {
  const sections = [...document.querySelectorAll('.about__section')];

  const menu = document.querySelector('.about__menu');
  const menuTemplate = menu ? menu.innerHTML : null;

  if (sections.length && menu && menuTemplate) {
    let manip = renderMenu(menu, menuTemplate, sections);
    let resize = () => {
      manip = manip.render();
    };
    window.addEventListener('resize', resize);
  }
};
