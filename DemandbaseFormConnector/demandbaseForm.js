/**
  File: demandbaseForm.js  v.beta_0.8
  Name: Demandbase Form Module
  Authors:  Matthew Downs (mdowns[at@]demandbase[dot.]com),
            Ilya Hoffman (Ilya[at@]SynapseAutomation[dot.]com),
  Support Contact: strategicservices[at@]demandbase[dot.]com
  License: Copyright 2013. This code may not be reused without explicit permission by its owners. All rights reserved.
**/

/***
Instructions:
Step 1 - Add this file to your HTML page (or landing page template)
    <!-- Including Demandbase Form Connector -->
    <script src="[YOUR_JS_PATH]/demandbaseForm.js" type="text/javascript"></script>

Step 2 - Update this file with required info:
        1.  Fill in Demandbase Key, Company ID, and Email ID (key, emailID, companyID)
        2a. Update hiddenFieldMap - Add field IDs for hidden fields to be populated by Demandbase data
            (add additional fields or remove unused fields as needed)
        2b. Update visibleFieldMap - Add field IDs for visible fields to be populated by Demandbase data
        3.  (Optional) Add the form name (or use formNameList if using multiple forms with different names)
            Note: first form in DOM is used if no form is specified.
        4. Search for comments with "Required" and "Optional" and fill-in required values and make additional adjustments as-needed

Testing:
    -Set "debug" property to true to enable alerts if there is an error calling the API
    -Set "showResult" property to true to display a table of Demandbase fields on the page
        -Be sure to set both these values to false before deploying this script to a production environment
    -To simulate a visit from a particular IP address, specify a value for the 'query' parameter (on the s.src variable)
     in the "_loadAsyncScript" function
    -See www.demandbaselabs.com/form.html for an example of this file in action

When using this file for multiple forms or multiple landing pages, ensure that the email, company name
and any hidden fields populated by Demandbase have the same DOM name (or DOM ID).
If the fields have different names (and it is not possible to rename (or recreate) the fields), then
create a mapping in this file to correlate form names, emailIDs and companyIDs.

Visit www.demandbaselabs.com for a live examples of Demandbase in action.
Contact Demandbase Strategic Services with questions, comments, or requests. <demandbaselabs[at@]demandbase[dot.]com>
***/

/** This section contains JS libraries and widget.js **/
/** !!!!!!!!!!!!! DO NOT MODIFY ANYTHING BETWEEN THESE LINES !!!!!!!!!!!!!!!!!!!!!!!!!!!!!! **/
(function(e,p){function f(a){return c.isWindow(a)?a:9===a.nodeType?a.defaultView||a.parentWindow:!1}function k(a){if(!fa[a]){var b=c("<"+a+">").appendTo("body"),d=b.css("display");b.remove();if("none"===d||""===d)d="block";fa[a]=d}return fa[a]}function m(a,b){var d={};c.each(qa.concat.apply([],qa.slice(0,b)),function(){d[this]=a});return d}function l(){try{return new e.XMLHttpRequest}catch(a){}}function q(){c(e).unload(function(){for(var a in M)M[a](0,1)})}function w(a,b,d,g){if(c.isArray(b)&&b.length)c.each(b,
function(b,h){d||Oa.test(a)?g(a,h):w(a+"["+("object"===typeof h||c.isArray(h)?b:"")+"]",h,d,g)});else if(d||null==b||"object"!==typeof b)g(a,b);else if(c.isArray(b)||c.isEmptyObject(b))g(a,"");else for(var h in b)w(a+"["+h+"]",b[h],d,g)}function x(a,b,c,g,h,n){h=h||b.dataTypes[0];n=n||{};n[h]=!0;h=a[h];for(var s=0,e=h?h.length:0,f=a===ga,E;s<e&&(f||!E);s++)E=h[s](b,c,g),"string"===typeof E&&(!f||n[E]?E=p:(b.dataTypes.unshift(E),E=x(a,b,c,g,E,n)));!f&&E||n["*"]||(E=x(a,b,c,g,"*",n));return E}function v(a){return function(b,
d){"string"!==typeof b&&(d=b,b="*");if(c.isFunction(d))for(var g=b.toLowerCase().split(ra),h=0,n=g.length,s,e;h<n;h++)s=g[h],(e=/^\+/.test(s))&&(s=s.substr(1)||"*"),s=a[s]=a[s]||[],s[e?"unshift":"push"](d)}}function u(a,b,d){var g="width"===b?a.offsetWidth:a.offsetHeight;if("border"===d)return g;c.each("width"===b?Pa:Qa,function(){d||(g-=parseFloat(c.css(a,"padding"+this))||0);"margin"===d?g+=parseFloat(c.css(a,"margin"+this))||0:g-=parseFloat(c.css(a,"border"+this+"Width"))||0});return g}function D(a,
b){b.src?c.ajax({url:b.src,async:!1,dataType:"script"}):c.globalEval(b.text||b.textContent||b.innerHTML||"");b.parentNode&&b.parentNode.removeChild(b)}function z(a){return"getElementsByTagName"in a?a.getElementsByTagName("*"):"querySelectorAll"in a?a.querySelectorAll("*"):[]}function B(a,b){if(1===b.nodeType){var d=b.nodeName.toLowerCase();b.clearAttributes();b.mergeAttributes(a);if("object"===d)b.outerHTML=a.outerHTML;else if("input"!==d||"checkbox"!==a.type&&"radio"!==a.type)if("option"===d)b.selected=
a.defaultSelected;else{if("input"===d||"textarea"===d)b.defaultValue=a.defaultValue}else a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);b.removeAttribute(c.expando)}}function G(a,b){if(1===b.nodeType&&c.hasData(a)){var d=c.expando,g=c.data(a),h=c.data(b,g);if(g=g[d]){var n=g.events,h=h[d]=c.extend({},g);if(n){delete h.handle;h.events={};for(var s in n)for(d=0,g=n[s].length;d<g;d++)c.event.add(b,s+(n[s][d].namespace?".":"")+n[s][d].namespace,n[s][d],n[s][d].data)}}}}
function N(a,b,d){if(c.isFunction(b))return c.grep(a,function(a,c){return!!b.call(a,c,a)===d});if(b.nodeType)return c.grep(a,function(a,c){return a===b===d});if("string"===typeof b){var g=c.grep(a,function(a){return 1===a.nodeType});if(Ra.test(b))return c.filter(b,g,!d);b=c.filter(b,g)}return c.grep(a,function(a,g){return 0<=c.inArray(a,b)===d})}function O(a,b){return(a&&"*"!==a?a+".":"")+b.replace(Sa,"`").replace(Ta,"&")}function Ua(a){var b,d,g,h,n,s,e,f,E,l,m,k=[];h=[];n=c._data(this,"events");
if(a.liveFired!==this&&n&&n.live&&!(a.target.disabled||a.button&&"click"===a.type)){a.namespace&&(m=RegExp("(^|\\.)"+a.namespace.split(".").join("\\.(?:.*\\.)?")+"(\\.|$)"));a.liveFired=this;var q=n.live.slice(0);for(e=0;e<q.length;e++)n=q[e],n.origType.replace(aa,"")===a.type?h.push(n.selector):q.splice(e--,1);h=c(a.target).closest(h,a.currentTarget);f=0;for(E=h.length;f<E;f++)for(l=h[f],e=0;e<q.length;e++)if(n=q[e],l.selector===n.selector&&(!m||m.test(n.namespace))&&!l.elem.disabled){s=l.elem;g=
null;if("mouseenter"===n.preType||"mouseleave"===n.preType)a.type=n.preType,g=c(a.relatedTarget).closest(n.selector)[0];g&&g===s||k.push({elem:s,handleObj:n,level:l.level})}f=0;for(E=k.length;f<E;f++){h=k[f];if(d&&h.level>d)break;a.currentTarget=h.elem;a.data=h.handleObj.data;a.handleObj=h.handleObj;m=h.handleObj.origHandler.apply(h.elem,arguments);if(!1===m||a.isPropagationStopped())if(d=h.level,!1===m&&(b=!1),a.isImmediatePropagationStopped())break}return b}}function sa(a,b,d){var g=c.extend({},
d[0]);g.type=a;g.originalEvent={};g.liveFired=p;c.event.handle.call(b,g);g.isDefaultPrevented()&&d[0].preventDefault()}function L(){return!0}function y(){return!1}function I(a){for(var b in a)if("toJSON"!==b)return!1;return!0}function U(a,b,d){if(d===p&&1===a.nodeType)if(d=a.getAttribute("data-"+b),"string"===typeof d){try{d="true"===d?!0:"false"===d?!1:"null"===d?null:c.isNaN(d)?Va.test(d)?c.parseJSON(d):d:parseFloat(d)}catch(g){}c.data(a,b,d)}else d=p;return d}var r=e.document,c=function(){function a(){if(!b.isReady){try{r.documentElement.doScroll("left")}catch(c){setTimeout(a,
1);return}b.ready()}}var b=function(a,c){return new b.fn.init(a,c,h)},c=e.jQuery,g=e.$,h,n=/^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,s=/\S/,f=/^\s+/,l=/\s+$/,E=/\d/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,k=/^[\],:{}\s]*$/,q=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,w=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,u=/(?:^|:|,)(?:\s*\[)+/g,x=/(webkit)[ \/]([\w.]+)/,v=/(opera)(?:.*version)?[ \/]([\w.]+)/,z=/(msie) ([\w.]+)/,y=/(mozilla)(?:.*? rv:([\w.]+))?/,t=navigator.userAgent,ta=!1,ja,ka=
"then done fail isResolved isRejected promise".split(" "),V,Wa=Object.prototype.toString,la=Object.prototype.hasOwnProperty,ma=Array.prototype.push,Y=Array.prototype.slice,B=String.prototype.trim,ua=Array.prototype.indexOf,D={};b.fn=b.prototype={constructor:b,init:function(a,c,d){var g,h;if(!a)return this;if(a.nodeType)return this.context=this[0]=a,this.length=1,this;if("body"===a&&!c&&r.body)return this.context=r,this[0]=r.body,this.selector="body",this.length=1,this;if("string"===typeof a){g=n.exec(a);
if(!g||!g[1]&&c)return!c||c.jquery?(c||d).find(a):this.constructor(c).find(a);if(g[1])return h=(c=c instanceof b?c[0]:c)?c.ownerDocument||c:r,(d=m.exec(a))?b.isPlainObject(c)?(a=[r.createElement(d[1])],b.fn.attr.call(a,c,!0)):a=[h.createElement(d[1])]:(d=b.buildFragment([g[1]],[h]),a=(d.cacheable?b.clone(d.fragment):d.fragment).childNodes),b.merge(this,a);if((c=r.getElementById(g[2]))&&c.parentNode){if(c.id!==g[2])return d.find(a);this.length=1;this[0]=c}this.context=r;this.selector=a;return this}if(b.isFunction(a))return d.ready(a);
a.selector!==p&&(this.selector=a.selector,this.context=a.context);return b.makeArray(a,this)},selector:"",jquery:"1.5.1",length:0,size:function(){return this.length},toArray:function(){return Y.call(this,0)},get:function(a){return null==a?this.toArray():0>a?this[this.length+a]:this[a]},pushStack:function(a,c,d){var g=this.constructor();b.isArray(a)?ma.apply(g,a):b.merge(g,a);g.prevObject=this;g.context=this.context;"find"===c?g.selector=this.selector+(this.selector?" ":"")+d:c&&(g.selector=this.selector+
"."+c+"("+d+")");return g},each:function(a,c){return b.each(this,a,c)},ready:function(a){b.bindReady();ja.done(a);return this},eq:function(a){return-1===a?this.slice(a):this.slice(a,+a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(Y.apply(this,arguments),"slice",Y.call(arguments).join(","))},map:function(a){return this.pushStack(b.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},
push:ma,sort:[].sort,splice:[].splice};b.fn.init.prototype=b.fn;b.extend=b.fn.extend=function(){var a,c,d,g,h,t,n=arguments[0]||{},e=1,s=arguments.length,f=!1;"boolean"===typeof n&&(f=n,n=arguments[1]||{},e=2);"object"!==typeof n&&!b.isFunction(n)&&(n={});for(s===e&&(n=this,--e);e<s;e++)if(null!=(a=arguments[e]))for(c in a)d=n[c],g=a[c],n!==g&&(f&&g&&(b.isPlainObject(g)||(h=b.isArray(g)))?(h?(h=!1,t=d&&b.isArray(d)?d:[]):t=d&&b.isPlainObject(d)?d:{},n[c]=b.extend(f,t,g)):g!==p&&(n[c]=g));return n};
b.extend({noConflict:function(a){e.$=g;a&&(e.jQuery=c);return b},isReady:!1,readyWait:1,ready:function(a){!0===a&&b.readyWait--;if(!b.readyWait||!0!==a&&!b.isReady){if(!r.body)return setTimeout(b.ready,1);b.isReady=!0;!0!==a&&0<--b.readyWait||(ja.resolveWith(r,[b]),b.fn.trigger&&b(r).trigger("ready").unbind("ready"))}},bindReady:function(){if(!ta){ta=!0;if("complete"===r.readyState)return setTimeout(b.ready,1);if(r.addEventListener)r.addEventListener("DOMContentLoaded",V,!1),e.addEventListener("load",
b.ready,!1);else if(r.attachEvent){r.attachEvent("onreadystatechange",V);e.attachEvent("onload",b.ready);var c=!1;try{c=null==e.frameElement}catch(d){}r.documentElement.doScroll&&c&&a()}}},isFunction:function(a){return"function"===b.type(a)},isArray:Array.isArray||function(a){return"array"===b.type(a)},isWindow:function(a){return a&&"object"===typeof a&&"setInterval"in a},isNaN:function(a){return null==a||!E.test(a)||isNaN(a)},type:function(a){return null==a?String(a):D[Wa.call(a)]||"object"},isPlainObject:function(a){if(!a||
("object"!==b.type(a)||a.nodeType||b.isWindow(a))||a.constructor&&!la.call(a,"constructor")&&!la.call(a.constructor.prototype,"isPrototypeOf"))return!1;for(var c in a);return c===p||la.call(a,c)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw a;},parseJSON:function(a){if("string"!==typeof a||!a)return null;a=b.trim(a);if(k.test(a.replace(q,"@").replace(w,"]").replace(u,"")))return e.JSON&&e.JSON.parse?e.JSON.parse(a):(new Function("return "+a))();b.error("Invalid JSON: "+
a)},parseXML:function(a,c,d){e.DOMParser?(d=new DOMParser,c=d.parseFromString(a,"text/xml")):(c=new ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(a));(d=c.documentElement)&&d.nodeName&&"parsererror"!==d.nodeName||b.error("Invalid XML: "+a);return c},noop:function(){},globalEval:function(a){if(a&&s.test(a)){var c=r.head||r.getElementsByTagName("head")[0]||r.documentElement,d=r.createElement("script");b.support.scriptEval()?d.appendChild(r.createTextNode(a)):d.text=a;c.insertBefore(d,
c.firstChild);c.removeChild(d)}},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var g,h=0,t=a.length,n=t===p||b.isFunction(a);if(d)if(n)for(g in a){if(!1===c.apply(a[g],d))break}else for(;h<t&&!1!==c.apply(a[h++],d););else if(n)for(g in a){if(!1===c.call(a[g],g,a[g]))break}else for(d=a[0];h<t&&!1!==c.call(d,h,d);d=a[++h]);return a},trim:B?function(a){return null==a?"":B.call(a)}:function(a){return null==a?"":(a+"").replace(f,"").replace(l,
"")},makeArray:function(a,c){var d=c||[];if(null!=a){var g=b.type(a);null==a.length||"string"===g||"function"===g||"regexp"===g||b.isWindow(a)?ma.call(d,a):b.merge(d,a)}return d},inArray:function(a,b){if(b.indexOf)return b.indexOf(a);for(var c=0,d=b.length;c<d;c++)if(b[c]===a)return c;return-1},merge:function(a,b){var c=a.length,d=0;if("number"===typeof b.length)for(var g=b.length;d<g;d++)a[c++]=b[d];else for(;b[d]!==p;)a[c++]=b[d++];a.length=c;return a},grep:function(a,b,c){var d=[],g;c=!!c;for(var h=
0,t=a.length;h<t;h++)g=!!b(a[h],h),c!==g&&d.push(a[h]);return d},map:function(a,b,c){for(var d=[],g,h=0,t=a.length;h<t;h++)g=b(a[h],h,c),null!=g&&(d[d.length]=g);return d.concat.apply([],d)},guid:1,proxy:function(a,c,d){2===arguments.length&&("string"===typeof c?(d=a,a=d[c],c=p):c&&!b.isFunction(c)&&(d=c,c=p));!c&&a&&(c=function(){return a.apply(d||this,arguments)});a&&(c.guid=a.guid=a.guid||c.guid||b.guid++);return c},access:function(a,c,d,g,h,t){var n=a.length;if("object"===typeof c){for(var e in c)b.access(a,
e,c[e],g,h,d);return a}if(d!==p){g=!t&&g&&b.isFunction(d);for(e=0;e<n;e++)h(a[e],c,g?d.call(a[e],e,h(a[e],c)):d,t);return a}return n?h(a[0],c):p},now:function(){return(new Date).getTime()},_Deferred:function(){var a=[],c,d,g,h={done:function(){if(!g){var d=arguments,t,n,e,s,f;c&&(f=c,c=0);t=0;for(n=d.length;t<n;t++)e=d[t],s=b.type(e),"array"===s?h.done.apply(h,e):"function"===s&&a.push(e);f&&h.resolveWith(f[0],f[1])}return this},resolveWith:function(b,h){if(!g&&!c&&!d){d=1;try{for(;a[0];)a.shift().apply(b,
h)}catch(t){throw t;}finally{c=[b,h],d=0}}return this},resolve:function(){h.resolveWith(b.isFunction(this.promise)?this.promise():this,arguments);return this},isResolved:function(){return d||c},cancel:function(){g=1;a=[];return this}};return h},Deferred:function(a){var c=b._Deferred(),d=b._Deferred(),g;b.extend(c,{then:function(a,b){c.done(a).fail(b);return this},fail:d.done,rejectWith:d.resolveWith,reject:d.resolve,isRejected:d.isResolved,promise:function(a){if(null==a){if(g)return g;g=a={}}for(var b=
ka.length;b--;)a[ka[b]]=c[ka[b]];return a}});c.done(d.cancel).fail(c.cancel);delete c.cancel;a&&a.call(c,c);return c},when:function(a){var c=arguments.length,d=1>=c&&a&&b.isFunction(a.promise)?a:b.Deferred(),g=d.promise();if(1<c){for(var h=Y.call(arguments,0),t=c,n=function(a){return function(b){h[a]=1<arguments.length?Y.call(arguments,0):b;--t||d.resolveWith(g,h)}};c--;)(a=h[c])&&b.isFunction(a.promise)?a.promise().then(n(c),d.reject):--t;t||d.resolveWith(g,h)}else d!==a&&d.resolve(a);return g},
uaMatch:function(a){a=a.toLowerCase();a=x.exec(a)||v.exec(a)||z.exec(a)||0>a.indexOf("compatible")&&y.exec(a)||[];return{browser:a[1]||"",version:a[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}b.extend(!0,a,this);a.superclass=this;a.fn=a.prototype=this();a.fn.constructor=a;a.subclass=this.subclass;a.fn.init=function(d,g){g&&g instanceof b&&!(g instanceof a)&&(g=a(g));return b.fn.init.call(this,d,g,c)};a.fn.init.prototype=a.fn;var c=a(r);return a},browser:{}});ja=b._Deferred();
b.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){D["[object "+b+"]"]=b.toLowerCase()});t=b.uaMatch(t);t.browser&&(b.browser[t.browser]=!0,b.browser.version=t.version);b.browser.webkit&&(b.browser.safari=!0);ua&&(b.inArray=function(a,b){return ua.call(b,a)});s.test("\u00a0")&&(f=/^[\s\xA0]+/,l=/[\s\xA0]+$/);h=b(r);r.addEventListener?V=function(){r.removeEventListener("DOMContentLoaded",V,!1);b.ready()}:r.attachEvent&&(V=function(){"complete"===r.readyState&&
(r.detachEvent("onreadystatechange",V),b.ready())});return b}();(function(){c.support={};var a=r.createElement("div");a.style.display="none";a.innerHTML="   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";var b=a.getElementsByTagName("*"),d=a.getElementsByTagName("a")[0],g=r.createElement("select"),h=g.appendChild(r.createElement("option")),n=a.getElementsByTagName("input")[0];if(b&&b.length&&d){c.support={leadingWhitespace:3===a.firstChild.nodeType,
tbody:!a.getElementsByTagName("tbody").length,htmlSerialize:!!a.getElementsByTagName("link").length,style:/red/.test(d.getAttribute("style")),hrefNormalized:"/a"===d.getAttribute("href"),opacity:/^0.55$/.test(d.style.opacity),cssFloat:!!d.style.cssFloat,checkOn:"on"===n.value,optSelected:h.selected,deleteExpando:!0,optDisabled:!1,checkClone:!1,noCloneEvent:!0,noCloneChecked:!0,boxModel:null,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableHiddenOffsets:!0};n.checked=!0;c.support.noCloneChecked=
n.cloneNode(!0).checked;g.disabled=!0;c.support.optDisabled=!h.disabled;var s=null;c.support.scriptEval=function(){if(null===s){var a=r.documentElement,b=r.createElement("script"),d="script"+c.now();try{b.appendChild(r.createTextNode("window."+d+"=1;"))}catch(g){}a.insertBefore(b,a.firstChild);e[d]?(s=!0,delete e[d]):s=!1;a.removeChild(b)}return s};try{delete a.test}catch(f){c.support.deleteExpando=!1}!a.addEventListener&&a.attachEvent&&a.fireEvent&&(a.attachEvent("onclick",function E(){c.support.noCloneEvent=
!1;a.detachEvent("onclick",E)}),a.cloneNode(!0).fireEvent("onclick"));a=r.createElement("div");a.innerHTML="<input type='radio' name='radiotest' checked='checked'/>";b=r.createDocumentFragment();b.appendChild(a.firstChild);c.support.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked;c(function(){var a=r.createElement("div"),b=r.getElementsByTagName("body")[0];if(b){a.style.width=a.style.paddingLeft="1px";b.appendChild(a);c.boxModel=c.support.boxModel=2===a.offsetWidth;"zoom"in a.style&&(a.style.display=
"inline",a.style.zoom=1,c.support.inlineBlockNeedsLayout=2===a.offsetWidth,a.style.display="",a.innerHTML="<div style='width:4px;'></div>",c.support.shrinkWrapBlocks=2!==a.offsetWidth);a.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";var d=a.getElementsByTagName("td");c.support.reliableHiddenOffsets=0===d[0].offsetHeight;d[0].style.display="";d[1].style.display="none";c.support.reliableHiddenOffsets=c.support.reliableHiddenOffsets&&0===d[0].offsetHeight;
a.innerHTML="";b.removeChild(a).style.display="none"}});b=function(a){var b=r.createElement("div");a="on"+a;if(!b.attachEvent)return!0;var c=a in b;c||(b.setAttribute(a,"return;"),c="function"===typeof b[a]);return c};c.support.submitBubbles=b("submit");c.support.changeBubbles=b("change");a=b=d=null}})();var Va=/^(?:\{.*\}|\[.*\])$/;c.extend({cache:{},uuid:0,expando:"jQuery"+(c.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},
hasData:function(a){a=a.nodeType?c.cache[a[c.expando]]:a[c.expando];return!!a&&!I(a)},data:function(a,b,d,g){if(c.acceptData(a)){var h=c.expando,n="string"===typeof b,e=a.nodeType,f=e?c.cache:a,l=e?a[c.expando]:a[c.expando]&&c.expando;if(l&&(!g||!l||f[l][h])||!n||d!==p){l||(e?a[c.expando]=l=++c.uuid:l=c.expando);f[l]||(f[l]={},e||(f[l].toJSON=c.noop));if("object"===typeof b||"function"===typeof b)g?f[l][h]=c.extend(f[l][h],b):f[l]=c.extend(f[l],b);a=f[l];g&&(a[h]||(a[h]={}),a=a[h]);d!==p&&(a[b]=d);
return"events"!==b||a[b]?n?a[b]:a:a[h]&&a[h].events}}},removeData:function(a,b,d){if(c.acceptData(a)){var g=c.expando,h=a.nodeType,n=h?c.cache:a,s=h?a[c.expando]:c.expando;if(n[s]){if(b){var f=d?n[s][g]:n[s];if(f&&(delete f[b],!I(f)))return}if(d&&(delete n[s][g],!I(n[s])))return;b=n[s][g];c.support.deleteExpando||n!=e?delete n[s]:n[s]=null;b?(n[s]={},h||(n[s].toJSON=c.noop),n[s][g]=b):h&&(c.support.deleteExpando?delete a[c.expando]:a.removeAttribute?a.removeAttribute(c.expando):a[c.expando]=null)}}},
_data:function(a,b,d){return c.data(a,b,d,!0)},acceptData:function(a){if(a.nodeName){var b=c.noData[a.nodeName.toLowerCase()];if(b)return!0!==b&&a.getAttribute("classid")===b}return!0}});c.fn.extend({data:function(a,b){var d=null;if("undefined"===typeof a){if(this.length&&(d=c.data(this[0]),1===this[0].nodeType))for(var g=this[0].attributes,h,n=0,e=g.length;n<e;n++)h=g[n].name,0===h.indexOf("data-")&&(h=h.substr(5),U(this[0],h,d[h]));return d}if("object"===typeof a)return this.each(function(){c.data(this,
a)});var f=a.split(".");f[1]=f[1]?"."+f[1]:"";return b===p?(d=this.triggerHandler("getData"+f[1]+"!",[f[0]]),d===p&&this.length&&(d=c.data(this[0],a),d=U(this[0],a,d)),d===p&&f[1]?this.data(f[0]):d):this.each(function(){var d=c(this),g=[f[0],b];d.triggerHandler("setData"+f[1]+"!",g);c.data(this,a,b);d.triggerHandler("changeData"+f[1]+"!",g)})},removeData:function(a){return this.each(function(){c.removeData(this,a)})}});c.extend({queue:function(a,b,d){if(a){b=(b||"fx")+"queue";var g=c._data(a,b);if(!d)return g||
[];!g||c.isArray(d)?g=c._data(a,b,c.makeArray(d)):g.push(d);return g}},dequeue:function(a,b){b=b||"fx";var d=c.queue(a,b),g=d.shift();"inprogress"===g&&(g=d.shift());g&&("fx"===b&&d.unshift("inprogress"),g.call(a,function(){c.dequeue(a,b)}));d.length||c.removeData(a,b+"queue",!0)}});c.fn.extend({queue:function(a,b){"string"!==typeof a&&(b=a,a="fx");return b===p?c.queue(this[0],a):this.each(function(d){d=c.queue(this,a,b);"fx"===a&&"inprogress"!==d[0]&&c.dequeue(this,a)})},dequeue:function(a){return this.each(function(){c.dequeue(this,
a)})},delay:function(a,b){a=c.fx?c.fx.speeds[a]||a:a;b=b||"fx";return this.queue(b,function(){var d=this;setTimeout(function(){c.dequeue(d,b)},a)})},clearQueue:function(a){return this.queue(a||"fx",[])}});var va=/[\n\t\r]/g,na=/\s+/,Xa=/\r/g,Ya=/^(?:href|src|style)$/,Za=/^(?:button|input)$/i,$a=/^(?:button|input|object|select|textarea)$/i,ab=/^a(?:rea)?$/i,wa=/^(?:radio|checkbox)$/i;c.props={"for":"htmlFor","class":"className",readonly:"readOnly",maxlength:"maxLength",cellspacing:"cellSpacing",rowspan:"rowSpan",
colspan:"colSpan",tabindex:"tabIndex",usemap:"useMap",frameborder:"frameBorder"};c.fn.extend({attr:function(a,b){return c.access(this,a,b,!0,c.attr)},removeAttr:function(a,b){return this.each(function(){c.attr(this,a,"");1===this.nodeType&&this.removeAttribute(a)})},addClass:function(a){if(c.isFunction(a))return this.each(function(b){var d=c(this);d.addClass(a.call(this,b,d.attr("class")))});if(a&&"string"===typeof a)for(var b=(a||"").split(na),d=0,g=this.length;d<g;d++){var h=this[d];if(1===h.nodeType)if(h.className){for(var n=
" "+h.className+" ",e=h.className,f=0,l=b.length;f<l;f++)0>n.indexOf(" "+b[f]+" ")&&(e+=" "+b[f]);h.className=c.trim(e)}else h.className=a}return this},removeClass:function(a){if(c.isFunction(a))return this.each(function(b){var d=c(this);d.removeClass(a.call(this,b,d.attr("class")))});if(a&&"string"===typeof a||a===p)for(var b=(a||"").split(na),d=0,g=this.length;d<g;d++){var h=this[d];if(1===h.nodeType&&h.className)if(a){for(var n=(" "+h.className+" ").replace(va," "),e=0,f=b.length;e<f;e++)n=n.replace(" "+
b[e]+" "," ");h.className=c.trim(n)}else h.className=""}return this},toggleClass:function(a,b){var d=typeof a,g="boolean"===typeof b;return c.isFunction(a)?this.each(function(d){var g=c(this);g.toggleClass(a.call(this,d,g.attr("class"),b),b)}):this.each(function(){if("string"===d)for(var h,n=0,e=c(this),f=b,l=a.split(na);h=l[n++];)f=g?f:!e.hasClass(h),e[f?"addClass":"removeClass"](h);else if("undefined"===d||"boolean"===d)this.className&&c._data(this,"__className__",this.className),this.className=
this.className||!1===a?"":c._data(this,"__className__")||""})},hasClass:function(a){a=" "+a+" ";for(var b=0,c=this.length;b<c;b++)if(-1<(" "+this[b].className+" ").replace(va," ").indexOf(a))return!0;return!1},val:function(a){if(!arguments.length){var b=this[0];if(b){if(c.nodeName(b,"option")){var d=b.attributes.value;return!d||d.specified?b.value:b.text}if(c.nodeName(b,"select")){var d=b.selectedIndex,g=[],h=b.options,b="select-one"===b.type;if(0>d)return null;for(var n=b?d:0,e=b?d+1:h.length;n<
e;n++){var f=h[n];if(f.selected&&!((c.support.optDisabled?f.disabled:null!==f.getAttribute("disabled"))||f.parentNode.disabled&&c.nodeName(f.parentNode,"optgroup"))){a=c(f).val();if(b)return a;g.push(a)}}return b&&!g.length&&h.length?c(h[d]).val():g}return wa.test(b.type)&&!c.support.checkOn?null===b.getAttribute("value")?"on":b.value:(b.value||"").replace(Xa,"")}return p}var l=c.isFunction(a);return this.each(function(b){var d=c(this),g=a;if(1===this.nodeType)if(l&&(g=a.call(this,b,d.val())),null==
g?g="":"number"===typeof g?g+="":c.isArray(g)&&(g=c.map(g,function(a){return null==a?"":a+""})),c.isArray(g)&&wa.test(this.type))this.checked=0<=c.inArray(d.val(),g);else if(c.nodeName(this,"select")){var h=c.makeArray(g);c("option",this).each(function(){this.selected=0<=c.inArray(c(this).val(),h)});h.length||(this.selectedIndex=-1)}else this.value=g})}});c.extend({attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,b,d,g){if(!a||3===a.nodeType||8===a.nodeType||
2===a.nodeType)return p;if(g&&b in c.attrFn)return c(a)[b](d);g=1!==a.nodeType||!c.isXMLDoc(a);var h=d!==p;b=g&&c.props[b]||b;if(1===a.nodeType){var n=Ya.test(b);if("selected"===b&&!c.support.optSelected){var e=a.parentNode;e&&(e.selectedIndex,e.parentNode&&e.parentNode.selectedIndex)}if((b in a||a[b]!==p)&&g&&!n)return h&&("type"===b&&Za.test(a.nodeName)&&a.parentNode&&c.error("type property can't be changed"),null===d?1===a.nodeType&&a.removeAttribute(b):a[b]=d),c.nodeName(a,"form")&&a.getAttributeNode(b)?
a.getAttributeNode(b).nodeValue:"tabIndex"===b?(b=a.getAttributeNode("tabIndex"))&&b.specified?b.value:$a.test(a.nodeName)||ab.test(a.nodeName)&&a.href?0:p:a[b];if(!c.support.style&&g&&"style"===b)return h&&(a.style.cssText=""+d),a.style.cssText;h&&a.setAttribute(b,""+d);if(!a.attributes[b]&&a.hasAttribute&&!a.hasAttribute(b))return p;a=!c.support.hrefNormalized&&g&&n?a.getAttribute(b,2):a.getAttribute(b);return null===a?p:a}h&&(a[b]=d);return a[b]}});var aa=/\.(.*)$/,oa=/^(?:textarea|input|select)$/i,
Sa=/\./g,Ta=/ /g,bb=/[^\w\s.|`]/g,cb=function(a){return a.replace(bb,"\\$&")};c.event={add:function(a,b,d,g){if(3!==a.nodeType&&8!==a.nodeType){try{c.isWindow(a)&&a!==e&&!a.frameElement&&(a=e)}catch(h){}if(!1===d)d=y;else if(!d)return;var n,f;d.handler&&(n=d,d=n.handler);d.guid||(d.guid=c.guid++);if(f=c._data(a)){var l=f.events,m=f.handle;l||(f.events=l={});m||(f.handle=m=function(){return"undefined"===typeof c||c.event.triggered?p:c.event.handle.apply(m.elem,arguments)});m.elem=a;b=b.split(" ");
for(var k,q=0,r;k=b[q++];){f=n?c.extend({},n):{handler:d,data:g};-1<k.indexOf(".")?(r=k.split("."),k=r.shift(),f.namespace=r.slice(0).sort().join(".")):(r=[],f.namespace="");f.type=k;f.guid||(f.guid=d.guid);var w=l[k],u=c.event.special[k]||{};w||(w=l[k]=[],u.setup&&!1!==u.setup.call(a,g,r,m)||(a.addEventListener?a.addEventListener(k,m,!1):a.attachEvent&&a.attachEvent("on"+k,m)));u.add&&(u.add.call(a,f),f.handler.guid||(f.handler.guid=d.guid));w.push(f);c.event.global[k]=!0}a=null}}},global:{},remove:function(a,
b,d,g){if(3!==a.nodeType&&8!==a.nodeType){!1===d&&(d=y);var h,n,e=0,f,l,m,k,q,r,w=c.hasData(a)&&c._data(a),u=w&&w.events;if(w&&u)if(b&&b.type&&(d=b.handler,b=b.type),!b||"string"===typeof b&&"."===b.charAt(0))for(h in b=b||"",u)c.event.remove(a,h+b);else{for(b=b.split(" ");h=b[e++];)if(k=h,f=0>h.indexOf("."),l=[],f||(l=h.split("."),h=l.shift(),m=RegExp("(^|\\.)"+c.map(l.slice(0).sort(),cb).join("\\.(?:.*\\.)?")+"(\\.|$)")),q=u[h])if(d){k=c.event.special[h]||{};for(n=g||0;n<q.length;n++)if(r=q[n],
d.guid===r.guid){if(f||m.test(r.namespace))null==g&&q.splice(n--,1),k.remove&&k.remove.call(a,r);if(null!=g)break}if(0===q.length||null!=g&&1===q.length)k.teardown&&!1!==k.teardown.call(a,l)||c.removeEvent(a,h,w.handle),delete u[h]}else for(n=0;n<q.length;n++)if(r=q[n],f||m.test(r.namespace))c.event.remove(a,k,r.handler,n),q.splice(n--,1);c.isEmptyObject(u)&&((b=w.handle)&&(b.elem=null),delete w.events,delete w.handle,c.isEmptyObject(w)&&c.removeData(a,p,!0))}}},trigger:function(a,b,d,g){var h=a.type||
a;if(!g){a="object"===typeof a?a[c.expando]?a:c.extend(c.Event(h),a):c.Event(h);0<=h.indexOf("!")&&(a.type=h=h.slice(0,-1),a.exclusive=!0);d||(a.stopPropagation(),c.event.global[h]&&c.each(c.cache,function(){var d=this[c.expando];d&&d.events&&d.events[h]&&c.event.trigger(a,b,d.handle.elem)}));if(!d||3===d.nodeType||8===d.nodeType)return p;a.result=p;a.target=d;b=c.makeArray(b);b.unshift(a)}a.currentTarget=d;(g=c._data(d,"handle"))&&g.apply(d,b);g=d.parentNode||d.ownerDocument;try{d&&d.nodeName&&c.noData[d.nodeName.toLowerCase()]||
d["on"+h]&&!1===d["on"+h].apply(d,b)&&(a.result=!1,a.preventDefault())}catch(n){}if(!a.isPropagationStopped()&&g)c.event.trigger(a,b,g,!0);else if(!a.isDefaultPrevented()){var e;g=a.target;var f=h.replace(aa,""),l=c.nodeName(g,"a")&&"click"===f,m=c.event.special[f]||{};if(!(m._default&&!1!==m._default.call(d,a)||l||g&&g.nodeName&&c.noData[g.nodeName.toLowerCase()])){try{g[f]&&(e=g["on"+f],e&&(g["on"+f]=null),c.event.triggered=!0,g[f]())}catch(k){}e&&(g["on"+f]=e);c.event.triggered=!1}}},handle:function(a){var b,
d,g,h;h=[];var n=c.makeArray(arguments);a=n[0]=c.event.fix(a||e.event);a.currentTarget=this;(b=0>a.type.indexOf(".")&&!a.exclusive)||(d=a.type.split("."),a.type=d.shift(),h=d.slice(0).sort(),g=RegExp("(^|\\.)"+h.join("\\.(?:.*\\.)?")+"(\\.|$)"));a.namespace=a.namespace||h.join(".");h=c._data(this,"events");d=(h||{})[a.type];if(h&&d){d=d.slice(0);h=0;for(var f=d.length;h<f;h++){var l=d[h];if(b||g.test(l.namespace))if(a.handler=l.handler,a.data=l.data,a.handleObj=l,l=l.handler.apply(this,n),l!==p&&
(a.result=l,!1===l&&(a.preventDefault(),a.stopPropagation())),a.isImmediatePropagationStopped())break}}return a.result},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),fix:function(a){if(a[c.expando])return a;
var b=a;a=c.Event(b);for(var d=this.props.length,g;d;)g=this.props[--d],a[g]=b[g];a.target||(a.target=a.srcElement||r);3===a.target.nodeType&&(a.target=a.target.parentNode);!a.relatedTarget&&a.fromElement&&(a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement);null==a.pageX&&null!=a.clientX&&(b=r.documentElement,d=r.body,a.pageX=a.clientX+(b&&b.scrollLeft||d&&d.scrollLeft||0)-(b&&b.clientLeft||d&&d.clientLeft||0),a.pageY=a.clientY+(b&&b.scrollTop||d&&d.scrollTop||0)-(b&&b.clientTop||
d&&d.clientTop||0));null!=a.which||null==a.charCode&&null==a.keyCode||(a.which=null!=a.charCode?a.charCode:a.keyCode);!a.metaKey&&a.ctrlKey&&(a.metaKey=a.ctrlKey);!a.which&&a.button!==p&&(a.which=a.button&1?1:a.button&2?3:a.button&4?2:0);return a},guid:1E8,proxy:c.proxy,special:{ready:{setup:c.bindReady,teardown:c.noop},live:{add:function(a){c.event.add(this,O(a.origType,a.selector),c.extend({},a,{handler:Ua,guid:a.handler.guid}))},remove:function(a){c.event.remove(this,O(a.origType,a.selector),a)}},
beforeunload:{setup:function(a,b,d){c.isWindow(this)&&(this.onbeforeunload=d)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}}};c.removeEvent=r.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)};c.Event=function(a){if(!this.preventDefault)return new c.Event(a);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||!1===a.returnValue||a.getPreventDefault&&
a.getPreventDefault()?L:y):this.type=a;this.timeStamp=c.now();this[c.expando]=!0};c.Event.prototype={preventDefault:function(){this.isDefaultPrevented=L;var a=this.originalEvent;a&&(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=L;var a=this.originalEvent;a&&(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=L;this.stopPropagation()},isDefaultPrevented:y,isPropagationStopped:y,
isImmediatePropagationStopped:y};var xa=function(a){var b=a.relatedTarget;try{if(b===r||b.parentNode){for(;b&&b!==this;)b=b.parentNode;b!==this&&(a.type=a.data,c.event.handle.apply(this,arguments))}}catch(d){}},ya=function(a){a.type=a.data;c.event.handle.apply(this,arguments)};c.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){c.event.special[a]={setup:function(d){c.event.add(this,b,d&&d.selector?ya:xa,a)},teardown:function(a){c.event.remove(this,b,a&&a.selector?ya:xa)}}});c.support.submitBubbles||
(c.event.special.submit={setup:function(a,b){if(this.nodeName&&"form"!==this.nodeName.toLowerCase())c.event.add(this,"click.specialSubmit",function(a){var b=a.target,h=b.type;("submit"===h||"image"===h)&&c(b).closest("form").length&&sa("submit",this,arguments)}),c.event.add(this,"keypress.specialSubmit",function(a){var b=a.target,h=b.type;("text"===h||"password"===h)&&c(b).closest("form").length&&13===a.keyCode&&sa("submit",this,arguments)});else return!1},teardown:function(a){c.event.remove(this,
".specialSubmit")}});if(!c.support.changeBubbles){var S,za=function(a){var b=a.type,d=a.value;"radio"===b||"checkbox"===b?d=a.checked:"select-multiple"===b?d=-1<a.selectedIndex?c.map(a.options,function(a){return a.selected}).join("-"):"":"select"===a.nodeName.toLowerCase()&&(d=a.selectedIndex);return d},ba=function(a,b){var d=a.target,g,h;oa.test(d.nodeName)&&!d.readOnly&&(g=c._data(d,"_change_data"),h=za(d),"focusout"===a.type&&"radio"===d.type||c._data(d,"_change_data",h),g===p||h===g||null==g&&
!h||(a.type="change",a.liveFired=p,c.event.trigger(a,b,d)))};c.event.special.change={filters:{focusout:ba,beforedeactivate:ba,click:function(a){var b=a.target,c=b.type;"radio"!==c&&"checkbox"!==c&&"select"!==b.nodeName.toLowerCase()||ba.call(this,a)},keydown:function(a){var b=a.target,c=b.type;(13===a.keyCode&&"textarea"!==b.nodeName.toLowerCase()||32===a.keyCode&&("checkbox"===c||"radio"===c)||"select-multiple"===c)&&ba.call(this,a)},beforeactivate:function(a){a=a.target;c._data(a,"_change_data",
za(a))}},setup:function(a,b){if("file"===this.type)return!1;for(var d in S)c.event.add(this,d+".specialChange",S[d]);return oa.test(this.nodeName)},teardown:function(a){c.event.remove(this,".specialChange");return oa.test(this.nodeName)}};S=c.event.special.change.filters;S.focus=S.beforeactivate}r.addEventListener&&c.each({focus:"focusin",blur:"focusout"},function(a,b){function d(a){a=c.event.fix(a);a.type=b;return c.event.handle.call(this,a)}c.event.special[b]={setup:function(){this.addEventListener(a,
d,!0)},teardown:function(){this.removeEventListener(a,d,!0)}}});c.each(["bind","one"],function(a,b){c.fn[b]=function(a,g,h){if("object"===typeof a){for(var n in a)this[b](n,g,a[n],h);return this}if(c.isFunction(g)||!1===g)h=g,g=p;var e="one"===b?c.proxy(h,function(a){c(this).unbind(a,e);return h.apply(this,arguments)}):h;if("unload"===a&&"one"!==b)this.one(a,g,h);else{n=0;for(var f=this.length;n<f;n++)c.event.add(this[n],a,e,g)}return this}});c.fn.extend({unbind:function(a,b){if("object"!==typeof a||
a.preventDefault)for(var d=0,g=this.length;d<g;d++)c.event.remove(this[d],a,b);else for(d in a)this.unbind(d,a[d]);return this},delegate:function(a,b,c,g){return this.live(b,c,g,a)},undelegate:function(a,b,c){return 0===arguments.length?this.unbind("live"):this.die(b,null,c,a)},trigger:function(a,b){return this.each(function(){c.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0]){var d=c.Event(a);d.preventDefault();d.stopPropagation();c.event.trigger(d,b,this[0]);return d.result}},
toggle:function(a){for(var b=arguments,d=1;d<b.length;)c.proxy(a,b[d++]);return this.click(c.proxy(a,function(g){var h=(c._data(this,"lastToggle"+a.guid)||0)%d;c._data(this,"lastToggle"+a.guid,h+1);g.preventDefault();return b[h].apply(this,arguments)||!1}))},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}});var Aa={focus:"focusin",blur:"focusout",mouseenter:"mouseover",mouseleave:"mouseout"};c.each(["live","die"],function(a,b){c.fn[b]=function(a,g,h,n){var e,f=0,l,m,k=n||this.selector;
n=n?this:c(this.context);if("object"===typeof a&&!a.preventDefault){for(e in a)n[b](e,g,a[e],k);return this}c.isFunction(g)&&(h=g,g=p);for(a=(a||"").split(" ");null!=(e=a[f++]);)if(l=aa.exec(e),m="",l&&(m=l[0],e=e.replace(aa,"")),"hover"===e)a.push("mouseenter"+m,"mouseleave"+m);else if(l=e,"focus"===e||"blur"===e?(a.push(Aa[e]+m),e+=m):e=(Aa[e]||e)+m,"live"===b){m=0;for(var q=n.length;m<q;m++)c.event.add(n[m],"live."+O(e,k),{data:g,selector:k,handler:h,origType:e,origHandler:h,preType:l})}else n.unbind("live."+
O(e,k),h);return this}});c.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "),function(a,b){c.fn[b]=function(a,c){null==c&&(c=a,a=null);return 0<arguments.length?this.bind(b,a,c):this.trigger(b)};c.attrFn&&(c.attrFn[b]=!0)});(function(){function a(a,b,c,d,g,h){g=0;for(var e=d.length;g<e;g++){var n=d[g];if(n){for(var f=!1,n=n[a];n;){if(n.sizcache===
c){f=d[n.sizset];break}if(1===n.nodeType)if(h||(n.sizcache=c,n.sizset=g),"string"!==typeof b){if(n===b){f=!0;break}}else if(0<k.filter(b,[n]).length){f=n;break}n=n[a]}d[g]=f}}}function b(a,b,c,d,g,h){g=0;for(var e=d.length;g<e;g++){var n=d[g];if(n){for(var f=!1,n=n[a];n;){if(n.sizcache===c){f=d[n.sizset];break}1===n.nodeType&&!h&&(n.sizcache=c,n.sizset=g);if(n.nodeName.toLowerCase()===b){f=n;break}n=n[a]}d[g]=f}}}var d=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
g=0,h=Object.prototype.toString,e=!1,f=!0,l=/\\/g,m=/\W/;[0,0].sort(function(){f=!1;return 0});var k=function(a,b,c,g){c=c||[];var n=b=b||r;if(1!==b.nodeType&&9!==b.nodeType)return[];if(!a||"string"!==typeof a)return c;var e,f,l,m,s,p,X=!0,u=k.isXML(b),A=[],x=a;do if(d.exec(""),e=d.exec(x))if(x=e[3],A.push(e[1]),e[2]){m=e[3];break}while(e);if(1<A.length&&w.exec(a))if(2===A.length&&q.relative[A[0]])f=D(A[0]+A[1],b);else for(f=q.relative[A[0]]?[b]:k(A.shift(),b);A.length;)a=A.shift(),q.relative[a]&&
(a+=A.shift()),f=D(a,f);else if(!g&&1<A.length&&9===b.nodeType&&!u&&q.match.ID.test(A[0])&&!q.match.ID.test(A[A.length-1])&&(s=k.find(A.shift(),b,u),b=s.expr?k.filter(s.expr,s.set)[0]:s.set[0]),b)for(s=g?{expr:A.pop(),set:v(g)}:k.find(A.pop(),1!==A.length||"~"!==A[0]&&"+"!==A[0]||!b.parentNode?b:b.parentNode,u),f=s.expr?k.filter(s.expr,s.set):s.set,0<A.length?l=v(f):X=!1;A.length;)e=p=A.pop(),q.relative[p]?e=A.pop():p="",null==e&&(e=b),q.relative[p](l,e,u);else l=[];l||(l=f);l||k.error(p||a);if("[object Array]"===
h.call(l))if(X)if(b&&1===b.nodeType)for(a=0;null!=l[a];a++)l[a]&&(!0===l[a]||1===l[a].nodeType&&k.contains(b,l[a]))&&c.push(f[a]);else for(a=0;null!=l[a];a++)l[a]&&1===l[a].nodeType&&c.push(f[a]);else c.push.apply(c,l);else v(l,c);m&&(k(m,n,c,g),k.uniqueSort(c));return c};k.uniqueSort=function(a){if(y&&(e=f,a.sort(y),e))for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1);return a};k.matches=function(a,b){return k(a,null,null,b)};k.matchesSelector=function(a,b){return 0<k(b,null,null,[a]).length};
k.find=function(a,b,c){var d;if(!a)return[];for(var g=0,h=q.order.length;g<h;g++){var e,n=q.order[g];if(e=q.leftMatch[n].exec(a)){var f=e[1];e.splice(1,1);if("\\"!==f.substr(f.length-1)&&(e[1]=(e[1]||"").replace(l,""),d=q.find[n](e,b,c),null!=d)){a=a.replace(q.match[n],"");break}}}d||(d="undefined"!==typeof b.getElementsByTagName?b.getElementsByTagName("*"):[]);return{set:d,expr:a}};k.filter=function(a,b,c,d){for(var g,h,e=a,n=[],f=b,l=b&&b[0]&&k.isXML(b[0]);a&&b.length;){for(var m in q.filter)if(null!=
(g=q.leftMatch[m].exec(a))&&g[2]){var s,r,A=q.filter[m];r=g[1];h=!1;g.splice(1,1);if("\\"!==r.substr(r.length-1)){f===n&&(n=[]);if(q.preFilter[m])if(g=q.preFilter[m](g,f,c,n,d,l)){if(!0===g)continue}else h=s=!0;if(g)for(var w=0;null!=(r=f[w]);w++)if(r){s=A(r,g,w,f);var X=d^!!s;c&&null!=s?X?h=!0:f[w]=!1:X&&(n.push(r),h=!0)}if(s!==p){c||(f=n);a=a.replace(q.match[m],"");if(!h)return[];break}}}if(a===e)if(null==h)k.error(a);else break;e=a}return f};k.error=function(a){throw"Syntax error, unrecognized expression: "+
a;};var q=k.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c="string"===typeof b,d=c&&!m.test(b),c=c&&!d;d&&(b=b.toLowerCase());for(var d=0,g=a.length,h;d<g;d++)if(h=a[d]){for(;(h=h.previousSibling)&&1!==h.nodeType;);a[d]=c||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}c&&k.filter(b,
a,!0)},">":function(a,b){var c,d="string"===typeof b,g=0,h=a.length;if(d&&!m.test(b))for(b=b.toLowerCase();g<h;g++){if(c=a[g])c=c.parentNode,a[g]=c.nodeName.toLowerCase()===b?c:!1}else{for(;g<h;g++)(c=a[g])&&(a[g]=d?c.parentNode:c.parentNode===b);d&&k.filter(b,a,!0)}},"":function(c,d,h){var e,n=g++,f=a;"string"===typeof d&&!m.test(d)&&(d=d.toLowerCase(),e=d,f=b);f("parentNode",d,n,c,e,h)},"~":function(c,d,h){var e,n=g++,f=a;"string"===typeof d&&!m.test(d)&&(d=d.toLowerCase(),e=d,f=b);f("previousSibling",
d,n,c,e,h)}},find:{ID:function(a,b,c){if("undefined"!==typeof b.getElementById&&!c)return(a=b.getElementById(a[1]))&&a.parentNode?[a]:[]},NAME:function(a,b){if("undefined"!==typeof b.getElementsByName){for(var c=[],d=b.getElementsByName(a[1]),g=0,h=d.length;g<h;g++)d[g].getAttribute("name")===a[1]&&c.push(d[g]);return 0===c.length?null:c}},TAG:function(a,b){if("undefined"!==typeof b.getElementsByTagName)return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,g,h){a=" "+a[1].replace(l,
"")+" ";if(h)return a;h=0;for(var e;null!=(e=b[h]);h++)e&&(g^(e.className&&0<=(" "+e.className+" ").replace(/[\t\n\r]/g," ").indexOf(a))?c||d.push(e):c&&(b[h]=!1));return!1},ID:function(a){return a[1].replace(l,"")},TAG:function(a,b){return a[1].replace(l,"").toLowerCase()},CHILD:function(a){if("nth"===a[1]){a[2]||k.error(a[0]);a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec("even"===a[2]&&"2n"||"odd"===a[2]&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-
0;a[3]=b[3]-0}else a[2]&&k.error(a[0]);a[0]=g++;return a},ATTR:function(a,b,c,d,g,h){b=a[1]=a[1].replace(l,"");!h&&q.attrMap[b]&&(a[1]=q.attrMap[b]);a[4]=(a[4]||a[5]||"").replace(l,"");"~="===a[2]&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(a,b,c,g,h){if("not"===a[1])if(1<(d.exec(a[3])||"").length||/^\w/.test(a[3]))a[3]=k(a[3],null,null,b);else return a=k.filter(a[3],b,c,1^h),c||g.push.apply(g,a),!1;else if(q.match.POS.test(a[0])||q.match.CHILD.test(a[0]))return!0;return a},POS:function(a){a.unshift(!0);
return a}},filters:{enabled:function(a){return!1===a.disabled&&"hidden"!==a.type},disabled:function(a){return!0===a.disabled},checked:function(a){return!0===a.checked},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return!0===a.selected},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!k(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){return"text"===a.getAttribute("type")},radio:function(a){return"radio"===
a.type},checkbox:function(a){return"checkbox"===a.type},file:function(a){return"file"===a.type},password:function(a){return"password"===a.type},submit:function(a){return"submit"===a.type},image:function(a){return"image"===a.type},reset:function(a){return"reset"===a.type},button:function(a){return"button"===a.type||"button"===a.nodeName.toLowerCase()},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)}},setFilters:{first:function(a,b){return 0===b},last:function(a,b,c,d){return b===
d.length-1},even:function(a,b){return 0===b%2},odd:function(a,b){return 1===b%2},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var g=b[1],h=q.filters[g];if(h)return h(a,c,b,d);if("contains"===g)return 0<=(a.textContent||a.innerText||k.getText([a])||"").indexOf(b[3]);if("not"===g){b=b[3];c=0;for(d=b.length;c<d;c++)if(b[c]===a)return!1;return!0}k.error(g)},CHILD:function(a,
b){var c=b[1],d=a;switch(c){case "only":case "first":for(;d=d.previousSibling;)if(1===d.nodeType)return!1;if("first"===c)return!0;d=a;case "last":for(;d=d.nextSibling;)if(1===d.nodeType)return!1;return!0;case "nth":var c=b[2],g=b[3];if(1===c&&0===g)return!0;var h=b[0],e=a.parentNode;if(e&&(e.sizcache!==h||!a.nodeIndex)){for(var n=0,d=e.firstChild;d;d=d.nextSibling)1===d.nodeType&&(d.nodeIndex=++n);e.sizcache=h}d=a.nodeIndex-g;return 0===c?0===d:0===d%c&&0<=d/c}},ID:function(a,b){return 1===a.nodeType&&
a.getAttribute("id")===b},TAG:function(a,b){return"*"===b&&1===a.nodeType||a.nodeName.toLowerCase()===b},CLASS:function(a,b){return-1<(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)},ATTR:function(a,b){var c=b[1],c=q.attrHandle[c]?q.attrHandle[c](a):null!=a[c]?a[c]:a.getAttribute(c),d=c+"",g=b[2],h=b[4];return null==c?"!="===g:"="===g?d===h:"*="===g?0<=d.indexOf(h):"~="===g?0<=(" "+d+" ").indexOf(h):h?"!="===g?d!==h:"^="===g?0===d.indexOf(h):"$="===g?d.substr(d.length-h.length)===h:"|="===
g?d===h||d.substr(0,h.length+1)===h+"-":!1:d&&!1!==c},POS:function(a,b,c,d){var g=q.setFilters[b[2]];if(g)return g(a,c,b,d)}}},w=q.match.POS,u=function(a,b){return"\\"+(b-0+1)},x;for(x in q.match)q.match[x]=RegExp(q.match[x].source+/(?![^\[]*\])(?![^\(]*\))/.source),q.leftMatch[x]=RegExp(/(^(?:.|\r|\n)*?)/.source+q.match[x].source.replace(/\\(\d+)/g,u));var v=function(a,b){a=Array.prototype.slice.call(a,0);return b?(b.push.apply(b,a),b):a};try{Array.prototype.slice.call(r.documentElement.childNodes,
0)[0].nodeType}catch(z){v=function(a,b){var c=0,d=b||[];if("[object Array]"===h.call(a))Array.prototype.push.apply(d,a);else if("number"===typeof a.length)for(var g=a.length;c<g;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var y,B;r.documentElement.compareDocumentPosition?y=function(a,b){return a===b?(e=!0,0):a.compareDocumentPosition&&b.compareDocumentPosition?a.compareDocumentPosition(b)&4?-1:1:a.compareDocumentPosition?-1:1}:(y=function(a,b){var c,d,g=[],h=[];c=a.parentNode;d=b.parentNode;
var f=c;if(a===b)return e=!0,0;if(c===d)return B(a,b);if(!c)return-1;if(!d)return 1;for(;f;)g.unshift(f),f=f.parentNode;for(f=d;f;)h.unshift(f),f=f.parentNode;c=g.length;d=h.length;for(f=0;f<c&&f<d;f++)if(g[f]!==h[f])return B(g[f],h[f]);return f===c?B(a,h[f],-1):B(g[f],b,1)},B=function(a,b,c){if(a===b)return c;for(a=a.nextSibling;a;){if(a===b)return-1;a=a.nextSibling}return 1});k.getText=function(a){for(var b="",c,d=0;a[d];d++)c=a[d],3===c.nodeType||4===c.nodeType?b+=c.nodeValue:8!==c.nodeType&&(b+=
k.getText(c.childNodes));return b};(function(){var a=r.createElement("div"),b="script"+(new Date).getTime(),c=r.documentElement;a.innerHTML="<a name='"+b+"'/>";c.insertBefore(a,c.firstChild);r.getElementById(b)&&(q.find.ID=function(a,b,c){if("undefined"!==typeof b.getElementById&&!c)return(b=b.getElementById(a[1]))?b.id===a[1]||"undefined"!==typeof b.getAttributeNode&&b.getAttributeNode("id").nodeValue===a[1]?[b]:p:[]},q.filter.ID=function(a,b){var c="undefined"!==typeof a.getAttributeNode&&a.getAttributeNode("id");
return 1===a.nodeType&&c&&c.nodeValue===b});c.removeChild(a);c=a=null})();(function(){var a=r.createElement("div");a.appendChild(r.createComment(""));0<a.getElementsByTagName("*").length&&(q.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if("*"===a[1]){for(var d=[],g=0;c[g];g++)1===c[g].nodeType&&d.push(c[g]);c=d}return c});a.innerHTML="<a href='#'></a>";a.firstChild&&"undefined"!==typeof a.firstChild.getAttribute&&"#"!==a.firstChild.getAttribute("href")&&(q.attrHandle.href=function(a){return a.getAttribute("href",
2)});a=null})();r.querySelectorAll&&function(){var a=k,b=r.createElement("div");b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||0!==b.querySelectorAll(".TEST").length){k=function(b,c,d,g){c=c||r;if(!g&&!k.isXML(c)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(1===c.nodeType||9===c.nodeType)){if(h[1])return v(c.getElementsByTagName(b),d);if(h[2]&&q.find.CLASS&&c.getElementsByClassName)return v(c.getElementsByClassName(h[2]),d)}if(9===c.nodeType){if("body"===b&&c.body)return v([c.body],
d);if(h&&h[3]){var e=c.getElementById(h[3]);if(!e||!e.parentNode)return v([],d);if(e.id===h[3])return v([e],d)}try{return v(c.querySelectorAll(b),d)}catch(f){}}else if(1===c.nodeType&&"object"!==c.nodeName.toLowerCase()){var h=c,n=(e=c.getAttribute("id"))||"__sizzle__",l=c.parentNode,m=/^\s*[+~]/.test(b);e?n=n.replace(/'/g,"\\$&"):c.setAttribute("id",n);m&&l&&(c=c.parentNode);try{if(!m||l)return v(c.querySelectorAll("[id='"+n+"'] "+b),d)}catch(s){}finally{e||h.removeAttribute("id")}}}return a(b,c,
d,g)};for(var c in a)k[c]=a[c];b=null}}();(function(){var a=r.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector,c=!1;try{b.call(r.documentElement,"[test!='']:sizzle")}catch(d){c=!0}b&&(k.matchesSelector=function(a,d){d=d.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!k.isXML(a))try{if(c||!q.match.PSEUDO.test(d)&&!/!=/.test(d))return b.call(a,d)}catch(g){}return 0<k(d,null,null,[a]).length})})();(function(){var a=r.createElement("div");a.innerHTML=
"<div class='test e'></div><div class='test'></div>";a.getElementsByClassName&&0!==a.getElementsByClassName("e").length&&(a.lastChild.className="e",1!==a.getElementsByClassName("e").length&&(q.order.splice(1,0,"CLASS"),q.find.CLASS=function(a,b,c){if("undefined"!==typeof b.getElementsByClassName&&!c)return b.getElementsByClassName(a[1])},a=null))})();r.documentElement.contains?k.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:r.documentElement.compareDocumentPosition?k.contains=
function(a,b){return!!(a.compareDocumentPosition(b)&16)}:k.contains=function(){return!1};k.isXML=function(a){return(a=(a?a.ownerDocument||a:0).documentElement)?"HTML"!==a.nodeName:!1};var D=function(a,b){for(var c,d=[],g="",h=b.nodeType?[b]:b;c=q.match.PSEUDO.exec(a);)g+=c[0],a=a.replace(q.match.PSEUDO,"");a=q.relative[a]?a+"*":a;c=0;for(var e=h.length;c<e;c++)k(a,h[c],d);return k.filter(g,d)};c.find=k;c.expr=k.selectors;c.expr[":"]=c.expr.filters;c.unique=k.uniqueSort;c.text=k.getText;c.isXMLDoc=
k.isXML;c.contains=k.contains})();var db=/Until$/,eb=/^(?:parents|prevUntil|prevAll)/,fb=/,/,Ra=/^.[^:#\[\.,]*$/,gb=Array.prototype.slice,hb=c.expr.match.POS,ib={children:!0,contents:!0,next:!0,prev:!0};c.fn.extend({find:function(a){for(var b=this.pushStack("","find",a),d=0,g=0,h=this.length;g<h;g++)if(d=b.length,c.find(a,this[g],b),0<g)for(var e=d;e<b.length;e++)for(var f=0;f<d;f++)if(b[f]===b[e]){b.splice(e--,1);break}return b},has:function(a){var b=c(a);return this.filter(function(){for(var a=
0,g=b.length;a<g;a++)if(c.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(N(this,a,!1),"not",a)},filter:function(a){return this.pushStack(N(this,a,!0),"filter",a)},is:function(a){return!!a&&0<c.filter(a,this).length},closest:function(a,b){var d=[],g,h,e=this[0];if(c.isArray(a)){var f,l={},k=1;if(e&&a.length){g=0;for(h=a.length;g<h;g++)f=a[g],l[f]||(l[f]=c.expr.match.POS.test(f)?c(f,b||this.context):f);for(;e&&e.ownerDocument&&e!==b;){for(f in l)g=l[f],(g.jquery?-1<g.index(e):
c(e).is(g))&&d.push({selector:f,elem:e,level:k});e=e.parentNode;k++}}return d}f=hb.test(a)?c(a,b||this.context):null;g=0;for(h=this.length;g<h;g++)for(e=this[g];e;){if(f?-1<f.index(e):c.find.matchesSelector(e,a)){d.push(e);break}e=e.parentNode;if(!e||!e.ownerDocument||e===b)break}d=1<d.length?c.unique(d):d;return this.pushStack(d,"closest",a)},index:function(a){return a&&"string"!==typeof a?c.inArray(a.jquery?a[0]:a,this):c.inArray(this[0],a?c(a):this.parent().children())},add:function(a,b){var d=
"string"===typeof a?c(a,b):c.makeArray(a),g=c.merge(this.get(),d);return this.pushStack(d[0]&&d[0].parentNode&&11!==d[0].parentNode.nodeType&&g[0]&&g[0].parentNode&&11!==g[0].parentNode.nodeType?c.unique(g):g)},andSelf:function(){return this.add(this.prevObject)}});c.each({parent:function(a){return(a=a.parentNode)&&11!==a.nodeType?a:null},parents:function(a){return c.dir(a,"parentNode")},parentsUntil:function(a,b,d){return c.dir(a,"parentNode",d)},next:function(a){return c.nth(a,2,"nextSibling")},
prev:function(a){return c.nth(a,2,"previousSibling")},nextAll:function(a){return c.dir(a,"nextSibling")},prevAll:function(a){return c.dir(a,"previousSibling")},nextUntil:function(a,b,d){return c.dir(a,"nextSibling",d)},prevUntil:function(a,b,d){return c.dir(a,"previousSibling",d)},siblings:function(a){return c.sibling(a.parentNode.firstChild,a)},children:function(a){return c.sibling(a.firstChild)},contents:function(a){return c.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:c.makeArray(a.childNodes)}},
function(a,b){c.fn[a]=function(d,g){var h=c.map(this,b,d),e=gb.call(arguments);db.test(a)||(g=d);g&&"string"===typeof g&&(h=c.filter(g,h));h=1<this.length&&!ib[a]?c.unique(h):h;(1<this.length||fb.test(g))&&eb.test(a)&&(h=h.reverse());return this.pushStack(h,a,e.join(","))}});c.extend({filter:function(a,b,d){d&&(a=":not("+a+")");return 1===b.length?c.find.matchesSelector(b[0],a)?[b[0]]:[]:c.find.matches(a,b)},dir:function(a,b,d){var g=[];for(a=a[b];a&&9!==a.nodeType&&(d===p||1!==a.nodeType||!c(a).is(d));)1===
a.nodeType&&g.push(a),a=a[b];return g},nth:function(a,b,c,g){b=b||1;for(g=0;a&&(1!==a.nodeType||++g!==b);a=a[c]);return a},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}});var jb=/ jQuery\d+="(?:\d+|null)"/g,pa=/^\s+/,Ba=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Ca=/<([\w:]+)/,kb=/<tbody/i,lb=/<|&#?\w+;/,Da=/<(?:script|object|embed|option|style)/i,Ea=/checked\s*(?:[^=]|=\s*.checked.)/i,C={option:[1,"<select multiple='multiple'>",
"</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]};C.optgroup=C.option;C.tbody=C.tfoot=C.colgroup=C.caption=C.thead;C.th=C.td;c.support.htmlSerialize||(C._default=[1,"div<div>","</div>"]);c.fn.extend({text:function(a){return c.isFunction(a)?this.each(function(b){var d=
c(this);d.text(a.call(this,b,d.text()))}):"object"!==typeof a&&a!==p?this.empty().append((this[0]&&this[0].ownerDocument||r).createTextNode(a)):c.text(this)},wrapAll:function(a){if(c.isFunction(a))return this.each(function(b){c(this).wrapAll(a.call(this,b))});if(this[0]){var b=c(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]);b.map(function(){for(var a=this;a.firstChild&&1===a.firstChild.nodeType;)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){return c.isFunction(a)?
this.each(function(b){c(this).wrapInner(a.call(this,b))}):this.each(function(){var b=c(this),d=b.contents();d.length?d.wrapAll(a):b.append(a)})},wrap:function(a){return this.each(function(){c(this).wrapAll(a)})},unwrap:function(){return this.parent().each(function(){c.nodeName(this,"body")||c(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){1===this.nodeType&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){1===
this.nodeType&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=c(arguments[0]);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,
"after",arguments);a.push.apply(a,c(arguments[0]).toArray());return a}},remove:function(a,b){for(var d=0,g;null!=(g=this[d]);d++)if(!a||c.filter(a,[g]).length)!b&&1===g.nodeType&&(c.cleanData(g.getElementsByTagName("*")),c.cleanData([g])),g.parentNode&&g.parentNode.removeChild(g);return this},empty:function(){for(var a=0,b;null!=(b=this[a]);a++)for(1===b.nodeType&&c.cleanData(b.getElementsByTagName("*"));b.firstChild;)b.removeChild(b.firstChild);return this},clone:function(a,b){a=null==a?!1:a;b=null==
b?a:b;return this.map(function(){return c.clone(this,a,b)})},html:function(a){if(a===p)return this[0]&&1===this[0].nodeType?this[0].innerHTML.replace(jb,""):null;if("string"!==typeof a||Da.test(a)||!c.support.leadingWhitespace&&pa.test(a)||C[(Ca.exec(a)||["",""])[1].toLowerCase()])c.isFunction(a)?this.each(function(b){var d=c(this);d.html(a.call(this,b,d.html()))}):this.empty().append(a);else{a=a.replace(Ba,"<$1></$2>");try{for(var b=0,d=this.length;b<d;b++)1===this[b].nodeType&&(c.cleanData(this[b].getElementsByTagName("*")),
this[b].innerHTML=a)}catch(g){this.empty().append(a)}}return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(c.isFunction(a))return this.each(function(b){var d=c(this),g=d.html();d.replaceWith(a.call(this,b,g))});"string"!==typeof a&&(a=c(a).detach());return this.each(function(){var b=this.nextSibling,d=this.parentNode;c(this).remove();b?c(b).before(a):c(d).append(a)})}return this.pushStack(c(c.isFunction(a)?a():a),"replaceWith",a)},detach:function(a){return this.remove(a,!0)},domManip:function(a,
b,d){var g,h,e,f=a[0],l=[];if(!c.support.checkClone&&3===arguments.length&&"string"===typeof f&&Ea.test(f))return this.each(function(){c(this).domManip(a,b,d,!0)});if(c.isFunction(f))return this.each(function(g){var h=c(this);a[0]=f.call(this,g,b?h.html():p);h.domManip(a,b,d)});if(this[0]){e=f&&f.parentNode;c.support.parentNode&&e&&11===e.nodeType&&e.childNodes.length===this.length?g={fragment:e}:g=c.buildFragment(a,this,l);e=g.fragment;1===e.childNodes.length?h=e=e.firstChild:h=e.firstChild;if(h){b=
b&&c.nodeName(h,"tr");h=0;for(var k=this.length,m=k-1;h<k;h++)d.call(b?c.nodeName(this[h],"table")?this[h].getElementsByTagName("tbody")[0]||this[h].appendChild(this[h].ownerDocument.createElement("tbody")):this[h]:this[h],g.cacheable||1<k&&h<m?c.clone(e,!0,!0):e)}l.length&&c.each(l,D)}return this}});c.buildFragment=function(a,b,d){var g,h,e;b=b&&b[0]?b[0].ownerDocument||b[0]:r;1===a.length&&"string"===typeof a[0]&&512>a[0].length&&b===r&&"<"===a[0].charAt(0)&&!Da.test(a[0])&&(c.support.checkClone||
!Ea.test(a[0]))&&(h=!0,e=c.fragments[a[0]],e&&1!==e&&(g=e));g||(g=b.createDocumentFragment(),c.clean(a,b,g,d));h&&(c.fragments[a[0]]=e?g:1);return{fragment:g,cacheable:h}};c.fragments={};c.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){c.fn[a]=function(d){var g=[];d=c(d);var h=1===this.length&&this[0].parentNode;if(h&&11===h.nodeType&&1===h.childNodes.length&&1===d.length)return d[b](this[0]),this;for(var h=0,e=d.length;h<
e;h++){var f=(0<h?this.clone(!0):this).get();c(d[h])[b](f);g=g.concat(f)}return this.pushStack(g,a,d.selector)}});c.extend({clone:function(a,b,d){var g=a.cloneNode(!0),h,e,f;if(!(c.support.noCloneEvent&&c.support.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||c.isXMLDoc(a)))for(B(a,g),h=z(a),e=z(g),f=0;h[f];++f)B(h[f],e[f]);if(b&&(G(a,g),d))for(h=z(a),e=z(g),f=0;h[f];++f)G(h[f],e[f]);return g},clean:function(a,b,d,g){b=b||r;"undefined"===typeof b.createElement&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||
r);for(var h=[],e=0,f;null!=(f=a[e]);e++)if("number"===typeof f&&(f+=""),f){if("string"!==typeof f||lb.test(f)){if("string"===typeof f){f=f.replace(Ba,"<$1></$2>");var l=(Ca.exec(f)||["",""])[1].toLowerCase(),k=C[l]||C._default,m=k[0],q=b.createElement("div");for(q.innerHTML=k[1]+f+k[2];m--;)q=q.lastChild;if(!c.support.tbody)for(m=kb.test(f),l="table"!==l||m?"<table>"!==k[1]||m?[]:q.childNodes:q.firstChild&&q.firstChild.childNodes,k=l.length-1;0<=k;--k)c.nodeName(l[k],"tbody")&&!l[k].childNodes.length&&
l[k].parentNode.removeChild(l[k]);!c.support.leadingWhitespace&&pa.test(f)&&q.insertBefore(b.createTextNode(pa.exec(f)[0]),q.firstChild);f=q.childNodes}}else f=b.createTextNode(f);f.nodeType?h.push(f):h=c.merge(h,f)}if(d)for(e=0;h[e];e++)!g||!c.nodeName(h[e],"script")||h[e].type&&"text/javascript"!==h[e].type.toLowerCase()?(1===h[e].nodeType&&h.splice.apply(h,[e+1,0].concat(c.makeArray(h[e].getElementsByTagName("script")))),d.appendChild(h[e])):g.push(h[e].parentNode?h[e].parentNode.removeChild(h[e]):
h[e]);return h},cleanData:function(a){for(var b,d,g=c.cache,h=c.expando,e=c.event.special,f=c.support.deleteExpando,l=0,k;null!=(k=a[l]);l++)if(!k.nodeName||!c.noData[k.nodeName.toLowerCase()])if(d=k[c.expando]){if((b=g[d]&&g[d][h])&&b.events){for(var m in b.events)e[m]?c.event.remove(k,m):c.removeEvent(k,m,b.handle);b.handle&&(b.handle.elem=null)}f?delete k[c.expando]:k.removeAttribute&&k.removeAttribute(c.expando);delete g[d]}}});var Fa=/alpha\([^)]*\)/i,mb=/opacity=([^)]*)/,nb=/-([a-z])/ig,ob=
/([A-Z])/g,Ga=/^-?\d+(?:px)?$/i,pb=/^-?\d/,qb={position:"absolute",visibility:"hidden",display:"block"},Pa=["Left","Right"],Qa=["Top","Bottom"],Z,Ha,ca,rb=function(a,b){return b.toUpperCase()};c.fn.css=function(a,b){return 2===arguments.length&&b===p?this:c.access(this,a,b,!0,function(a,b,h){return h!==p?c.style(a,b,h):c.css(a,b)})};c.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Z(a,"opacity","opacity");return""===c?"1":c}return a.style.opacity}}},cssNumber:{zIndex:!0,fontWeight:!0,opacity:!0,
zoom:!0,lineHeight:!0},cssProps:{"float":c.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,b,d,g){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var h,e=c.camelCase(b),f=a.style,l=c.cssHooks[e];b=c.cssProps[e]||e;if(d===p)return l&&"get"in l&&(h=l.get(a,!1,g))!==p?h:f[b];if(!("number"===typeof d&&isNaN(d)||null==d||("number"===typeof d&&!c.cssNumber[e]&&(d+="px"),l&&"set"in l&&(d=l.set(a,d))===p)))try{f[b]=d}catch(k){}}},css:function(a,b,d){var g,h=c.camelCase(b),e=c.cssHooks[h];b=c.cssProps[h]||
h;if(e&&"get"in e&&(g=e.get(a,!0,d))!==p)return g;if(Z)return Z(a,b,h)},swap:function(a,b,c){var g={},h;for(h in b)g[h]=a.style[h],a.style[h]=b[h];c.call(a);for(h in b)a.style[h]=g[h]},camelCase:function(a){return a.replace(nb,rb)}});c.curCSS=c.css;c.each(["height","width"],function(a,b){c.cssHooks[b]={get:function(a,g,h){var e;if(g)return 0!==a.offsetWidth?e=u(a,b,h):c.swap(a,qb,function(){e=u(a,b,h)}),0>=e&&(e=Z(a,b,b),"0px"===e&&ca&&(e=ca(a,b,b)),null!=e)?""===e||"auto"===e?"0px":e:0>e||null==
e?(e=a.style[b],""===e||"auto"===e?"0px":e):"string"===typeof e?e:e+"px"},set:function(a,b){if(!Ga.test(b))return b;b=parseFloat(b);if(0<=b)return b+"px"}}});c.support.opacity||(c.cssHooks.opacity={get:function(a,b){return mb.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var d=a.style;d.zoom=1;var g=c.isNaN(b)?"":"alpha(opacity="+100*b+")",e=d.filter||"";d.filter=Fa.test(e)?e.replace(Fa,g):d.filter+" "+g}});r.defaultView&&
r.defaultView.getComputedStyle&&(Ha=function(a,b,d){var g;d=d.replace(ob,"-$1").toLowerCase();if(!(b=a.ownerDocument.defaultView))return p;if(b=b.getComputedStyle(a,null))g=b.getPropertyValue(d),""===g&&!c.contains(a.ownerDocument.documentElement,a)&&(g=c.style(a,d));return g});r.documentElement.currentStyle&&(ca=function(a,b){var c,g=a.currentStyle&&a.currentStyle[b],e=a.runtimeStyle&&a.runtimeStyle[b],f=a.style;!Ga.test(g)&&pb.test(g)&&(c=f.left,e&&(a.runtimeStyle.left=a.currentStyle.left),f.left=
"fontSize"===b?"1em":g||0,g=f.pixelLeft+"px",f.left=c,e&&(a.runtimeStyle.left=e));return""===g?"auto":g});Z=Ha||ca;c.expr&&c.expr.filters&&(c.expr.filters.hidden=function(a){var b=a.offsetHeight;return 0===a.offsetWidth&&0===b||!c.support.reliableHiddenOffsets&&"none"===(a.style.display||c.css(a,"display"))},c.expr.filters.visible=function(a){return!c.expr.filters.hidden(a)});var sb=/%20/g,Oa=/\[\]$/,Ia=/\r?\n/g,tb=/#.*$/,ub=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,vb=/^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
wb=/^(?:GET|HEAD)$/,xb=/^\/\//,Ja=/\?/,yb=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,zb=/^(?:select|textarea)/i,ra=/\s+/,Ab=/([?&])_=[^&]*/,Bb=/(^|\-)([a-z])/g,Cb=function(a,b,c){return b+c.toUpperCase()},Ka=/^([\w\+\.\-]+:)\/\/([^\/?#:]*)(?::(\d+))?/,La=c.fn.load,ga={},Ma={},J,K;try{J=r.location.href}catch(Ib){J=r.createElement("a"),J.href="",J=J.href}K=Ka.exec(J.toLowerCase());c.fn.extend({load:function(a,b,d){if("string"!==typeof a&&La)return La.apply(this,arguments);if(!this.length)return this;
var g=a.indexOf(" ");if(0<=g){var e=a.slice(g,a.length);a=a.slice(0,g)}g="GET";b&&(c.isFunction(b)?(d=b,b=p):"object"===typeof b&&(b=c.param(b,c.ajaxSettings.traditional),g="POST"));var f=this;c.ajax({url:a,type:g,dataType:"html",data:b,complete:function(a,b,g){g=a.responseText;a.isResolved()&&(a.done(function(a){g=a}),f.html(e?c("<div>").append(g.replace(yb,"")).find(e):g));d&&f.each(d,[g,b,a])}});return this},serialize:function(){return c.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?
c.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||zb.test(this.nodeName)||vb.test(this.type))}).map(function(a,b){var d=c(this).val();return null==d?null:c.isArray(d)?c.map(d,function(a,c){return{name:b.name,value:a.replace(Ia,"\r\n")}}):{name:b.name,value:d.replace(Ia,"\r\n")}}).get()}});c.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){c.fn[b]=function(a){return this.bind(b,a)}});c.each(["get","post"],
function(a,b){c[b]=function(a,g,e,f){c.isFunction(g)&&(f=f||e,e=g,g=p);return c.ajax({type:b,url:a,data:g,success:e,dataType:f})}});c.extend({getScript:function(a,b){return c.get(a,p,b,"script")},getJSON:function(a,b,d){return c.get(a,b,d,"json")},ajaxSetup:function(a,b){b?c.extend(!0,a,c.ajaxSettings,b):(b=a,a=c.extend(!0,c.ajaxSettings,b));for(var d in{context:1,url:1})d in b?a[d]=b[d]:d in c.ajaxSettings&&(a[d]=c.ajaxSettings[d]);return a},ajaxSettings:{url:J,isLocal:/(?:^file|^widget|\-extension):$/.test(K[1]),
global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":"*/*"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":e.String,"text html":!0,"text json":c.parseJSON,"text xml":c.parseXML}},ajaxPrefilter:v(ga),ajaxTransport:v(Ma),ajax:function(a,b){function d(a,b,d,r){if(2!==y){y=
2;z&&clearTimeout(z);v=p;w=r||"";t.readyState=a?4:0;var u,x,B;if(d){r=g;var C=t,ha=r.contents,G=r.dataTypes,N=r.responseFields,H,F,P,O;for(F in N)F in d&&(C[N[F]]=d[F]);for(;"*"===G[0];)G.shift(),H===p&&(H=r.mimeType||C.getResponseHeader("content-type"));if(H)for(F in ha)if(ha[F]&&ha[F].test(H)){G.unshift(F);break}if(G[0]in d)P=G[0];else{for(F in d){if(!G[0]||r.converters[F+" "+G[0]]){P=F;break}O||(O=F)}P=P||O}P?(P!==G[0]&&G.unshift(P),d=d[P]):d=void 0}else d=p;if(200<=a&&300>a||304===a){if(g.ifModified){if(H=
t.getResponseHeader("Last-Modified"))c.lastModified[q]=H;if(H=t.getResponseHeader("Etag"))c.etag[q]=H}if(304===a)b="notmodified",u=!0;else try{H=g;H.dataFilter&&(d=H.dataFilter(d,H.dataType));var ia=H.dataTypes;F={};var J,K,M=ia.length,L,Q=ia[0],I,U,R,T,W;for(J=1;J<M;J++){if(1===J)for(K in H.converters)"string"===typeof K&&(F[K.toLowerCase()]=H.converters[K]);I=Q;Q=ia[J];if("*"===Q)Q=I;else if("*"!==I&&I!==Q){U=I+" "+Q;R=F[U]||F["* "+Q];if(!R)for(T in W=p,F)if(L=T.split(" "),L[0]===I||"*"===L[0])if(W=
F[L[1]+" "+Q]){T=F[T];!0===T?R=W:!0===W&&(R=T);break}R||W||c.error("No conversion from "+U.replace(" "," to "));!0!==R&&(d=R?R(d):W(T(d)))}}x=d;b="success";u=!0}catch(S){b="parsererror",B=S}}else if(B=b,!b||a)b="error",0>a&&(a=0);t.status=a;t.statusText=b;u?l.resolveWith(e,[x,b,t]):l.rejectWith(e,[t,b,B]);t.statusCode(m);m=p;D&&f.trigger("ajax"+(u?"Success":"Error"),[t,g,u?x:B]);k.resolveWith(e,[t,b]);D&&(f.trigger("ajaxComplete",[t,g]),--c.active||c.event.trigger("ajaxStop"))}}"object"===typeof a&&
(b=a,a=p);b=b||{};var g=c.ajaxSetup({},b),e=g.context||g,f=e!==g&&(e.nodeType||e instanceof c)?c(e):c.event,l=c.Deferred(),k=c._Deferred(),m=g.statusCode||{},q,r={},w,u,v,z,B,y=0,D,C,t={readyState:0,setRequestHeader:function(a,b){y||(r[a.toLowerCase().replace(Bb,Cb)]=b);return this},getAllResponseHeaders:function(){return 2===y?w:null},getResponseHeader:function(a){var b;if(2===y){if(!u)for(u={};b=ub.exec(w);)u[b[1].toLowerCase()]=b[2];b=u[a.toLowerCase()]}return b===p?null:b},overrideMimeType:function(a){y||
(g.mimeType=a);return this},abort:function(a){a=a||"abort";v&&v.abort(a);d(0,a);return this}};l.promise(t);t.success=t.done;t.error=t.fail;t.complete=k.done;t.statusCode=function(a){if(a){var b;if(2>y)for(b in a)m[b]=[m[b],a[b]];else b=a[t.status],t.then(b,b)}return this};g.url=((a||g.url)+"").replace(tb,"").replace(xb,K[1]+"//");g.dataTypes=c.trim(g.dataType||"*").toLowerCase().split(ra);g.crossDomain||(B=Ka.exec(g.url.toLowerCase()),g.crossDomain=B&&(B[1]!=K[1]||B[2]!=K[2]||(B[3]||("http:"===B[1]?
80:443))!=(K[3]||("http:"===K[1]?80:443))));g.data&&g.processData&&"string"!==typeof g.data&&(g.data=c.param(g.data,g.traditional));x(ga,g,b,t);if(2===y)return!1;D=g.global;g.type=g.type.toUpperCase();g.hasContent=!wb.test(g.type);D&&0===c.active++&&c.event.trigger("ajaxStart");if(!g.hasContent&&(g.data&&(g.url+=(Ja.test(g.url)?"&":"?")+g.data),q=g.url,!1===g.cache)){B=c.now();var G=g.url.replace(Ab,"$1_="+B);g.url=G+(G===g.url?(Ja.test(g.url)?"&":"?")+"_="+B:"")}if(g.data&&g.hasContent&&!1!==g.contentType||
b.contentType)r["Content-Type"]=g.contentType;g.ifModified&&(q=q||g.url,c.lastModified[q]&&(r["If-Modified-Since"]=c.lastModified[q]),c.etag[q]&&(r["If-None-Match"]=c.etag[q]));r.Accept=g.dataTypes[0]&&g.accepts[g.dataTypes[0]]?g.accepts[g.dataTypes[0]]+("*"!==g.dataTypes[0]?", */*; q=0.01":""):g.accepts["*"];for(C in g.headers)t.setRequestHeader(C,g.headers[C]);if(g.beforeSend&&(!1===g.beforeSend.call(e,t,g)||2===y))return t.abort(),!1;for(C in{success:1,error:1,complete:1})t[C](g[C]);if(v=x(Ma,
g,b,t)){t.readyState=1;D&&f.trigger("ajaxSend",[t,g]);g.async&&0<g.timeout&&(z=setTimeout(function(){t.abort("timeout")},g.timeout));try{y=1,v.send(r,d)}catch(N){2>status?d(-1,N):c.error(N)}}else d(-1,"No Transport");return t},param:function(a,b){var d=[],g=function(a,b){b=c.isFunction(b)?b():b;d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};b===p&&(b=c.ajaxSettings.traditional);if(c.isArray(a)||a.jquery&&!c.isPlainObject(a))c.each(a,function(){g(this.name,this.value)});else for(var e in a)w(e,
a[e],b,g);return d.join("&").replace(sb,"+")}});c.extend({active:0,lastModified:{},etag:{}});var Db=c.now(),da=/(\=)\?(&|$)|()\?\?()/i;c.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return c.expando+"_"+Db++}});c.ajaxPrefilter("json jsonp",function(a,b,d){var g="string"===typeof a.data;if("jsonp"===a.dataTypes[0]||b.jsonpCallback||null!=b.jsonp||!1!==a.jsonp&&(da.test(a.url)||g&&da.test(a.data))){var h,f=a.jsonpCallback=c.isFunction(a.jsonpCallback)?a.jsonpCallback():a.jsonpCallback,l=e[f];
b=a.url;var k=a.data,m="$1"+f+"$2",q=function(){e[f]=l;h&&c.isFunction(l)&&e[f](h[0])};!1!==a.jsonp&&(b=b.replace(da,m),a.url===b&&(g&&(k=k.replace(da,m)),a.data===k&&(b+=(/\?/.test(b)?"&":"?")+a.jsonp+"="+f)));a.url=b;a.data=k;e[f]=function(a){h=[a]};d.then(q,q);a.converters["script json"]=function(){h||c.error(f+" was not called");return h[0]};a.dataTypes[0]="json";return"script"}});c.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},
contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){c.globalEval(a);return a}}});c.ajaxPrefilter("script",function(a){a.cache===p&&(a.cache=!1);a.crossDomain&&(a.type="GET",a.global=!1)});c.ajaxTransport("script",function(a){if(a.crossDomain){var b,c=r.head||r.getElementsByTagName("head")[0]||r.documentElement;return{send:function(g,e){b=r.createElement("script");b.async="async";a.scriptCharset&&(b.charset=a.scriptCharset);b.src=a.url;b.onload=b.onreadystatechange=function(a,
g){if(!b.readyState||/loaded|complete/.test(b.readyState))b.onload=b.onreadystatechange=null,c&&b.parentNode&&c.removeChild(b),b=p,g||e(200,"success")};c.insertBefore(b,c.firstChild)},abort:function(){b&&b.onload(0,1)}}}});var Eb=c.now(),M,$;c.ajaxSettings.xhr=e.ActiveXObject?function(){var a;if(!(a=!this.isLocal&&l()))a:{try{a=new e.ActiveXObject("Microsoft.XMLHTTP");break a}catch(b){}a=void 0}return a}:l;$=c.ajaxSettings.xhr();c.support.ajax=!!$;c.support.cors=$&&"withCredentials"in $;$=p;c.support.ajax&&
c.ajaxTransport(function(a){if(!a.crossDomain||c.support.cors){var b;return{send:function(d,g){var e=a.xhr(),f,l;a.username?e.open(a.type,a.url,a.async,a.username,a.password):e.open(a.type,a.url,a.async);if(a.xhrFields)for(l in a.xhrFields)e[l]=a.xhrFields[l];a.mimeType&&e.overrideMimeType&&e.overrideMimeType(a.mimeType);a.crossDomain&&!a.hasContent||d["X-Requested-With"]||(d["X-Requested-With"]="XMLHttpRequest");try{for(l in d)e.setRequestHeader(l,d[l])}catch(k){}e.send(a.hasContent&&a.data||null);
b=function(d,l){var k,m,q,r,s;try{if(b&&(l||4===e.readyState))if(b=p,f&&(e.onreadystatechange=c.noop,delete M[f]),l)4!==e.readyState&&e.abort();else{k=e.status;q=e.getAllResponseHeaders();r={};(s=e.responseXML)&&s.documentElement&&(r.xml=s);r.text=e.responseText;try{m=e.statusText}catch(w){m=""}k||!a.isLocal||a.crossDomain?1223===k&&(k=204):k=r.text?200:404}}catch(u){l||g(-1,u)}r&&g(k,m,r,q)};a.async&&4!==e.readyState?(M||(M={},q()),f=Eb++,e.onreadystatechange=M[f]=b):b()},abort:function(){b&&b(0,
1)}}}});var fa={},Fb=/^(?:toggle|show|hide)$/,Gb=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,ea,qa=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]];c.fn.extend({show:function(a,b,d){if(a||0===a)return this.animate(m("show",3),a,b,d);d=0;for(var g=this.length;d<g;d++)a=this[d],b=a.style.display,!c._data(a,"olddisplay")&&"none"===b&&(b=a.style.display=""),""===b&&"none"===c.css(a,"display")&&c._data(a,"olddisplay",
k(a.nodeName));for(d=0;d<g;d++)if(a=this[d],b=a.style.display,""===b||"none"===b)a.style.display=c._data(a,"olddisplay")||"";return this},hide:function(a,b,d){if(a||0===a)return this.animate(m("hide",3),a,b,d);a=0;for(b=this.length;a<b;a++)d=c.css(this[a],"display"),"none"!==d&&!c._data(this[a],"olddisplay")&&c._data(this[a],"olddisplay",d);for(a=0;a<b;a++)this[a].style.display="none";return this},_toggle:c.fn.toggle,toggle:function(a,b,d){var g="boolean"===typeof a;c.isFunction(a)&&c.isFunction(b)?
this._toggle.apply(this,arguments):null==a||g?this.each(function(){var b=g?a:c(this).is(":hidden");c(this)[b?"show":"hide"]()}):this.animate(m("toggle",3),a,b,d);return this},fadeTo:function(a,b,c,g){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,g)},animate:function(a,b,d,g){var e=c.speed(b,d,g);return c.isEmptyObject(a)?this.each(e.complete):this[!1===e.queue?"each":"queue"](function(){var b=c.extend({},e),d,g=1===this.nodeType,f=g&&c(this).is(":hidden"),l=this;
for(d in a){var m=c.camelCase(d);d!==m&&(a[m]=a[d],delete a[d],d=m);if("hide"===a[d]&&f||"show"===a[d]&&!f)return b.complete.call(this);!g||"height"!==d&&"width"!==d||(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],"inline"===c.css(this,"display")&&"none"===c.css(this,"float")&&(c.support.inlineBlockNeedsLayout?"inline"===k(this.nodeName)?this.style.display="inline-block":(this.style.display="inline",this.style.zoom=1):this.style.display="inline-block"));c.isArray(a[d])&&
((b.specialEasing=b.specialEasing||{})[d]=a[d][1],a[d]=a[d][0])}null!=b.overflow&&(this.style.overflow="hidden");b.curAnim=c.extend({},a);c.each(a,function(d,g){var e=new c.fx(l,b,d);if(Fb.test(g))e["toggle"===g?f?"show":"hide":g](a);else{var h=Gb.exec(g),k=e.cur();if(h){var m=parseFloat(h[2]),q=h[3]||(c.cssNumber[d]?"":"px");"px"!==q&&(c.style(l,d,(m||1)+q),k*=(m||1)/e.cur(),c.style(l,d,k+q));h[1]&&(m=("-="===h[1]?-1:1)*m+k);e.custom(k,m,q)}else e.custom(k,g,"")}});return!0})},stop:function(a,b){var d=
c.timers;a&&this.queue([]);this.each(function(){for(var a=d.length-1;0<=a;a--)d[a].elem===this&&(b&&d[a](!0),d.splice(a,1))});b||this.dequeue();return this}});c.each({slideDown:m("show",1),slideUp:m("hide",1),slideToggle:m("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){c.fn[a]=function(a,c,e){return this.animate(b,a,c,e)}});c.extend({speed:function(a,b,d){var g=a&&"object"===typeof a?c.extend({},a):{complete:d||!d&&b||c.isFunction(a)&&a,duration:a,
easing:d&&b||b&&!c.isFunction(b)&&b};g.duration=c.fx.off?0:"number"===typeof g.duration?g.duration:g.duration in c.fx.speeds?c.fx.speeds[g.duration]:c.fx.speeds._default;g.old=g.complete;g.complete=function(){!1!==g.queue&&c(this).dequeue();c.isFunction(g.old)&&g.old.call(this)};return g},easing:{linear:function(a,b,c,g){return c+g*a},swing:function(a,b,c,g){return(-Math.cos(a*Math.PI)/2+0.5)*g+c}},timers:[],fx:function(a,b,c){this.options=b;this.elem=a;this.prop=c;b.orig||(b.orig={})}});c.fx.prototype=
{update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this);(c.fx.step[this.prop]||c.fx.step._default)(this)},cur:function(){if(null!=this.elem[this.prop]&&(!this.elem.style||null==this.elem.style[this.prop]))return this.elem[this.prop];var a,b=c.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?b&&"auto"!==b?b:0:a},custom:function(a,b,d){function g(a){return e.step(a)}var e=this,f=c.fx;this.startTime=c.now();this.start=a;this.end=b;this.unit=d||this.unit||(c.cssNumber[this.prop]?
"":"px");this.now=this.start;this.pos=this.state=0;g.elem=this.elem;g()&&c.timers.push(g)&&!ea&&(ea=setInterval(f.tick,f.interval))},show:function(){this.options.orig[this.prop]=c.style(this.elem,this.prop);this.options.show=!0;this.custom("width"===this.prop||"height"===this.prop?1:0,this.cur());c(this.elem).show()},hide:function(){this.options.orig[this.prop]=c.style(this.elem,this.prop);this.options.hide=!0;this.custom(this.cur(),0)},step:function(a){var b=c.now(),d=!0;if(a||b>=this.options.duration+
this.startTime){this.now=this.end;this.pos=this.state=1;this.update();this.options.curAnim[this.prop]=!0;for(var g in this.options.curAnim)!0!==this.options.curAnim[g]&&(d=!1);if(d){if(null!=this.options.overflow&&!c.support.shrinkWrapBlocks){var e=this.elem,f=this.options;c.each(["","X","Y"],function(a,b){e.style["overflow"+b]=f.overflow[a]})}this.options.hide&&c(this.elem).hide();if(this.options.hide||this.options.show)for(var l in this.options.curAnim)c.style(this.elem,l,this.options.orig[l]);
this.options.complete.call(this.elem)}return!1}a=b-this.startTime;this.state=a/this.options.duration;b=this.options.easing||(c.easing.swing?"swing":"linear");this.pos=c.easing[this.options.specialEasing&&this.options.specialEasing[this.prop]||b](this.state,a,0,1,this.options.duration);this.now=this.start+(this.end-this.start)*this.pos;this.update();return!0}};c.extend(c.fx,{tick:function(){for(var a=c.timers,b=0;b<a.length;b++)a[b]()||a.splice(b--,1);a.length||c.fx.stop()},interval:13,stop:function(){clearInterval(ea);
ea=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){c.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&null!=a.elem.style[a.prop]?a.elem.style[a.prop]=("width"===a.prop||"height"===a.prop?Math.max(0,a.now):a.now)+a.unit:a.elem[a.prop]=a.now}}});c.expr&&c.expr.filters&&(c.expr.filters.animated=function(a){return c.grep(c.timers,function(b){return a===b.elem}).length});var Hb=/^t(?:able|d|h)$/i,Na=/^(?:body|html)$/i;"getBoundingClientRect"in r.documentElement?
c.fn.offset=function(a){var b=this[0],d;if(a)return this.each(function(b){c.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return c.offset.bodyOffset(b);try{d=b.getBoundingClientRect()}catch(g){}var e=b.ownerDocument,l=e.documentElement;if(!d||!c.contains(l,b))return d?{top:d.top,left:d.left}:{top:0,left:0};b=e.body;e=f(e);return{top:d.top+(e.pageYOffset||c.support.boxModel&&l.scrollTop||b.scrollTop)-(l.clientTop||b.clientTop||0),left:d.left+(e.pageXOffset||
c.support.boxModel&&l.scrollLeft||b.scrollLeft)-(l.clientLeft||b.clientLeft||0)}}:c.fn.offset=function(a){var b=this[0];if(a)return this.each(function(b){c.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return c.offset.bodyOffset(b);c.offset.initialize();var d,g=b.offsetParent,e=b.ownerDocument,f=e.documentElement,l=e.body;d=(e=e.defaultView)?e.getComputedStyle(b,null):b.currentStyle;for(var k=b.offsetTop,m=b.offsetLeft;(b=b.parentNode)&&(b!==l&&b!==f)&&
(!c.offset.supportsFixedPosition||"fixed"!==d.position);)d=e?e.getComputedStyle(b,null):b.currentStyle,k-=b.scrollTop,m-=b.scrollLeft,b===g&&(k+=b.offsetTop,m+=b.offsetLeft,c.offset.doesNotAddBorder&&(!c.offset.doesAddBorderForTableAndCells||!Hb.test(b.nodeName))&&(k+=parseFloat(d.borderTopWidth)||0,m+=parseFloat(d.borderLeftWidth)||0),g=b.offsetParent),c.offset.subtractsBorderForOverflowNotVisible&&"visible"!==d.overflow&&(k+=parseFloat(d.borderTopWidth)||0,m+=parseFloat(d.borderLeftWidth)||0);if("relative"===
d.position||"static"===d.position)k+=l.offsetTop,m+=l.offsetLeft;c.offset.supportsFixedPosition&&"fixed"===d.position&&(k+=Math.max(f.scrollTop,l.scrollTop),m+=Math.max(f.scrollLeft,l.scrollLeft));return{top:k,left:m}};c.offset={initialize:function(){var a=r.body,b=r.createElement("div"),d,g,e,f=parseFloat(c.css(a,"marginTop"))||0;c.extend(b.style,{position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",height:"1px",visibility:"hidden"});b.innerHTML="<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
a.insertBefore(b,a.firstChild);d=b.firstChild;g=d.firstChild;e=d.nextSibling.firstChild.firstChild;this.doesNotAddBorder=5!==g.offsetTop;this.doesAddBorderForTableAndCells=5===e.offsetTop;g.style.position="fixed";g.style.top="20px";this.supportsFixedPosition=20===g.offsetTop||15===g.offsetTop;g.style.position=g.style.top="";d.style.overflow="hidden";d.style.position="relative";this.subtractsBorderForOverflowNotVisible=-5===g.offsetTop;this.doesNotIncludeMarginInBodyOffset=a.offsetTop!==f;a.removeChild(b);
c.offset.initialize=c.noop},bodyOffset:function(a){var b=a.offsetTop,d=a.offsetLeft;c.offset.initialize();c.offset.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(c.css(a,"marginTop"))||0,d+=parseFloat(c.css(a,"marginLeft"))||0);return{top:b,left:d}},setOffset:function(a,b,d){var g=c.css(a,"position");"static"===g&&(a.style.position="relative");var e=c(a),f=e.offset(),l=c.css(a,"top"),k=c.css(a,"left"),m="absolute"===g&&-1<c.inArray("auto",[l,k]),g={},q={};m&&(q=e.position());l=m?q.top:parseInt(l,
10)||0;k=m?q.left:parseInt(k,10)||0;c.isFunction(b)&&(b=b.call(a,d,f));null!=b.top&&(g.top=b.top-f.top+l);null!=b.left&&(g.left=b.left-f.left+k);"using"in b?b.using.call(a,g):e.css(g)}};c.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),d=this.offset(),g=Na.test(b[0].nodeName)?{top:0,left:0}:b.offset();d.top-=parseFloat(c.css(a,"marginTop"))||0;d.left-=parseFloat(c.css(a,"marginLeft"))||0;g.top+=parseFloat(c.css(b[0],"borderTopWidth"))||0;g.left+=parseFloat(c.css(b[0],
"borderLeftWidth"))||0;return{top:d.top-g.top,left:d.left-g.left}},offsetParent:function(){return this.map(function(){for(var a=this.offsetParent||r.body;a&&!Na.test(a.nodeName)&&"static"===c.css(a,"position");)a=a.offsetParent;return a})}});c.each(["Left","Top"],function(a,b){var d="scroll"+b;c.fn[d]=function(b){var e=this[0],l;return e?b!==p?this.each(function(){(l=f(this))?l.scrollTo(a?c(l).scrollLeft():b,a?b:c(l).scrollTop()):this[d]=b}):(l=f(e))?"pageXOffset"in l?l[a?"pageYOffset":"pageXOffset"]:
c.support.boxModel&&l.document.documentElement[d]||l.document.body[d]:e[d]:null}});c.each(["Height","Width"],function(a,b){var d=b.toLowerCase();c.fn["inner"+b]=function(){return this[0]?parseFloat(c.css(this[0],d,"padding")):null};c.fn["outer"+b]=function(a){return this[0]?parseFloat(c.css(this[0],d,a?"margin":"border")):null};c.fn[d]=function(a){var e=this[0];if(!e)return null==a?null:this;if(c.isFunction(a))return this.each(function(b){var e=c(this);e[d](a.call(this,b,e[d]()))});if(c.isWindow(e)){var f=
e.document.documentElement["client"+b];return"CSS1Compat"===e.document.compatMode&&f||e.document.body["client"+b]||f}return 9===e.nodeType?Math.max(e.documentElement["client"+b],e.body["scroll"+b],e.documentElement["scroll"+b],e.body["offset"+b],e.documentElement["offset"+b]):a===p?(e=c.css(e,d),f=parseFloat(e),c.isNaN(f)?e:f):this.css(d,"string"===typeof a?a:a+"px")}});e.jQuery=e.$=c})(window);
(function(e,p){function f(f){return!e(f).parents().andSelf().filter(function(){return"hidden"===e.curCSS(this,"visibility")||e.expr.filters.hidden(this)}).length}e.ui=e.ui||{};e.ui.version||(e.extend(e.ui,{version:"1.8.11",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,
PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}}),e.fn.extend({_focus:e.fn.focus,focus:function(f,m){return"number"===typeof f?this.each(function(){var l=this;setTimeout(function(){e(l).focus();m&&m.call(l)},f)}):this._focus.apply(this,arguments)},scrollParent:function(){var f;f=e.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.curCSS(this,
"position",1))&&/(auto|scroll)/.test(e.curCSS(this,"overflow",1)+e.curCSS(this,"overflow-y",1)+e.curCSS(this,"overflow-x",1))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(e.curCSS(this,"overflow",1)+e.curCSS(this,"overflow-y",1)+e.curCSS(this,"overflow-x",1))}).eq(0);return/fixed/.test(this.css("position"))||!f.length?e(document):f},zIndex:function(f){if(f!==p)return this.css("zIndex",f);if(this.length){f=e(this[0]);for(var m;f.length&&f[0]!==document;){m=f.css("position");
if("absolute"===m||"relative"===m||"fixed"===m)if(m=parseInt(f.css("zIndex"),10),!isNaN(m)&&0!==m)return m;f=f.parent()}}return 0},disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.each(["Width","Height"],function(f,m){function l(f,l,k,m){e.each(q,function(){l-=parseFloat(e.curCSS(f,"padding"+this,!0))||0;k&&(l-=parseFloat(e.curCSS(f,
"border"+this+"Width",!0))||0);m&&(l-=parseFloat(e.curCSS(f,"margin"+this,!0))||0)});return l}var q="Width"===m?["Left","Right"]:["Top","Bottom"],w=m.toLowerCase(),x={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+m]=function(f){return f===p?x["inner"+m].call(this):this.each(function(){e(this).css(w,l(this,f)+"px")})};e.fn["outer"+m]=function(f,k){return"number"!==typeof f?x["outer"+m].call(this,f):this.each(function(){e(this).css(w,
l(this,f,!0,k)+"px")})}}),e.extend(e.expr[":"],{data:function(f,m,l){return!!e.data(f,l[3])},focusable:function(k){var m=k.nodeName.toLowerCase(),l=e.attr(k,"tabindex");if("area"===m){m=k.parentNode;l=m.name;if(!k.href||!l||"map"!==m.nodeName.toLowerCase())return!1;k=e("img[usemap=#"+l+"]")[0];return!!k&&f(k)}return(/input|select|textarea|button|object/.test(m)?!k.disabled:"a"==m?k.href||!isNaN(l):!isNaN(l))&&f(k)},tabbable:function(f){var m=e.attr(f,"tabindex");return(isNaN(m)||0<=m)&&e(f).is(":focusable")}}),
e(function(){var f=document.body,m=f.appendChild(m=document.createElement("div"));e.extend(m.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});e.support.minHeight=100===m.offsetHeight;e.support.selectstart="onselectstart"in m;f.removeChild(m).style.display="none"}),e.extend(e.ui,{plugin:{add:function(f,m,l){f=e.ui[f].prototype;for(var q in l)f.plugins[q]=f.plugins[q]||[],f.plugins[q].push([m,l[q]])},call:function(e,f,l){if((f=e.plugins[f])&&e.element[0].parentNode)for(var q=0;q<f.length;q++)e.options[f[q][0]]&&
f[q][1].apply(e.element,l)}},contains:function(e,f){return document.compareDocumentPosition?e.compareDocumentPosition(f)&16:e!==f&&e.contains(f)},hasScroll:function(f,m){if("hidden"===e(f).css("overflow"))return!1;m=m&&"left"===m?"scrollLeft":"scrollTop";var l=!1;if(0<f[m])return!0;f[m]=1;l=0<f[m];f[m]=0;return l},isOverAxis:function(e,f,l){return e>f&&e<f+l},isOver:function(f,m,l,q,p,x){return e.ui.isOverAxis(f,l,p)&&e.ui.isOverAxis(m,q,x)}}))})(jQuery);
(function(e,p){if(e.cleanData){var f=e.cleanData;e.cleanData=function(m){for(var l=0,k;null!=(k=m[l]);l++)e(k).triggerHandler("remove");f(m)}}else{var k=e.fn.remove;e.fn.remove=function(f,l){return this.each(function(){l||f&&!e.filter(f,[this]).length||e("*",this).add([this]).each(function(){e(this).triggerHandler("remove")});return k.call(e(this),f,l)})}}e.widget=function(f,l,k){var p=f.split(".")[0],x;f=f.split(".")[1];x=p+"-"+f;k||(k=l,l=e.Widget);e.expr[":"][x]=function(l){return!!e.data(l,f)};
e[p]=e[p]||{};e[p][f]=function(e,f){arguments.length&&this._createWidget(e,f)};l=new l;l.options=e.extend(!0,{},l.options);e[p][f].prototype=e.extend(!0,l,{namespace:p,widgetName:f,widgetEventPrefix:e[p][f].prototype.widgetEventPrefix||f,widgetBaseClass:x},k);e.widget.bridge(f,e[p][f])};e.widget.bridge=function(f,l){e.fn[f]=function(k){var w="string"===typeof k,x=Array.prototype.slice.call(arguments,1),v=this;k=!w&&x.length?e.extend.apply(null,[!0,k].concat(x)):k;if(w&&"_"===k.charAt(0))return v;
w?this.each(function(){var l=e.data(this,f),w=l&&e.isFunction(l[k])?l[k].apply(l,x):l;if(w!==l&&w!==p)return v=w,!1}):this.each(function(){var p=e.data(this,f);p?p.option(k||{})._init():e.data(this,f,new l(k,this))});return v}};e.Widget=function(e,f){arguments.length&&this._createWidget(e,f)};e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:!1},_createWidget:function(f,l){e.data(l,this.widgetName,this);this.element=e(l);this.options=e.extend(!0,{},this.options,this._getCreateOptions(),
f);var k=this;this.element.bind("remove."+this.widgetName,function(){k.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){return e.metadata&&e.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")},widget:function(){return this.element},
option:function(f,l){var k=f;if(0===arguments.length)return e.extend({},this.options);if("string"===typeof f){if(l===p)return this.options[f];k={};k[f]=l}this._setOptions(k);return this},_setOptions:function(f){var l=this;e.each(f,function(e,f){l._setOption(e,f)});return this},_setOption:function(e,f){this.options[e]=f;"disabled"===e&&this.widget()[f?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",f);return this},enable:function(){return this._setOption("disabled",
!1)},disable:function(){return this._setOption("disabled",!0)},_trigger:function(f,l,k){var p=this.options[f];l=e.Event(l);l.type=(f===this.widgetEventPrefix?f:this.widgetEventPrefix+f).toLowerCase();k=k||{};if(l.originalEvent){f=e.event.props.length;for(var x;f;)x=e.event.props[--f],l[x]=l.originalEvent[x]}this.element.trigger(l,k);return!(e.isFunction(p)&&!1===p.call(this.element[0],l,k)||l.isDefaultPrevented())}}})(jQuery);
(function(e){e.ui=e.ui||{};var p=/left|center|right/,f=/top|center|bottom/,k=e.fn.position,m=e.fn.offset;e.fn.position=function(l){if(!l||!l.of)return k.apply(this,arguments);l=e.extend({},l);var m=e(l.of),w=m[0],x=(l.collision||"flip").split(" "),v=l.offset?l.offset.split(" "):[0,0],u,D,z;9===w.nodeType?(u=m.width(),D=m.height(),z={top:0,left:0}):w.setTimeout?(u=m.width(),D=m.height(),z={top:m.scrollTop(),left:m.scrollLeft()}):w.preventDefault?(l.at="left top",u=D=0,z={top:l.of.pageY,left:l.of.pageX}):
(u=m.outerWidth(),D=m.outerHeight(),z=m.offset());e.each(["my","at"],function(){var e=(l[this]||"").split(" ");1===e.length&&(e=p.test(e[0])?e.concat(["center"]):f.test(e[0])?["center"].concat(e):["center","center"]);e[0]=p.test(e[0])?e[0]:"center";e[1]=f.test(e[1])?e[1]:"center";l[this]=e});1===x.length&&(x[1]=x[0]);v[0]=parseInt(v[0],10)||0;1===v.length&&(v[1]=v[0]);v[1]=parseInt(v[1],10)||0;"right"===l.at[0]?z.left+=u:"center"===l.at[0]&&(z.left+=u/2);"bottom"===l.at[1]?z.top+=D:"center"===l.at[1]&&
(z.top+=D/2);z.left+=v[0];z.top+=v[1];return this.each(function(){var f=e(this),k=f.outerWidth(),m=f.outerHeight(),q=parseInt(e.curCSS(this,"marginLeft",!0))||0,p=parseInt(e.curCSS(this,"marginTop",!0))||0,w=k+q+(parseInt(e.curCSS(this,"marginRight",!0))||0),L=m+p+(parseInt(e.curCSS(this,"marginBottom",!0))||0),y=e.extend({},z),I;"right"===l.my[0]?y.left-=k:"center"===l.my[0]&&(y.left-=k/2);"bottom"===l.my[1]?y.top-=m:"center"===l.my[1]&&(y.top-=m/2);y.left=Math.round(y.left);y.top=Math.round(y.top);
I={left:y.left-q,top:y.top-p};e.each(["left","top"],function(f,q){e.ui.position[x[f]]&&e.ui.position[x[f]][q](y,{targetWidth:u,targetHeight:D,elemWidth:k,elemHeight:m,collisionPosition:I,collisionWidth:w,collisionHeight:L,offset:v,my:l.my,at:l.at})});e.fn.bgiframe&&f.bgiframe();f.offset(e.extend(y,{using:l.using}))})};e.ui.position={fit:{left:function(f,k){var m=e(window),m=k.collisionPosition.left+k.collisionWidth-m.width()-m.scrollLeft();f.left=0<m?f.left-m:Math.max(f.left-k.collisionPosition.left,
f.left)},top:function(f,k){var m=e(window),m=k.collisionPosition.top+k.collisionHeight-m.height()-m.scrollTop();f.top=0<m?f.top-m:Math.max(f.top-k.collisionPosition.top,f.top)}},flip:{left:function(f,k){if("center"!==k.at[0]){var m=e(window),m=k.collisionPosition.left+k.collisionWidth-m.width()-m.scrollLeft(),p="left"===k.my[0]?-k.elemWidth:"right"===k.my[0]?k.elemWidth:0,v="left"===k.at[0]?k.targetWidth:-k.targetWidth,u=-2*k.offset[0];f.left+=0>k.collisionPosition.left?p+v+u:0<m?p+v+u:0}},top:function(f,
k){if("center"!==k.at[1]){var m=e(window),m=k.collisionPosition.top+k.collisionHeight-m.height()-m.scrollTop(),p="top"===k.my[1]?-k.elemHeight:"bottom"===k.my[1]?k.elemHeight:0,v="top"===k.at[1]?k.targetHeight:-k.targetHeight,u=-2*k.offset[1];f.top+=0>k.collisionPosition.top?p+v+u:0<m?p+v+u:0}}}};e.offset.setOffset||(e.offset.setOffset=function(f,k){/static/.test(e.curCSS(f,"position"))&&(f.style.position="relative");var m=e(f),p=m.offset(),v=parseInt(e.curCSS(f,"top",!0),10)||0,u=parseInt(e.curCSS(f,
"left",!0),10)||0,p={top:k.top-p.top+v,left:k.left-p.left+u};"using"in k?k.using.call(f,p):m.css(p)},e.fn.offset=function(f){var k=this[0];return k&&k.ownerDocument?f?this.each(function(){e.offset.setOffset(this,f)}):m.call(this):null})})(jQuery);
(function(e){var p=0;e.widget("ui.autocomplete",{options:{appendTo:"body",autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null},pending:0,_create:function(){var f=this,k=this.element[0].ownerDocument,m;this.element.addClass("ui-autocomplete-input").attr("autocomplete","off").attr({role:"textbox","aria-autocomplete":"list","aria-haspopup":"true"}).bind("keydown.autocomplete",function(l){if(!f.options.disabled&&!f.element.attr("readonly")){m=!1;var k=
e.ui.keyCode;switch(l.keyCode){case k.PAGE_UP:f._move("previousPage",l);break;case k.PAGE_DOWN:f._move("nextPage",l);break;case k.UP:f._move("previous",l);l.preventDefault();break;case k.DOWN:f._move("next",l);l.preventDefault();break;case k.ENTER:case k.NUMPAD_ENTER:f.menu.active&&(m=!0,l.preventDefault());case k.TAB:if(!f.menu.active)break;f.menu.select(l);break;case k.ESCAPE:f.element.val(f.term);f.close(l);break;default:clearTimeout(f.searching),f.searching=setTimeout(function(){f.term!=f.element.val()&&
(f.selectedItem=null,f.search(null,l))},f.options.delay)}}}).bind("keypress.autocomplete",function(e){m&&(m=!1,e.preventDefault())}).bind("focus.autocomplete",function(){f.options.disabled||(f.selectedItem=null,f.previous=f.element.val())}).bind("blur.autocomplete",function(e){f.options.disabled||(clearTimeout(f.searching),f.closing=setTimeout(function(){f.close(e);f._change(e)},150))});this._initSource();this.response=function(){return f._response.apply(f,arguments)};this.menu=e("<ul></ul>").addClass("ui-autocomplete").appendTo(e(this.options.appendTo||
"body",k)[0]).mousedown(function(k){var m=f.menu.element[0];e(k.target).closest(".ui-menu-item").length||setTimeout(function(){e(document).one("mousedown",function(k){k.target!==f.element[0]&&k.target!==m&&!e.ui.contains(m,k.target)&&f.close()})},1);setTimeout(function(){clearTimeout(f.closing)},13)}).menu({focus:function(e,k){k=k.item.data("item.autocomplete");!1!==f._trigger("focus",e,{item:k})&&/^key/.test(e.originalEvent.type)&&f.element.val(k.value)},selected:function(e,m){var p=m.item.data("item.autocomplete"),
x=f.previous;f.element[0]!==k.activeElement&&(f.element.focus(),f.previous=x,setTimeout(function(){f.previous=x;f.selectedItem=p},1));!1!==f._trigger("select",e,{item:p})&&f.element.val(p.value);f.term=f.element.val();f.close(e);f.selectedItem=p},blur:function(){f.menu.element.is(":visible")&&f.element.val()!==f.term&&f.element.val(f.term)}}).zIndex(this.element.zIndex()+1).css({top:0,left:0}).hide().data("menu");e.fn.bgiframe&&this.menu.element.bgiframe()},destroy:function(){this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup");
this.menu.element.remove();e.Widget.prototype.destroy.call(this)},_setOption:function(f,k){e.Widget.prototype._setOption.apply(this,arguments);"source"===f&&this._initSource();"appendTo"===f&&this.menu.element.appendTo(e(k||"body",this.element[0].ownerDocument)[0]);"disabled"===f&&k&&this.xhr&&this.xhr.abort()},_initSource:function(){var f=this,k,m;e.isArray(this.options.source)?(k=this.options.source,this.source=function(f,m){m(e.ui.autocomplete.filter(k,f.term))}):"string"===typeof this.options.source?
(m=this.options.source,this.source=function(k,q){f.xhr&&f.xhr.abort();f.xhr=e.ajax({url:m,data:k,dataType:"json",autocompleteRequest:++p,success:function(e){this.autocompleteRequest===p&&q(e)},error:function(){this.autocompleteRequest===p&&q([])}})}):this.source=this.options.source},search:function(e,k){e=null!=e?e:this.element.val();this.term=this.element.val();if(e.length<this.options.minLength)return this.close(k);clearTimeout(this.closing);if(!1!==this._trigger("search",k))return this._search(e)},
_search:function(e){this.pending++;this.element.addClass("ui-autocomplete-loading");this.source({term:e},this.response)},_response:function(e){!this.options.disabled&&e&&e.length?(e=this._normalize(e),this._suggest(e),this._trigger("open")):this.close();this.pending--;this.pending||this.element.removeClass("ui-autocomplete-loading")},close:function(e){clearTimeout(this.closing);this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.deactivate(),this._trigger("close",e))},_change:function(e){this.previous!==
this.element.val()&&this._trigger("change",e,{item:this.selectedItem})},_normalize:function(f){return f.length&&f[0].label&&f[0].value?f:e.map(f,function(f){return"string"===typeof f?{label:f,value:f}:e.extend({label:f.label||f.value,value:f.value||f.label},f)})},_suggest:function(f){var k=this.menu.element.empty().zIndex(this.element.zIndex()+1);this._renderMenu(k,f);this.menu.deactivate();this.menu.refresh();k.show();this._resizeMenu();k.position(e.extend({of:this.element},this.options.position));
this.options.autoFocus&&this.menu.next(new e.Event("mouseover"))},_resizeMenu:function(){var e=this.menu.element;e.outerWidth(Math.max(e.width("").outerWidth(),this.element.outerWidth()))},_renderMenu:function(f,k){var m=this;e.each(k,function(e,k){m._renderItem(f,k)})},_renderItem:function(f,k){return e("<li></li>").data("item.autocomplete",k).append(e("<a></a>").text(k.label)).appendTo(f)},_move:function(e,k){if(this.menu.element.is(":visible"))if(this.menu.first()&&/^previous/.test(e)||this.menu.last()&&
/^next/.test(e))this.element.val(this.term),this.menu.deactivate();else this.menu[e](k);else this.search(null,k)},widget:function(){return this.menu.element}});e.extend(e.ui.autocomplete,{escapeRegex:function(e){return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")},filter:function(f,k){var m=RegExp(e.ui.autocomplete.escapeRegex(k),"i");return e.grep(f,function(e){return m.test(e.label||e.value||e)})}})})(jQuery);
(function(e){e.widget("ui.menu",{_create:function(){var p=this;this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({role:"listbox","aria-activedescendant":"ui-active-menuitem"}).click(function(f){e(f.target).closest(".ui-menu-item a").length&&(f.preventDefault(),p.select(f))});this.refresh()},refresh:function(){var p=this;this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","menuitem").children("a").addClass("ui-corner-all").attr("tabindex",
-1).mouseenter(function(f){p.activate(f,e(this).parent())}).mouseleave(function(){p.deactivate()})},activate:function(e,f){this.deactivate();if(this.hasScroll()){var k=f.offset().top-this.element.offset().top,m=this.element.attr("scrollTop"),l=this.element.height();0>k?this.element.attr("scrollTop",m+k):k>=l&&this.element.attr("scrollTop",m+k-l+f.height())}this.active=f.eq(0).children("a").addClass("ui-state-hover").attr("id","ui-active-menuitem").end();this._trigger("focus",e,{item:f})},deactivate:function(){this.active&&
(this.active.children("a").removeClass("ui-state-hover").removeAttr("id"),this._trigger("blur"),this.active=null)},next:function(e){this.move("next",".ui-menu-item:first",e)},previous:function(e){this.move("prev",".ui-menu-item:last",e)},first:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},last:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},move:function(e,f,k){this.active?(e=this.active[e+"All"](".ui-menu-item").eq(0),e.length?this.activate(k,
e):this.activate(k,this.element.children(f))):this.activate(k,this.element.children(f))},nextPage:function(p){if(this.hasScroll())if(!this.active||this.last())this.activate(p,this.element.children(".ui-menu-item:first"));else{var f=this.active.offset().top,k=this.element.height(),m=this.element.children(".ui-menu-item").filter(function(){var l=e(this).offset().top-f-k+e(this).height();return 10>l&&-10<l});m.length||(m=this.element.children(".ui-menu-item:last"));this.activate(p,m)}else this.activate(p,
this.element.children(".ui-menu-item").filter(!this.active||this.last()?":first":":last"))},previousPage:function(p){if(this.hasScroll())if(!this.active||this.first())this.activate(p,this.element.children(".ui-menu-item:last"));else{var f=this.active.offset().top,k=this.element.height();result=this.element.children(".ui-menu-item").filter(function(){var m=e(this).offset().top-f+k-e(this).height();return 10>m&&-10<m});result.length||(result=this.element.children(".ui-menu-item:first"));this.activate(p,
result)}else this.activate(p,this.element.children(".ui-menu-item").filter(!this.active||this.first()?":last":":first"))},hasScroll:function(){return this.element.height()<this.element.attr("scrollHeight")},select:function(e){this._trigger("selected",e,{item:this.active})}})})(jQuery);(function(e){e.nano=function(p,f){return p.replace(/\{([\w\.]*)\}/g,function(k,m){var l=m.split("."),p=f[l.shift()];e.each(l,function(){p=p[this]});return null===p||void 0===p?"":p})}})(jQuery);
/*End JS Libraries */
/*Start Demandbase Company Autocomplete Widget */
var Demandbase=Demandbase||{};Demandbase.host=Demandbase.host||("https:"==document.location.protocol?"https://":"http://")+"autocomplete.demandbase.com";Demandbase.xhost=Demandbase.xhost||("https:"==document.location.protocol?"https://":"http://")+"api-admin.demandbase.com";Demandbase.jQuery=Demandbase.jQuery||jQuery.noConflict(!0);Demandbase.callback=Demandbase.callback||function(e){console.log("Demandbase data:",e)};"undefined"==typeof window.console&&(window.console={log:function(){},debug:function(){}});
Demandbase.CompanyAutocomplete={dialog:null,jQuery:Demandbase.jQuery,textField:null,errors:[],log:function(){console.log.apply(window.console,["Demandbase.CompanyAutocomplete:"].concat([].splice.call(arguments,0)))},setup:!1,initialized:!1,version:"v1.7.2",dataType:"jsonp",company:null,email:null,label:"{marketing_alias} ({city}, {state})",sequence:0,session:(new Date).getTime()+""+Math.random(),debug:null,latest_result:[],callback:null,widget:function(e){var p=Demandbase.jQuery;e||(e={});this.key=
e.key;e.company&&(this.company=e.company);e.email&&(this.email=e.email);e.label&&(this.label=e.label);e.dataType&&(this.dataType=e.dataType);e.callback&&(this.callback=e.callback);if(!this.company)throw this.log("company is required"),"company is required";if(!this.callback)throw this.log("callback is required"),"callback is required";this.setup=!0;p(function(){Demandbase.CompanyAutocomplete.init()})},init:function(){if(this.setup&&!this.initialized){var e=Demandbase.jQuery;this._append_stylesheet();
this.container=e(e("#demandbase-autocomplete")[0]||e("<div>").attr({id:"demandbase-autocomplete"}).appendTo("body"));this.element=e(e("#demandbase-company-autocomplete-widget")[0]||e("<div>").attr({id:"demandbase-company-autocomplete-widget","class":"demandbase-company-autocomplete ui-widget"})).appendTo(this.container);this.textField=e(e("#"+this.company)[0]||e("<input>").appendTo(this.element));this.textField.autocomplete({appendTo:this.element,delay:30,minLength:2,source:this._source,select:this._select,
change:this._change});this.textField.autocomplete("widget").addClass("demandbase-company-autocomplete");this.email&&e(function(){var e=Demandbase.CompanyAutocomplete,f=e.jQuery;f("#"+e.email).change(function(){e.getPerson(e.callback)})});this.initialized=!0}},getPerson:function(e){var p=Demandbase.CompanyAutocomplete;e=Demandbase.jQuery;var f=e("#"+p.email).val(),k=p.key,m=null,l=-(new Date).getTimezoneOffset()/60;if(0<e.trim(f).length){try{m=f.split("@").pop()}catch(q){}e.getJSON(Demandbase.host+
"/api/v3/email.json?key="+k+"&query="+f+"&domain="+m+"&timezone="+l+"&source=autocomplete&callback=?",function(e){try{p.callback(e)}catch(f){}})}},_append_stylesheet:function(){Demandbase.jQuery("<link>").appendTo("head").attr({rel:"stylesheet",type:"text/css",href:Demandbase.host+"/autocomplete/stylesheet.v2.css"})},_select:function(e,p){var f=Demandbase.CompanyAutocomplete,k=f.jQuery,m=void 0;if(m=p.item.pick){p.item.value=m.marketing_alias;try{f.callback({pick:m})}catch(l){f.errors.push(l),f.log("Demandbase.CompanyAutocomplete:",
"ERROR:","An error occurred in the callback"),f.log(l)}m={key:f.key,pick:m,company:m.company_name,sid:m.demandbase_sid,timezone:-(new Date).getTimezoneOffset()/60,input:f.textField.val(),email:k("#"+f.email).val(),pick_index:k.inArray(m,f.latest_result.picks),session:f.session,sequence:f.sequence};try{m.domain=k("#"+f.email).val().split("@").pop()}catch(q){}k.getJSON(Demandbase.host+"/analysis/autocomplete/"+f.version+"/log.json?callback=?",m,function(e){})}},_source:function(e,p){var f=Demandbase.CompanyAutocomplete,
k=Demandbase.jQuery,m=null,l=null,q=null;try{l=k("#"+f.email).val().split("@").pop()}catch(w){}try{q=document.location.hash.slice(1)}catch(x){}m={version:f.version,sequence:f.sequence++,term:e.term,key:f.key};l&&0<k.trim(l).length&&(m.domain=l);q&&0<k.trim(q).length&&(m.query=q);try{f.request_callback&&"function"===typeof f.request_callback&&f.request_callback(m)}catch(v){console.log("request callback error: ",v)}k.ajax({url:Demandbase.host+"/autocomplete",dataType:f.dataType,data:m,success:function(l){if(l)if("ok"==
l.status){if(l.sequence>f.latest_result.sequence||!f.latest_result.sequence)f.latest_result=l;try{f.response_callback&&"function"===typeof f.response_callback&&f.response_callback(f.latest_result)}catch(m){console.log("response callback error: ",m)}p(k.map(f.latest_result.picks,function(m){return{label:k.nano("function"==typeof f.label?f.label.apply(this,[k,m]):f.label,m),value:e.term,ip:l.ip,pick:m}}))}else f.log("ERROR: ",l.error),p([]),f.textField.autocomplete("destroy")},error:function(e,k,l){f.log(k,
l);p([]);f.textField.autocomplete("destroy")}})},filter:function(e,p){if("function"!==typeof p)throw new TypeError;for(var f=e.length>>>0,k=[],m=0;m<f;m++)if(m in e){var l=e[m];p.call(e,l,m,e)&&k.push(l)}return k},_change:function(e,p){if(!p.item){var f=Demandbase.CompanyAutocomplete,k=f.jQuery,m=void 0,l=k.trim(k(this).val()),q={key:f.key,input:f.textField.val(),email:k("#"+f.email).val(),timezone:-(new Date).getTimezoneOffset()/60,session:f.session,sequence:f.sequence};try{q.domain=k("#"+f.email).val().split("@").pop()}catch(w){}k.getJSON(Demandbase.host+
"/analysis/autocomplete/"+f.version+"/log.json?callback=?",q,function(e){});try{if(0<l.length&&(f.latest_result&&f.latest_result.picks&&0<f.latest_result.picks.length)&&(m=f.filter(f.latest_result.picks,function(e){return e.company_name.match(RegExp("^"+l,"i"))})[0]))try{f.callback({input_match:m})}catch(x){f.errors.push(x),f.log("Demandbase.CompanyAutocomplete:","ERROR:","An error occurred in the callback"),f.log(x)}}catch(v){f.errors.push(v),f.log("Demandbase.CompanyAutocomplete:","ERROR:","Unable to detect input match: ",
v)}}}};
/*End Demandbase Company Autocomplete Widget */
/** !!!!!!!!!!!!! DO NOT MODIFY ANYTHING ABOVE THIS LINE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!! **/


/**
Demandbase.Connectors namespace - Contains all functions and properties for a Demandbase-enabled form
@module Demandbase.Connectors
@main Demandbase.Connectors
@beta
**/
'use strict';
Demandbase.Connectors=window.Demandbase.Connectors||{};

/**
Connects three Demandbase APIs to a form using the CompanyAutocomplete Widget and the IP Address API.
Includes functionality to determine API priority order, populate hidden and visible fields, and show additional fields
when hidden fields are not provided by Demandbase.
@class Demandbase.Connectors.WebForm
@static
@beta
**/
Demandbase.Connectors.WebForm = {
    name: 'Demandbase Form Module',
    /**
    Required - Demandbase API key for authenticating calls to IP address API and Company Autocomplete Widget
    @property key
    @type string
    @static
    @default ""
    @required
    **/
    key: '',
    /**
    Required - ID of user-facing input element for capturing visitor's email address.
    After visitor enters email address, the value of this field is used to query the Domain API via the
    Company Autocomplete Widget.
    @property emailID
    @type string
    @static
    @default ""
    @required
    **/
    emailID: '',
    /**
    Required - ID of the user-facing input element for capturing company name.
    The will have autocomplete list will be attached to this field, which also triggers the call to the Company Name API.
    Note: This is separate from/in-addition-to the hidden company field which has the coompany named from the winning Demandbase data set
    @property companyID
    @type string
    @static
    @default ""
    @required
    **/
    companyID: '',
    /**
    Specify which form has the input fields indicated by companyID and emailID and the fields mapped in the hiddenFieldMap and visibleFieldsMap.
    This should only be set if all Demandbase-enabled forms always has the same name, otherwise use formNameList.
    Specifying a form is not required if there is only one form on the page. Leaving default value  (null) selects first form found in the DOM.
    This is the Form object to populate with Demandbase data and send to the form processor.
    If the form/landing page has another <form> element (common for search, email subscribe or login functionality), define this property.
    If neither form nor formName list is defined, then the first form in the DOM is used by default.
    @property form
    @type HTML Element
    @default null
    @static
    @optional
    @example
        document.forms['form_name']
    **/
    form: null,                     //Optional
    /**
    Specify which form has the input fields indicated by companyID and emailID and the fields mapped in the hiddenFieldMap and visibleFieldMap.
    This array is used when there are multiple form pages that have forms with different names.
    If every form has the same name, use the form propery.
    Specifying a form is not required if there is only one form on the page. Leaving default value  (null) selects first form found in the DOM.
    This is the Form object to populate with Demandbase data and send to the form processor.
    If the form/landing page multiple <form> element (common for search, email subscribe or login functionality),
    and the name is not the same on every Demandbase-enabled form, then define this property.
    If neither form nor formName list is defined, then the first form in the DOM is used by default.
    @property formNameList
    @type String Array
    @default ['']
    @static
    @optional
    @example
        ['formName1', 'formName2', 'formName3']
    **/
    formNameList: [''],
    /**
    Testing mode - Show alert to use if there are errors.
    To enable in production/deployed page, set "db_debug=true" in URL query string.
    Warning: set to false before deploying!
    @property debug
    @type Boolean
    @static
    @default true
    @required
    @example
        false
    **/
    debug: true,
    /**
    Testing mode - Shows a div of all fields in the winning Demandbase data with the configured field mapping
    This cannot be enabled via query string parameter.
    Warning: set to false before deploying!
    @property showResult
    @type Boolean
    @static
    @default false
    @required
    @example
        false
    **/
    showResult: true,
    /**
    Testing mode - set to true to run QUnit tests and display results on the page
    This can be enabled via query string parameter by setting "db_runTests=true".
    Warning: set to false before deploying!
    @property runTests
    @static
    @default false
    @example
        true
    **/
    runTests: false,
    /**
    Testing mode - logs messages to console on key events and actions
    Advise: set to false before deploying.
    Note: this can also be set in the query string, for example: add "?db_logging=true" to the landing page URL to enable on production form
    @property logging
    @type Boolean
    @static
    @default true
    @required
    @example
        false
    **/
    logging: true,
    /**
    Testing mode - set to false when deploying to production.
    Set to true to test using testIpAddress (overrides value sent to IP API query parameter)
    Note: this can also be set in the query string, for example: add "?db_useTestIp=true" to the landing page URL to enable
    Advise: set to false before deploying.
    @property useTestIp
    @type Boolean
    @static
    @default false
    **/
    useTestIp: false,
    /**
    Testing mode - IP passed to query parameter when useTestIp is true,
    Set to test any individual IP for testing.  This value can also be set from the URL query string, for example "?db_ip=3.0.0.1".
    If useTestIp is not set to true this value will be ignored
    @property testIpAddress
    @type String
    @static
    @default ''
    @example
        '50.59.18.196'
    **/
    testIpAddress: '3.0.0.1',
    /**
    Optional - True means user input for company field will match the nearest company, false means company name API will only match a company when the user selects
    a company from the autocomplete list.
    Advise: set to false before deploying.
    @property useCompanyInputMatch
    @type Boolean
    @static
    @default false
    **/
    useCompanyInputMatch: false,
    /**
    Optional - False means IP addresses that resolve to an ISP will count as a match.
    True is the recommended value, so results from the IP address API will not be considered an identification if the result is from an ISP.
    @property useIspFilter
    @type Boolean
    @static
    @default true
    **/
    useIspFilter: true,
    /**
    Optional - True means the audience fields from the IP API will be added to the data sets returned by the Domain and Company APIs.
    This property does not impact the IP field itself.
    @property keepAudienceFields
    @type Boolean
    @static
    @default false
    **/
    keepAudienceFields: false,
    /**
    Optional - Use only if needing to override the fields shown in the company autocomplete auto suggest list
    @property cacLabel
    @optional
    @type String
    @static
    @default '{marketing_alias} ({city}, {state})'
    @example
        '{company_name} ({industry} / {zip})'
    **/
    cacLabel: '{marketing_alias} ({city}, {state})',
    /**
    Required - map IDs (or name) of hidden form fields to populate with Demandbase data and integrate with form processor
    This set of name/values pairs has the Demandbase variable name on left, DOM ID of input field element on the right.
    This does not work with single select menus.

    Note: This mapping is not required if the ID or name of the hidden fields matches the Demandbase variable
    name with the prefix ("db_") defined in the _normalize function.
    Strategy tips:
    Demandbase recommends capturing the IP address
    Store the Demandbase unique ID for use with Eloqua Cloud Connector
    Note Account Watch must be setup to use "watch_list_"+[variableName] for custom Account Watch fields
    Optional Manual Review flag set when Company API is used
    @property hiddenFieldMap
    @type object
    @static
    @default (various)
    @required
    @example
        hiddenFieldMap: {
            'company_name': 'DBCompanyName',
            'audience' : 'DBAudience',
            'industry': 'DBIndustry',
            'employee_range': 'DBEeRange',
            'revenue_range': 'DBRevRange',
        }
    **/
    hiddenFieldMap: {},
    /**
    Optional - map visible form fields to pre-populate with Demandbase data.
    This set of name/values pairs has the Demandbase variable name on left, and the ID (or name) of the input field or select element to populate on the right
    @property visibleFieldMap
    @type object
    @static
    @default (various)
    @optional
    @example
        visibleFieldMap: {
            '[demandbaseVarName]' : '[input_element_id]'
            'industry': 'Industry__c',
            'employee_range': 'EmployeeRange__c'
        }
    **/
    visibleFieldMap: {},
    /**
    Defines the order of precedence to use when more than one API returns a result by mapping "Email", "IP", and "Company" to numeric values
    Highest number is top priority, lowest number is only used when other APIs do not identify the company.
    Be default, Domain API "wins" over other APIs.  If Domain API doesnt identify, use IP Address API, then use Company selected
    @property priorityMap
    @type object
    @static
    @default
        priorityMap: {
            'domain': 3,   //highest # is top priority - Domain API "wins" over other APIs
            'ip': 2,       //if Domain API doesnt identify, use IP Address API
            'company': 1   //Company API is lowest priority (lowest number)
        }
    @required
    **/
    priorityMap: {
        'domain': 3,
        'ip': 2,
        'company': 1
    },
    /**
    A list of Demandbase variable names which defines the returned attributes that signify an identification.
    If the fields in list are not returned by any of the APIs, then the onNoId function is called, and the elements in the
    toggleFieldList are shown.
    @property requiredAttrsList
    @type object
    @static
    @default ['company_name']
    @optional
    @example
        requiredAttrsList : ['company_name','country','state']
    **/
    requiredAttrsList: ['company_name'],        //Array of Demandbase variable names to determine if an API call has ID'd the visitor (if a field is blank, this counts as not ID'd)
    /**
    Defines a list of DOM IDs of elements to hide initially and show if Demandbase does not populate them with data.
    Note, this is not typically the input field itself, rather it is usually a wrapper div that also contains the field label.
    @property toggleFieldList
    @type String Array
    @static
    @default []
    @optional
    @example
        toggleFieldList : ['formFieldContainer1', 'formFieldContainer2']
    **/
    toggleFieldList: [],                     //Array of the DOM IDs of fields to show when company is not ID'd
    /**
    Indicates whether the form fields in toggleFieldList are shown by default.
    The default value, true, indicates fields will be hidden when the page loads.
    This is updated whenever the _toggleFields function is called to indicate whether fields should be shown or hidden.
    This helps prevent fields from being re-hidden if the vistior interacts with the company/email fields multiple times
    @property areToggleFieldsVisible
    @static
    @default true
    @optional
    **/
    areToggleFieldsVisible: true,
    /**
    This method accepts an object containing any parameters to be set from outside the Demandbase.Connectors.WebForm, providing the flexibility to modify the field mapping, form, and autocomplete fields.
    Call the connect method from the page, rather than creating a unique version of the form module for a particular page.  This is very useful on sites that do not have a formalized
    naming convention for fields and forms.  See example for how to use within a page.
    @method connect
    @param {Object} [options] Fields to set in Demandbase.Connectors.WebForm class.  Any public property can be passed.
    @example
        var dbf = Demandbase.Connectors.WebForm;
        dbf.connect({
            emailID : "email_input_id",
            companyID : "company_input_id",
            form: document.forms['simpleFormTest'],
            hiddenFieldMap: {
                'company_name': 'DBCompanyName',
                'industry': 'DBIndustry',
                'employee_range': 'DBEeRange',
            }
        });
    **/
    connect: function(options) {
        if (!options) options = {};
        if (options.key) this.key = options.key;
        if (options.companyID) this.companyID = options.companyID;
        if (options.emailID) this.emailID = options.emailID;
        if (options.form) this.form = options.form;
        if (options.formNameList) this.formNameList = options.formNameList;
        if (options.testIpAddress) this.testIpAddress = options.testIpAddress;
        if (options.cacLabel) this.cacLabel = options.cacLabel;
        if (options.hiddenFieldMap) this.hiddenFieldMap = options.hiddenFieldMap;
        if (options.visibleFieldMap) this.visibleFieldMap = options.visibleFieldMap;
        if (options.priorityMap) this.priorityMap = options.priorityMap;
        if (options.requiredAttrsList) this.requiredAttrsList = options.requiredAttrsList;
        if (options.toggleFieldList) this.toggleFieldList = options.toggleFieldList;

        if (typeof options.debug !== 'undefined' && !this._isNullEmpty(options.debug)) this.debug = options.debug;
        if (typeof options.showResult !== 'undefined' && !this._isNullEmpty(options.showResult)) this.showResult = options.showResult;
        if (typeof options.logging !== 'undefined' && !this._isNullEmpty(options.logging)) this.logging = options.logging;
        if (typeof options.useTestIp !== 'undefined' && !this._isNullEmpty(options.useTestIp)) this.useTestIp = options.useTestIp;
        if (typeof options.useIspFilter !== 'undefined' && !this._isNullEmpty(options.useIspFilter)) this.useIspFilter = options.useIspFilter;
        if (typeof options.useCompanyInputMatch !== 'undefined' && !this._isNullEmpty(options.useCompanyInputMatch)) this.useCompanyInputMatch = options.useCompanyInputMatch;
        if (typeof options.keepAudienceFields !== 'undefined' && !this._isNullEmpty(options.keepAudienceFields)) this.keepAudienceFields = options.keepAudienceFields;
        if (typeof options.areToggleFieldsVisible !== 'undefined' && !this._isNullEmpty(options.areToggleFieldsVisible)) this.areToggleFieldsVisible = options.areToggleFieldsVisible;
        this._log('Module Run with Options: ');
        this._log(options);
    },
    /**
    This method initializes the connector, attaching the Company Autocomplete Widget to the form and loading a script tag to call the IP address API.
    First, this function checks to ensure the Demandbase namespace is available, an indication that the widget.js file has loaded.
    @method init
    **/
    init: function() {
        if (typeof Demandbase !== 'undefined') {
            Demandbase.jQuery(document).ready(function() {
                var dbf = Demandbase.Connectors.WebForm;
                dbf.djq = Demandbase.jQuery;
                dbf._loadAsyncScript(); //TODO: MD - test running this function outside of doc ready so IP API is called regardless of CAC
                dbf._attachCompanyAPI();

                //Assign form to use Select the first form that matches a value in formNameList...
                for (var formName in dbf.formNameList) {
                    dbf.form = document.forms[dbf.formNameList[formName]];
                    if (dbf.form != null) { break; }
                }
                //...use the first form in the DOM, if otherwise not specified
                if (! dbf.form) dbf.form = document.forms[0];

                if (dbf.djq('#' + dbf.emailID).val() !== '') Demandbase.CompanyAutocomplete.getPerson(Demandbase.CompanyAutocomplete.callback);
                if (dbf.toggleFieldList.length > 0 && dbf.areToggleFieldsVisible) dbf.toggleFields();

                db_hook_init();
            });
            this._log('Initializing ' + this.name + ' v.' + this._version);
        } else {
            this._loadAsyncScript(); //still call IP API, even if widget isnt loaded
            this._log('Initializing ' + this.name + ' v.' + this._version + '... \nFAILED - widget.js file not loaded');
        }

    },
    /**
    This method is the "engine" that runs the Demandbase.Connectors.WebForm, accepting the data set returned by each API call, determining which API returned data and populating fields on the form.
    The parser uses the priorityMap to determine when a returned dataset should override the existing one, and it creates a field set for the fields in the hiddenFieldMap.
    When showResult is set to true, this method outputs a table of the returned attributes.  When debug is true, this method will display alerts if there is a JS error.
    This parser function is called 3X during a form interaction
            1st call - User lands on the form page, triggering a call to the Demandbase IP Address API
            2nd call - User enters email address which returns a data.person object
            3rd call - User enters company name which returns a data.pick object (or data.input_match, if they just type a name and do not actually select a company from the list)
    @method parser
    @param {Object} [data] - The JSON data set returned from any of the three Demandbase APIs
    **/
    parser: function(data) {
        if (! data) return '';  //Protects against 404 errors or empty objects
        try {
            //Identify data source and priority
            var priority, source;
            if (typeof data.person == 'object') {
                source = 'domain';
                this._sourceChecker.setSource(source, this._isIdComplete(data), true);
                if (!data.person) return; //TODO: MD - why here? better way?
                data = data.person;
                /* if Domain API returns same SID as existing data set, do not override */
                if (this._dbDataSet && data.demandbase_sid == this._dbDataSet.demandbase_sid) return;

            } else if (data.pick || data.input_match) {
                source = 'company';        /*Company API returns data*/
                if (data.pick) {
                    data = data.pick;
                    /*set dbDataSet early when no other dataset has been popld yet - reqd for checkSources/onNoId*/
                    if (this._dbDataSet == null) this._dbDataSet = data;
                } else if (data.input_match) {
                    data = data.input_match;
                    if (this.useCompanyInputMatch) {
                        this._log('Using input_match object from Company Name API...');
                    } else {
                        //this._sourceChecker.setSource(source, false, true);  // Record source and result.
                        this._log('input_match object detected from Company Name API...exiting because useCompanyInputMatch=false');
                        return;
                    }
                }
                data['manual_review'] = true;    /*Add manual review flag when the Company Name API is used (can be captured to flag for potential user input errors)*/
            } else {
                source = 'ip';            /*IP Address API returns data*/
                /*store fields returned only by IP API*/
                this._detectedIP = data['ip'] || '';
                this._detectedAudience = data['audience'] || '';
                this._detectedAudienceSegment = data['audience_segment'] || '';
                this._ipDataSet = data;
                this._sourceChecker.setSource('ip', this._isIdComplete(data), false);
                this._log('Queried IP Address: ' + this._detectedIP);
                if (data['isp'] === true && this.useIspFilter) return; //Handle ISP traffic
                //this._lastDataSource = this.priorityMap[source];     //initialize lastDataSource when IP API is called
            }
            this._log('Parsing response from API: ' + source);
            this._sourceChecker.setSource(source, this._isIdComplete(data), true);  /* Record source and result.*/

            if (this._dbDataSet) isIdMatch = data.demandbase_sid == this._dbDataSet.demandbase_sid;

            db_hook_before_parse(data, source); /*call hook function before parsing*/

            priority = this.priorityMap[source]; /*Check if data source takes precedence*/
            if (this._lastDataSource !== null && priority < this._lastDataSource) {
                //by pass API priority if current result from Domain API matches SID from subsequent result
                if (!isIdMatch /*&& this._dbDataSrc !== 'domain'*/) return;
            }
            this._dbDataSet = data;  //Update the data object used
            this._dbDataSrc = source;
            data['data_source'] = source;
            this._removeDataset(data);    //Remove previously used data set
            this._log('Parsing data response from: ' + this._dbDataSrc);
            this._log('New Data Set:');
            this._log(this._dbDataSet);
            data = this._flattenData(data);
            this._restoreIpFields(data);

            var fs = document.createElement('fieldset');
            fs.id = 'db_data_container', fs.style.cssText = 'border:none;';
            for (var attr in data) {
                var val = data[attr] || '';
                var newEl = this._buildHiddenField(attr, val);
                if (this.showResult) {
                    var testEl = document.createElement('div');
                    testEl.setAttribute('id', newEl.id + '_container');
                    testEl.innerHTML = '<strong>' + newEl.id + '</strong>: ' + newEl.value + '<br/>';
                    fs.appendChild(testEl);
                }
                this._prepopVisibleFields(attr, val);
                fs.appendChild(newEl);
                db_hook_attr(source, attr, val);
            }
            if (this.form) {
                this.form.appendChild(fs);
                this._lastDataSource = priority;
            }
            db_hook_after_parse(data, source);
          }catch (e) {
              if (this.debug || this._getQueryParam('db_debug') === 'true') alert('Error: ' + e + ' \n ' + e.stack);
          }
    },
     /**
    Some demandbase fields are returned as objects (hq hierarchy and Account Watch)
     This function breaks out each individual field in those objects andnormalizes the name, making
      it possible to iterate through the entire data set without checking for objects
    @method _flattenData
    @params  {Object} [data] - The JSON data set returned from any of the three Demandbase APIs
    **/
    _flattenData: function(data) {
        for (var d in data) {
            if (typeof data[d] == 'object' && data[d] !== null) {
                for (var nd in data[d]) {
                    data[d + '_' + nd] = data[d][nd];
                }
                delete data[d];
            }
        }
        return data;
    },
    /**
    Adds the IP address to the data sets returned by the Domain and Company Name APIs, so it can still be stored if the IP address API data set is overridden.
    @method _restoreIpFields
    @params  {Object} [data] - The JSON data set returned from any of the three Demandbase APIs
    **/
    _restoreIpFields: function(data) {
        if (data) {
            if (typeof data['ip'] == 'undefined' && !this._isNullEmpty(this._detectedIP)) {
                data['ip'] = this._detectedIP;
            }
            if (this.keepAudienceFields) {
                if (typeof data['audience' == 'undefined'] && !this._isNullEmpty(this._detectedAudience)) {
                    data['audience'] = this._detectedAudience;
                }
                if (typeof data['audience_segment' == 'undefined'] && !this._isNullEmpty(this._detectedAudienceSegment)) {
                    data['audience_segment'] = this._detectedAudienceSegment;
                }
            }
        }
    },
    /**
    This function swaps the Demandbase variable name for the value listed in hiddenFieldMap.
    If a field is not listed in hiddenFieldMap, then a prefix is applied to the variable name.
    Note, this function alters the in-memory JSON object returned from Demandbase.
    @method _normalize
    @params {String} name - A Demandbase varialbe name to lookup in hiddenFieldMap
    **/
    _normalize: function(name) {
        var prefix = 'db_';
        return this.hiddenFieldMap[name] ? this.hiddenFieldMap[name] : prefix + name;
    },
    /**
    Creates a new hidden field and sets its value according to the returned data set.  If a field with the same name already exists, it will be deleted and re-created.
    Note: this does not support the population of hidden drop down lists.  Single select menus can only be populated if they're visible.
    @method _buildHiddenField
    @params {String} attr - Field name of field to be created
    @params    {String} val -  Field value to be set in field
    **/
    _buildHiddenField: function(attr, val) {
         var elName = this._normalize(attr); //Maps the Demandbase variable name to the form field to populate

        var fieldId = elName;
        var fieldName = elName;

        /*If MAS renders the form with hidden fields present...
        ...remove them to avoid multiple values in the POST*/
        var oldField = this._getElmByIdOrName(elName);
        //if (typeof oldField !== 'undefined' && oldField == null) oldField = document.getElementsByName(elName)[0];
        if (oldField) {
            fieldId = oldField.id;

            if (oldField.name) fieldName = oldField.name;
            if (!fieldId) fieldId = elName; /* just in case existing element does not have ID set */
            //TODO: MD - possibly popl single select menu here, instead of creating new element
            oldField.parentNode.removeChild(oldField);
        }

        var newEl = document.createElement('input');
        newEl.setAttribute('id', fieldId);
        newEl.setAttribute('name', fieldName);
        newEl.setAttribute('type', 'hidden');
        newEl.value = val;

        return newEl;
    },
    /**
    This method populates visible fields according to the visibleFieldMap, includes setting values in select elements (menus)
    @method _prepopVisibleFields
    @params  {String} attr - Name of field to populate
    @params     {String} val - Value to set in field
    @uses visibleFieldMap
    **/
    _prepopVisibleFields: function(attr, val) {
        if (this.visibleFieldMap[attr]) {
            var valSet = false,
            field = this._getElmByIdOrName(this.visibleFieldMap[attr]);

            if (field) {
                /*pre-populating a single select or multi select menu*/
                if (field.type == 'select-one') {
                    for (var i = 0; i < field.options.length; i++) {
                        if (field.options[i].value == val) {
                            valSet = field.options[i].selected = true;
                            break;
                        }
                    }
                }else {
                    field.value = val;
                    valSet = true;
                }
                //Trigger change event when value is set
                if (valSet) {
                    this.djq(field).change().parents('p');
                    //.addClass('db_hidden').hide();  //optional - hide fields after pre-populating
                }
            }
        }
    },
    /**
    This method first attempts to retrieve an element by it's ID (supplied as the single argument).
    If no element is found with the ID, then this looks for the element by name.
    Note: this only looks for named elements on the specified form, not all named elements in the DOM
    This is used by any function that retrieves a DOM element within this class.
    @method _getElmByIdOrName
    @params {String} field - the ID or name of the element to retrieve
    @static
    **/
    _getElmByIdOrName: function(field) {
        var elm = document.getElementById(field);
        if (!elm && this.form) {
            elm = this.form.elements.namedItem(field);
            if (elm && elm instanceof NodeList) elm = elm[0];
        }
        //TODO: what if elm is still undefined?
        return elm;
    },
    /**
    Used to get the IP address from the query string, this function can retrieve the value of any parameter from the URL query string.
    @method _getQueryParam
    @params {String} param - The name of the query parameter whose value to retrieve
    @static
    **/
    _getQueryParam: function(param) {
        var qs = window.location.search.substring(1); //remove the leading '?'
        var pairs = qs.split('&');
        var params = {};
        for (var i = 0; i < pairs.length; i++) {
          var nvArray = pairs[i].split('=');
          var name = nvArray[0];
          var value = nvArray[1];
          params[name] = value;
        }
        return params[param];
    },
    /**
    Attaches the Demandbase Company Autocomplete Widget to the input fields specified by companyID and emailID.
    In addition to the dynamci autocomplete list of companies, this makes calls to the Domain API and Company Name API when the user enters information.
    Required widget.js file is already loaded.
    @method _attachCompanyAPI
    **/
    _attachCompanyAPI: function() {
        //Instantiating the Company Autocomplete Widget - this automatically calls the Domain and Company Name APIs
        //when the user enters an email or company name
        //Be sure to include widget.js on the page
        if(this.companyID && this.emailID) {
            if (Demandbase.CompanyAutocomplete) {
                Demandbase.CompanyAutocomplete.widget({
                    company: this.companyID,
                    email: this.emailID,
                    key: this.key,
                    label: this.cacLabel,
                    callback: function(data) {Demandbase.Connectors.WebForm.parser(data)}
                });
                var self;
                self = Demandbase.Connectors.WebForm;
                /*Since the callback is not called when there is no match on company name
                we explictly check sources after an 'autocompletechange' event.*/
                self.djq('#' + self.companyID).bind('autocompletecreate', function() {
                    self.djq(this).autocomplete('option', 'change', function(event, ui) {
                        Demandbase.CompanyAutocomplete._change.call(this, event, ui);
                        self._sourceChecker.checkSources();  //this runs after the blur event
                    });
                });
            }
            this._log('Attached CompanyAutocomplete Widget to email/company fields: ' + this.emailID + ' / ' + this.companyID);
         } else{ this._log("ERROR: CompanyID has no value or has the wrong ID. Autocomplete has not attached to any element."); }
    },
    /**
    Effectively calls the IP address API by adding a script tag at the end of the head.
    useTestIp and testIpAddress can be used to override the query parameter to test as a specific visitor IP.
    @method _loadAsyncScript
    @uses useTestIp
    @uses testIpAddress
    **/
    _loadAsyncScript: function() {
        var s = document.createElement('script');
        s.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'api.demandbase.com/api/v2/ip.json?key=' + this.key + '&referrer=' + document.referrer + '&page=' + document.location.href + '&page_title=' + document.title + '&callback=Demandbase.Connectors.WebForm.parser&query=';
        s.id = 'db_ip_api';
        s.async = true;
        //override query parameter with test IP address when bln is set
        if (this.useTestIp || this._getQueryParam('db_useTestIp') === 'true') {
            var testIp = this._getQueryParam('db_ip');
            if (testIp && testIp !== '') {
                this.testIpAddress = testIp;
                this._log('Overriding IP Address from query string: ' + this.testIpAddress);
            } else {
                this._log('Overriding IP Address from internal: ' + this.testIpAddress);
            }
            s.src = s.src + this.testIpAddress;
        }
        document.getElementsByTagName('head')[0].appendChild(s);
        this._log('Loaded IP Address API');
        this._sourceChecker.setSource('ip');  //Register HIT with source checker
        this._attachUnitTests();
    },
    /**
    Checks for empty values that should trigger form to grow (false here means API has not "fully" identified according to implemented definition)
    Uses list of Demandbase variable names that trigger positive identification (company _name is default indicator)
    @method _isIdComplete
    @param {Object} [data] JSON object returned from Demandbase APIs
    **/
    _isIdComplete: function(data) {
        triggerFieldList = this.requiredAttrsList;
        if (data) {
            for (var field in triggerFieldList) {
                if (!data[triggerFieldList[field]] || data[triggerFieldList[field]] == '') {
                    return false;
                }
            }
        } else { return false; } /* return false if arg is null*/
        return true;
    },
    /**
    Shows or hides fields in the toggleFieldList
    Note adjustments may be required depending on form markup.
    Note for Marketo forms, change to use: Demandbase.jQuery('#' + fieldId).parents('li').toggle();
    @method toggleFields
    **/
    toggleFields: function() {
        var toggled = false;
        for (var field in this.toggleFieldList) {
            fieldId = this.toggleFieldList[field];
            if (fieldId !== '') {
                var elmToToggle = this._getToggleElm(fieldId);
                if(elmToToggle) {
                  if (this.areToggleFieldsVisible) {
                      this.djq(elmToToggle).hide();
                      toggled = true;
                  } else {
                      this.djq(elmToToggle).show();
                      toggled = true;
                  }                  
                } else {
                  this._log('Failed attempt to toggle element with ID ' + fieldId + '. _getToggleElm could not find this element.')
                }

            }
        }
        if (toggled) this.areToggleFieldsVisible = !this.areToggleFieldsVisible;
    },
    /**
    @method _getToggleElm
    @param String id - the DOM id of HTML element
    **/
    _getToggleElm : function(id) {
      //For Marketo, override to "return this.djq('#' + fieldId).parents('li');""
      return this.djq('#' + id);
    },
    /**
    If an already-set field is not returned by an overriding dataset, this function will reset the field value to the empty string.
    @method _resetFields
    @param {Object} data
    **/
    _resetFields: function(data) {
        if (data) {
            for (var field in this.visibleFieldMap) {
                if (typeof data[field] == 'undefined' || this._isNullEmpty(data[field])) {
                    var id = this.visibleFieldMap[field];
                    this.djq('[id="' + id + '"]').val('');
                }
            }
            for (var field in this.hiddenFieldMap) {
                if (typeof data[field] == 'undefined' || this._isNullEmpty(data[field])) {
                    var id = this.hiddenFieldMap[field];
                    this.djq('[id="' + id + '"]').val('');
                }
            }
        }
    },
    /**
    Deletes the data container added by the parser function.  This runs whenever a dataset overrides the exisiting data to ensure there are no duplicate fields.
    @method _removeDataset
    @param {Object} data
    **/
    _removeDataset: function(data) {
        var fs = document.getElementById('db_data_container');
        if (fs && fs.parentNode) {
            fs.parentNode.removeChild(fs);
            this._resetFields(data);
        }
    },
    /**
    Checks to see if the argument is null or the empty string ('')
    @method _isNullEmpty
    @param {Object} a
    **/
    _isNullEmpty: function(a) {
        return (a == null || a === '') ? true : false;
    },
    /**
    Safe log method. All logging can be disabled by setting logging to false.
    @method _log
    **/
    _log: function(msg) {
        if (this.logging || this._getQueryParam('db_logging') === 'true') window.console.log('DB Form Connector: ' + msg);
    },
    /**
    Adds unit test files to page when flag set in file or in query string.
    Qunit is loaded first and actual test file is loaded in callback after qunit is loaded.
    Stylesheet for qunit is also added to head.
    @method _attachUnitTests
    **/
    _attachUnitTests: function() {
        if (this.runTests || (this._getQueryParam('db_runTests') == 'true')) {
            var qu = document.getElementById('qunit'), quf = document.getElementById('qunit-fixture');
            if (!qu || !quf) {
                /* append divs for qunit fixture */
                var b = document.getElementsByTagName('body');
                if(b && b instanceof NodeList) {
                    b = b[0];
                    var qud = document.createElement('div'), quf = document.createElement('div');
                    qud.setAttribute('id', 'qunit');
                    quf.setAttribute('id', 'qunit-fixture');
                    qud.appendChild(quf); 
                    b.appendChild(qud);                    
                }
            }

            this.djq('<link>').appendTo('head').attr({
                rel: 'stylesheet',
                type:'text/css',
                id:  'qunit_style',  
                href: 'http://www.demandbaselabs.com/css/qunit.css'
            });

            this.djq.getScript(('https:' == document.location.protocol ? 'https://' : 'http://') + 'www.demandbaselabs.com/scripts/qunit.js', function(data, textStatus, jqxhr) {
            
                Demandbase.Connectors.WebForm.djq.getScript(('https:' == document.location.protocol ? 'https://' : 'http://') + 'www.demandbaselabs.com/scripts/unitTest_WebForm.js');
            });

        }
    },
    /**
    The number from priorityMap of the most recent Demandbase API who's data set has been used.
    @property _lastDataSource
    @type Integer
    @default null
    @protected
    @static
    **/
    _lastDataSource: null,
    /**
    The IP address returned by the Demandbase IP API
    @property _detectedIP
    @type String
    @default null
    @protected
    @static
    **/
    _detectedIP: null,
    /**
    The value of the "audience" field returned by the Demandbase IP API
    @property _detectedAudience
    @type String
    @default null
    @protected
    @static
    **/
    _detectedAudience: null,
    /**
    The value of the "audience_segment" field returned by the Demandbase IP API
    @property _detectedAudienceSegment
    @type String
    @default null
    @protected
    @static
    **/
    _detectedAudienceSegment: null,
    /**
    Demandbase data object returned from the IP address API
    @property _ipDataSet
    @type Object
    @default null
    @protected
    @static
    **/
    _ipDataSet: null,
    /**
    Demandbase object used in form submit (set automatically)
    @property _dbDataSet
    @type Object
    @default null
    @protected
    @static
    **/
    _dbDataSet: null,
    /**
    Demandbase API that provided _dbDataSet (leave these fields blank)
    @property _dbDataSrc
    @type Object
    @default null
    @protected
    @static
    **/
    _dbDataSrc: null,
    /**
    Namespace propery for jQuery - grabbed from CAC
    This is set in the init function because we need to check for jQuery
    @property djq
    @type function
    @final
    **/
    djq : null,
    /**
    Version for Demandbase.Connectors.WebForm file
    @property _version
    @type String
    @default (varies)
    @protected
    @final
    **/
    _version: 'beta_0.8',
    /**
    @class _sourceChecker
    @extensionfor formConncector
    @static
    **/
    _sourceChecker: {
        /**
        A JS closure which indicates if each API has been queried and whether the result counts as an identificaiton according to requiredFieldsList
        @property sources
        @type object
        **/
        'sources': {
            'ip': {
                'hit': false,
                'result': false
            },
            'company': {
                'hit': false,
                'result': false
            },
            'domain': {
                'hit': false,
                'result': false
            }
        },
        /**
        @method setSource
        @params {String} source - The name of the API which returned data
        @params {Boolean} result - Does the result count as an identification according to the requiredFieldsList
        @params {Boolean} check - Run checkSources method after registering hit?
        **/
        'setSource': function(source, result, check) {
            if (!result) result = false;
            this.sources[source].hit = true;
            this.sources[source].result = result;
            Demandbase.Connectors.WebForm._log('API response logged with SourceChecker: ' + source + ' : ' + result);
            if (check) this.checkSources();
        },
        /**
        Examines _sourceChecker.sources to see if each API has been queried and identified the company.  If all APIs have been hit and none have identified, then the onNoId function is called.
        @method checkSources
        **/
        'checkSources': function() {

            var id = false,
                allHit = true;
            for (var source in this.sources) {
                if (this.sources[source].result) id = true;
                if (!this.sources[source].hit) {
                    allHit = false;
                    break;
                }
            }
            if (allHit) this.onAllHit();
            /*if (allHit && !id)     this.onNoId();*/
        },
        /**
        This function is called when all APIs have been hit but none have provided the required fields.  The primary use is to show additional form fields to the visitor.
        @method onNoId
        **/
        'onNoId': function() {
            //Callback when all three API's have been hit but no identification has been made.
            Demandbase.Connectors.WebForm._log('All APIs hit with no identification. Running onNoId function...');
            //Calling function to show elements defined in toggleFieldList
            Demandbase.Connectors.WebForm.toggleFields();
            db_hook_no_id();
        },
        /**
        This function is called when all three APIs have been queried, regardless of the results.
        In general, this function is run after the visitors has entered a company name.
        Note: this may be run more than once, if the user goes back and corrects the email address or company name they entered
        @method onAllHit
        **/
        'onAllHit' : function() {
            isId = Demandbase.Connectors.WebForm._isIdComplete(Demandbase.Connectors.WebForm._dbDataSet);
            if (!isId) this.onNoId();
            db_hook_all_hit();
        }
    }
};

/** ensure console.log and console.debug exist **/
if (typeof window.console === 'undefined') window.console = {log: function() {}, debug: function() {}};

/** Safety: define hook functions, in case they're not defined elsewhere **/
/** These hooks provide extensibility.  They are global functions that can be defined any where are called by the init and parser functions.**/
/**This fcn is called at the end of Demandbase.Connectors.WebForm.init**/
if (typeof db_hook_init === 'undefined') db_hook_init = function() {};

/** this function is called after all APIs have been queried **/
if (typeof db_hook_all_hit === 'undefined') db_hook_all_hit = function() {};

/** this function is called after all APIs have been queried but non have returned the values for the fields in requiredFieldList**/
if (typeof db_hook_no_id === 'undefined') db_hook_no_id = function() {};

/**This fcn is called by Demandbase.Connectors.WebForm.parser for each field when a returned data set is parsed**/
if (typeof db_hook_attr === 'undefined') db_hook_attr = function() {};

/**This fcn is called by Demandbase.Connectors.WebForm.parser before a data set is processed.
This function runs regardless of whether the returned data set overrides the current data set.**/
if (typeof db_hook_before_parse === 'undefined') db_hook_before_parse = function() {};

/**This fcn is called at the end of Demandbase.Connectors.WebForm.parser, after a data set is processed.
This function runs only when the returned data set overrides the current data set.**/
if (typeof db_hook_after_parse === 'undefined') db_hook_after_parse = function() {};

Demandbase.Connectors.WebForm.init();
/********* CREDITS *****************/
/*
 * jQuery JavaScript Library v1.5.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Feb 23 13:55:29 2011 -0500
 *
 * jQuery UI 1.8.11
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 *
 * jQuery UI Widget 1.8.11
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 *
 * jQuery UI Position 1.8.11
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Position
 *
 * jQuery UI Autocomplete 1.8.11
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Autocomplete
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 *
 * Nano Templates (Tomasz Mazur, Jacek Becela) */
