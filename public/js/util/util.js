export const _ = {
  $: (selector, base = document) => base.querySelector(selector),
  $All: (selector, base = document) => base.querySelectorAll(selector),
  create: (selector, base = document) => base.createElement(selector),
};
export const delay = (ms, value = '') =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const debounceInit =
  (timer = null) =>
  (fn, wait) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(fn, wait);
  };
export const debounce = debounceInit();
export const getDataFromAPI = async (url) => {
  const response = await fetch(url);
  const jsonData = await response.json();
  return jsonData;
};

export const emphasisOn = function (target) {
  target.classList.add('emphasis');
};
export const emphasisOff = function (target) {
  target.classList.remove('emphasis');
};
export const hideTarget = function (target) {
  target.classList.add('off');
};
export const showTarget = function (target) {
  target.classList.remove('off');
};
