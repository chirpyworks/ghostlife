/**
 * GHOSTLIFE application behavior.
 * UI state, rendering, sharing, bilingual switching, and interaction live here.
 */
const GL_PARAMS=new URLSearchParams(location.search);
let lang=(GL_PARAMS.get("lang")==="ko"||GL_PARAMS.get("lang")==="en")?GL_PARAMS.get("lang"):(localStorage.getItem("gl_lang")||(navigator.language&&navigator.language.toLowerCase().startsWith("ko")?"ko":"en"));
function t(key){return (uiCopy[lang]&&uiCopy[lang][key])||uiCopy.ko[key]||key}
function getArchetypeView(key){
  const a=archetypes[key],e=archetypeEn[key];
  if(lang==="en")return {n:a.n,label:a.n,city:a.city,job:e.job,desire:e.desire,fear:e.fear,object:e.object,line:e.line,decision:e.decision};
  return {n:a.n,label:a.ko,city:a.city,job:a.job,desire:a.desire,fear:a.fear,object:a.object,line:a.line,decision:a.decision};
}
function applyLanguage(){
  document.documentElement.lang=lang;
  localStorage.setItem("gl_lang",lang);
  document.getElementById("langKo")?.classList.toggle("active",lang==="ko");
  document.getElementById("langEn")?.classList.toggle("active",lang==="en");
  document.getElementById("langKo")?.setAttribute("aria-pressed",lang==="ko"?"true":"false");
  document.getElementById("langEn")?.setAttribute("aria-pressed",lang==="en"?"true":"false");
  document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.dataset.i18n;if(uiCopy[lang][k]!=null)el.textContent=uiCopy[lang][k]});
  document.querySelectorAll("[data-i18n-html]").forEach(el=>{const k=el.dataset.i18nHtml;if(uiCopy[lang][k]!=null)el.innerHTML=uiCopy[lang][k]});
  const friend=document.getElementById("friendCode");if(friend){friend.placeholder=t("friendPlaceholder");friend.setAttribute("aria-label",t("friendCodeLabel"))}
  const mine=document.getElementById("myCode");if(mine)mine.setAttribute("aria-label",t("myCodeLabel"));
  document.title=lang==="ko"?"GHOSTLIFE — 다른 선택 끝의 나":"GHOSTLIFE — The Life You Didn’t Live";
  const desc=document.querySelector('meta[name="description"]');if(desc)desc.content=lang==="ko"?"그때 다른 선택을 했다면, 나는 지금 어떤 삶을 살고 있을까?":"If you had chosen differently, what kind of life would you be living now?";
}
function setLang(next){
  if(next!=="ko"&&next!=="en")return;lang=next;
  const u=new URL(location.href);if(lang==="en")u.searchParams.set("lang","en");else u.searchParams.delete("lang");
  history.replaceState(null,"",u.pathname+(u.searchParams.toString()?"?"+u.searchParams.toString():"")+u.hash);
  applyLanguage();renderInviteNote();

  if(document.getElementById("test").classList.contains("active"))renderQ();

  if(currentKey&&document.getElementById("result").classList.contains("active")){
    renderResult(false,false);
  }

  if(duoPair&&document.getElementById("compare").classList.contains("active")){
    const inputs=document.getElementById("compareInputs");
    const standalone=inputs.style.display==="none";
    if(standalone){
      renderStandaloneDuo(duoPair[0],duoPair[1],false);
    }else{
      const duo=document.getElementById("duo");
      duo.innerHTML=duoHtml(duoPair[0],duoPair[1]);
      duo.classList.add("active");
    }
  }
}
function buildUrl(params={},hash=""){
  const rootPath=location.pathname.replace(/en\.html$/,"");
  const sharePath=lang==="en"?rootPath+"en.html":rootPath;
  const u=new URL(location.origin+sharePath);
  Object.entries(params).forEach(([k,v])=>{if(v!=null&&v!=="")u.searchParams.set(k,v)});
  if(lang!=="en")u.searchParams.delete("lang");
  return u.toString()+hash;
}
function renderInviteNote(){
  const n=document.getElementById("inviteNote");if(!n)return;
  if(!invitedByKey){n.classList.remove("active");n.innerHTML="";return}
  const a=getArchetypeView(invitedByKey);
  n.innerHTML=lang==="ko"
    ?"<strong>"+a.label+"</strong>가 초대했어요. 내 결과가 나오면 두 사람이 다른 삶에서 어디서 만났을지도 바로 이어서 보여드릴게요."
    :"<strong>"+a.n+"</strong> invited you. Finish your choices and you’ll see where your two unlived lives might have crossed.";
  n.classList.add("active");
}

let invitedByKey="",duoPair=null;
const withKey=(GL_PARAMS.get("with")||"").toUpperCase();
if(archetypes[withKey]) invitedByKey=withKey;
const duoRaw=(GL_PARAMS.get("duo")||"").toUpperCase();
if(duoRaw.includes("-")){const [a,b]=duoRaw.split("-");if(archetypes[a]&&archetypes[b])duoPair=[a,b];}
let qi=0,picks=[],s={stay:0,leave:0,order:0,impulse:0,hidden:0,seen:0,build:0,experience:0},current=null,currentKey="";
function show(id){
  document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));
  const el=document.getElementById(id);el.classList.add("active");el.setAttribute("tabindex","-1");
  requestAnimationFrame(()=>{try{el.focus({preventScroll:true})}catch(e){}})
}
function resetQuizUI(){
  const wrap=document.querySelector(".question-wrap");
  if(wrap)wrap.classList.remove("is-switching");
  const answers=document.getElementById("answers");
  if(answers)answers.innerHTML="";
}
function startTest(){
  qi=0;picks=[];s={stay:0,leave:0,order:0,impulse:0,hidden:0,seen:0,build:0,experience:0};
  resetQuizUI();
  track("test_start",{invited:!!invitedByKey});
  show("test");
  renderQ();
}
function renderQ(){
  const q=questionCopy[lang][qi];
  document.getElementById("qnum").textContent=String(qi+1).padStart(2,"0");
  document.getElementById("stepText").textContent=String(qi+1).padStart(2,"0")+" / 08";
  document.getElementById("progressBar").style.width=((qi+1)/8*100)+"%";
  document.getElementById("qtext").textContent=q.q;
  document.getElementById("answers").innerHTML=q.a.map((txt,i)=>'<button class="answer" onclick="choose('+i+')"><span>'+String.fromCharCode(65+i)+'</span><span>'+txt+'</span></button>').join("")
}
function choose(i){
  const wrap=document.querySelector(".question-wrap");wrap.classList.add("is-switching");
  setTimeout(()=>{picks.push(i);Object.entries(questionScores[qi][i]).forEach(([k,v])=>s[k]+=v);qi++;
    if(qi<questionScores.length){renderQ();wrap.classList.remove("is-switching");}
    else{track("test_complete",{invited:!!invitedByKey});finish();}
  },170)
}
function keyFromScores(){return ghostKeyFromScores(s,picks)}
function finish(){
  currentKey=keyFromScores();current=archetypes[currentKey]||archetypes.LOHB;show("reveal");
  const phase=document.getElementById("revealPhase");phase.textContent="SIGNAL";
  setTimeout(()=>phase.textContent="SPLIT",430);setTimeout(()=>phase.textContent="LOCK",980);
  setTimeout(renderResult,1580)
}
function renderResult(trackView=true,trackCompare=true){
  const v=getArchetypeView(currentKey);
  applyVisualSystem(currentKey);
  document.getElementById("ghostId").textContent="GHOST ID / "+currentKey;
  document.getElementById("resultTitle").innerHTML=current.n.split(" ").slice(0,-1).join(" ")+"<em>"+current.n.split(" ").slice(-1)+"</em>";
  document.getElementById("heroLine").textContent="“"+v.line+"”";
  document.getElementById("coords").innerHTML="<span>"+v.city+"</span><span>"+v.job+"</span><span>"+v.object+"</span>";
  document.getElementById("resultKo").textContent=v.label;
  document.getElementById("facts").innerHTML='<div class="fact"><small>'+t("want")+'</small><b>'+v.desire+'</b></div><div class="fact"><small>'+t("avoid")+'</small><b>'+v.fear+'</b></div><div class="fact"><small>'+t("city")+'</small><b>'+v.city+'</b></div><div class="fact"><small>'+t("symbol")+'</small><b>'+v.object+'</b></div>';
  document.getElementById("decision").innerHTML='<span class="eyebrow">'+t("decision")+'</span><br><br>'+v.decision;
  show("result");
  history.replaceState(null,"",location.pathname+location.search+"#"+currentKey);
  if(trackView)track("result_view",{result:currentKey,invited:!!invitedByKey});
  if(invitedByKey)renderAutoDuo(invitedByKey,currentKey,trackCompare);else{document.getElementById("autoDuo").classList.remove("active");document.getElementById("autoDuo").innerHTML="";}
}

function splitTitleLines(name){
  const words=name.split(" ");
  if(words.length<=2)return [name];
  const cut=Math.ceil(words.length/2);
  return [words.slice(0,cut).join(" "),words.slice(cut).join(" ")];
}
function wrapCanvasText(ctx,text,maxWidth){
  const words=text.split(" "); const lines=[]; let line="";
  for(const word of words){const test=line?line+" "+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word}else line=test}
  if(line)lines.push(line); return lines;
}
function posterPalette(key){const p=visualProfiles[key]||visualProfiles.LOHB;return {bg1:p.b1,bg2:p.b2,accent:p.a,line:p.a+"55"}}
function drawEmblem(ctx,key,cx,cy,size,accent){
  const b={L:1,S:0,I:1,O:0,V:1,H:0,E:1,B:0},bits=[...key].map(x=>b[x]||0);
  ctx.save();ctx.translate(cx,cy);ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.globalAlpha=.7;
  ctx.beginPath();ctx.arc(0,0,bits[0]?size*.38:size*.28,0,Math.PI*2);ctx.stroke();
  ctx.rotate((bits[1]?22:-12)*Math.PI/180);ctx.beginPath();ctx.moveTo(-size*(bits[2]?.38:.26),0);ctx.lineTo(size*(bits[2]?.38:.26),0);ctx.stroke();ctx.rotate(-(bits[1]?22:-12)*Math.PI/180);
  ctx.beginPath();ctx.moveTo(0,-size*.34);ctx.lineTo(0,size*.34);ctx.stroke();
  if(bits[3]){ctx.beginPath();ctx.moveTo(-size*.3,size*.28);ctx.lineTo(0,-size*.32);ctx.lineTo(size*.3,size*.28);ctx.stroke()}
  else ctx.strokeRect(-size*.28,-size*.28,size*.56,size*.56);
  ctx.restore();
}
function buildPosterCanvas(){
  const W=1080,H=1920,canvas=document.createElement("canvas");canvas.width=W;canvas.height=H;
  const ctx=canvas.getContext("2d"),p=posterPalette(currentKey),v=getArchetypeView(currentKey);
  const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,p.bg1);g.addColorStop(.62,"#090909");g.addColorStop(1,p.bg2);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle=p.line;ctx.lineWidth=2;
  const leave=currentKey[0]==="L",impulse=currentKey[1]==="I",seen=currentKey[2]==="V",experience=currentKey[3]==="E";
  ctx.save();ctx.translate(540,960);ctx.rotate((impulse?-8:0)*Math.PI/180);ctx.strokeRect(leave?-290:-390,-720,leave?760:780,1440);ctx.restore();
  if(experience){ctx.beginPath();ctx.arc(leave?900:820,520,seen?330:240,0,Math.PI*2);ctx.stroke();}
  else{ctx.strokeRect(leave?690:720,seen?240:170,seen?300:190,seen?520:240);}
  if(impulse){[570,650,730].forEach((y,i)=>{ctx.beginPath();ctx.moveTo(leave?520:610,y);ctx.lineTo(1040,y+(i-1)*18);ctx.stroke()})}
  else{[570,650,730].forEach(y=>{ctx.beginPath();ctx.moveTo(leave?620:690,y);ctx.lineTo(1040,y);ctx.stroke()})}
  drawEmblem(ctx,currentKey,seen?900:860,seen?390:300,seen?320:180,p.accent);
  ctx.fillStyle="#aaa39a";ctx.font="22px Arial";ctx.fillText("GHOSTLIFE / "+currentKey,76,96);
  ctx.fillStyle="#f1eee7";ctx.font="92px Georgia";
  const titleLines=splitTitleLines(current.n);let ty=580;
  for(let i=0;i<titleLines.length;i++){ctx.fillStyle=i===titleLines.length-1?p.accent:"#f1eee7";ctx.fillText(titleLines[i],76,ty);ty+=104}
  const uiFont=getComputedStyle(document.documentElement).getPropertyValue("--ko")||"sans-serif";ctx.fillStyle="#ded8cf";ctx.font=(lang==="ko"?"500 40px ":"36px Georgia, ")+uiFont;
  const hero=wrapCanvasText(ctx,v.line,850);let hy=ty+80;for(const line of hero.slice(0,4)){ctx.fillText(line,76,hy);hy+=54}
  ctx.fillStyle="#a9a39a";ctx.font="24px Arial";ctx.fillText(v.city.toUpperCase(),76,1640);ctx.font="500 24px "+uiFont;ctx.fillText(v.job,76,1684);
  ctx.strokeStyle="rgba(255,255,255,.18)";ctx.beginPath();ctx.moveTo(76,1738);ctx.lineTo(1004,1738);ctx.stroke();
  ctx.fillStyle="#a9a39a";ctx.font="500 22px "+uiFont;ctx.fillText(v.object,76,1792);
  ctx.fillStyle="#f1eee7";ctx.font="500 20px "+uiFont;ctx.fillText(t("posterFooter"),76,1850);
  return canvas;
}
async function downloadPoster(){
  if(!current)return;track("poster_export",{result:currentKey});
  const canvas=buildPosterCanvas();
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/png",1));
  const file=new File([blob],"GHOSTLIFE-"+currentKey+".png",{type:"image/png"});
  if(navigator.canShare&&navigator.canShare({files:[file]})&&navigator.share){
    try{await navigator.share({files:[file],title:"GHOSTLIFE — "+current.n,text:t("posterFooter")});track("share_export",{type:"result_poster",result:currentKey,method:"native"});return}catch(e){}
  }
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=file.name;document.body.appendChild(a);a.click();a.remove();track("share_export",{type:"result_poster",result:currentKey,method:"download"});setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function shareResult(){
  track("share_intent",{type:"result",result:currentKey});
  const v=getArchetypeView(currentKey);
  const text=lang==="ko"
    ?"다른 삶의 나는 "+v.label+". "+v.line+" #GHOSTLIFE"
    :"In another life, I’m "+v.n+". "+v.line+" #GHOSTLIFE";
  const url=buildUrl({},"#"+currentKey);
  if(navigator.share){try{await navigator.share({title:"GHOSTLIFE — "+v.n,text,url});track("share_export",{type:"result_link",result:currentKey});return}catch(e){}}
  await navigator.clipboard.writeText(text+" "+url);track("share_export",{type:"result_link",result:currentKey,method:"clipboard"});alert(t("copiedResult"))
}
function restart(){
  track("retake",{from:currentKey});
  history.replaceState(null,"",lang==="en"?location.pathname+"?lang=en":location.pathname);
  invitedByKey="";duoPair=null;current=null;currentKey="";
  const autoDuo=document.getElementById("autoDuo");
  if(autoDuo){autoDuo.classList.remove("active");autoDuo.innerHTML="";}
  resetQuizUI();
  startTest();
}
function startFresh(){history.replaceState(null,"",lang==="en"?location.pathname+"?lang=en":location.pathname);location.reload()}

function baseUrl(){return location.origin+location.pathname}
async function shareCompareInvite(){
  if(!currentKey)return;
  const v=getArchetypeView(currentKey),url=buildUrl({with:currentKey});
  const text=lang==="ko"
    ?"나는 "+v.label+"가 나왔어. 너도 해봐. 끝나면 우리 둘이 다른 삶에서 어디서 만나는지도 나와."
    :"I got "+v.n+". Try yours—when you finish, GHOSTLIFE shows where our other lives might have crossed.";
  track("compare_invite",{result:currentKey});
  if(navigator.share){try{await navigator.share({title:lang==="ko"?"GHOSTLIFE — 같이 해볼래?":"GHOSTLIFE — Find your other life",text,url});track("share_export",{type:"invite",result:currentKey,method:"native"});return}catch(e){}}
  await navigator.clipboard.writeText(text+" "+url);track("share_export",{type:"invite",result:currentKey,method:"clipboard"});alert(t("copiedInvite"));
}
function duoData(a,b){
  const seed=(a+b).split("").reduce((n,ch)=>n+ch.charCodeAt(0),0),cp=duoCopy[lang],A=getArchetypeView(a),B=getArchetypeView(b);
  return {scene:cp.scenes[seed%cp.scenes.length],reason:cp.reasons[(seed>>1)%cp.reasons.length],clash:cp.clashes[(seed>>2)%cp.clashes.length],shared:(A.object+" × "+B.object)};
}
function duoHtml(a,b){
  const A=getArchetypeView(a),B=getArchetypeView(b),d=duoData(a,b);
  return '<div class="duo-card"><div class="eyebrow">'+t("firstGhost")+'</div><h3>'+A.n+'</h3><p>'+A.city+' · '+A.object+'</p></div>'+
  '<div class="duo-card"><div class="eyebrow">'+t("secondGhost")+'</div><h3>'+B.n+'</h3><p>'+B.city+' · '+B.object+'</p></div>'+
  '<div class="duo-card span-all"><div class="eyebrow">'+t("whereMeet")+'</div><h3>'+d.scene+'</h3><p class="duo-scene-copy">'+d.reason+'<br><br><strong>'+t("clash")+'</strong><br>'+d.clash+'<br><br><strong>'+t("shared")+'</strong><br>'+d.shared+'</p></div>';
}
function renderAutoDuo(a,b,trackCreate=true){
  const el=document.getElementById("autoDuo");
  el.innerHTML=duoHtml(a,b)+
    '<div class="duo-actions span-all">'+
      '<button class="btn" data-action="download-duo-poster" data-a="'+a+'" data-b="'+b+'">'+t("saveDuoPoster")+'</button>'+
      '<button class="btn secondary" data-action="share-duo" data-a="'+a+'" data-b="'+b+'">'+t("shareDuo")+'</button>'+
    '</div>';
  el.classList.add("active");
  if(trackCreate)track("compare_create",{a,b,automatic:true});
}
function openCompare(){
  document.getElementById("compareInputs").style.display="";
  document.getElementById("returnResult").style.display="";
  document.getElementById("myCode").value=currentKey;document.getElementById("friendCode").value="";
  document.getElementById("duo").classList.remove("active");document.getElementById("duoActions").style.display="none";show("compare")
}
async function copyCode(){await navigator.clipboard.writeText(currentKey);document.getElementById("myCode").value=currentKey+" — "+t("copied")}
function makeDuo(){
  const fk=document.getElementById("friendCode").value.trim().toUpperCase(),f=archetypes[fk];
  if(!f){alert(t("badCode"));return}
  document.getElementById("duo").innerHTML=duoHtml(currentKey,fk);document.getElementById("duo").classList.add("active");
  document.getElementById("duoActions").style.display="flex";duoPair=[currentKey,fk];track("compare_create",{a:currentKey,b:fk,automatic:false});
}
function buildDuoPosterCanvas(a,b){
  const A=getArchetypeView(a),B=getArchetypeView(b),d=duoData(a,b),pa=posterPalette(a),pb=posterPalette(b),W=1080,H=1920,cv=document.createElement("canvas");cv.width=W;cv.height=H;
  const x=cv.getContext("2d"),uiFont=getComputedStyle(document.documentElement).getPropertyValue("--ko")||"sans-serif";
  const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,pa.bg1);g.addColorStop(.49,pa.bg2);g.addColorStop(.51,pb.bg1);g.addColorStop(1,pb.bg2);x.fillStyle=g;x.fillRect(0,0,W,H);
  x.strokeStyle="rgba(255,255,255,.18)";x.beginPath();x.moveTo(W/2,100);x.lineTo(W/2,H-100);x.stroke();
  drawEmblem(x,a,270,290,220,pa.accent);drawEmblem(x,b,810,290,220,pb.accent);
  x.fillStyle="#aaa39a";x.font="22px Arial";x.fillText("GHOSTLIFE / DUAL TIMELINE",70,88);
  x.fillStyle="#f1eee7";x.font="58px Georgia";x.fillText(A.n,70,650);x.fillText(B.n,570,650);
  x.fillStyle=pa.accent;x.font="500 28px "+uiFont;x.fillText(lang==="ko"?A.label:A.city,70,706);x.fillStyle=pb.accent;x.fillText(lang==="ko"?B.label:B.city,570,706);
  x.fillStyle="#f1eee7";x.font="500 50px "+uiFont;const lines=wrapCanvasText(x,d.scene,900);let y=1010;for(const line of lines){x.fillText(line,70,y);y+=66}
  x.fillStyle="#c8c1b7";x.font="500 30px "+uiFont;const copy=wrapCanvasText(x,d.reason,900);y+=48;for(const line of copy){x.fillText(line,70,y);y+=44}
  x.fillStyle="#aaa39a";x.font="500 22px "+uiFont;x.fillText(A.city+" × "+B.city,70,1760);x.fillText(A.object+" × "+B.object,70,1810);
  return cv;
}
async function downloadDuoPoster(a,b){
  if(!a||!b){if(!duoPair)return;[a,b]=duoPair}track("poster_export",{type:"duo",a,b});
  const canvas=buildDuoPosterCanvas(a,b),blob=await new Promise(r=>canvas.toBlob(r,"image/png",1)),file=new File([blob],"GHOSTLIFE-DUO-"+a+"-"+b+".png",{type:"image/png"});
  if(navigator.canShare&&navigator.canShare({files:[file]})&&navigator.share){try{await navigator.share({files:[file],title:lang==="ko"?"GHOSTLIFE — 둘의 다른 삶":"GHOSTLIFE — Two unlived lives"});track("share_export",{type:"duo_poster",a,b,method:"native"});return}catch(e){}}
  const url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download=file.name;link.click();track("share_export",{type:"duo_poster",a,b,method:"download"});setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function shareDuo(a,b){
  if(!a||!b){if(!duoPair)return;[a,b]=duoPair}
  const d=duoData(a,b),A=getArchetypeView(a),B=getArchetypeView(b),url=buildUrl({duo:a+"-"+b});
  track("share_intent",{type:"duo",a,b});
  const text=lang==="ko"
    ?A.label+"와 "+B.label+"가 다른 삶에서 처음 마주친 곳은 "+d.scene+"."
    :A.n+" and "+B.n+" cross paths in another life at "+d.scene+".";
  if(navigator.share){try{await navigator.share({title:lang==="ko"?"GHOSTLIFE — 둘의 장면":"GHOSTLIFE — Where your other lives meet",text,url});track("share_export",{type:"duo_link",a,b,method:"native"});return}catch(e){}}
  await navigator.clipboard.writeText(text+" "+url);track("share_export",{type:"duo_link",a,b,method:"clipboard"});alert(t("copiedDuo"));
}
function renderStandaloneDuo(a,b,trackVisit=true){
  duoPair=[a,b];document.getElementById("duo").innerHTML=duoHtml(a,b);document.getElementById("duo").classList.add("active");document.getElementById("duoActions").style.display="flex";document.getElementById("compareInputs").style.display="none";document.getElementById("returnResult").style.display="none";show("compare");if(trackVisit)track("compare_visit",{a,b});
}

function handleActionClick(event){
  const button=event.target.closest("[data-action]");
  if(!button)return;

  const action=button.dataset.action;
  const handlers={
    "start-test":()=>startTest(),
    "download-poster":()=>downloadPoster(),
    "share-result":()=>shareResult(),
    "invite-friend":()=>shareCompareInvite(),
    "open-compare":()=>openCompare(),
    "restart":()=>restart(),
    "copy-code":()=>copyCode(),
    "make-duo":()=>makeDuo(),
    "download-duo-poster":()=>downloadDuoPoster(button.dataset.a,button.dataset.b),
    "share-duo":()=>shareDuo(button.dataset.a,button.dataset.b),
    "start-fresh":()=>startFresh(),
    "back-result":()=>show("result"),
    "set-lang":()=>setLang(button.dataset.lang)
  };

  handlers[action]?.();
}

document.addEventListener("click",handleActionClick);

window.addEventListener("load",()=>{
  applyLanguage();
  renderInviteNote();
  if(duoPair){renderStandaloneDuo(duoPair[0],duoPair[1]);return}
  if(invitedByKey)track("compare_visit",{from:invitedByKey});
  const h=location.hash.replace("#","").toUpperCase();if(archetypes[h]){currentKey=h;current=archetypes[h];renderResult();}
})
