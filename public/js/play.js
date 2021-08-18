import { _ } from './util/util.js';
import { SearchUI } from './search.js';
import { HotSearchKeywordUI } from './search.hot.js';
import { CarouselCtroller } from './carousel.ctrl.js';
import { RequestData } from './request_data.js';
import { URL } from './url.js';
import { viewMoreUrlSetting } from './view_more_manager';

const { CAROUSEL_API, VIEW_MORE_API, VIEW_MORE_API_CUSTOM } = URL;
const requestInfoForSection1_carousel = 'mileageList';
const requestInfoForSection2_view_more = 'contents';
const requestInfoForSection1_carousel_hot = 'mallEventList';
const requestInfoForSection1_banner = 'event';
let count = 0;

const playViewMore = () =>
  new RequestData(VIEW_MORE_API, requestInfoForSection2_view_more, 'view_more_basic');
const playHotDealCarousel = () =>
  new RequestData(CAROUSEL_API, requestInfoForSection1_carousel_hot, 'carousel_hot');
const playCarousel = () =>
  new RequestData(CAROUSEL_API, requestInfoForSection1_carousel, 'carousel');

const loadBannerImg = () => new RequestData(CAROUSEL_API, requestInfoForSection1_banner, 'banner');

const ctrlCarouselBtn = () => {
  const carouselObj = {
    slideArea: _.$('.main_carousel'),
    slideNextBtn: _.$('.evt_main .next'),
    slidePrevBtn: _.$('.evt_main .prev'),
    value: 'carousel',
  };
  return new CarouselCtroller(carouselObj);
};

const ctrlHotDealCarousel = () => {
  const carouselObj = {
    slideArea: _.$('.hot_deal_list'),
    slideNextBtn: _.$('.slide_hot_deal .next'),
    slidePrevBtn: _.$('.slide_hot_deal .prev'),
    value: 'carousel_hot',
  };
  return new CarouselCtroller(carouselObj);
};

const ctrlViewMoreBtn = () => {
  const viewMoreBtn = _.$('.see_more_btn');
  viewMoreBtn.addEventListener('click', viewMoreUrlSetting);
};

function init() {
  playViewMore();
  loadBannerImg();
  ctrlViewMoreBtn();
  playCarousel();
  ctrlCarouselBtn();
  playHotDealCarousel();
  ctrlHotDealCarousel();
  new HotSearchKeywordUI();
  new SearchUI();
}

init();
