import {
   _, getData, emphasisOn, emphasisOff, hideTarget, showTarget
} from "./util.js";

export function SearchUI(){ 
   this.searchWindow = _.$('.search_input');   
   this.searchBox = _.$('.search_box'); 
   this.searchArea = _.$('.search');  
   this.hotKeywordBox=_.$('.hot_keyword_tpl');
   this.popularSearchTerm;
   this.rollingPage;
   this.relatedTermBox= _.$('.related_term_tpl');
   this.init();
}

SearchUI.prototype.init = function(){
   this.getInitialData();
   this.controllMouseEvent();
   this.realtimeSearch();
}

SearchUI.prototype.getInitialData = async function(){
   const url = 'https://shoppinghow.kakao.com/v1.0/shophow/top/recomKeyword.json?_=1615192416887';
   const initialData = await getData(url);
   this.popularSearchTerm = initialData.list.map(el=>el.keyword);
  
   this.renderRollingKeyword();
   this.renderKeywordBox();
}

SearchUI.prototype.renderRollingKeyword = function(){
   this.makeTpl(this.popularSearchTerm, 1, this.searchWindow, 'beforeBegin');
   this.searchBox.firstElementChild.className="rolling_keyword";
   this.rollingPage = _.$('.rolling_keyword');
   this.rollupKeyword();
}

SearchUI.prototype.rollupKeyword= function(){
   setInterval(()=>{
      this.rollingPage.style.transition = '1s';
      this.rollingPage.style.transform =`translateY(-50px)`;
     setTimeout(() => {
         const first = this.rollingPage.firstElementChild;
         this.rollingPage.appendChild(first);
         this.rollingPage.style.transition ='none';
         this.rollingPage.style.transform ='translateY(0px)';
      },1000)
   }, 2500)
}

SearchUI.prototype.renderKeywordBox= function(){
   const tempTitle = `<div>인기 쇼핑 키워드</div>`;
   this.hotKeywordBox.insertAdjacentHTML('afterBegin', tempTitle);
   const halfArr =this.popularSearchTerm.filter((v,i)=>i<this.popularSearchTerm.length/2)
 
   this.makeTpl(halfArr, 1, this.hotKeywordBox,'beforeEnd');
   this.makeTpl(halfArr, 6,  this.hotKeywordBox, 'beforeEnd');
}

SearchUI.prototype.controllMouseEvent = function(){
   const clickArea = this.searchBox.firstElementChild.closest('.search_box');
   clickArea.addEventListener('click',()=>{
      hideTarget(this.rollingPage);
      emphasisOn(this.searchBox);
      (this.searchWindow.value!=='')? showTarget(this.relatedTermBox) :showTarget(this.hotKeywordBox);
   })

   this.searchArea.addEventListener("mouseleave", ()=>setTimeout(()=>{
      if(this.searchWindow.value==='') {
         showTarget(this.rollingPage);
      } 
      hideTarget(this.relatedTermBox);
      hideTarget(this.hotKeywordBox);
      emphasisOff(this.searchBox);
   }, 200));
}

SearchUI.prototype.realtimeSearch = function(){
   let timer;
   this.searchWindow.addEventListener('input', ()=>{

      if (timer)  clearTimeout(timer);
      timer = setTimeout(async ()=>{
         const searchingWord = this.searchWindow.value;
         if (searchingWord==='') {
            hideTarget(this.relatedTermBox);
            showTarget(this.hotKeywordBox);
            return;
         }
         const relatedLink = `https://completion.amazon.com/api/2017/suggestions?mid=ATVPDKIKX0DER&alias=aps&suggestion-type=KEYWORD&prefix=${searchingWord}`;
         const {suggestions, prefix} = await getData(relatedLink);
         const relatedTermArr = suggestions.map(el=>el.value)
         this.renderRelatedTerm(relatedTermArr, prefix);
        }, 500);
   })
}

SearchUI.prototype.renderRelatedTerm = function(resArray, inputTerm){
   while(this.relatedTermBox.firstChild) {
      this.relatedTermBox.removeChild(this.relatedTermBox.firstChild); 
   }
   resArray.forEach(el=> {
      el = this.colorMatchingStr(el, inputTerm);
      const divEl = `<div>${el}</div>`;
      this.relatedTermBox.insertAdjacentHTML('beforeEnd', divEl);
   });
   showTarget(this.relatedTermBox);
   hideTarget(this.hotKeywordBox);
}

SearchUI.prototype.colorMatchingStr = function(el, inputTerm){
   const matchingOption = new RegExp(inputTerm);
   return el.replace(matchingOption.exec(el),`<span class="emphasis_text">${matchingOption.exec(el)}</span>`);
   const elToArr = Array.prototype.slice.call(el);
   const inputTermLength = Array.prototype.slice.call(this.searchWindow.value).length;
   elToArr.forEach((v,i)=>{
      if(i<inputTermLength) {v.style.color = 'rgb(255, 0,0)';}})
   //const inputTermLength = this.searchWindow.value.length;
  

   console.log(elToArr, inputTermLength)


   console.log(el, matchingOption, matchingOption.exec(el), this.searchWindow.value)
   //검색어와 일치하는 단어 색을 바꾸는 작업인데 아직 어떻게할지 아이디어가없습니다//
}

SearchUI.prototype.makeTpl = function(arr, startNumber, pasteArea, place){
   const tempBox = _.create('div');
   arr.forEach((v, idx)=>{
      const tempDiv = 
      `<div><ul>
         <span class="kwd_number">${idx+startNumber}</span>
         <span>${this.popularSearchTerm[idx+startNumber-1]}</span>
      </ul></div>`;
      tempBox.insertAdjacentHTML('beforeEnd', tempDiv)
   });
   pasteArea.insertAdjacentElement(place, tempBox);
}
