export const _ = {
  $: (selector, base = document) => base.querySelector(selector),
  $All: (selector, base = document) => base.querySelectorAll(selector),
  create: (selector, base = document) => base.createElement(selector),
};

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
