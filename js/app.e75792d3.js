(function(e){function t(t){for(var r,o,i=t[0],c=t[1],l=t[2],f=0,s=[];f<i.length;f++)o=i[f],Object.prototype.hasOwnProperty.call(a,o)&&a[o]&&s.push(a[o][0]),a[o]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);p&&p(t);while(s.length)s.shift()();return u.push.apply(u,l||[]),n()}function n(){for(var e,t=0;t<u.length;t++){for(var n=u[t],r=!0,o=1;o<n.length;o++){var i=n[o];0!==a[i]&&(r=!1)}r&&(u.splice(t--,1),e=c(c.s=n[0]))}return e}var r={},o={1:0},a={1:0},u=[];function i(e){return c.p+"js/"+({}[e]||e)+"."+{2:"824a6cef",3:"8bd5cb77",4:"8a8e940f",5:"6a184592"}[e]+".js"}function c(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.e=function(e){var t=[],n={2:1,3:1,4:1};o[e]?t.push(o[e]):0!==o[e]&&n[e]&&t.push(o[e]=new Promise((function(t,n){for(var r="css/"+({}[e]||e)+"."+{2:"628483bc",3:"276fb1b1",4:"3fc846d1",5:"31d6cfe0"}[e]+".css",a=c.p+r,u=document.getElementsByTagName("link"),i=0;i<u.length;i++){var l=u[i],f=l.getAttribute("data-href")||l.getAttribute("href");if("stylesheet"===l.rel&&(f===r||f===a))return t()}var s=document.getElementsByTagName("style");for(i=0;i<s.length;i++){l=s[i],f=l.getAttribute("data-href");if(f===r||f===a)return t()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=t,p.onerror=function(t){var r=t&&t.target&&t.target.src||a,u=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");u.code="CSS_CHUNK_LOAD_FAILED",u.request=r,delete o[e],p.parentNode.removeChild(p),n(u)},p.href=a;var d=document.getElementsByTagName("head")[0];d.appendChild(p)})).then((function(){o[e]=0})));var r=a[e];if(0!==r)if(r)t.push(r[2]);else{var u=new Promise((function(t,n){r=a[e]=[t,n]}));t.push(r[2]=u);var l,f=document.createElement("script");f.charset="utf-8",f.timeout=120,c.nc&&f.setAttribute("nonce",c.nc),f.src=i(e);var s=new Error;l=function(t){f.onerror=f.onload=null,clearTimeout(p);var n=a[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;s.message="Loading chunk "+e+" failed.\n("+r+": "+o+")",s.name="ChunkLoadError",s.type=r,s.request=o,n[1](s)}a[e]=void 0}};var p=setTimeout((function(){l({type:"timeout",target:f})}),12e4);f.onerror=f.onload=l,document.head.appendChild(f)}return Promise.all(t)},c.m=e,c.c=r,c.d=function(e,t,n){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)c.d(n,r,function(t){return e[t]}.bind(null,r));return n},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="",c.oe=function(e){throw console.error(e),e};var l=window["webpackJsonp"]=window["webpackJsonp"]||[],f=l.push.bind(l);l.push=t,l=l.slice();for(var s=0;s<l.length;s++)t(l[s]);var p=f;u.push([0,0]),n()})({0:function(e,t,n){e.exports=n("2f39")},"0047":function(e,t,n){},"2f39":function(e,t,n){"use strict";n.r(t);n("d3b7"),n("e6cf"),n("ac1f"),n("5319"),n("96cf");var r=n("c973"),o=n.n(r),a=(n("5c7d"),n("43b9"),n("7d6e"),n("e54f"),n("4848"),n("c382"),n("1c10"),n("7bb2"),n("985d"),n("0047"),n("2b0e")),u=n("1f91"),i=n("42d2"),c=n("b178");a["default"].use(c["b"],{config:{},lang:u["a"],iconSet:i["a"]});var l=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"q-app"}},[n("router-view")],1)},f=[],s=n("e4fd"),p=Object(s["defineComponent"])({name:"App"}),d=p,h=n("2877"),b=Object(h["a"])(d,l,f,!1,null,null,null),v=b.exports,m=n("4bde"),g=n("8c4f"),w=[{path:"/",component:function(){return n.e(3).then(n.bind(null,"713b"))},children:[{path:"",component:function(){return n.e(2).then(n.bind(null,"04b7"))}},{path:"/camera",component:function(){return Promise.all([n.e(0),n.e(4)]).then(n.bind(null,"a00b"))}}]},{path:"*",component:function(){return n.e(5).then(n.bind(null,"e51e"))}}],y=w,x=Object(m["route"])((function(e){var t=e.Vue;t.use(g["a"]);var n=new g["a"]({scrollBehavior:function(){return{x:0,y:0}},routes:y,mode:"hash",base:""});return n})),j=function(){return k.apply(this,arguments)};function k(){return k=o()(regeneratorRuntime.mark((function e(){var t,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if("function"!==typeof x){e.next=6;break}return e.next=3,x({Vue:a["default"]});case 3:e.t0=e.sent,e.next=7;break;case 6:e.t0=x;case 7:return t=e.t0,n={router:t,render:function(e){return e(v)}},n.el="#q-app",e.abrupt("return",{app:n,router:t});case 11:case"end":return e.stop()}}),e)}))),k.apply(this,arguments)}var O=n("9483");Object(O["a"])("service-worker.js",{ready:function(){},registered:function(){},cached:function(){},updatefound:function(){},updated:function(){},offline:function(){},error:function(){}});var P=n("bc3a"),S=n.n(P),_=Object(m["boot"])((function(e){var t=e.Vue;t.prototype.$axios=S.a}));/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream&&window.navigator.standalone&&n.e(0).then(n.t.bind(null,"a0db",7));var E="";function C(){return A.apply(this,arguments)}function A(){return A=o()(regeneratorRuntime.mark((function e(){var t,n,r,o,u,i,c,l;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,j();case 2:t=e.sent,n=t.app,r=t.router,o=!1,u=function(e){o=!0;var t=Object(e)===e?r.resolve(e).route.fullPath:e;window.location.href=t},i=window.location.href.replace(window.location.origin,""),c=[_],l=0;case 10:if(!(!1===o&&l<c.length)){e.next=28;break}if("function"===typeof c[l]){e.next=13;break}return e.abrupt("continue",25);case 13:return e.prev=13,e.next=16,c[l]({app:n,router:r,Vue:a["default"],ssrContext:null,redirect:u,urlPath:i,publicPath:E});case 16:e.next=25;break;case 18:if(e.prev=18,e.t0=e["catch"](13),!e.t0||!e.t0.url){e.next=23;break}return window.location.href=e.t0.url,e.abrupt("return");case 23:return console.error("[Quasar] boot error:",e.t0),e.abrupt("return");case 25:l++,e.next=10;break;case 28:if(!0!==o){e.next=30;break}return e.abrupt("return");case 30:new a["default"](n);case 31:case"end":return e.stop()}}),e,null,[[13,18]])}))),A.apply(this,arguments)}C()}});