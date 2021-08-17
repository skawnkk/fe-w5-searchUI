import { _ } from './util.js';

import { CarouselMaker } from './carousel.maker.js';
import { BannerImgMaker } from './banner_img.js';
import { ViewMoreManager } from './view_more_manager.js';

export class LoaderFromJson {
  constructor(url, requestInfo, value) {
    this.requestInfo = requestInfo;
    this.value = value;
    this.title;
    this.desc;
    this.imgurl;
    this.init(url);
  }

  populateUI(parsedData) {
    let titleArr = [];
    let descArr = [];
    let imgUrlArr = [];

    parsedData.forEach((el) => {
      let [title, desc, imgurl] = el;
      if (title) titleArr.push(title);
      if (desc) descArr.push(desc);
      if (imgurl) imgUrlArr.push(imgurl);
    });

    if (this.value === 'carousel')
      return new CarouselMaker(null, null, imgUrlArr, this.value);
    if (this.value === 'banner') return new BannerImgMaker(imgUrlArr);
    if (this.value === 'view_more' || this.value === 'view_more_basic')
      return new ViewMoreManager(titleArr, descArr, imgUrlArr, this.value);
    if (this.value === 'carousel_hot')
      return new CarouselMaker(titleArr, descArr, imgUrlArr, this.value);
  }

  dataParsing(requestData) {
    if (requestData.length == undefined) requestData = [requestData];

    return requestData.map((item) => {
      if (item.eventContent) {
        item = item.eventContent;
        this.title = item.title;
        this.desc = item.subtitle;
        this.imgurl = item.imgurl;
      } else {
        this.title = item.text;
        this.desc = item.text2;
        this.imgurl = item.imgurl;
      }

      if (this.title || this.desc || this.imgurl) {
        return [this.title, this.desc, this.imgurl];
      }
    });
  }

  init(url) {
    fetch(url)
      .then((response) => response.json())
      .then((json) => this.dataParsing(json[this.requestInfo]))
      .then((result) => this.populateUI(result));
  }
}

//*XMLHttpRequest
// let requestURL = 'https://shoppinghow.kakao.com/v1.0/shophow/top/planningEvent.json?_=1614126791478';
// let request = new XMLHttpRequest();
// request.open('GET', requestURL);
// request.responseType = 'json';
// request.send();
// request.onload = function () {
//    let mallEventjson = request.response;
//    dataParsing(mallEventjson.mallEventList);
// }
