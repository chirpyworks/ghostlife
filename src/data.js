/**
 * GHOSTLIFE product data.
 * Questions, archetypes, bilingual copy, and visual profiles live here so
 * remixes can change content without touching application behavior.
 */

// ── Axis vocabulary ───────────────────────────────────────────────────────
const A={stay:'S',leave:'L',order:'O',impulse:'I',hidden:'H',seen:'V',build:'B',experience:'E'};

// ── Scoring matrix ────────────────────────────────────────────────────────
const questionScores=[
[{stay:-1,order:-1},{stay:-1,impulse:1},{leave:1,order:-1},{leave:1,impulse:1}],
[{hidden:-1,build:-1},{hidden:-1,experience:1},{seen:1,build:-1},{seen:1,experience:1}],
[{stay:-1,hidden:-1},{stay:-1,seen:1},{leave:1,hidden:-1},{leave:1,seen:1}],
[{order:-1,build:-1},{order:-1,experience:1},{impulse:1,build:-1},{impulse:1,experience:1}],
[{stay:-1,build:-1},{stay:-1,experience:1},{leave:1,build:-1},{leave:1,experience:1}],
[{order:-1,hidden:-1},{order:-1,seen:1},{impulse:1,hidden:-1},{impulse:1,seen:1}],
[{stay:-1,order:-1},{stay:-1,impulse:1},{leave:1,order:-1},{leave:1,impulse:1}],
[{hidden:-1,build:-1},{hidden:-1,experience:1},{seen:1,build:-1},{seen:1,experience:1}]
];

// ── Native KR / EN question copy ──────────────────────────────────────────
const questionCopy={
ko:[
{q:"낯선 도시에서 막차를 놓쳤다. 나는?",a:["근처에서 자고, 아침에 다시 움직인다.","일단 걷는다. 어디까지 갈지는 걷다가 정한다.","오늘 안에 다른 도시로 갈 방법부터 찾는다.","첫차를 타고, 내린 곳에서 다음을 정한다."]},
{q:"오래된 빈 건물 하나를 마음대로 쓸 수 있게 됐다.",a:["조용히 고쳐서 나만의 공간으로 쓴다.","한동안 혼자 머물며 계절이 바뀌는 걸 본다.","사람들이 찾아오는 작업실로 만든다.","매달 다른 사람에게 열어두고, 쓰임이 계속 바뀌게 한다."]},
{q:"앞으로 10년이 안정적으로 보장된 길이 생겼다.",a:["그 길을 택하고, 내 방식대로 깊게 파고든다.","그 길을 택하되, 내 이름을 걸고 크게 바꿔본다.","좋은 기회지만 떠난다. 굳이 이유를 설명하진 않는다.","거절하고, 전혀 다른 일을 내 이름으로 시작한다."]},
{q:"아무 약속도 없는 하루가 통째로 생겼다.",a:["미뤄둔 일을 정리하고 하나는 끝낸다.","갈 곳만 정해두고 혼자 오래 걷는다.","손에 잡히는 걸로 바로 뭔가를 만든다.","연락도 계획도 없이 그냥 밖으로 나간다."]},
{q:"내 이름으로 작은 공간 하나를 연다면?",a:["한 도시에 오래 자리 잡은 작업실.","한 계절쯤 머물러 사는 작은 방.","도시를 옮겨 다니는 이동식 스튜디오.","도착할 때마다 쓰임이 바뀌는 임시 공간."]},
{q:"처음 보는 사람들 사이에 들어가면 나는 보통…",a:["분위기를 먼저 읽고, 필요할 때만 말한다.","어색하지 않게 사람들을 서로 이어준다.","한두 사람과 엉뚱한 얘기로 깊게 빠진다.","먼저 말을 꺼내 분위기를 바꾼다."]},
{q:"1년치 생활비를 받는 대신, 한 가지 방식으로 살아야 한다면?",a:["한 도시에 머물며 일정한 루틴을 지킨다.","한 도시에 머물되, 매일 다르게 산다.","도시는 자주 바꾸지만 일정은 철저히 지킨다.","계획 없이 계속 옮겨 다닌다."]},
{q:"내 삶에서 딱 한 장면만 남길 수 있다면?",a:["아무도 모르는 방에 놓인, 내가 완성한 물건 하나.","아무도 모르는 곳에서 혼자 본 풍경 하나.","내 이름으로 오래 쓰일 무언가.","사람들이 오래도록 이야기할 단 한 번의 밤."]}
],
en:[
{q:"You miss the last train in a city you barely know. What do you do?",a:["Find a nearby place to sleep and start fresh in the morning.","Start walking. I’ll decide where I’m going on the way.","Figure out how to get to another city before the night is over.","Take the first train out and decide what’s next when I get off."]},
{q:"You’re given an old empty building to use however you want.",a:["Restore it quietly and make it my own.","Live there alone for a while and watch the seasons change.","Turn it into a studio people can drop into.","Open it to someone new every month and let the place keep changing."]},
{q:"A path opens up that could keep your life stable for the next ten years.",a:["Take it, then go deep in my own way.","Take it, but reshape it publicly under my own name.","Walk away. It’s a good offer, but I don’t need to explain why.","Turn it down and start something completely different under my own name."]},
{q:"You get an entire day with no plans and no one waiting for you.",a:["Clear a few things off my list and finish at least one.","Pick a destination and take a long walk alone.","Make something immediately with whatever is around.","Leave the house with no plan and see where the day goes."]},
{q:"If you could open one small place under your own name, what would it be?",a:["A studio in one city I could keep for years.","A room where I could live through one full season.","A mobile studio that moves from city to city.","A temporary space that becomes something different wherever it lands."]},
{q:"When you walk into a room full of strangers, you usually…",a:["Read the room first and speak when it matters.","Naturally connect people who should know each other.","End up deep in an unexpected conversation with one or two people.","Shift the energy first and let everyone else catch up."]},
{q:"You’re given a year’s living expenses, but you have to choose one way to live.",a:["Stay in one city and keep a steady routine.","Stay in one city, but make every day different.","Keep moving cities, but run my schedule tightly.","Keep moving with no real plan."]},
{q:"If only one scene from your life could remain, which one would you keep?",a:["One finished thing, left in a room no one knows about.","One landscape I saw alone, somewhere no one else knows.","Something with my name on it that people keep using for years.","One night people are still talking about long after it’s over."]}
]
};


// ── Korean archetype narratives ───────────────────────────────────────────
const archetypes={
"SOHB":{n:"THE QUIET EMPEROR",ko:"고요한 황제",city:"Kyoto",job:"복원 공방의 주인",desire:"오래 두고 봐도 좋은 완성도",fear:"의미가 흐려지는 것",object:"옻칠 상자",line:"작은 세계를 오래 가꿨다. 모두에게 이해받을 필요는 없었다.",decision:"멀리 가는 대신, 한곳을 오래 깊게 파고들었다."},
"SOHE":{n:"THE MEMORY ENGINEER",ko:"기억의 설계자",city:"Vienna",job:"아카이브 필름메이커",desire:"사라지기 전에 남겨두는 일",fear:"되돌릴 수 없는 상실",object:"35mm 슬라이드",line:"다들 지나친 것들이 먼저 눈에 들어왔다. 사라지기 전에 남겨두는 사람이 됐다.",decision:"새로운 것보다, 사라지는 것을 먼저 보기 시작했다."},
"SOVB":{n:"THE HERMIT ICON",ko:"은둔의 아이콘",city:"Antwerp",job:"가구 디자이너",desire:"딱 봐도 내 것인 결과",fear:"내 방식이 흐려지는 것",object:"검은 연필",line:"앞에 나서지 않아도 괜찮았다. 만든 것만 보면 내 것이라는 걸 알 수 있었으니까.",decision:"많이 보이는 것보다, 분명하게 남는 쪽을 택했다."},
"SOVE":{n:"THE GARDEN GENERAL",ko:"정원의 장군",city:"Melbourne",job:"도시 정원 스튜디오 디렉터",desire:"오래 남는 것",fear:"내가 떠난 뒤 금방 무너지는 것",object:"씨앗 봉투",line:"빨리 만드는 법보다 오래 돌보는 법을 배웠다.",decision:"속도보다 오래 버티는 쪽을 골랐다."},
"SIHB":{n:"THE PUBLIC SECRET",ko:"공공의 비밀",city:"Seoul",job:"독립 매거진 창립자",desire:"내 방식대로 인정받는 것",fear:"유명해질수록 내가 지워지는 것",object:"은색 라이터",line:"이름은 알려졌지만, 내 생활까지 보여줄 생각은 없었다.",decision:"숨지 않되, 어디까지 보여줄지는 내가 정했다."},
"SIHE":{n:"THE AFTER-HOURS SAINT",ko:"심야의 성자",city:"Marseille",job:"심야 식당의 요리사",desire:"사람 사이에 남는 온기",fear:"마음이 무뎌지는 것",object:"에나멜 컵",line:"사람들이 하루를 마칠 때쯤 내 하루가 시작됐다.",decision:"빨리 끝내기보다, 사람을 조금 더 오래 보는 쪽을 택했다."},
"SIVB":{n:"THE SOCIAL ALCHEMIST",ko:"사교의 연금술사",city:"London",job:"크리에이티브 프로듀서",desire:"사람 사이에서 생기는 에너지",fear:"아무 일도 시작되지 않는 자리",object:"샴페인 쿠페",line:"어디를 가든 사람 사이에 흐름이 생기게 만들었다.",decision:"혼자 완성하는 것보다, 사람을 연결하는 쪽을 골랐다."},
"SIVE":{n:"THE LAST ROMANTIC",ko:"마지막 낭만주의자",city:"Buenos Aires",job:"야간 사진가",desire:"한 번쯤 잊히지 않을 순간",fear:"별일 없이 흘러가 버리는 삶",object:"붉은 성냥갑",line:"오래 남는 것보다 오래 기억될 순간을 골랐다.",decision:"안전하게 남는 것보다, 세게 느끼는 쪽을 택했다."},
"LOHB":{n:"THE NIGHT ARCHITECT",ko:"밤의 설계자",city:"Lisbon",job:"독립 라디오 프로듀서",desire:"언제든 방향을 틀 수 있는 자유",fear:"멀쩡해 보이지만 빠져나올 길 없는 삶",object:"황동 열쇠",line:"안정적인 삶보다, 언제든 방향을 틀 수 있는 삶이 좋았다.",decision:"정답 하나를 고르기보다, 늘 빠져나갈 길 하나를 남겨뒀다."},
"LOHE":{n:"THE PRIVATE REVOLUTIONARY",ko:"사적인 혁명가",city:"Helsinki",job:"필드 레코딩 아티스트",desire:"내 기준으로 사는 것",fear:"익숙하다는 이유로 눌러앉는 것",object:"카세트 테이프",line:"크게 선언하지 않고, 내 생활의 규칙부터 바꿨다.",decision:"설명해서 납득시키기 전에 먼저 움직였다."},
"LOVB":{n:"THE FAR HORIZON",ko:"먼 수평선",city:"Vancouver",job:"클라이밋 테크 창업가",desire:"몇 년이고 붙들고 싶은 큰 문제",fear:"중요하지 않은 일에 내 에너지를 다 쓰는 것",object:"나침반",line:"그럴듯한 이력보다, 몇 년이고 붙들고 싶은 문제를 골랐다.",decision:"안전한 성공보다 더 큰 문제 쪽으로 방향을 틀었다."},
"LOVE":{n:"THE DRIFTER WITH A PLAN",ko:"계획 있는 방랑자",city:"Copenhagen",job:"문화 전략가",desire:"움직이면서도 흐트러지지 않는 삶",fear:"자유가 공허함으로 바뀌는 것",object:"교통 카드",line:"자주 떠났지만 아무렇게나 떠난 적은 없었다.",decision:"정착하는 대신, 나만의 이동 리듬을 만들었다."},
"LIHB":{n:"THE UNFINISHED LEGEND",ko:"미완의 전설",city:"Istanbul",job:"실험 건축가",desire:"아직 바꿀 수 있다는 감각",fear:"끝나는 순간 움직일 여지가 사라지는 것",object:"찢긴 청사진",line:"끝내기보다 여지를 남겨두는 편이 좋았다. 그래야 다음이 생겼으니까.",decision:"완성보다 계속 바뀔 수 있는 상태를 남겼다."},
"LIHE":{n:"THE VANISHING ACT",ko:"사라지는 사람",city:"Reykjavik",job:"다큐멘터리 로케이션 스카우트",desire:"계속 낯설어지는 생활",fear:"내가 나한테도 뻔해지는 것",object:"접힌 지도",line:"익숙해질 때쯤이면 다시 떠났다.",decision:"익숙함이 굳어지기 전에 먼저 자리를 옮겼다."},
"LIVB":{n:"THE OTHER SUN",ko:"또 다른 태양",city:"Mexico City",job:"독립 패션 레이블 창립자",desire:"내 취향대로 만든 세계",fear:"남이 정한 기준 안에서 사는 것",object:"금색 안전핀",line:"들어갈 자리가 없으면 직접 만들었다. 남의 취향에 맞출 생각은 없었다.",decision:"허락을 기다리기보다, 먼저 내 자리를 만들었다."},
"LIVE":{n:"THE BEAUTIFUL MISTAKE",ko:"아름다운 실수",city:"Naples",job:"세트 디자이너",desire:"예상 밖으로 흘러가는 삶",fear:"너무 잘 짜여 있어 놀랄 일이 없는 하루",object:"금이 간 거울",line:"돌이켜보면 가장 좋았던 선택은 처음엔 실수처럼 보였던 것들이었다.",decision:"정답처럼 보이는 길보다, 마음이 먼저 가는 쪽을 골랐다."}
};

// ── English archetype narratives ──────────────────────────────────────────
const archetypeEn={
"SOHB":{job:"Restoration atelier owner",desire:"work that still feels right years later",fear:"watching meaning get watered down",object:"lacquer box",line:"I built a small world slowly. I never needed everyone to understand it.",decision:"I chose to go deeper instead of farther."},
"SOHE":{job:"Archival filmmaker",desire:"saving things before they disappear",fear:"a loss that can’t be recovered",object:"35mm slide",line:"I noticed what everyone else walked past, then saved it before it vanished.",decision:"I stopped chasing the new and started watching what was disappearing."},
"SOVB":{job:"Furniture designer",desire:"making work that is unmistakably mine",fear:"losing the edges of my own taste",object:"black pencil",line:"I didn’t have to be loud. You could tell it was mine by looking at the work.",decision:"I chose to be unmistakable rather than everywhere."},
"SOVE":{job:"Urban garden studio director",desire:"building things that outlast me",fear:"watching everything collapse when I leave",object:"seed packet",line:"I got better at tending things than rushing them into existence.",decision:"I chose durability over speed."},
"SIHB":{job:"Independent magazine founder",desire:"being recognized without becoming generic",fear:"becoming visible while disappearing inside the image",object:"silver lighter",line:"People knew my name. Very few knew anything else.",decision:"I stopped hiding and became precise about what I would show."},
"SIHE":{job:"Late-night chef",desire:"warmth that lingers between people",fear:"going numb to other people",object:"enamel cup",line:"My day began when everyone else was winding theirs down.",decision:"I chose to stay with people a little longer."},
"SIVB":{job:"Creative producer",desire:"the charge that happens between people",fear:"rooms where nothing ever starts",object:"champagne coupe",line:"Wherever I went, I made something happen between people.",decision:"I chose to connect people instead of finishing everything alone."},
"SIVE":{job:"Night photographer",desire:"one moment worth remembering forever",fear:"a life that passes without anything happening",object:"red matchbook",line:"I chose the moments that would be remembered, not the things that would last.",decision:"I chose intensity over safety."},
"LOHB":{job:"Independent radio producer",desire:"the freedom to change direction",fear:"a life that looks fine but has no exit",object:"brass key",line:"I wanted a life with doors in it—places where I could still turn.",decision:"I stopped choosing one correct path and always left myself another way out."},
"LOHE":{job:"Field-recording artist",desire:"living by my own rules",fear:"settling into a life just because it’s familiar",object:"cassette tape",line:"I changed the rules of my life quietly, one ordinary habit at a time.",decision:"I moved before I had everyone convinced."},
"LOVB":{job:"Climate-tech founder",desire:"a problem big enough to stay with",fear:"spending my best energy on things that don’t matter",object:"compass",line:"I chose the problem I could live with for years, not the job that looked best on paper.",decision:"I turned toward the bigger problem instead of the safer success."},
"LOVE":{job:"Cultural strategist",desire:"a life that moves without coming apart",fear:"freedom turning into emptiness",object:"transit card",line:"I moved often, but never randomly.",decision:"Instead of settling down, I built a rhythm for leaving."},
"LIHB":{job:"Experimental architect",desire:"the feeling that things can still change",fear:"finishing something and losing all room to move",object:"torn blueprint",line:"I liked things with the ending left open. That’s where the next thing could begin.",decision:"I chose possibility over completion."},
"LIHE":{job:"Documentary location scout",desire:"a life that keeps becoming unfamiliar",fear:"becoming predictable even to myself",object:"folded map",line:"Just when a place started to feel familiar, I moved again.",decision:"I left before familiarity could harden into a life."},
"LIVB":{job:"Independent fashion label founder",desire:"a world built to my own taste",fear:"living inside someone else’s standards",object:"gold safety pin",line:"If there wasn’t a place for me, I made one. I never planned to fit someone else’s taste.",decision:"I stopped waiting for permission and made the place myself."},
"LIVE":{job:"Set designer",desire:"a life that keeps taking unexpected turns",fear:"days so perfectly arranged that nothing can surprise me",object:"cracked mirror",line:"Looking back, the best choices were the ones that first looked like mistakes.",decision:"I followed the pull before I knew where it led."}
};

// ── Interface copy ────────────────────────────────────────────────────────
const uiCopy={
ko:{
heroTitle:'<span class="line">그때 다른 선택을 했다면,</span><span class="line">나는 지금</span><em>어떤 삶을 살고 있을까?</em>',
heroBody:"여덟 장면에서 망설이지 말고 마음이 먼저 가는 쪽을 고르세요. 마지막에는 지금과 조금 다른 삶을 살고 있는 또 하나의 내가 나타납니다. 정답도, 진단도 없습니다.",
startBtn:"다른 삶의 나 만나기",landingFine:'약 1분 · 로그인 없이 · 무료 · <a href="privacy.html?lang=ko">개인정보 안내</a>',
revealTitle:'선택이 갈라진 곳에서 <i>다른 내가 나타납니다</i>',resultEyebrow:"또 다른 나",
savePoster:"포스터 저장",shareResult:"결과 공유",inviteFriend:"친구 초대",compareCode:"코드로 비교",retake:"다시 선택",
disclaimer:'GHOSTLIFE는 심리검사가 아닙니다. 여덟 개의 선택으로 상상해보는 ‘살지 않은 나’에 가깝습니다. · <a href="privacy.html?lang=ko">개인정보 안내</a>',
compareTitle:'다른 삶의 우리 둘은 <em>어디서 처음 만났을까?</em>',compareBody:"각자의 GHOST 코드를 넣으면 두 사람이 다른 삶에서 마주쳤을 법한 한 장면을 보여줍니다.",
myCodeLabel:"내 GHOST 코드",friendCodeLabel:"친구 GHOST 코드",copy:"복사",friendPlaceholder:"친구 코드 입력",seeScene:"장면 보기",
saveDuoPoster:"둘의 포스터 저장",shareDuo:"둘의 장면 공유",tryIt:"나도 해보기",backResult:"내 결과로 돌아가기",
want:"계속 원하는 것",avoid:"가장 피하고 싶은 것",city:"살고 있는 도시",symbol:"곁에 둔 물건",decision:"이 삶을 만든 선택",
posterFooter:"다른 선택 끝의 나",copied:"복사됨",badCode:"4자리 GHOST 코드를 확인해주세요.",copiedResult:"결과 문구가 복사됐어요.",
copiedInvite:"친구 초대 링크가 복사됐어요.",copiedDuo:"둘의 장면 링크가 복사됐어요.",
firstGhost:"첫 번째 GHOST",secondGhost:"두 번째 GHOST",whereMeet:"처음 마주친 곳",clash:"부딪히는 곳",shared:"둘의 상징"
},
en:{
heroTitle:'<span class="line">If I had chosen differently,</span><span class="line">what kind of life</span><em>would I be living now?</em>',
heroBody:"Choose the option that pulls you first in eight imagined moments. At the end, you’ll meet a version of yourself living a life you never chose. No right answers. No diagnosis.",
startBtn:"Meet the other you",landingFine:'About a minute · No login · Free · <a href="privacy.html?lang=en">Privacy</a>',
revealTitle:'Somewhere after the fork, <i>another you comes into view.</i>',resultEyebrow:"ANOTHER YOU",
savePoster:"Save poster",shareResult:"Share result",inviteFriend:"Invite a friend",compareCode:"Compare codes",retake:"Choose again",
disclaimer:'GHOSTLIFE isn’t a personality test. It’s a small fiction built from eight choices—a glimpse at a life you didn’t live. · <a href="privacy.html?lang=en">Privacy</a>',
compareTitle:'If our other lives crossed, <em>where would we meet?</em>',compareBody:"Enter both GHOST codes to see the scene where your unlived lives might have crossed.",
myCodeLabel:"My GHOST code",friendCodeLabel:"Friend’s GHOST code",copy:"Copy",friendPlaceholder:"Enter a friend’s code",seeScene:"See the scene",
saveDuoPoster:"Save dual poster",shareDuo:"Share this scene",tryIt:"Try GHOSTLIFE",backResult:"Back to my result",
want:"What you keep chasing",avoid:"What you avoid",city:"Where you live",symbol:"What you keep close",decision:"The choice that made this life",
posterFooter:"THE LIFE YOU DIDN’T LIVE",copied:"COPIED",badCode:"Check the 4-character GHOST code.",copiedResult:"Result text copied.",
copiedInvite:"Invite link copied.",copiedDuo:"Dual-result link copied.",
firstGhost:"FIRST GHOST",secondGhost:"SECOND GHOST",whereMeet:"WHERE YOU MEET",clash:"WHERE YOU CLASH",shared:"WHAT YOU SHARE"
}
};

// ── Dual-result scene copy ────────────────────────────────────────────────
const duoCopy={
ko:{
scenes:["새벽 두 시의 기차역","문 닫기 직전의 작은 서점","비가 막 시작된 항구","오래된 호텔의 엘리베이터","전시가 끝난 뒤 텅 빈 계단","낯선 도시의 심야 식당","첫 배가 들어오는 부두","비행기 지연 안내가 뜬 공항 라운지"],
reasons:["말보다 먼저 서로의 속도를 알아봤다.","한 사람의 침묵과 다른 사람의 움직임이 이상하게 잘 맞았다.","서로 전혀 다른 이유로 같은 자리에 오래 남아 있었다.","둘 다 다음 장면을 기다리는 표정이 비슷했다."],
clashes:["한 사람은 떠날 타이밍을 보고, 다른 사람은 남을 이유를 만든다.","한 사람은 계획을 세우고, 다른 사람은 계획이 끝나기 전에 움직인다.","보여주고 싶은 것과 숨기고 싶은 것의 경계가 다르다.","한 사람은 무언가를 남기려 하고, 다른 사람은 순간을 끝까지 느끼려 한다."]
},
en:{
scenes:["a train platform at 2 a.m.","a tiny bookstore five minutes before closing","a harbor just as the rain begins","an old hotel elevator","an empty staircase after an exhibition closes","a late-night diner in a city neither of you knows","a pier as the first ferry comes in","an airport lounge under a delayed-flight notice"],
reasons:["You notice each other’s pace before either of you says much.","One person’s stillness and the other’s momentum fit together strangely well.","You both stay in the same place longer than expected, for completely different reasons.","You’re both wearing the look of someone waiting for the next scene to begin."],
clashes:["One of you watches for the moment to leave; the other keeps finding reasons to stay.","One makes the plan. The other starts moving before the plan is finished.","You draw the line between private and visible in very different places.","One wants to leave something behind; the other wants to feel the moment while it lasts."]
}
};


// ── 16-result visual profile system ───────────────────────────────────────
const visualProfiles={
SOHB:{a:"#b69a69",b1:"#070706",b2:"#171109"},SOHE:{a:"#9d8b73",b1:"#0a0908",b2:"#18140f"},
SOVB:{a:"#b5ad9f",b1:"#080808",b2:"#141414"},SOVE:{a:"#8f9b78",b1:"#080a08",b2:"#14170f"},
SIHB:{a:"#b9a17f",b1:"#090807",b2:"#19120d"},SIHE:{a:"#b77f67",b1:"#0b0807",b2:"#1a100d"},
SIVB:{a:"#c2aa7f",b1:"#090806",b2:"#1b140d"},SIVE:{a:"#ad6356",b1:"#0c0808",b2:"#1b0e0e"},
LOHB:{a:"#c5a56d",b1:"#06080a",b2:"#22190f"},LOHE:{a:"#899b9d",b1:"#07090a",b2:"#10191b"},
LOVB:{a:"#9aa98a",b1:"#070908",b2:"#121a12"},LOVE:{a:"#8099a8",b1:"#06080a",b2:"#101821"},
LIHB:{a:"#a58a76",b1:"#090706",b2:"#1d120d"},LIHE:{a:"#84919e",b1:"#070809",b2:"#11161d"},
LIVB:{a:"#c49a57",b1:"#0b0805",b2:"#211509"},LIVE:{a:"#d0a46d",b1:"#211a15",b2:"#090909"}
};
function axisClasses(key){
  return [
    key[0]==="L"?"axis-leave":"axis-stay",
    key[1]==="I"?"axis-impulse":"axis-order",
    key[2]==="V"?"axis-seen":"axis-hidden",
    key[3]==="E"?"axis-experience":"axis-build"
  ];
}
function emblemSvg(key){
  const bit=(ch,pos)=>({L:1,S:0,I:1,O:0,V:1,H:0,E:1,B:0}[ch]||0);
  const b=[...key].map(bit),a="var(--a)";
  const r=b[0]?38:28,rot=b[1]?22:-12,open=b[2]?76:52,cut=b[3]?18:34;
  return '<svg viewBox="0 0 100 100" fill="none" stroke="var(--a)" stroke-width="1.2" aria-hidden="true">'+
    '<circle cx="50" cy="50" r="'+r+'" opacity=".75"/>'+
    '<line x1="'+(50-open/2)+'" y1="50" x2="'+(50+open/2)+'" y2="50" transform="rotate('+rot+' 50 50)" opacity=".8"/>'+
    '<line x1="50" y1="'+cut+'" x2="50" y2="'+(100-cut)+'" opacity=".55"/>'+
    (b[2]?'<rect x="38" y="38" width="24" height="24" transform="rotate(45 50 50)" opacity=".6"/>':'<circle cx="50" cy="50" r="7" opacity=".9"/>')+
    (b[3]?'<path d="M18 76 L50 20 L82 76" opacity=".55"/>':'<path d="M20 24 H80 V76 H20 Z" opacity=".4"/>')+
  '</svg>';
}
function applyVisualSystem(key){
  const p=visualProfiles[key]||visualProfiles.LOHB,poster=document.getElementById("poster");
  poster.className="poster "+key+" "+axisClasses(key).join(" ")+" lock-in";
  poster.style.setProperty("--a",p.a);poster.style.setProperty("--bg1",p.b1);poster.style.setProperty("--bg2",p.b2);
  document.getElementById("posterEmblem").innerHTML=emblemSvg(key);
}
