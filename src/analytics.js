/**
 * Lightweight product analytics adapter.
 * GA4 is optional; local event buffering keeps the app functional without it.
 */
const GL_ANALYTICS_ENDPOINT=window.GHOSTLIFE_ANALYTICS_ENDPOINT||localStorage.getItem("gl_analytics_endpoint")||"";
const GL_SESSION=sessionStorage.getItem("gl_session")||(()=>{const x=(crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random());sessionStorage.setItem("gl_session",x);return x})();
function track(name,props={}){
  const event={name,ts:new Date().toISOString(),session:GL_SESSION,path:location.pathname,props:{lang,...props}};
  try{
    const q=JSON.parse(localStorage.getItem("gl_events")||"[]");q.push(event);localStorage.setItem("gl_events",JSON.stringify(q.slice(-100)));
  }catch(e){}
  if(window.gtag) try{window.gtag("event",name,{lang,...props})}catch(e){}
  if(window.mixpanel) try{window.mixpanel.track(name,{lang,...props})}catch(e){}
  if(GL_ANALYTICS_ENDPOINT){
    const body=JSON.stringify(event);
    try{if(navigator.sendBeacon){navigator.sendBeacon(GL_ANALYTICS_ENDPOINT,new Blob([body],{type:"application/json"}));}
    else fetch(GL_ANALYTICS_ENDPOINT,{method:"POST",headers:{"content-type":"application/json"},body,keepalive:true});}catch(e){}
  }
}
