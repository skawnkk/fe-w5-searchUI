import { _ } from './util/util.js';
const NUMBER_TO_SHOW = 5;
export class CarouselMaker {
  constructor(titleArr, descArr, imgUrlArr, id) {
    this.titleArr = titleArr;
    this.descArr = descArr;
    this.imgUrlArr = imgUrlArr;
    this.slideArea = id === 'carousel' ? _.$('.main_carousel') : _.$('.hot_deal_list');
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
    let carouseolTpl = '';
    for (let i = 0; i < this.titleArr.length; i++) {
      if (i % NUMBER_TO_SHOW === 0) {
        carouseolTpl += `<ul class='panel'>`;
      }
      carouseolTpl += `
        <div class='panel_list'> 
          <a href="#">
            <img src="${this.imgUrlArr[i]}"></img>
            <p>${this.titleArr[i]}</p>
            <span>${this.descArr[i]}</span>
            <span class="theme_icon">테마</span>
          </a>  
        </div>`;

      if (i % NUMBER_TO_SHOW === NUMBER_TO_SHOW - 1) {
        carouseolTpl += `</ul>`;
      }
    }
    this.slideArea.innerHTML = carouseolTpl;
  }

  checkArrLength() {
    this.imgUrlArr.length === 3 ? this.makeBasicTpl() : this.makeHotDealTpl();
  }

  init() {
    this.checkArrLength();
    this.insertCloneTpl();
  }
}
