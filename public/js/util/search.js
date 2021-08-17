import { _ } from './util.js';

// 🥑 인기검색어 템플릿
const makeHotKeywordTpl = function (
  popularSearchTerm,
  { keywords, startNumber, renderPlace, direction }
) {
  let tempDiv = '';
  keywords.forEach((v, idx) => {
    tempDiv += `<div><ul>
    <span class="kwd_number">${idx + startNumber}</span>
    <span>${popularSearchTerm[idx + startNumber - 1]}</span>
    </ul></div>`;
  });
  const tempBox = _.create('div');
  tempBox.insertAdjacentHTML('beforeEnd', tempDiv);
  renderPlace.insertAdjacentElement(direction, tempBox);
};

//🍒검색창입력 - 연관검색어 tpl
const makeEmphasisOnTpl = (relatedKeyword, inputTerm) => {
  let relatedKeywordTpl = ``;
  relatedKeyword.forEach((el) => {
    el = colorMatchingSameKeyword(el, inputTerm);
    relatedKeywordTpl += `<div>${el}</div>`;
  });
  return relatedKeywordTpl;
};

const colorMatchingSameKeyword = (el, inputTerm) => {
  const matchingOption = new RegExp(inputTerm);
  return el.replace(
    matchingOption.exec(el),
    `<span class="emphasis_text">${matchingOption.exec(el)}</span>`
  );
};

//🍒검색창입력 - 검색이력Tpl
const makeKeywordHistoryTpl = (term, id) => {
  const divEl = _.create('div');
  divEl.innerHTML = `<span id=${id}>${term}</span>`;

  const delBtn = _.create('span');
  delBtn.className = 'delete';
  delBtn.innerText = 'ⅹ';
  delBtn.addEventListener('click', ({ target }) => {
    SearchUI.prototype.deleteSearchTerm(target);
  });

  divEl.appendChild(delBtn);
  return divEl;
};

const validHistoryKeyword = (dataKey = 'recentSearchTerms') => {
  const loadedDataObj = localStorage.getItem(dataKey);
  return !loadedDataObj ? [] : JSON.parse(loadedDataObj);
};

export {
  makeKeywordHistoryTpl,
  validHistoryKeyword,
  makeEmphasisOnTpl,
  makeHotKeywordTpl,
};
