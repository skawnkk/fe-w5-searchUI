import { _ } from './util/util.js';

export class CarouselCtroller {
  constructor(obj) {
    this.prev = obj.slidePrevBtn;
    this.next = obj.slideNextBtn;
    this.area = obj.slideArea;
    this.value = obj.value;
    this.size = Number(getComputedStyle(this.area).width.replace(/[p-x]/g, ''));
    this.pagingSpeed = 0.4;
    this.picNumber = 1;
    this.play();
  }

  addClickEvent(el) {
    el.addEventListener('click', () => {
      el === this.prev ? this.picNumber-- : this.picNumber++;
      this.area.style.transform = `translate(${-this.size * this.picNumber}px)`;
      this.area.style.transition = `transform ${this.pagingSpeed}s`;
    });
  }
  handleTransitioned() {
    let lastImg = _.$(`#first_clone_${this.value}`);
    let firstImg = _.$(`#last_clone_${this.value}`);

    if (this.area.children[this.picNumber] === lastImg) {
      this.picNumber = 1;
      this.area.style.transform = `translate(${-this.size * this.picNumber}px)`;
      this.area.style.transition = 'none';
    }

    if (this.area.children[this.picNumber] === firstImg) {
      this.picNumber = this.area.children.length - 2;
      this.area.style.transform = `translate(${-this.size * this.picNumber}px)`;
      this.area.style.transition = 'none';
    }
  }
  play() {
    this.area.style.transform = `translate(${-this.size * this.picNumber}px)`;
    const prevNextBtn = [this.prev, this.next];
    prevNextBtn.forEach((el) => this.addClickEvent(el));

    this.area.addEventListener('transitionend', this.handleTransitioned.bind(this));
  }
}
