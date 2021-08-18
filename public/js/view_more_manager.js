import { _ } from './util/util.js';

import { URL } from './url.js';

export class ViewMoreManager {
  constructor(titleArr, descArr, imgUrlArr, value) {
    this.title = titleArr;
    this.desc = descArr;
    this.img = imgUrlArr;
    this.value = value;
    this.range;
    this.init();
  }

  makeTpl() {
    //🤔돔 조작을 더 줄일 순 없을까? (기존데이터는 유지하면서...)
    const filteredArr = this.title.filter((_, i) => i < this.range);
    filteredArr.forEach((v, i) => {
      const viewMoreLi = document.createElement('li');
      viewMoreLi.className = 'panel_list';
      viewMoreLi.innerHTML = `
         <a href="#">
            <img src="${this.img[i]}"></img>
            <p>${this.title[i]}</p>
            <span>${this.desc[i]}</span>
            <span class="theme_icon">테마</span>
         </a>
         `;
      const viewMoreArea = _.$('.evt_list ul');
      viewMoreArea.insertAdjacentElement('beforeEnd', viewMoreLi);
    });
  }

  init() {
    //view_more_basic: 처음렌더링시 화면에 보여지는 갯수.
    this.range = this.value === 'view_more_basic' ? 5 : this.img.length;
    this.makeTpl();
  }
}

const resetViewMoreSection = () => {
  let viewMores = _.$('.evt_list .panel');
  while (viewMores.childNodes.length) {
    viewMores.removeChild(viewMores.firstChild);
  }

  playViewMore();
  count = 0;
  changeButton(count);
};

const changeButton = (count) => {
  let newBtn = count === 0 ? document.createTextNode('더보기') : document.createTextNode(' 접기');

  const block = _.$('.see_more_btn');
  block.removeChild(block.firstChild);
  block.appendChild(newBtn);
};

export const viewMoreUrlSetting = () => {
  var viewMorePage = 2;
  while (count < viewMorePage) {
    count++;
    let viewMoreUrl = URL.VIEW_MORE_API_CUSTOM(count);
    if (count === viewMorePage) changeButton(count);
    return new RequestData(viewMoreUrl, requestInfoForSection2_view_more, 'view_more');
  }

  resetViewMoreSection();
};
