export const _ = {
   $: (selector, base = document) => base.querySelector(selector),
   $All: (selector, base = document) => base.querySelectorAll(selector),
   create: (selector, base = document) =>base.createElement(selector),
};