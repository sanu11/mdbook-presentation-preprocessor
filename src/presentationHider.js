var PresentationMode;!function(t){t[t.Slides=0]="Slides",t[t.Web=1]="Web"}(PresentationMode=PresentationMode||{});var PresentationModeHider=function(){function t(){var e=this;this.queryKey="presentation_mode",this.webClass="article-content",this.preClass="presentation-only",this.mode=this.getMode(),this.setMode(),this.assignClassesViaComments(),this.tryMoveToFirstChapter(),window.addEventListener("keyup",function(t){t.altKey&&("p"!=t.key&&"P"!=t.key&&"KeyP"!=t.code||e.toggle())})}return t.prototype.tryMoveToFirstChapter=function(){if(this.mode===PresentationMode.Slides&&(""===location.pathname||"/"===location.pathname)){var t=document.querySelector(".sidebar .chapter");if(!t)return console.error("unable to find chapter 1 link for paging. Please manually click into chapter 1");t.firstChild.firstChild.click()}},t.prototype.assignClassesViaComments=function(){for(var t,e=document.createNodeIterator(document.body,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_COMMENT,null),n=this.mode===PresentationMode.Web?"not-presenting":"presenting",o=null;t=e.nextNode();)if(8===t.nodeType){var i=t.nodeValue.trim();"web-only"===i?o=this.webClass:"slides-only"===i?o=this.preClass:i.startsWith("notes")?this.processNotes(i):"web-only-end"!==i&&"slides-only-end"!==i&&"notes-end"!==i||(o=null)}else 1===t.nodeType&&null!==o&&t.classList.add(o,n)},t.prototype.getMode=function(){var e=localStorage.getItem(this.queryKey);if(null===e)return PresentationMode.Web;try{var t=parseInt(e);return 1<t||t<0?(console.error("presentation_mode was out of range",t),PresentationMode.Web):t}catch(t){return console.error("presentation_mode present in localStorage but value is not an integer",e,t),PresentationMode.Web}},t.prototype.setMode=function(){localStorage.setItem(this.queryKey,this.mode.toString())},t.prototype.updatePage=function(){this.updateElements(document.querySelectorAll(".presentation-only")),this.updateElements(document.querySelectorAll(".article-content"))},t.prototype.updateElements=function(t){for(var e=0;e<t.length;e++){var n=t[e];this.mode===PresentationMode.Slides?n.classList.replace("not-presenting","presenting"):n.classList.replace("presenting","not-presenting")}},t.prototype.toggle=function(){switch(this.mode){case PresentationMode.Slides:this.mode=PresentationMode.Web;break;case PresentationMode.Web:this.mode=PresentationMode.Slides}this.setMode(),this.updatePage()},t.prototype.processNotes=function(t){var e=t.indexOf("\n");console.log("%c"+t.substr(e+1),"font-size: 14pt;")},t}(),___presentationModeHider=new PresentationModeHider,END_KEY="end-date",MIN_KEY="total-minutes",PresentationTimer=function(){function t(){var e=this;window.addEventListener("keyup",function(t){if(t.altKey)switch(t.key){case"g":return e.start();case"ArrowUp":return e.updateEnd(1);case"ArrowDown":return e.updateEnd(-1);case"m":return e.promptForMinutes();case".":return e.stop()}});var t=this.getEnd();t&&(this.end=new Date(t),this.tick())}return t.prototype.tick=function(){this.timeout=null;var t=new Date;if(t>=this.end)return this.update(0,0);var e=+this.end-+t,n=Math.floor(e/1e3),o=Math.floor(n/60);this.update(o,n-60*o),this.timeout=window.setTimeout(this.tick.bind(this),1e3)},t.prototype.getEnd=function(){var t=localStorage.getItem(END_KEY);this.minutes=+localStorage.getItem(MIN_KEY)||45;var e=new Date;if(e.setHours(e.getHours()+1),t&&!(+t<+e))return t;localStorage.removeItem(END_KEY)},t.prototype.start=function(){var t=new Date,e=t.getMinutes();t.setMinutes(e+this.minutes),this.end=t,this.saveGlobals(),this.tick()},t.prototype.stop=function(){this.timeout&&clearTimeout(this.timeout),localStorage.removeItem(END_KEY);var t=document.getElementById("counter");t&&t.parentElement.removeChild(t)},t.prototype.update=function(t,e){var n=this.getCounterEl();n.innerHTML=this.formatTime(t,e),n.style.borderColor=this.getColor(60*t+e)},t.prototype.formatTime=function(t,e){if(60<=t){var n=Math.floor(t/60);return t-=60*n,n+":"+this.twoDigits(t)+":"+this.twoDigits(e)}return this.twoDigits(t)+":"+this.twoDigits(e)},t.prototype.twoDigits=function(t){return("0"+t).substr(-2)},t.prototype.getCounterEl=function(){var t=document.getElementById("counter");return t||((t=document.createElement("div")).style.position="fixed",t.style.left="calc(100% - 10px)",t.style.top="55px",t.style.width="70px",t.style.textAlign="right",t.style.border="2px solid var(--quote-border)",t.style.color="var(--fg)",t.style.borderRadius="5px",t.style.paddingLeft="5px",t.style.backgroundColor="var(--bg)",t.setAttribute("id","counter"),t.addEventListener("mouseenter",function(t){t.currentTarget.style.left="calc(100% - 70px)",t.currentTarget.style.textAlign="left"}),t.addEventListener("mouseleave",function(t){t.currentTarget.style.left="calc(100% - 10px)",t.currentTarget.style.textAlign="right"}),document.body.appendChild(t),t)},t.prototype.getColor=function(t){var e=t/(60*this.minutes),n=1-e,o=0,i=0;return n<.5?o=i=255*n*2:i=2*e*(o=255),"rgb("+o.toFixed(2)+", "+i.toFixed(2)+", 0)"},t.prototype.updateEnd=function(t){this.timeout&&(clearTimeout(this.timeout),this.timeout=null);var e=this.end.getMinutes();e+=t,this.minutes+=t,this.end.setMinutes(e),this.saveGlobals(),this.tick()},t.prototype.saveGlobals=function(){localStorage.setItem(END_KEY,this.end.toString()),this.saveMinutes()},t.prototype.saveMinutes=function(){localStorage.setItem(MIN_KEY,this.minutes.toString())},t.prototype.promptForMinutes=function(){if(!document.getElementById("minutes-prompt")){var t=document.createElement("div");t.setAttribute("id","minutes-prompt"),t.style.position="absolute",t.style.left="calc(50% - 50px)",t.style.top="calc(50% - 25px)",t.style.display="flex",t.style.flexFlow="column",t.style.justifyContent="space-between",t.style.alignItems="center",t.style.boxShadow="1px 1px 1px 1px var(--quote-border)",t.style.backgroundColor="var(--bg)",t.style.padding="5px";var e=document.createElement("label");e.setAttribute("for","minutes-inputs"),e.appendChild(document.createTextNode("Presentation Length"));var n=document.createElement("input");n.setAttribute("type","number"),n.setAttribute("min","1"),n.setAttribute("name","minutes-input"),n.setAttribute("id","minutes-input"),n.value=(this.minutes||0).toString();var o=document.createElement("button");o.setAttribute("type","button"),o.addEventListener("click",this.promptOk.bind(this)),o.appendChild(document.createTextNode("OK")),t.appendChild(e),t.appendChild(n),t.appendChild(o),document.body.appendChild(t),n.focus()}},t.prototype.promptOk=function(){var t=document.getElementById("minutes-input");if(t){var e=+t.value;this.end?this.updateEnd(e-this.minutes):(this.minutes=e,this.saveMinutes())}t.parentElement.parentElement.removeChild(t.parentElement)},t}(),___presentationTimer=new PresentationTimer;