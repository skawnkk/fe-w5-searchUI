import {
  _,
  emphasisOn,
  getDataFromAPI,
  emphasisOff,
  hideTarget,
  showTarget,
  delay,
} from './util/util.js';
import { makeHotKeywordTpl } from './util/search.js';
import { URL } from './url.js';

export function HotSearchKeywordUI() {
  this.searchWindow = _.$('.search_input');
  this.searchBox = _.$('.search_box');
  this.hotKeywordBox = _.$('.hot_keyword_tpl');
  this.relatedTermBox = _.$('.related_term_tpl');
  this.searchArea = _.$('.search');
  this.rollingPage;
  this.clicked = false;
  this.getHotKeyword();
}

//🥑인기검색어- 데이터& rollingPage & box init
HotSearchKeywordUI.prototype.getHotKeyword = async function () {
  const { list } = await getDataFromAPI(URL.SEARCH_KEYWORD);
  const popularSearchTerm = list.map((el) => el.keyword).slice(0, 10);
  this.renderRollingKeyword(popularSearchTerm);
  this.renderKeywordBox(popularSearchTerm);
};

HotSearchKeywordUI.prototype.renderRollingKeyword = function (popularSearchTerm) {
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
  this.controllMouseEvent();
};

HotSearchKeywordUI.prototype.rollupKeyword = function () {
  this.clicked === false ? setTimeout(this.moveNode.bind(this), 2000) : clearTimeout(this.moveNode);
};

HotSearchKeywordUI.prototype.moveNode = function () {
  this.rollingPage.style.transition = '1s';
  this.rollingPage.style.transform = `translateY(-50px)`;
  delay(1000).then(() => {
    //1초동안 translate하는 중
    const first = this.rollingPage.firstElementChild;
    this.rollingPage.appendChild(first);
    this.rollingPage.style.transition = 'none';
    this.rollingPage.style.transform = 'translateY(0px)';
  });

  this.rollupKeyword();
};

HotSearchKeywordUI.prototype.handleMouseOutFromSearchUI = function () {
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

HotSearchKeywordUI.prototype.handleMouseClickOnSearchUI = function () {
  this.clicked = true;
  hideTarget(this.rollingPage);
  emphasisOn(this.searchBox);
  this.searchWindow.value !== '' ? showTarget(this.relatedTermBox) : showTarget(this.hotKeywordBox);
};
HotSearchKeywordUI.prototype.controllMouseEvent = function () {
  const clickArea = this.searchBox.firstElementChild.closest('.search_box');
  clickArea.addEventListener('click', this.handleMouseClickOnSearchUI.bind(this));
  this.searchArea.addEventListener('mouseleave', this.handleMouseOutFromSearchUI.bind(this));
};

//🥑인기검색어- 박스
HotSearchKeywordUI.prototype.renderKeywordBox = function (popularSearchTerm) {
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
