/* ===== たまみ式・波動コンパス診断（クリーン外部JS） ===== */
/* 互換性重視：optional chaining 不使用 */

/* --- 診断ページ用ロゴ（絵＋Tamami） --- */
var LOGO_SVG =
  '<div class="brand" style="display:flex;align-items:center;gap:10px">' +
    '<svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" style="height:28px">' +
      '<defs><linearGradient id="s" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#7b5cff"/><stop offset="100%" stop-color="#00e3ff"/></linearGradient></defs>' +
      '<path d="M10 40 q40 -30 80 0" stroke="url(#s)" stroke-width="2.5" fill="none"/>' +
      '<circle cx="90" cy="25" r="4" fill="#fff" stroke="url(#s)" stroke-width="2"/>' +
    '</svg>' +
    '<div style="font-weight:700;color:#1b2430;opacity:.9">Tamami</div>' +
  '</div>';

/* --- 現在のサイトURLを取得（メール内リンクなどで使用） --- */
var SITE_ORIGIN = (typeof window !== 'undefined' && window.location && window.location.origin)
  ? window.location.origin
  : 'https://tamami-diagnosis9.netlify.app';
var DIAG_LINK = SITE_ORIGIN + '/';

/* ===== 設問定義 ===== */
var QUESTION_BANK = [
  { id:'Q1',  text:'連絡の頻度やタイミングを自然に合わせられる', elem:'水' },
  { id:'Q2',  text:'相手の気持ちを想像しすぎず、素直に確認できる', elem:'金' },
  { id:'Q3',  text:'恋愛中も自分の生活リズムを保てている', elem:'土' },
  { id:'Q4',  text:'気になる人に対して行動で気持ちを示せる', elem:'火' },
  { id:'Q5',  text:'小さな変化に気づき、言葉で伝えられる', elem:'木' },
  { id:'Q6',  text:'予定がずれても関係をこじらせずに切り替えられる', elem:'水' },
  { id:'Q7',  text:'恋にのめり込みすぎず、適度な距離感を保てる', elem:'土' },
  { id:'Q8',  text:'感情をため込まず、その都度やさしく伝えられる', elem:'金' },
  { id:'Q9',  text:'好きな人の夢や目標を応援できる', elem:'木' },
  { id:'Q10', text:'「一緒にいると楽しい」と思える時間が多い', elem:'火' },
  { id:'Q11', text:'会えない時も信頼して待つことができる', elem:'水' },
  { id:'Q12', text:'ふたりの関係をコツコツ育てるのが得意', elem:'土' },
  { id:'Q13', text:'気持ちを言葉より行動で伝えることが多い', elem:'火' },
  { id:'Q14', text:'相手の魅力を見つけて褒めるのが得意', elem:'木' },
  { id:'Q15', text:'感情に流されず、冷静に話し合える', elem:'金' }
];
var ELEMENTS = ['木','火','土','金','水'];
var TYPE_NAME = { '木':'育みミューズ', '火':'ときめきスパーク', '土':'安心アンカー', '金':'ことばの調律師', '水':'流れのコンパス' };
var ADVICE = {
  '木':'育てる力が光っています。小さな「いいね」を言葉にして伝えてみましょう。',
  '火':'ときめきを大切に。1日のどこかに“ごほうび時間”をひとつ入れてみて。',
  '土':'安心が土台。今週は「寝る・食べる・お金」のペースを一定に保ちましょう。',
  '金':'短い一言で十分。「今こう感じた」をそのままやさしく伝えてみて。',
  '水':'無理に合わせなくてOK。タイミングが合わない日は「今日は整える日」に。'
};

/* ===== 九星 ===== */
var KYUSEI_MAP = { 1:{label:'一白水星', elem:'水'}, 2:{label:'二黒土星', elem:'土'}, 3:{label:'三碧木星', elem:'木'}, 4:{label:'四緑木星', elem:'木'}, 5:{label:'五黄土星', elem:'土'}, 6:{label:'六白金星', elem:'金'}, 7:{label:'七赤金星', elem:'金'}, 8:{label:'八白土星', elem:'土'}, 9:{label:'九紫火星', elem:'火'} };
function isBeforeSetsubun(iso){ if(!iso) return false; var d=new Date(iso+'T00:00:00'); var m=d.getMonth()+1,day=d.getDate(); return (m===1)||(m===2&&day<=3); }
function yDigitSum(y){ var s=0; String(y).split('').forEach(function(d){ s+= +d; }); while(s>9){ s=String(s).split('').reduce(function(a,b){return a+(+b);},0);} return s; }
function honmeiFromYear(y){ var n=yDigitSum(y); var v=11-n; while(v<=0) v+=9; return ((v-1)%9)+1; }
function calcHonmei(iso){ if(!iso) return null; var d=new Date(iso+'T00:00:00'); var y=d.getFullYear(); if(isBeforeSetsubun(iso)) y--; var num=honmeiFromYear(y); var info=KYUSEI_MAP[num]; return {num:num,label:info.label,elem:info.elem,yearUsed:y}; }

/* ===== 相性 ===== */
var FEED={'木':'火','火':'土','土':'金','金':'水','水':'木'};
var CONTROL={'木':'土','土':'水','水':'火','火':'金','金':'木'};
function kyuseiCompat(e1,e2){
  if(!e1||!e2) return {label:'—',score:null,comment:''};
  if(e1===e2) return {label:'調和',score:78,comment:'似た波長で安心感。新鮮さは意識して増やしましょう。'};
  if(FEED[e1]===e2) return {label:'相生（あなた→相手）',score:86,comment:'背中を押す一言が鍵。育ち合う循環が生まれます。'};
  if(FEED[e2]===e1) return {label:'相生（相手→あなた）',score:86,comment:'受け取り上手で好循環に。頼ることも愛の表現です。'};
  if(CONTROL[e1]===e2||CONTROL[e2]===e1) return {label:'相克',score:58,comment:'違いが出やすい組み合わせ。合意文（ルール）を先に決めて整流を。'};
  return {label:'中庸',score:72,comment:'穏やかで自然体。共通の楽しみを少しずつ増やして。'};
}

/* ===== 9タイプ（メール冒頭） ===== */
var TYPE9 = {
  "ビジョンシーカー": { icon:"🧠", color:"#8AB4F8", short:"俯瞰して道筋を描ける人", theme:"思考を形に、最初の一歩へ" },
  "ハートナビゲーター": { icon:"💞", color:"#F8A1C1", short:"共感で灯りをともす人", theme:"想いを信じて小さく行動" },
  "アクションクリエイター": { icon:"🚀", color:"#FFB86B", short:"手を動かして進める人", theme:"熱量を整えて継続力に" },
  "直感バランサー": { icon:"🌈", color:"#BDA5F5", short:"直感と理性の調和型", theme:"違いを束ねて流れに乗る" },
  "情熱マスター":   { icon:"🔥", color:"#FF8DA1", short:"喜びで周囲を温める人", theme:"休息も情熱の一部に" },
  "理性アーキテクト": { icon:"💎", color:"#86E6D6", short:"構造化して実装できる人", theme:"言語化→合意→一歩ずつ" },
  "内省ヒーラー":   { icon:"🌿", color:"#9ED49E", short:"余白で整える癒し手", theme:"ゆるく継続、小さな習慣" },
  "感覚ドリーマー": { icon:"🌙", color:"#A7C8FF", short:"感性で物語を紡ぐ人", theme:"心地よさを指標に前へ" },
  "統合マスター":   { icon:"☀️", color:"#FFC2D4", short:"全体を束ね調律する人", theme:"強みを掛け合わせて統合" }
};
function pickTypeNameForMail(pay){
  var top = (pay && pay.self && pay.self.summary && pay.self.summary.top) ? pay.self.summary.top : "木";
  var map = { "木":"ハートナビゲーター","火":"情熱マスター","土":"内省ヒーラー","金":"理性アーキテクト","水":"直感バランサー" };
  return map[top] || "統合マスター";
}
function renderTypeHeaderBlock(typeName){
  var t = TYPE9[typeName] || TYPE9["統合マスター"];
  return ''
    + '<h2 style="margin-top:14px;">'+ t.icon +' あなたは【'+ typeName +'】タイプ！</h2>'
    + '<div style="background:linear-gradient(180deg,#FFF7F9,#FFFFFF);'
    + 'border-left:6px solid '+ t.color +';border:1px solid #F5D8E2;'
    + 'border-radius:12px;padding:12px 14px;">'
    +   '<div style="color:#6b5a55;">'+ t.short +'</div>'
    +   '<div style="margin-top:6px;color:#8b6a5c;">🪷 今のテーマ：<b>'+ t.theme +'</b></div>'
    + '</div>';
}

/* ===== DOM Util ===== */
function $(sel){ return document.querySelector(sel); }
var QROOT, B_SELF, S_SELF;

/* ===== 質問UI ===== */
function renderQuestions(){
  QROOT.innerHTML='';
  QUESTION_BANK.forEach(function(q,i){
    var el=document.createElement('div'); el.className='q';
    el.innerHTML= '<label><b>'+(i+1)+'. '+q.text+'</b></label>\
      <div class="row" data-elem="'+q.elem+'" data-qid="'+q.id+'">\
        '+[1,2,3,4,5].map(function(v){return '<button type="button" class="pill" data-val="'+v+'">'+v+'</button>';}).join('')+'\
      </div>';
    QROOT.appendChild(el);
  });
}
function attachHandlers(){
  QROOT.addEventListener('click',function(e){
    var t=e.target;
    var b = t.closest ? t.closest('.pill') : (t.classList && t.classList.contains('pill')? t : null);
    if(!b) return;
    var row=b.parentElement;
    Array.prototype.forEach.call(row.querySelectorAll('.pill'), function(x){ x.classList.remove('active'); });
    b.classList.add('active'); row.dataset.value=b.getAttribute('data-val'); updatePreview();
  });
  var twinToggle = document.getElementById('use_twin');
   if (twinToggle) {
     twinToggle.addEventListener('change', function(){
       var tf = document.getElementById('twin_fields');
       if (tf) { this.checked ? tf.classList.remove('hidden') : tf.classList.add('hidden'); }
     });
   }
}

/* ===== 集計・表示 ===== */
function collect(){
  var scores={'木':0,'火':0,'土':0,'金':0,'水':0}; var answers=[];
  Array.prototype.forEach.call(QROOT.querySelectorAll('[data-qid]'), function(row){
    var val= +row.dataset.value || 0; var elem=row.dataset.elem; answers.push({id:row.dataset.qid, value:val, elem:elem}); scores[elem]+=val;
  });
  return {scores:scores,answers:answers};
}
function normalize(scores){
  var tot=Object.values(scores).reduce(function(a,b){return a+b;},0)||1;
  var p={}; ELEMENTS.forEach(function(k){ p[k]=Math.round(scores[k]/tot*100); });
  var diff=100-Object.values(p).reduce(function(a,b){return a+b;},0); if(diff) p[ELEMENTS[0]]+=diff; return p;
}
function summary(perc){
  var order=ELEMENTS.slice().sort(function(a,b){return perc[b]-perc[a];});
  var top=order[0]; return {order:order, top:top, topName: TYPE_NAME[top], tips: ADVICE[top]};
}
function bars(root,perc){
  root.innerHTML='';
  ELEMENTS.forEach(function(k){
    var w=document.createElement('div');
    w.innerHTML = '\
      <div class="row" style="justify-content:space-between">\
        <span>'+k+'</span><span>'+perc[k]+'%</span>\
      </div>\
      <div class="bar"><span style="width:'+perc[k]+'%"></span></div>';
    root.appendChild(w);
  });
}
function tags(root,sum){
  root.innerHTML='';
  ['タイプ:'+ (sum.topName||sum.top),'優勢:'+sum.top,'順位:'+sum.order.join(' > '),'ヒント:'+sum.tips].forEach(function(t){
    var s=document.createElement('span'); s.className='tag'; s.textContent=t; root.appendChild(s);
  });
}
function showToast(m,err){ var t=document.createElement('div'); t.className='toast'+(err?' err':''); t.textContent=m; document.body.appendChild(t); setTimeout(function(){ t.remove(); },3200); }
function renderAll(){
  var me=collect(); var p=normalize(me.scores); var s=summary(p);
  bars(B_SELF,p); tags(S_SELF,s);
  var ky=calcHonmei($('#dob').value); var ktxt=ky? ky.label: '—（詳細はメール）';
  $('#self_kyusei').textContent = '九星：'+ktxt;
}
function updatePreview(){ renderAll(); }

/* ===== 入力チェック ===== */
function validate(){
  if(!$('#name') || !$('#email') || !$('#dob')) return 'ページの読み込みに失敗しました（必須フィールド未検出）';
  if(!$('#name').value.trim()) return 'お名前は必須です';
  if(!$('#email').value.trim()) return 'メールは必須です';
  if(!$('#dob').value) return '生年月日は必須です';
  var twin=$('#use_twin').checked; if(twin && !$('#p_dob').value) return 'ツイン相性には相手の生年月日が必要です';
  var answered=Array.prototype.filter.call(QROOT.querySelectorAll('[data-qid]'), function(r){return +r.dataset.value>0;}).length;
  if(answered<QUESTION_BANK.length) return '未回答があります';
  return null;
}

/* ===== メール：相手の五行→擬似パーセント（60% + 10%×4） ===== */
function estimatePercFromKyElem(elem){
  var base={'木':10,'火':10,'土':10,'金':10,'水':10};
  if(!elem || ELEMENTS.indexOf(elem)<0) return base;
  ELEMENTS.forEach(function(k){ base[k] = (k===elem)?60:10; });
  return base;
}

/* ===== メール内グラフ描画（横棒・本人/相手で配色別） ===== */
function renderBarsEmail(title, perc, palette){
  var head = '<h2>'+title+'</h2>';
  var rows = ELEMENTS.map(function(k){
    var w = perc[k]||0;
    var bar = '<div style="height:10px;border-radius:6px;background:#0b152e1a;border:1px solid #00000010;overflow:hidden"><div style="height:10px;width:'+w+'%;background:linear-gradient(90deg,'+palette[0]+','+palette[1]+')"></div></div>';
    return '<div style="display:flex;justify-content:space-between;margin:6px 0 4px"><div>'+k+'</div><div>'+w+'%</div></div>'+bar;
  }).join('');
  return head + rows;
}

/* ===== メール生成（やさしい口調 + タイプブロック + 静的グラフ） ===== */
var SELF_DESC = {
  "木": { label: "育みミューズ",     text: "芽吹きを見つけて大切に育む人。やさしさと成長力で周りに安心を広げます。" },
  "火": { label: "ときめきスパーク", text: "心の火花で場を明るくする人。情熱と直感で一歩を後押しします。" },
  "土": { label: "安心アンカー",     text: "揺れを受け止め整える人。落ち着きと誠実さで土台をつくります。" },
  "金": { label: "ことばの調律師",   text: "想いを言葉で整える人。境界とルールで心地よい距離感を守ります。" },
  "水": { label: "流れのコンパス",   text: "流れを読み形を変える人。柔軟さと受容性で未来の道筋を示します。" }
};
var REL_NOTE = {
  "木": { "木":"似たリズムで安心感が生まれる関係。お互いの成長を静かに応援できます。",
          "火":"あなたの育みが相手の情熱をのびやかに育てます。嬉しい変化を一緒に喜んで。",
          "土":"木の広がりを土が受け止めて安定へ。焦らず小さな積み重ねが力に。",
          "金":"考え方や言い回しで噛み合わない時は深呼吸を。意図を短く優しく伝えると調和します。",
          "水":"水の柔軟さがあなたの成長を潤します。流れに乗ると心が軽くなります。" },
  "火": { "木":"相手のやさしさがあなたの情熱を健やかに灯します。喜びを素直に分かち合って。",
          "火":"惹かれ合う火花。勢いが強い時は休憩を挟むと温かさが長続きします。",
          "土":"土の落ち着きが情熱を現実へつなぎます。ゴールを一緒に言葉にしてみて。",
          "金":"ペースや言葉でぶつかりやすい関係。要点を短く、気持ちはやわらかく。",
          "水":"水が火を包み、熱が想いを動かす関係。温度差は“間”を置くと心地よく整います。" },
  "土": { "木":"あなたの土台が相手の成長を支えます。ゆっくり目標を育てましょう。",
          "火":"相手の情熱をあなたが現実化。段取りを一緒に描くと前進がスムーズに。",
          "土":"価値観が近く居心地の良い関係。小さな楽しみを定期的に共有して。",
          "金":"整える力が共鳴。ルールや役割を優しく合わせると安心感が深まります。",
          "水":"水の柔らかさが土の負担をほどきます。無理を手放すと余白に幸せが満ちます。" },
  "金": { "木":"切り口が鋭くなりがち。評価より意図の共有を。丁寧な言葉選びが橋になります。",
          "火":"勢いとルールのバランスが鍵。“今日は楽しむ日／整える日”を分けると◎",
          "土":"約束を守る安心が育つ関係。心地よい境界を一緒に作っていけます。",
          "金":"価値観が近く話が早い組み合わせ。柔らかさを忘れないと温かさが続きます。",
          "水":"あなたの整理力を水の受容が優しく包みます。結論を急がない余白が調和に。" },
  "水": { "木":"あなたの柔らかさが木の成長を後押し。流れに身を任せると喜びが増えます。",
          "火":"温度差はリズムの違い。感情は一拍置いて共有すると、刺激が推進力に変わります。",
          "土":"土が水路を整え、あなたは潤いを運ぶ関係。安心できるルーティンが助けに。",
          "金":"言葉やルールが頼りになる相手。受け取り方を素直に伝えるとさらに安心に。",
          "水":"似た感性でやさしく寄り添う関係。静かな時間を一緒に味わうほど深まります。" }
};
var RELATION_PATTERNS = {
  "共鳴": { label:"① 共鳴", headline:"波長がぴったり",
    advice:"似た感性が自然に寄り添う関係です。言葉が少なくても、空気感やまなざしで十分に伝わります。ふたりの“安心できるリズム”を大切にすると、静かに絆が深まります。やさしい時間を増やしていきましょう。" },
  "補完": { label:"② 補完", headline:"違いが魅力に変わる",
    advice:"役割が自然に分かれ、足りない部分を満たし合える関係です。相手を“変える”より“理解する”を合言葉に。気持ちは短く素直に、考えはゆっくり丁寧に。歩幅を合わせるほど、安心感が増していきます。" },
  "刺激": { label:"③ 刺激", headline:"惹かれ合い × 摩擦",
    advice:"強い引力と同時に、ペースの違いで擦れやすい関係です。熱量を少し落として、心の余白を作ることが鍵。感情は一拍おいてから、要点だけを優しく共有すると、刺激が推進力へと変わっていきます。" },
  "成長": { label:"④ 成長", headline:"導き合う関係",
    advice:"相手の在り方が、自分の伸びしろをそっと照らします。急がず、芽が開くタイミングを信じましょう。小さな「できた」を一緒に喜ぶ習慣が、ふたりの未来をあたたかく育てます。" },
  "調整": { label:"⑤ 調整", headline:"ペースを整える",
    advice:"バランス感覚は似ていても、心地よいテンポは少し違います。無理に合わせず“中間の心地よさ”を探して。約束はゆるやかに、余白は多めに。心身の調律が整うほど、関係はやさしくほどけていきます。" },
  "融合": { label:"⑥ 融合", headline:"魂の安らぎ",
    advice:"一緒にいるだけで呼吸が揃うような、深く静かな調和。言葉よりも共鳴がすべてを伝えます。感謝を小さく積み重ねると、ぬくもりが満ちていきます。日常の手ざわりを二人で丁寧に楽しんで。" }
};
var SELF_TIPS = {
  "木": "芽生えを大切に。小さな前進を褒めるほど、流れがやさしく育ちます。",
  "火": "ときめきを燃料に。深呼吸で熱量を整えると、長く心地よく続きます。",
  "土": "整えるほど安心が満ちます。休息とルーティンに少し余白を。",
  "金": "言葉をやわらかく。意図を短く丁寧に伝えるだけで関係がほどけます。",
  "水": "流れに寄り添う選択を。結論は急がず、心の余白を味方にしましょう。"
};
function relationPattern(a,b){
  if(a===b) return "共鳴";
  var cyc=["木","火","土","金","水"];
  if(cyc[(cyc.indexOf(a)+1+5)%5]===b) return "補完";
  if((a==="木"&&b==="金")||(a==="金"&&b==="木")||(a==="火"&&b==="水")||(a==="水"&&b==="火")) return "刺激";
  return "成長";
}

/* ===== メールHTML ===== */
function buildEmailHTML(ctx){
  ctx = ctx || {};
  var yourEl      = ctx.yourEl;
  var partnerEl   = ctx.partnerEl;
  var percSelf    = ctx.percSelf || {'木':0,'火':0,'土':0,'金':0,'水':0};
  var percPartner = ctx.percPartner || {'木':0,'火':0,'土':0,'金':0,'水':0};
  var typeName    = ctx.typeName || '';
  var nameForMail = (typeof ctx.name === 'string' && ctx.name.trim()) ? ctx.name.trim() : '';
  var partnerName = (typeof ctx.partnerName === 'string' && ctx.partnerName.trim()) ? ctx.partnerName.trim() : '';

  var you    = SELF_DESC[yourEl];
  var isTwin = !!partnerEl;

  // ロゴURLと戻るリンクを動的化
  var LOGO_URL = SITE_ORIGIN + '/tamami.png';

  var patKey, pat, relation_label="", relation_summary="", relation_mini="", advice_text="";
  if(isTwin){
    patKey = relationPattern(yourEl, partnerEl);
    pat    = RELATION_PATTERNS[patKey];
    relation_label   = pat.label+'（'+yourEl+'×'+partnerEl+'）';
    relation_summary = pat.headline;
    relation_mini    = REL_NOTE[yourEl][partnerEl];
    advice_text      = pat.advice;
  }else{
    advice_text = SELF_TIPS[yourEl] || "今は呼吸とペースをやさしく整える時。心地よさを優先して大丈夫です。";
  }

  var subject = isTwin
    ? (nameForMail
        ? "【" + nameForMail + "さまのツイン相性診断レポート】お二人の波動バランス結果🌙"
        : "【ツイン相性診断レポート】お二人の波動バランス結果🌙")
    : (nameForMail
        ? "【" + nameForMail + "さまの波動診断レポート】今のバランスとやさしいヒント💫"
        : "【波動診断レポート】あなたの今のバランスとやさしいヒント💫");

  var style =
    '<style>' +
    '  body{font-family:"Zen Maru Gothic","Hiragino Sans","Noto Sans JP",sans-serif;background:#fffafc;color:#5b4b47;line-height:1.8;font-size:15px;}' +
    '  .c{max-width:650px;margin:0 auto;padding:24px 28px;background:linear-gradient(180deg,#fff8f9 0%,#fff 100%);border-radius:16px;box-shadow:0 0 18px rgba(255,192,203,.25)}' +
    '  h1{text-align:center;color:#d87ba0;font-size:22px;margin:.2em 0 .6em}' +
    '  h2{color:#8b6a5c;font-size:18px;margin:1.2em 0 .4em}' +
    '  .box{background:#fff0f4;border-left:5px solid #f6a5c0;padding:10px 15px;border-radius:10px;margin-top:8px}' +
    '  .ft{margin-top:28px;border-top:1px solid #f5d8e2;padding-top:16px;font-size:14px;text-align:center;color:#967d72}' +
    '  a{color:#d87ba0;text-decoration:none}' +
    '  .brand{display:flex;align-items:center;gap:10px;justify-content:center;margin-bottom:10px}' +
    '  .brand svg{height:26px}' +
    '  .c img{max-width:100%;height:auto;}' +
    '</style>';

  function renderHBar(p, title, grad){
    if(!p) return '';
    function row(label,val){
      return '<div style="margin:6px 0 8px;display:flex;justify-content:space-between;"><div>'+label+'</div><div>'+val+'%</div></div>'+
             '<div style="height:10px;border-radius:6px;background:#fde2ea;border:1px solid #f5c7d2;overflow:hidden;">'+
               '<div style="height:10px;width:'+val+'%;background:linear-gradient(90deg,'+grad[0]+','+grad[1]+');"></div>'+
             '</div>';
    }
    return '<h2>'+title+'</h2>' +
           row('木', p['木']) + row('火', p['火']) + row('土', p['土']) + row('金', p['金']) + row('水', p['水']);
  }
  var graphSelf    = renderHBar(percSelf, '📊 あなたのバランス（%）', ['#F8A1C1','#FDD8E6']);
  var graphPartner = isTwin ? renderHBar(percPartner, '📊 お相手のバランス（%）', ['#B3D9FF','#9EC5FF']) : '';

  var typeHeader = (typeof renderTypeHeaderBlock === 'function') ? renderTypeHeaderBlock(typeName) : '';

  var typeBlockTwin = isTwin
    ? ('<p>💙 ' + (partnerName ? (partnerName + 'さまは ') : 'お相手は ')
        + '<strong>' + SELF_DESC[partnerEl].label + '</strong> タイプ — '
        + SELF_DESC[partnerEl].text + '</p>')
    : '';

  var relationBlock = isTwin
    ? ('<h2>🔮 二人の相性まとめ</h2>' +
       '<div class="box">' +
       '<p><strong>' + relation_label + '</strong><br>' + relation_summary + '</p>' +
       '<p style="margin-top:8px;color:#6b5a5c;">' + relation_mini + '</p>' +
       '</div>')
    : '';

  var headerTitle = isTwin ? '🌙 ツイン相性診断レポート 🌙' : '🌙 波動診断レポート 🌙';
  var html =
  '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8">' + style + '</head>' +
  '<body><div class="c">' +
    '<h1>' + headerTitle + '</h1>' +
    (typeHeader || '') +
    '<p>こんにちは、' + (nameForMail ? (nameForMail + 'さま') : 'ご利用者さま') + '🌷<br>' +
    (isTwin ? 'ツイン相性診断' : '波動診断') + ' をご利用いただきありがとうございます。<br>' +
    (isTwin ? 'お二人' : 'あなた') + 'の今にやさしく寄り添うメッセージをお届けします。</p>' +

      '<h2>' + (isTwin ? '💗 あなたとお相手のタイプ' : '💗 あなたのタイプ') + '</h2>' +
      '<div class="box"><p>💞 ' + (nameForMail ? nameForMail + 'さまは ' : 'あなたは ') +
      '<strong>' + SELF_DESC[yourEl].label + '</strong> タイプ — ' + SELF_DESC[yourEl].text + '</p>' +
      typeBlockTwin + '</div>' +

      relationBlock +

      '<div>' + graphSelf + graphPartner + '</div>' +

      '<h2>💫 ' + (isTwin ? '関係アドバイス' : 'やさしいヒント') + '</h2>' +
      '<div class="box"><p>' + advice_text + '</p></div>' +
      '<p style="margin:14px 0">' +
      '<a href="' + DIAG_LINK + '" target="_blank" ' +
       'style="display:inline-block;padding:10px 16px;border-radius:10px;' +
              'background:#f59ab3;color:#fff;text-decoration:none;font-weight:700">' +
      '診断ページに戻る' +
    '</a>' +
  '</p>' +
      '<div class="ft">' +
        '<p>診断にご協力ありがとうございました🌷<br>' +
        (isTwin ? 'あなたと大切な人の波動が' : 'あなたの波動が') + '、今日もやさしく調和しますように。</p>' +
        '<p style="margin:12px 0 0 0; line-height:1.6;">' +
          '<img src="'+ (SITE_ORIGIN + '/tamami.png') +'" alt="Tamami" width="112" height="34" ' +
          'style="display:inline-block;width:112px;height:auto;max-width:112px;vertical-align:middle;margin-right:6px;" />' +
          '癒しのガイド <strong>たまみ</strong>' +
        '</p>' +
        '<p><a href="https://l8x1uh5r.autosns.app/line" target="_blank">📩 公式LINEはこちらから</a></p>' +
      '</div>' +
    '</div></body></html>';

  return { subject: subject, html: html };
}

/* ===== 送信内容の組み立て ===== */
function payload(){
  var twin = $('#use_twin').checked;
  var me   = collect();
  var percS = normalize(me.scores);
  var sumS  = summary(percS);
  var selfKy = calcHonmei($('#dob').value);
  var pKy    = (twin && $('#p_dob').value) ? calcHonmei($('#p_dob').value) : null;
  var kyc    = twin ? kyuseiCompat(selfKy && selfKy.elem, pKy && pKy.elem) : null;
  var youElement     = sumS.top;
  var partnerElement = pKy ? pKy.elem : null;
  return {
    name: $('#name').value.trim(),
    email: $('#email').value.trim(),
    dob: $('#dob').value || null,
    birthplace: ($('#birthplace') ? $('#birthplace').value : null),
    partner: { enabled:twin, name: $('#p_name')?$('#p_name').value.trim():'', dob: $('#p_dob')?($('#p_dob').value||null):null, element: partnerElement },
    self: { perc: percS, summary: sumS, answers: me.answers },
    kyusei: { self:selfKy, partner:pKy, compat:kyc },
    you: { element: youElement },
    graphLink: "", /* ← 不使用（静的描画へ変更） */
    meta: { ts: Date.now(), ua: navigator.userAgent }
  };
}

/* ===== メール作成（静的グラフ値を渡す） ===== */
function composeEmail(pay){
  // 既存集計をそのまま利用
  var yourEl = (pay && pay.you && pay.you.element) ? pay.you.element :
               (pay && pay.self && pay.self.summary ? pay.self.summary.top : null);
  var partnerEl = (pay && pay.partner && pay.partner.enabled) ? (pay.partner.element || null) : null;
  var percSelf = (pay && pay.self && pay.self.perc) ? pay.self.perc : {'木':0,'火':0,'土':0,'金':0,'水':0};
  var percPartner = partnerEl ? estimatePercFromKyElem(partnerEl) : null;
  var mailTypeName = pickTypeNameForMail(pay);

  // ★ ここだけ追加：名前を ctx に渡す
  return buildEmailHTML({
    name: (pay && typeof pay.name === 'string') ? pay.name.trim() : '',
    partnerName: (pay && pay.partner && typeof pay.partner.name === 'string')
                   ? pay.partner.name.trim() : '',
    yourEl: yourEl,
    partnerEl: partnerEl,
    percSelf: percSelf,
    percPartner: percPartner || {'木':0,'火':0,'土':0,'金':0,'水':0},
    typeName: mailTypeName
  });
}

/* ===== Make送信 ===== */
async function sendAll(pay){
  // ここでは #hook の内容を使用（端末が変わっても初期化で埋まる）
  var hookEl = document.getElementById('hook');
  var hook = (hookEl && hookEl.value) ? hookEl.value.trim() : '';
  if(!hook){
    showToast('Webhook URL が未設定です（?admin=1 で設定）', true);
    return [{ch:'MAKE',status:'ERR',error:'NO_HOOK'}];
  }

  var email = composeEmail(pay);
  if(!pay || !pay.email){ return [{ch:'MAKE',status:'ERR',error:'EMPTY_TO'}]; }
  if(!email.subject || !email.html){ return [{ch:'MAKE',status:'ERR',error:'EMPTY_MAIL'}]; }

  var body = { payload: pay, email: { to: pay.email, subject: email.subject, html: email.html } };
  try{
    var r = await fetch(hook,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    return [{ch:'MAKE',status:r.ok?'OK':'HTTP_'+r.status}];
  }catch(e){
    return [{ch:'MAKE',status:'ERR',error:String(e)}];
  }
}

/* ===== 送信後リダイレクト ===== */
function redirectAfter(pay){
  var thanksEl = document.getElementById('thanks');
  var url = (thanksEl && thanksEl.value) ? thanksEl.value.trim() : '';
  if(!url) return;
  var dest=url;
  var tq = document.getElementById('thanks_query');
  if(tq && tq.checked){
    var p=new URLSearchParams();
    p.set('name', pay.name||'');
    var top = (pay && pay.self && pay.self.summary && pay.self.summary.top) ? pay.self.summary.top : '';
    p.set('top', top);
    if(pay.kyusei && pay.kyusei.self && pay.kyusei.self.label) p.set('honmei_self', pay.kyusei.self.label);
    if(pay.partner && pay.partner.enabled && pay.kyusei && pay.kyusei.partner && pay.kyusei.partner.label) p.set('honmei_partner', pay.kyusei.partner.label);
    dest += (url.indexOf('?')>=0?'&':'?') + p.toString();
  }

  // ← ここで back を付ける
  var here = location.origin + location.pathname;
  var u = new URL(dest, location.origin);
  u.searchParams.set('back', here);

  // ★ 修正ポイント：u に飛ばす
  location.assign(u.toString());
}

/* ===== 初期化 ===== */
document.addEventListener('DOMContentLoaded', function(){
  try{
    var q = new URLSearchParams(location.search);
    if(q.get('admin')==='1'){
      var d=document.getElementById('dev_settings');
      if(d) d.style.display='block';
    }

    // ロゴ差し込み
    var brandHost = document.getElementById('brand');
    if(brandHost){ brandHost.innerHTML = LOGO_SVG; }

    // Hook/Thanks の初期化（localStorage→隠し既定→空ならそのまま）
    var hookEl   = document.getElementById('hook');
    var thanksEl = document.getElementById('thanks');
    var defHook  = document.getElementById('__hook_default');
    var defThanks= document.getElementById('__thanks_default');

    try{
      var saved = JSON.parse(localStorage.getItem('tamami_admin') || '{}');
      if(hookEl && !hookEl.value){ hookEl.value = saved.hook || (defHook ? defHook.value : ''); }
      if(thanksEl && !thanksEl.value){ thanksEl.value = saved.thanks || (defThanks ? defThanks.value : ''); }
      var tqEl = document.getElementById('thanks_query');
      if(tqEl && typeof saved.tq === 'boolean'){ tqEl.checked = saved.tq; }
    }catch(_){}

    // 変更を自動保存
    function saveAdmin(){
      var obj = {
        hook:   hookEl   ? hookEl.value.trim()   : '',
        thanks: thanksEl ? thanksEl.value.trim() : '',
        tq:     (document.getElementById('thanks_query') || {}).checked || false
      };
      localStorage.setItem('tamami_admin', JSON.stringify(obj));
    }
    [hookEl, thanksEl, document.getElementById('thanks_query')].forEach(function(el){
      if(!el) return;
      el.addEventListener('change', saveAdmin);
      el.addEventListener('input',  saveAdmin);
    });

    // 既存：設問UIなど
    QROOT  = document.getElementById('questions');
    B_SELF = document.getElementById('bars_self');
    S_SELF = document.getElementById('sum_self');
    if(!QROOT){ console.error('questions root not found'); return; }

    renderQuestions();
    attachHandlers();
    updatePreview();

    var sendBtn = document.getElementById('do_send');
    if (sendBtn){
      sendBtn.addEventListener('click', async function(){
        var msg=validate(); if(msg){ showToast(msg,true); return; }
        updatePreview();
        var pay=payload();
        var res=await sendAll(pay);
        var ok = res.some(function(r){ return r.status==='OK'; });
        showToast(ok?'送信しました。メールをご確認ください。':'送信エラー',!ok);
        if(ok) redirectAfter(pay);
      });
    }
  }catch(e){
    console.error('init failed', e);
  }
});