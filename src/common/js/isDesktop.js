export default () => {
  const width = window.outerWidth >= 1200 && window.innerWidth >= 1200;
  const height = window.outerHeight >= 640 && window.innerHeight >= 640;
  return width && height;
};
