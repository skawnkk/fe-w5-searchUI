import { _ } from './util/util.js';

export class CarouselMaker {
  constructor(titleArr, descArr, imgUrlArr, id) {
    this.titleArr = titleArr;
    this.descArr = descArr;
    this.imgUrlArr = imgUrlArr;
    this.slideArea =
      id === 'carousel' ? _.$('.main_carousel') : _.$('.hot_deal_list');
    this.slideLi;
    this.id = id;
    this.count = 0;
    this.init();
  }

  insertCloneTpl() {
    const cloneOfLastNode = this.slideArea.lastElementChild.cloneNode(true);
    const cloneOfFirstNode = this.slideArea.firstElementChild.cloneNode(true);
    cloneOfLastNode.id = `last_clone_${this.id}`;
    cloneOfFirstNode.id = `first_clone_${this.id}`;
    this.slideArea.insertAdjacentElement('afterBegin', cloneOfLastNode);
    this.slideArea.insertAdjacentElement('beforeEnd', cloneOfFirstNode);
  }

  makeBasicTpl() {
    let slides = '';
    this.imgUrlArr.forEach((img) => {
      slides += `<div class="slide_panel"><a href="#">
      <img src="${img}"></img></a></div>`;
    });
    this.slideArea.innerHTML = slides;
  }

  makeHotDealTpl() {
    this.slideArea = _.$('.hot_deal_list');

    for (let i = 0; i < this.titleArr.length; i++) {
      if (i % 5 === 0) {
        this.slideLi = document.createElement('ul');
        this.slideLi.className = 'panel';
      }

      const slideDiv = document.createElement('div');
      slideDiv.className = 'panel_list';
      slideDiv.innerHTML = `<a href="#">
            <img
               src="${this.imgUrlArr[i]}"></img>
            <p>${this.titleArr[i]}</p>
            <span>${this.descArr[i]}</span>
            <span class="theme_icon">테마</span>
         </a>`;

      this.slideLi.insertAdjacentElement('beforeEnd', slideDiv);
      if (this.slideLi.children.length === 5)
        this.slideArea.insertAdjacentElement('beforeEnd', this.slideLi);
    }
  }

  checkArrLength() {
    this.imgUrlArr.length === 3 ? this.makeBasicTpl() : this.makeHotDealTpl();
  }

  init() {
    this.checkArrLength();
    this.insertCloneTpl();
  }
}
