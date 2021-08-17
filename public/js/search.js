import { _, getDataFromAPI, hideTarget, showTarget, debounce } from './util/util.js';
import { validHistoryKeyword, makeEmphasisOnTpl } from './util/search.js';
import { URL } from './url.js';

export function SearchUI() {
  this.searchWindow = _.$('.search_input');
  this.searchBox = _.$('.search_box');
  this.searchArea = _.$('.search');
  this.searchForm = _.$('.search_form');
  this.hotKeywordBox = _.$('.hot_keyword_tpl');
  this.relatedTermBox = _.$('.related_term_tpl');
  this.historyKeywordBox = _.$('.searched_keyword_tpl');
  this.delBtn = _.$('.delete');
  this.dataKey = 'recentSearchTerms';
  this.clicked = false;
  this.arrNumber = -1;
  this.searchHistory = [];
  this.relatedTermArr;
  this.init();
}
//🍒검색창-입력

SearchUI.prototype.storeSearchTerm = function (keyword = this.searchHistory) {
  this.dataKey = 'recentSearchTerm';
  localStorage.setItem(this.dataKey, JSON.stringify(keyword));
  this.viewKeywordHistory(this.dataKey);
};

SearchUI.prototype.makeKeywordHistoryTpl = function (term, id) {
  const divEl = _.create('div');
  divEl.innerHTML = `<span id=${id}>${term}</span>`;

  const delBtn = _.create('span');
  delBtn.className = 'delete';
  delBtn.innerText = 'ⅹ';
  delBtn.addEventListener('click', ({ target }) => {
    this.deleteSearchTerm(target);
  });

  divEl.appendChild(delBtn);
  return divEl;
};

SearchUI.prototype.viewKeywordHistory = function (dataKey) {
  this.historyKeywordBox = _.$('.searched_keyword_tpl');
  this.historyKeywordBox.innerHTML = '';
  validHistoryKeyword(dataKey).map(({ term, id }) =>
    this.historyKeywordBox.insertAdjacentElement('AfterBegin', this.makeKeywordHistoryTpl(term, id))
  );
};

SearchUI.prototype.deleteSearchTerm = function (target) {
  console.log(validHistoryKeyword(this.dataKey));
  this.searchHistory = validHistoryKeyword().filter((el) => {
    return +target.previousSibling.id !== el.id;
  });
  this.storeSearchTerm(this.searchHistory);
};

SearchUI.prototype.controllKeybordEvent = function () {
  this.searchWindow.addEventListener('keydown', ({ key }) => this.controllKeyEvent(key));
  this.searchForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    console.log(2);
    const submittedKeyword = {
      term: this.searchWindow.value,
      id: evt.timeStamp,
    };

    if (this.searchHistory.length > 5) this.searchHistory.shift();
    this.searchHistory.push(submittedKeyword);
    this.storeSearchTerm(this.searchHistory);

    this.searchWindow.value = '';
    this.searchWindow.blur();
    hideTarget(this.hotKeywordBox);
    hideTarget(this.relatedTermBox);
  });
};

//🍒 검색창입력 - 연관검색어

SearchUI.prototype.realtimeSearch = function () {
  this.searchWindow.addEventListener('input', (e) => {
    debounce(this.responseRealTime.bind(this), 200);
  });
};

SearchUI.prototype.responseRealTime = async function () {
  const searchingWord = this.searchWindow.value;
  if (searchingWord === '') {
    hideTarget(this.relatedTermBox);
    showTarget(this.hotKeywordBox);
    return;
  }
  const { suggestions, prefix } = await getDataFromAPI(URL.AMAZON_SEARCH(searchingWord));
  const relatedTermArr = suggestions.map((el) => el.value);
  this.renderRelatedTerm(relatedTermArr, prefix);
};

SearchUI.prototype.renderRelatedTerm = function (relatedKeyword, inputTerm) {
  this.relatedTermBox.innerHTML = '';
  this.relatedTermBox.insertAdjacentHTML('beforeEnd', makeEmphasisOnTpl(relatedKeyword, inputTerm));

  if (relatedKeyword.length === 0) {
    hideTarget(this.relatedTermBox);
    return;
  }

  showTarget(this.relatedTermBox);
  hideTarget(this.hotKeywordBox);
};

SearchUI.prototype.controllKeyEvent = function (key) {
  if (key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'Escape') return;

  const turnOffRelatedKeyword = () => {
    hideTarget(this.relatedTermBox);
    showTarget(this.rollingPage);
    this.arrNumber = -1;
    this.clicked = false;
    return;
  };

  const reltermDivs = Array.from(this.relatedTermBox.children);
  if (reltermDivs.length === 0) return; //연관검색어가 존재하지 않는 경우

  switch (key) {
    case 'ArrowUp':
      this.arrNumber -= 1;
      break;
    case 'ArrowDown':
      if (this.arrNumber < 0) showTarget(this.relatedTermBox);
      this.arrNumber += 1;
      break;
    default:
      turnOffRelatedKeyword();
  }

  if (this.arrNumber > reltermDivs.length - 1 || this.arrNumber < 0) {
    return turnOffRelatedKeyword();
  }

  reltermDivs.forEach((el) => {
    if (el.classList.contains('keybord_focus')) el.classList.remove('keybord_focus');
  });

  reltermDivs[this.arrNumber].classList.add('keybord_focus');

  const focusedKey = _.$('.keybord_focus');
  this.searchWindow.value = focusedKey.innerText;
};

SearchUI.prototype.init = function () {
  this.realtimeSearch();
  this.controllKeybordEvent();
  this.viewKeywordHistory();
};
