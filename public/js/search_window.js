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
   this.relatedTermArr;
   this.relatedTermBox= _.$('.related_term_tpl');
   this.clicked=false;
   this.arrNumber = -1;
}

SearchUI.prototype.init = function(){
   this.getInitialData();
   this.controllMouseEvent();
   this.realtimeSearch();
   this.eventControll();
}

SearchUI.prototype.getInitialData = async function(){
   const url = 'https://shoppinghow.kakao.com/v1.0/shophow/top/recomKeyword.json?_=1615192416887';
   const {list} = await getData(url);
   this.popularSearchTerm = list.map(el=>el.keyword).slice(0,10);
  
   this.renderRollingKeyword();
   this.renderKeywordBox();
}

SearchUI.prototype.renderRollingKeyword = function(){
   this.makeTpl(this.popularSearchTerm, 1, this.searchWindow, 'beforeBegin');
   this.searchBox.firstElementChild.className="rolling_keyword";
   this.rollingPage = _.$('.rolling_keyword');
   this.rollupKeyword();
}


SearchUI.prototype.checkSetTimeout = function(){
   (this.clicked!==true)? setTimeout(this.moveNode.bind(this), 2500):clearTimeout(this.moveNode);
}

SearchUI.prototype.rollupKeyword= function(){
   this.checkSetTimeout();
}

SearchUI.prototype.moveNode = function(){
   this.rollingPage.style.transition = '1s';
   this.rollingPage.style.transform =`translateY(-50px)`;

   setTimeout(() => {
      const first = this.rollingPage.firstElementChild;
      this.rollingPage.appendChild(first);
      this.rollingPage.style.transition ='none';
      this.rollingPage.style.transform ='translateY(0px)';
   },1000)

   this.checkSetTimeout();
}



SearchUI.prototype.controllMouseEvent = function(){
   const clickArea = this.searchBox.firstElementChild.closest('.search_box');
   
   clickArea.addEventListener('click',()=>{
      hideTarget(this.rollingPage);
      emphasisOn(this.searchBox);
      (this.searchWindow.value!=='')? showTarget(this.relatedTermBox) :showTarget(this.hotKeywordBox);
      this.clicked =true;
      this.rollupKeyword();
   })

   this.searchArea.addEventListener("mouseleave", ()=>setTimeout(()=>{
      if(this.searchWindow.value==='') {
         showTarget(this.rollingPage);
         this.clicked = false;
         this.rollupKeyword();
      } 
      //hideTarget(this.relatedTermBox);
      hideTarget(this.hotKeywordBox);
      emphasisOff(this.searchBox);
     
   }, 200));
}

SearchUI.prototype.renderKeywordBox= function(){
   const tempTitle = `<div>인기 쇼핑 키워드</div>`;
   this.hotKeywordBox.insertAdjacentHTML('afterBegin', tempTitle);
   const halfArr =this.popularSearchTerm.filter((v,i)=>i<this.popularSearchTerm.length/2)
 
   this.makeTpl(halfArr, 1, this.hotKeywordBox,'beforeEnd');
   this.makeTpl(halfArr, 6,  this.hotKeywordBox, 'beforeEnd');

}

SearchUI.prototype.realtimeSearch = function(){
   let timer;
   this.searchWindow.addEventListener('input', (e)=>{

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
         this.relatedTermArr = suggestions.map(el=>el.value)
         this.renderRelatedTerm(this.relatedTermArr, prefix);
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
   this.controllKeyEvent();
}

SearchUI.prototype.colorMatchingStr = function(el, inputTerm){
   const matchingOption = new RegExp(inputTerm);
   return el.replace(matchingOption.exec(el),`<span class="emphasis_text">${matchingOption.exec(el)}</span>`);
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
SearchUI.prototype.eventControll = function(){
   this.searchWindow.addEventListener('keydown', ({key})=>this.controllKeyEvent(key));
}

SearchUI.prototype.controllKeyEvent = function(key){
   if(key!=='ArrowDown'&&key!=='ArrowUp'&&key!=='Escape') return;
   const reltermDivs = Array.from(this.relatedTermBox.children);
   if(reltermDivs.length===0) return; //연관검색어가 존재하지 않는 경우

   switch (key) {
      case 'ArrowUp':
         this.arrNumber-=1;
         break;
      case 'ArrowDown':
         if(this.arrNumber<0) showTarget(this.relatedTermBox);
         this.arrNumber+=1;
         break;
      default:
         hideTarget(this.relatedTermBox);
         this.arrNumber = -1;
         return;
   }  

   if(this.arrNumber>reltermDivs.length-1 || this.arrNumber<0) {
      hideTarget(this.relatedTermBox);
      this.arrNumber = -1;
      return;
   }

   reltermDivs.forEach(el=>{
      if(el.classList.contains('keybord_focus')){
         console.log(this.arrNumber)
         el.classList.remove('keybord_focus')
      };
   });

   reltermDivs[this.arrNumber].classList.add('keybord_focus');

   const focusedKey = _.$('.keybord_focus');
   console.log(focusedKey.innerText, this.searchWindow)
   this.searchWindow.value = focusedKey.innerText;
}