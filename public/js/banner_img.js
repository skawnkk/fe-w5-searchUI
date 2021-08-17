import { _ } from './util/util.js';

export class BannerImgMaker {
  constructor(img) {
    this.imgUrl = img;
    this.area = _.$('.banner_area a img');
    this.paste();
  }

  paste() {
    this.area.setAttribute('src', this.imgUrl);
  }
}
