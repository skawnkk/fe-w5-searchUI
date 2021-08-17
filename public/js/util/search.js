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
  tempBox.innerHTML = tempDiv;
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

const validHistoryKeyword = (dataKey = 'recentSearchTerm') => {
  const loadedDataObj = localStorage.getItem(dataKey);
  return !loadedDataObj ? [] : JSON.parse(loadedDataObj);
};

export { validHistoryKeyword, makeEmphasisOnTpl, makeHotKeywordTpl };
