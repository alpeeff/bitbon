import axios from '../../api/axios';
import lazy from 'vanilla-lazyload';

export default () => {
  const target = document.querySelector('.articles__container');
  let instanceLazy = new lazy({
    threshold: 100,
  });
  if (!target) return;
  const state = {
    slug: 'staty',
    page: 1,
    filtersTemplate: null,
    router: {},
    results: [],
  };
  axios({
    url: '/filters',
    params: {
      slug: state.slug,
    },
  })
    .then((res) => {
      const { results } = res.data;
      state.filtersTemplate = results;
      const clone = {};
      results.forEach(({ name }) => {
        clone[name] = false;
      });
      state.router = { ...clone };
      methods.renderFilters();
    })
    .catch(console.error);
  axios({
    url: '/',
    params: {
      slug: state.slug,
      page: state.page,
    },
  }).then((res) => {
    const { results } = res.data;
    state.results = results;
    methods.renderArticles();
  });
  const methods = {
    renderFilters() {
      const container = document.querySelector('.filter__list');
      container.innerHTML = '';
      state.filtersTemplate.forEach((item) => {
        const btn = document.createElement('button');
        btn.classList.add('filter__btn');
        btn.setAttribute('data-filter-name', item.name);
        btn.addEventListener('click', this.onClick);
        btn.innerHTML = `
        <div class="filter__img">
          <img class="filter__img-active" src="https://bitbon.today${item.icon}" alt="">
          <img class="filter__img-inactive" src="https://bitbon.today${item.icon_inactive}" alt="">
        </div>
        <div class="filter__btn-title">${item.title}</div>
        `;
        container.append(btn);
      });
    },
    getFilters() {
      return Object.keys(state.router)
        .filter((key) => state.router[key])
        .join(',');
    },
    fetching() {
      console.log(this.getFilters());
      return axios({
        url: '/',
        params: {
          slug: state.slug,
          page: state.page,
          filters: this.getFilters() ? this.getFilters() : null,
        },
      });
    },
    onClick(event) {
      const target = event.target.closest('.filter__btn');
      if (!target) return;
      const name = target.getAttribute('data-filter-name');
      state.router[name] = !state.router[name];
      if (state.router[name]) {
        target.classList.add('active');
      } else {
        target.classList.remove('active');
      }
      methods.fetching().then((res) => console.log(res.data));
    },
    renderArticles() {
      const container = document.querySelector('.card__list');
      state.results.forEach((item) => {
        const card = document.createElement('div');
        card.classList.add('card__wrapper');
        card.innerHTML = `
          <a href="https://bitbon.today${
            item.link
          }" class="card card--article ex">
            <div class="card__img">
              <img class="lazy" data-src="https://bitbon.today${
                item.image
              }" alt="alt">
              <div class="card__filters">
                ${item.filters.map((filter) => {
                  return `
                    <div class="card__filters-item">
                      <img src="https://bitbon.today${filter.icon}">
                    </div>
                  `;
                })}
              </div>
              <div class="card__views">
                <svg width="12" height="7"><use xlink:href="./assets/sprite.svg#eye"></use></svg>
                <span>${item.viewed}</span>
              </div>
            </div>
            <div class="card__body">
              <div class="card__title">${item.title}</div>
              <div class="card__undertitle">${item.mini_text}</div>
              <div class="card__bottom">
                <div class="card__author">
                  <div class="card__author-img">
                    <img src="https://bitbon.today${item.avatar}">
                  </div>
                  <div class="card__author-name">${item.author}</div>
                </div>
                <div class="card__heading">
                  <svg width="15" height="15"><use xlink:href="./assets/sprite.svg#time"></use></svg>
                  <span>${item.published_date}</span>
                </div>
              </div>
            </div>
          </a>
        `;
        window.setTimeout(() => {
          instanceLazy.update();
        });
        container.append(card);
      });
    },
  };
};
