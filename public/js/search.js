import {
  _,
  emphasisOn,
  getDataFromAPI,
  emphasisOff,
  hideTarget,
  showTarget,
  delay,
  debounce,
} from './util/util.js';
import {
  makeKeywordHistoryTpl,
  validHistoryKeyword,
  makeEmphasisOnTpl,
  makeHotKeywordTpl,
} from './util/search.js';
import { URL } from './url.js';

export function SearchUI() {
  this.searchWindow = _.$('.search_input');
  this.searchBox = _.$('.search_box');
  this.searchArea = _.$('.search');
  this.searchForm = _.$('.search_form');
  this.hotKeywordBox = _.$('.hot_keyword_tpl');
  this.relatedTermBox = _.$('.related_term_tpl');
  this.historyKeywordBox = _.$('.searched_keyword_tpl');
  this.rollingPage;
  this.relatedTermArr;
  this.clicked = false;
  this.arrNumber = -1;
  this.dataKey = 'recentSearchTerms';
  this.searchHistory = [];
  this.loadedDataArr;
  this.delBtn = _.$('.delete');
}

//🥑인기검색어- 데이터& rollingPage & box init
SearchUI.prototype.getHotKeyword = async function () {
  const { list } = await getDataFromAPI(URL.SEARCH_KEYWORD);
  const popularSearchTerm = list.map((el) => el.keyword).slice(0, 10);
  this.renderRollingKeyword(popularSearchTerm);
  this.renderKeywordBox(popularSearchTerm);
};

SearchUI.prototype.renderRollingKeyword = function (popularSearchTerm) {
  const tplInfo = {
    keywords: popularSearchTerm,
    startNumber: 1,
    renderPlace: this.searchWindow,
    direction: 'beforeBegin',
  };
  makeHotKeywordTpl(popularSearchTerm, tplInfo);

  this.searchBox.firstElementChild.className = 'rolling_keyword';
  this.rollingPage = _.$('.rolling_keyword');
  this.rollupKeyword();
};

SearchUI.prototype.rollupKeyword = function () {
  this.checkSetTimeout();
};

SearchUI.prototype.checkSetTimeout = function () {
  this.clicked === false ? setTimeout(this.moveNode.bind(this), 2000) : clearTimeout(this.moveNode);
};

SearchUI.prototype.moveNode = function () {
  this.rollingPage.style.transition = '1s';
  this.rollingPage.style.transform = `translateY(-50px)`;
  delay(1000).then(() => {
    //1초동안 translate하는 중
    const first = this.rollingPage.firstElementChild;
    this.rollingPage.appendChild(first);
    this.rollingPage.style.transition = 'none';
    this.rollingPage.style.transform = 'translateY(0px)';
  });

  this.checkSetTimeout();
};
//🥑인기검색어- 박스
SearchUI.prototype.renderKeywordBox = function (popularSearchTerm) {
  const tempTitle = `<div>인기 쇼핑 키워드</div>`;
  this.hotKeywordBox.insertAdjacentHTML('afterBegin', tempTitle);
  const halfArr = popularSearchTerm.filter((v, i) => i < popularSearchTerm.length / 2);
  const tplInfo1To5 = {
    keywords: halfArr,
    startNumber: 1,
    renderPlace: this.hotKeywordBox,
    direction: 'beforeEnd',
  };
  makeHotKeywordTpl(popularSearchTerm, tplInfo1To5);

  tplInfo1To5.startNumber = 6;
  makeHotKeywordTpl(popularSearchTerm, tplInfo1To5);
};

//🍒검색창-입력
SearchUI.prototype.onEvents = function () {
  this.controllMouseEvent();
  this.controllKeybordEvent();
};

SearchUI.prototype.storeSearchTerm = function (keyword = this.searchHistory) {
  this.dataKey = 'recentSearchTerm';
  localStorage.setItem(this.dataKey, JSON.stringify(keyword));
  this.viewKeywordHistory(this.dataKey);
};

SearchUI.prototype.viewKeywordHistory = function (dataKey) {
  this.loadedDataArr = validHistoryKeyword(dataKey);
  this.historyKeywordBox = _.$('.searched_keyword_tpl');
  this.historyKeywordBox.innerHTML = '';
  this.loadedDataArr.map(({ term, id }) =>
    this.historyKeywordBox.insertAdjacentElement('AfterBegin', makeKeywordHistoryTpl(term, id))
  );
};

SearchUI.prototype.deleteSearchTerm = function (target) {
  this.loadedDataArr = validHistoryKeyword();
  this.searchHistory = this.loadedDataArr.filter((el) => {
    return +target.previousSibling.id !== el.id;
  });
  this.storeSearchTerm(this.searchHistory);
};

SearchUI.prototype.controllKeybordEvent = function () {
  this.searchWindow.addEventListener('keydown', ({ key }) => this.controllKeyEvent(key));
  this.searchForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

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
SearchUI.prototype.controllMouseEvent = function () {
  const handleMouseClickOnSearchUI = () => {
    this.clicked = true;
    hideTarget(this.rollingPage);

    emphasisOn(this.searchBox);
    this.searchWindow.value !== ''
      ? showTarget(this.relatedTermBox)
      : showTarget(this.hotKeywordBox);
  };

  const handleMouseOutFromSerchUI = () => {
    delay(500).then(() => {
      if (this.searchWindow.value === '') {
        this.clicked = false;
        showTarget(this.rollingPage);
      }

      hideTarget(this.relatedTermBox);
      hideTarget(this.hotKeywordBox);
      emphasisOff(this.searchBox);
    });
  };

  const clickArea = this.searchBox.firstElementChild.closest('.search_box');
  clickArea.addEventListener('click', handleMouseClickOnSearchUI);
  this.searchArea.addEventListener('mouseleave', handleMouseOutFromSerchUI);
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
  this.relatedTermArr = suggestions.map((el) => el.value);
  this.renderRelatedTerm(this.relatedTermArr, prefix);
};

SearchUI.prototype.renderRelatedTerm = function (relatedKeyword, inputTerm) {
  this.relatedTermBox.innerHTML = '';
  this.relatedTermBox.insertAdjacentHTML('beforeEnd', makeEmphasisOnTpl(relatedKeyword, inputTerm));

  if (this.relatedTermArr.length === 0) {
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
  this.getHotKeyword();
  this.realtimeSearch();
  this.onEvents();
  this.viewKeywordHistory();
};
