import {
   _
} from "./util.js";
const searchWindow = _.$('.search_input');
const searchBox = _.$('.search_box');
const searchArea = _.$('.search');
const hotKeywordBox=_.$('.hot_keyword_tpl');


const getData = (url) => {
   fetch(url)
   .then((response) => {
      return response.json();
   }).then((json) => {
      return json.list;
   }).then((arr)=>{
      return arr.map(el=>el.keyword)
   }).then((arr)=>{
      renderKeywordBox(arr)
      renderRollingKeyword(arr)
   })
}

const getRelatedTerm = (url) =>{
   fetch(url)
   .then((response) => {
      return response.json();
   }).then((json) => {
      return json.suggestions;
   }).then(resArray =>{
      return resArray.map(el=>el.value);
   }).then((resArray)=>renderRelatedTerm(resArray))
}

const renderRelatedTerm = (resArray) => {
   const relatedTermBox = _.$('.related_term_tpl');
   const firstNode = relatedTermBox.firstChild;
   if(firstNode) relatedTermBox.removeChild(firstNode); 
   
   const relatedTerm10 = resArray.slice(0,10);
   const tempBox = _.create('div');
   relatedTerm10.forEach(el=> {
      const divEl = _.create('div');
      divEl.innerText=el;
      tempBox.appendChild( divEl)
   });
   relatedTermBox.insertAdjacentElement('afterBegin', tempBox);
   showTarget(relatedTermBox);
   hideTarget(hotKeywordBox)

   //여기작업중
}
const rollupKeyword =(tempBox)=>{
 
   setInterval(()=>{
      tempBox.style.transition = '1s';
      tempBox.style.transform =`translateY(-50px)`;
     setTimeout(() => {
         const first = tempBox.firstElementChild;
         tempBox.appendChild(first);
         tempBox.style.transition ='none';
         tempBox.style.transform ='translateY(0px)';
      },1000)
   }, 2500)
 
}

const makeTpl = (originArr, arr, startNumber, pasteArea, place)=>{
   const tempBox = _.create('div');
   arr.forEach((v, idx)=>{
      const tempDiv = _.create('div');
      tempDiv.innerHTML = 
      `<ul>
         <span class="kwd_number">${idx+startNumber}</span>
         <span>${originArr[idx+startNumber-1]}</span>
      </ul>`
      tempBox.insertAdjacentElement('beforeEnd', tempDiv)
   });
   pasteArea.insertAdjacentElement(place, tempBox);
}

const renderRollingKeyword = (arr)=>{
   makeTpl(arr, arr, 1, searchWindow, 'beforeBegin');
   searchBox.firstElementChild.className="rolling_keyword";
   searchBox.firstElementChild.classList.add="on";
   const rollingPage = _.$('.rolling_keyword');
   rollupKeyword(rollingPage);
}

const renderKeywordBox = (arr)=>{
   const tempTitle = _.create('div');
   tempTitle.innerText='인기 쇼핑 키워드';
   hotKeywordBox.insertAdjacentElement('afterBegin', tempTitle);
   
   const originArr = arr.slice(0,arr.length-2)
   const halfArr =originArr.filter((v,i)=>i<originArr.length/2)
 
   makeTpl(originArr, halfArr, 1, hotKeywordBox,'beforeEnd');
   makeTpl(originArr, halfArr, 6,  hotKeywordBox, 'beforeEnd');
}


const hideRolling = () => {
   const rollingPage = _.$('.rolling_keyword');
   rollingPage.style.display = 'none';
}

const showRolling = () => {
   const rollingPage = _.$('.rolling_keyword');
   rollingPage.style.display = 'block';
}

const hideTarget = (target) => {
   target.classList.remove("show");
}

const showTarget = (target) => {
   target.classList.add("show");
}

const realtimeSearch = () => {
   let timer;
   searchWindow.addEventListener('input', (e)=>{
      if (timer)  clearTimeout(timer);
      timer = setTimeout(function() {
         const searchingWord = searchWindow.value;
         getRelatedTerm(`https://completion.amazon.com/api/2017/suggestions?session-id=143-2446705-2343767&customer-id=&request-id=S6PGC8D1B31CR1Z4MJQB&page-type=Gateway&lop=en_US&site-variant=desktop&client-info=amazon-search-ui&mid=ATVPDKIKX0DER&alias=aps&b2b=0&fresh=0&ks=229&prefix=${searchingWord}&event=onKeyPress&limit=11&fb=1&suggestion-type=KEYWORD&suggestion-type=WIDGET&_=1615298235851', searchingWord`);
      }, 1000);
   })
}

const showHotkeyword = () => {
   showTarget(hotKeywordBox);
   showTarget(searchBox);

   searchArea.addEventListener("mouseleave", ()=>setTimeout(()=>{
      if(searchWindow.value==='') showRolling()
      hideTarget(hotKeywordBox)
      hideTarget(searchBox)
   }, 200));
}

const searchWindowClick = () => {
   const clickArea = searchBox.firstElementChild.closest('.search_box');
   clickArea.addEventListener('click',()=>{
      hideRolling();
      showHotkeyword();
   })
}

export const searchInit = ()=>{
   getData('https://shoppinghow.kakao.com/v1.0/shophow/top/recomKeyword.json?_=1615192416887');
   searchWindowClick();
   realtimeSearch();
}