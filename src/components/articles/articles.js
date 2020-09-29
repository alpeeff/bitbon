import axios from '../../api/axios';
import lazy from 'vanilla-lazyload';
import throttle from '../../common/js/throttle';

const loadingTemplate = `
<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;
const article = ({
  link,
  image,
  filters,
  viewed,
  title,
  mini_text,
  avatar,
  author,
  published_date,
}) => {
  return `
  <a href="https://bitbon.today${link}" class="card card--article ex">
    <div class="card__img">
      <img class="lazy" data-src="https://bitbon.today${image}" alt="alt">
      <div class="card__filters">
        ${filters.map((filter) => {
          return `
            <div class="card__filters-item">
              <img src="https://bitbon.today${filter.icon}">
            </div>
          `;
        })}
      </div>
      <div class="card__views">
        <svg width="12" height="7"><use xlink:href="./assets/sprite.svg#eye"></use></svg>
        <span>${viewed}</span>
      </div>
    </div>
    <div class="card__body">
      <div class="card__title">${title}</div>
      <div class="card__undertitle">${mini_text}</div>
      <div class="card__bottom">
        <div class="card__author">
          <div class="card__author-img">
            <img src="https://bitbon.today${avatar}">
          </div>
          <div class="card__author-name">${author}</div>
        </div>
        <div class="card__heading">
          <svg width="15" height="15"><use xlink:href="./assets/sprite.svg#time"></use></svg>
          <span>${published_date}</span>
        </div>
      </div>
    </div>
  </a>
`;
};

const news = ({ link, image, viewed, title, published_date }) => {
  return `
  <a href="https://bitbon.today${link}">
    <div class="card__img">
      <img class="lazy" data-src="https://bitbon.today${image}" alt="alt">
      <div class="card__views">
        <svg width="12" height="7"><use xlink:href="./assets/sprite.svg#eye"></use></svg>
        <span>${viewed}</span>
      </div>
    </div>
    <div class="card__body">
      <div class="card__title">${title}</div>
      <div class="card__bottom">
        <div class="card__heading">
          <svg width="15" height="15"><use xlink:href="./assets/sprite.svg#time"></use></svg>
          <span>${published_date}</span>
        </div>
      </div>
    </div>
  </a>
`;
};

export default () => {
  const target = document.querySelector('#articles__container');
  if (!target) return;
  let instanceLazy = new lazy({
    threshold: 0,
  });
  const page = target ? target.getAttribute('data-page') : null;

  const state = {
    all: false,
    loaderContainer: document.querySelector('.card__loading'),
    loading: true,
    slug: page || 'staty',
    page: 1,
    filtersTemplate: null,
    router: {},
    results: [],
  };
  const onFirstLoad = () => {
    methods.setLoading();
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
      methods.unsetLoding();
    });
  };

  const methods = {
    setLoading() {
      state.loading = true;
      state.loaderContainer.innerHTML = loadingTemplate;
    },
    unsetLoding(isAll) {
      if (isAll) {
        state.loading = false;
        state.loaderContainer.innerHTML = `<p>Вы загрузили все ${
          page === 'novosti' ? 'новости' : 'статьи'
        }</p>`;
      } else {
        state.loading = false;
        state.loaderContainer.innerHTML = '';
      }
    },
    renderFilters() {
      const container = document.querySelector('.filter__list');
      if (page === 'novosti') {
        container.remove();
        return;
      }
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
      state.page = 1;
      if (state.router[name]) {
        target.classList.add('active');
      } else {
        target.classList.remove('active');
      }
      methods.fetching().then((res) => {
        const { results } = res.data;
        const obj = {};
        results.forEach((item) => {
          obj[item.id] = { ...item };
        });
        state.results = Object.keys(obj)
          .map((key) => {
            return obj[key];
          })
          .sort((a, b) => b.id - a.id);
        const container = document.querySelector('.card__list');
        container.innerHTML = '';
        state.all = false;
        methods.renderArticles();
      });
    },
    renderArticles() {
      const container = document.querySelector('.card__list');
      for (let i = 0; i < state.results.length; i++) {
        const item = state.results[i];
        const onPage = document.querySelector(
          `.card__wrapper[data-id="${item.id}"]`
        );
        if (!onPage) {
          const card = document.createElement('div');
          if (page === 'novosti') {
            card.classList.add('card');
            card.classList.add('card--news');
            card.classList.add('ex');
          } else {
            card.classList.add('card__wrapper');
          }
          card.setAttribute('data-id', item.id);
          card.innerHTML = page === 'novosti' ? news(item) : article(item);
          container.append(card);
        }
        window.setTimeout(() => {
          instanceLazy.update();
        });
      }
    },
  };
  onFirstLoad();
  const throttledScroll = throttle(() => {
    const currentScroll =
      document.querySelector('.card__list').getBoundingClientRect().bottom -
      window.innerHeight;
    if (currentScroll < 300 && !state.loading && !state.all) {
      methods.setLoading();
      ++state.page;
      methods
        .fetching()
        .then((res) => {
          const { results } = res.data;
          console.log(results.length);
          state.results = [...state.results, ...results];
          methods.renderArticles();
          methods.unsetLoding();
        })
        .catch((e) => {
          console.error(e);
          state.all = true;
          methods.unsetLoding(true);
        });
    }
  }, 200);
  document.addEventListener('scroll', throttledScroll);
};
