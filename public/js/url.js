const KAKAO_BASIC = `https://shoppinghow.kakao.com`;

export const URL = {
  CAROUSEL_API:
    KAKAO_BASIC + `/v1.0/shophow/top/planningEvent.json?_=1614126791478`,
  VIEW_MORE_API:
    KAKAO_BASIC +
    `/v1/event/homecontents.json?page=1&countPerPage=20&categoryid=&min_num=53884&displaytype=PC&_=1614421595623`,
  VIEW_MORE_API_CUSTOM: (count) =>
    KAKAO_BASIC +
    `/v1/event/homecontents.json?page=${
      1 + 2 * count
    }&countPerPage=20&categoryid=&min_num=${53884 + count}&displaytype=PC&_=${
      1614421595623 + count
    }`,
  SEARCH_KEYWORD:
    KAKAO_BASIC + `/v1.0/shophow/top/recomKeyword.json?_=1615192416887`,
  AMAZON_SEARCH: (searchingWord) =>
    `https://completion.amazon.com/api/2017/suggestions?mid=ATVPDKIKX0DER&alias=aps&suggestion-type=KEYWORD&prefix=${searchingWord}`,
};
