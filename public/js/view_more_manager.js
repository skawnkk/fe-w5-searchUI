import { _ } from './util.js';

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
