import { VALUES, ACTIONS, ACTION_LIBRARY, FEEDBACK_REASONS, actionKey, emptyStore, dateKey, recentDates, validateStore, setPlan, complete, recordRest, saveReflection, skipReflection, setConditions, completedDays, growth, recommendations, recommendationReason, recommendationPolicy, methodSummary, setMethodSaved, allowRecommendation, mergeStores } from './core.js';
import { FRIENDS, CONDITIONS, characterImage } from './characters.js';

const KEY = 'nadown-haru-v2';
const main = document.querySelector('#main');
const modal = document.querySelector('#modal');
let store = emptyStore(), corruptRaw = null, storageBlocked = false, unsaved = false;
let activeDay = dateKey(), toastTimer;
const ui = { tab: 'today', step: 1, value: null, time: 1, energy: 'gentle', intention: '', selected: null, offset: 0, feedback: null, feedbackReason:null, note: '', restResume: false, values: [], friendStyle:'2d' };
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const label = id => VALUES.find(v => v.id === id)?.label || '';
const purpose = id => ({ relation:'관계를',money:'돈을',rest:'휴식을',health:'건강을',freedom:'자유를',achievement:'성취를',stability:'안정을' }[id] || '나를');
const icon = id => `<img class="ui-icon" src="./assets/icons/${['heart','wallet','moon','sun','wind','flag','home','arrow-right','book-2'].includes(id)?id:'sun'}.svg" width="22" height="22" alt="" aria-hidden="true">`;
const longDate = key => new Date(`${key}T12:00:00`).toLocaleDateString('ko-KR', { month:'long',day:'numeric',weekday:'long' });
const shortDate = key => new Date(`${key}T12:00:00`).toLocaleDateString('ko-KR', { month:'numeric',day:'numeric' });

function notify(message) {
  clearTimeout(toastTimer); const node = document.querySelector('#toast');
  node.textContent = message; node.hidden = false;
  toastTimer = setTimeout(() => { node.hidden = true; }, 4200);
}
function alertStorage() {
  const node = document.querySelector('#storage-alert');
  node.hidden = !storageBlocked && !unsaved;
  node.textContent = storageBlocked
    ? '저장된 기록을 읽지 못했어요. 기존 기록은 그대로 두었습니다. 설정에서 원본을 보관한 뒤 초기화와 백업 가져오기를 진행해주세요.'
    : '이 브라우저에 기록을 저장하지 못했어요. 지금 기록은 화면에만 있어요. 설정에서 기록을 내려받아 보관해주세요.';
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { try { store = validateStore(JSON.parse(raw)); } catch { corruptRaw = raw; storageBlocked = true; } }
  } catch { unsaved = true; }
  alertStorage();
}
function commit(mutator) {
  if (storageBlocked) { notify('설정에서 기존 기록을 먼저 확인해주세요.'); return false; }
  let live = store;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      let latest;
      try { latest = validateStore(JSON.parse(raw)); } catch { storageBlocked = true; corruptRaw = raw; alertStorage(); notify('기존 기록을 보존하기 위해 저장을 멈췄어요.'); return false; }
      live = unsaved ? mergeStores(store, latest) : mergeStores(latest, store);
    }
  } catch { /* This session remains usable if storage is disabled. */ }
  try { store = validateStore(mutator(live)); } catch (e) { notify(e.message); return false; }
  try { localStorage.setItem(KEY, JSON.stringify(store)); unsaved = false; } catch { unsaved = true; }
  alertStorage(); return true;
}
function hydrateToday() {
  const r = store.days[activeDay];
  ui.value = r?.value || store.conditions?.primary || null; ui.values = [...(store.conditions?.values || (r?.value?[r.value]:[]))]; ui.time = r?.time || 1; ui.energy = r?.energy || 'gentle';
  ui.intention = r?.intention || ''; ui.feedback = r?.feedback || null; ui.note = r?.note || '';
  ui.feedbackReason=r?.feedbackReason||null;
  if(!r&&store.conditions)ui.step=2;
}
function plant(count, big = false) {
  const g = growth(count), leaf = count >= 3, flower = count >= 7;
  return `<div class="illustration ${big ? 'big' : ''}" role="img" aria-label="실천 ${count}일로 자란 ${g.name}"><svg viewBox="0 0 420 300" fill="none" aria-hidden="true">
    <ellipse cx="210" cy="255" rx="145" ry="14" fill="#dae3ca" opacity=".4"/>
    <circle cx="207" cy="145" r="115" fill="#edf1e2"/>
    <path d="M57 213c-4-11 0-19 5-25m-2 19-11-4m11-6 9-5M355 222c1-10 6-17 11-20m-9 14 10 2" stroke="#b5c5a2" stroke-width="2" stroke-linecap="round"/>
    <path d="m141 222 13 43c29 10 80 10 110 0l14-43" fill="#d8b69a"/><path d="m149 229 10 32c29 7 70 7 99 0l10-32" fill="#dec3ac"/>
    <ellipse cx="210" cy="222" rx="70" ry="17" fill="#c5a286"/><ellipse cx="210" cy="219" rx="62" ry="11" fill="#79654f"/><ellipse cx="211" cy="219" rx="49" ry="6" fill="#856e53"/>
    ${count === 0 ? '<path d="M198 216c-6-13 8-24 19-16 10 8 2 22-9 22-4 0-7-2-10-6Z" fill="#d4dcb2"/><path d="m204 215 7-11" stroke="#7d9259" stroke-width="2" stroke-linecap="round"/>' : `
      <path d="M210 219V137" stroke="#587840" stroke-width="5" stroke-linecap="round"/>
      <path d="M208 175c-37 2-61-20-65-47 34-1 62 13 65 47Z" fill="#89a662"/>
      <path d="M212 158c-1-34 25-57 55-58-1 29-21 56-55 58Z" fill="#6e914e"/>
      <path d="m151 137 57 38m5-18 45-47" stroke="#f2f1d9" stroke-width="1.6" opacity=".55"/>
      ${leaf ? '<path d="M211 195c27 3 49-8 58-28-30-8-52 3-58 28Z" fill="#75944f"/><path d="M209 139c-24-6-37-28-32-51 26 9 37 26 32 51Z" fill="#adc27f"/>' : ''}
      ${flower ? '<path d="M210 145V84" stroke="#587840" stroke-width="4" stroke-linecap="round"/><circle cx="210" cy="65" r="16" fill="#edc3a4"/><circle cx="227" cy="78" r="16" fill="#f1ceb0"/><circle cx="220" cy="98" r="16" fill="#edc3a4"/><circle cx="198" cy="98" r="16" fill="#f1ceb0"/><circle cx="191" cy="78" r="16" fill="#edc3a4"/><circle cx="210" cy="82" r="12" fill="#d1aa64"/>' : ''}
      ${count >= 14 ? '<path d="M175 221v-26m0 10c-16 0-22-8-25-17 17-4 24 2 25 17Zm0-5c1-14 9-22 22-22-1 14-8 21-22 22Z" fill="#91a76b" stroke="#7a9454" stroke-width="2"/>' : ''}`}
    <path d="M306 95v9m-4-5h8M102 152v8m-4-4h8" stroke="#b1be92" stroke-width="1.5" stroke-linecap="round"/>
  </svg></div>`;
}
function context() { return { value:ui.value, time:ui.time, energy:ui.energy, intention:ui.intention }; }
function steps(active) { return `<div class="stepper" aria-label="이용 순서"><span class="${active >= 1 ? 'active':''}">01 지금 필요한 것</span><span class="${active >= 2 ? 'active':''}">02 행동 하나</span><span class="${active >= 3 ? 'active':''}">03 실천과 느낌</span></div>`; }
function companion(id,message) {
  const f=FRIENDS.find(x=>x.id===id);
  return `<div class="companion-note">${characterImage(id,'2d')}<div><span class="micro-label">${f.name}의 한마디</span><p>${message}</p></div></div>`;
}
function intro() {
  const status=store.days[activeDay]?.status;
  const done=status==='done',planned=status==='planned'&&!ui.restResume,rest=status==='rest'&&!ui.restResume;
  const first=!status&&ui.step===1;
  const heading=done?'오늘의 작은 한 번,<br>내 안에 남았어요.':planned?'오늘의 틈은,<br>이만큼이면 충분해요.':rest?'잠시 쉬어가는 것도,<br>나를 위한 시간이니까.':first?'작은 실천으로,<br><em>자라는 나.</em>':'나에게 중요한 것에서,<br>오늘의 작은 행동으로.';
  const copy=done?'완료한 실천은 그대로 간직해요. 짧게 돌아보거나, 오늘은 여기까지 해도 좋아요.':planned?'더 작게 바꿔도 좋아요. 실제로 해본 뒤 실천을 남겨주세요.':rest?'지금까지 모인 실천은 그대로예요. 다시 시작하고 싶을 때 돌아오세요.':first?'나에게 중요한 것을 고르고,\n작은 행동 하나를 시작해요.':'고른 조건을 기억해뒀어요. 오늘은 어떤 작은 행동이 편할까요?';
  const friend=done?'ssagi':rest?'moru':'tteumi';
  const quote=done?'작은 한 번도, 네가 해낸 하루야.':rest?'오늘은 천천히, 네 속도로.':'지금 할 수 있는 만큼만 해볼까?';
  return `<section class="intro ${first?'intro-welcome':'intro-compact'}" aria-label="오늘의 안내"><div class="intro-text"><div class="eyebrow">${esc(longDate(activeDay))} <span class="today-status">${done?'실천 완료':planned?'행동을 골랐어요':rest?'쉬어가는 날':'나를 위한 작은 시간'}</span></div><h1>${heading}</h1><p class="intro-copy">${copy.replaceAll('\\n','<br>')}</p>${first?'<div class="hero-footnote"><span>하루 한 행동</span><span>회원가입 없이 가볍게</span></div>':''}</div><figure class="hero-character ${friend}"><div class="character-quote">${quote}</div>${characterImage(friend,'3d','',true)}<figcaption>${FRIENDS.find(x=>x.id===friend).name}와 함께 만드는 오늘의 틈</figcaption></figure></section>`;
}
function timeControls(){
  return `<details class="time-controls"><summary>오늘 가능한 시간과 여유 <span>${ui.time}분 · ${ui.energy==='gentle'?'가볍게':'조금 넉넉하게'}</span></summary><div class="choice-settings"><fieldset><legend>가능한 시간</legend><div class="options" role="group" aria-label="가능한 시간">${[1,5,10].map(n=>`<button class="option" type="button" data-time="${n}" aria-pressed="${ui.time===n}" aria-label="${n}분 이내">${n}분</button>`).join('')}</div></fieldset><fieldset><legend>오늘의 여유</legend><div class="options" role="group" aria-label="오늘의 여유"><button class="option" type="button" data-energy="gentle" aria-pressed="${ui.energy==='gentle'}">가볍게</button><button class="option" type="button" data-energy="roomy" aria-pressed="${ui.energy==='roomy'}">조금 넉넉하게</button></div></fieldset></div></details>`;
}
function wizard() {
  if(ui.step===1)return `<div class="choice-heading"><div><span class="section-kicker">01 · 행복의 조건</span><h2>지금, 나에게 중요한 것은?</h2><p class="subtext" id="condition-hint">여러 개 골라도 좋아요. 그중 오늘의 중심 하나를 정해요.</p></div>${characterImage('shwimi','2d','choice-friend')}</div>
    <div class="value-grid" role="group" aria-label="행복의 조건" aria-describedby="condition-hint">${VALUES.map(v=>`<button class="value-button" type="button" data-condition="${v.id}" aria-pressed="${ui.values.includes(v.id)}"><span class="value-icon">${icon(v.icon)}</span><span><strong>${CONDITIONS[v.id].title}</strong><small>${v.hint}</small></span><span class="selection-mark" aria-hidden="true">${ui.values.includes(v.id)?'✓':'+'}</span></button>`).join('')}</div>
    ${ui.values.length?`<div class="primary-condition"><span>오늘의 중심</span><div role="group" aria-label="주된 행복의 조건">${ui.values.map(id=>`<button type="button" class="condition-chip" data-primary="${id}" aria-pressed="${ui.value===id}">${label(id)}${ui.value===id?' ✓':''}</button>`).join('')}</div></div><p class="condition-example">${esc(CONDITIONS[ui.value].example)}처럼, 작은 행동으로 시작해요.</p>`:''}
    <details class="condition-guide"><summary>행복의 조건은 무엇인가요?</summary><p>오늘 나에게 필요한 것을 고르는 출발점이에요. 성격 검사나 평생 지킬 목표가 아니니 언제든 다시 고를 수 있어요.</p>${ui.value?`<p>${esc(CONDITIONS[ui.value].scope)}</p>`:''}</details>
    <div class="choice-actions"><span class="micro-label">조건은 이 브라우저에 기억해둘게요.</span><div class="choice-primary"><button class="primary full" type="button" data-act="suggest" ${!ui.value||storageBlocked?'disabled':''}>오늘의 작은 행동 만나기 ${icon('arrow-right')}</button></div></div>`;
  const options=recommendations(store,{...context(),today:activeDay,offset:ui.offset});
  if(!ui.selected)ui.selected=options[0]||null;
  const chosen=ui.selected;
  return `${steps(2)}<div class="row between"><button class="back-link" type="button" data-act="back">← 행복의 조건 다시 고르기</button><span class="condition-summary">오늘의 중심 · ${esc(label(ui.value))}</span></div><h2>오늘은 이만큼만 해볼까요?</h2><p class="subtext">${esc((CONDITIONS[ui.value]?.scope||'내가 할 수 있는 작은 행동부터 골라요.').split('. ')[0])}</p>
    ${chosen?`<article class="recommendation-feature"><span class="section-kicker">틈이가 건네는 작은 행동 · ${chosen.minutes}분</span><h3>${esc(chosen.title)}</h3><p>${esc(recommendationReason(store,chosen,{...context(),today:activeDay}))}</p><button class="secondary smaller-action" type="button" data-act="easier" ${chosen.minutes<=1?'disabled':''}>${chosen.minutes<=1?'가장 작은 1분 행동이에요':'조금 더 작게 해볼래요'}</button></article>`:'<p class="live-empty">지금 조건에 맞는 추천이 없어요. 다른 시간이나 조건으로 다시 골라보세요.</p>'}
    <div class="alternatives-heading"><h3>다른 행동도 괜찮아요</h3><button class="text-button" type="button" data-act="refresh">다른 순서로 보기</button></div><div class="actions-list">${options.map(a=>`<button type="button" class="action-option" data-action-id="${a.id}" aria-pressed="${chosen?.id===a.id}"><strong><span class="radio-dot" aria-hidden="true"></span>${a.title}</strong><span class="time-tag">${a.minutes}분</span></button>`).join('')}</div>
    ${timeControls()}
    <details><summary>내가 직접 행동을 정할래요</summary><div class="details-content"><label class="input-label" for="custom-action">${ui.time}분 안에 할 수 있는 작은 행동</label><input class="input" id="custom-action" maxlength="100" placeholder="예: 창밖을 보며 잠깐 쉬기"><button type="button" class="text-button" data-act="custom">이 행동 선택하기</button></div></details>
    <div class="plan-actions"><button type="button" class="primary full" data-act="plan" ${!chosen||storageBlocked?'disabled':''}>이 행동으로 오늘의 틈 만들기 ${icon('arrow-right')}</button><button type="button" class="quiet-button" data-act="rest-dialog">오늘은 쉬어갈래요</button><p class="note">완료하기 전에는 행동을 바꿀 수 있어요. 오늘의 행동은 하나만 남겨요.</p></div>`;
}
function landingStory(){
  return `<section class="how-it-works"><div><span class="section-kicker">매일, 이 정도의 틈이면</span><h2>잘 해내는 하루보다,<br>나를 알아가는 하루.</h2><p class="subtext">큰 목표 대신 지금 가능한 것 하나.<br>나에게 맞는 방법을 조금씩 찾아가요.</p></div><ol><li><span>01</span><div><h3>나에게 중요한 것 고르기</h3><p>여러 조건 중 오늘의 중심 하나를 골라요.</p></div></li><li><span>02</span><div><h3>작은 행동 하나 해보기</h3><p>부담스럽다면 더 작게. 편한 때에 실천해요.</p></div></li><li><span>03</span><div><h3>짧게 남기고, 차곡차곡 모으기</h3><p>느낌은 한 번만 남기거나 건너뛰어도 좋아요.</p></div></li></ol></section><section class="rest-promise">${characterImage('moru','3d')}<div><span class="section-kicker">모루가 전하는 마음</span><h2>쉬어간 날도, 나의 하루니까.</h2><p>하루를 건너뛰어도 쌓아둔 실천은 사라지지 않아요.<br>다시 돌아온 오늘부터, 내 속도로 이어가요.</p></div></section><section class="friends-invitation"><div><span class="section-kicker">당신의 작은 틈을 함께하는</span><h2>틈친구들을 만나보세요</h2></div><div class="friend-lineup">${FRIENDS.map(f=>`<div>${characterImage(f.id)}<span>${f.name}</span></div>`).join('')}</div><button type="button" class="text-button" data-tab="friends">다섯 친구의 이야기 보기 ↗</button></section>`;
}
function friends(){
  return `<section class="friends-page"><div class="page-heading"><span class="section-kicker">작은 행동 곁에, 다정한 동료</span><h1>우리의 틈친구들</h1><p class="subtext">시작이 망설여질 때도, 잠깐 쉬고 싶을 때도.<br>다섯 친구가 각자의 방식으로 오늘의 틈을 함께해요.</p></div><div class="friends-toolbar"><p>친구들의 두 가지 모습을 만나보세요.</p><div class="options" role="group" aria-label="캐릭터 이미지 스타일"><button type="button" class="option" data-friend-style="2d" aria-pressed="${ui.friendStyle==='2d'}">2D 일러스트</button><button type="button" class="option" data-friend-style="3d" aria-pressed="${ui.friendStyle==='3d'}">3D 피규어</button></div></div><div class="friends-list">${FRIENDS.map((f,i)=>`<article class="friend-profile ${f.color}"><figure>${characterImage(f.id,ui.friendStyle)}<figcaption>${f.subject}</figcaption></figure><div><span class="section-kicker">0${i+1} · ${f.role}</span><h2>${f.name}</h2><blockquote>“${f.line}”</blockquote><p>${f.description}</p></div></article>`).join('')}</div><div class="below-action"><button type="button" class="primary" data-tab="today">나의 오늘에 작은 틈 만들기 ${icon('arrow-right')}</button></div></section>`;
}
function reflectionMessage(r) {
  if(r.feedback==='good')return '좋았던 행동을 내 방법에 담아두고, 다음에 다시 골라봐요.';
  if(r.feedback!=='notfit')return '느낌을 남겼어요. 다음 선택을 돌아볼 때 함께 볼 수 있어요.';
  const policy=recommendationPolicy(store,r.action,r.value,activeDay);
  if(!policy.blocked)return '그때의 느낌은 남겨두고, 다시 추천받을 수 있게 했어요.';
  if(r.feedbackReason==='too_much')return r.action.minutes>1?'다음번엔 같은 방향의 1분 대안부터 찾아볼게요.':'1분도 부담스러웠군요. 다른 행동을 고르거나 쉬어가도 괜찮아요.';
  if(r.feedbackReason==='preference'||r.feedbackReason==='legacy')return '이 행동은 추천에서 빼둘게요. 내 방법에서 언제든 다시 허용할 수 있어요.';
  return `이 행동은 ${shortDate(policy.until)}까지 잠시 쉬고, 다른 행동을 먼저 보여드릴게요.`;
}
function nextDirection(r) {
  if(!r.feedback)return '';
  const choices=recommendations(store,{value:r.value,time:r.feedbackReason==='too_much'?1:r.time,energy:r.energy,today:activeDay});
  const next=choices.find(a=>actionKey(a,r.value)!==actionKey(r.action,r.value));
  if(!next)return `<div class="next-direction"><span class="micro-label">다음번에는</span><p>직접 행동을 정하거나, 잠시 쉬어가도 괜찮아요.</p></div>`;
  const key=actionKey(next,next.value),saved=!!store.preferences?.[key]?.saved;
  return `<div class="next-direction"><span class="micro-label">다음번에는 이렇게 해볼까요?</span><h3>${esc(next.title)} <span class="time-tag">${next.minutes}분</span></h3><p>${esc(recommendationReason(store,next,{value:r.value,time:r.feedbackReason==='too_much'?1:r.time,energy:r.energy,today:activeDay}))}</p><button type="button" class="text-button" data-save-method="${esc(key)}" aria-pressed="${saved}">${saved?'✓ 내 방법에 담았어요':'다음에 해볼 방법으로 담기'}</button><p class="note">오늘의 기록은 그대로예요. 다음 실천 때 골라볼 수 있어요.</p></div>`;
}
function reflectionPanel(r){
  if(r.reflectionState==='saved')return `<div class="reflection-saved">${companion('neuru','오늘 남긴 느낌을 잘 챙겨둘게요.')}<span class="section-kicker">오늘의 회고</span><h3>${feedbackLabel[r.feedback]||'기억하고 싶은 한 줄'}</h3>${r.note?`<p class="saved-note">${esc(r.note)}</p>`:''}<p class="success-line">${esc(reflectionMessage(r))}</p><p class="note">확정한 회고는 다시 바꾸지 않아요.</p></div>`;
  if(r.reflectionState==='skipped')return `<div class="reflection-saved">${companion('moru','오늘은 여기까지여도 충분해.')}<p class="subtext">회고는 건너뛰었어요. 오늘의 실천은 그대로 남아 있어요.</p></div>`;
  return `<div class="reflection">${companion('neuru','너에게 어땠는지, 하나만 남겨볼래?')}<h3>실천하고 나니 어땠나요?</h3><p class="subtext">한 번만 남길 수 있어요. 회고 없이 마쳐도 괜찮아요.</p><div class="options" role="group" aria-label="실천 후 느낌">${[['good','나에게 좋았어요'],['neutral','비슷해요'],['notfit','잘 안 맞아요']].map(([id,l])=>`<button type="button" class="option feedback-button" data-feedback="${id}" aria-pressed="${ui.feedback===id}">${l}</button>`).join('')}</div><fieldset class="reason-fieldset" ${ui.feedback==='notfit'?'':'hidden'}><legend>어떤 점이 안 맞았나요? <span class="micro-label">선택</span></legend><div class="reason-options">${FEEDBACK_REASONS.map(x=>`<button type="button" class="reason-button" data-feedback-reason="${x.id}" aria-pressed="${ui.feedbackReason===x.id}"><strong>${x.label}</strong><small>${x.detail}</small></button>`).join('')}</div></fieldset><label for="reflection-note" class="input-label">기억하고 싶은 한 줄 <span class="micro-label">선택</span></label><textarea id="reflection-note" maxlength="280" placeholder="예: 잠깐 멈추니 마음이 한결 가벼웠다">${esc(ui.note)}</textarea><div class="counter">280자 이내</div><button type="button" class="primary full" data-act="reflect">이 느낌으로 회고 남기기</button><div class="below-action"><button type="button" class="quiet-button" data-act="skip-reflection">회고 없이 오늘 마치기</button></div></div>`;
}
function todayPanel() {
  const r=store.days[activeDay];
  if(r?.status==='done')return `${steps(3)}<div class="status-label">✓ 오늘의 실천 완료</div><h2>오늘, 나를 위해 해낸 일</h2><h3 class="task-title">${esc(r.action.title)}</h3><p class="micro-label">${esc(label(r.value))} · ${r.action.minutes}분 · 하루 한 번의 실천</p>${reflectionPanel(r)}<div class="method-keep"><button type="button" class="secondary" data-save-method="${esc(actionKey(r.action,r.value))}" aria-pressed="${!!store.preferences?.[actionKey(r.action,r.value)]?.saved}">${store.preferences?.[actionKey(r.action,r.value)]?.saved?'✓ 내 방법에 담았어요':'이 행동을 내 방법에 담기'}</button><button type="button" class="text-button" data-tab="methods">내 방법 둘러보기</button></div>${nextDirection(r)}<div class="divider"></div><div class="row between"><button type="button" class="secondary" data-tab="garden">나의 정원 보기</button><button type="button" class="text-button" data-act="share">행동만 복사하기</button></div>`;
  if(r?.status==='rest'&&!ui.restResume)return `<div class="rest-state">${characterImage('moru','2d')}<span class="section-kicker">모루와 쉬어가는 오늘</span><h2>아무것도 증명하지 않아도 괜찮아요.</h2><p class="subtext">쉬어간 날로 남겼어요. 지금까지 자란 정원은 그대로예요.</p><button type="button" class="primary" data-act="resume">작은 행동을 골라볼래요</button><div class="below-action"><button type="button" class="text-button" data-tab="garden">정원 둘러보기</button></div></div>`;
  if(r?.status==='planned'&&ui.step!==2&&!ui.restResume)return `${steps(3)}<div class="status-label">오늘 내가 정한 행동</div><h2 class="task-title">${esc(r.action.title)}</h2><div class="task-context">${icon(VALUES.find(v=>v.id===r.value)?.icon)}${esc(purpose(r.value))} 위해 · ${r.action.minutes}분이면 돼요<p class="selected-reason">${esc(recommendationReason(store,r.action,{...r,today:activeDay}))}</p></div>${companion('shwimi',r.action.minutes>1?'지금은 어렵다면 더 작게 바꿔도 좋아.':'편한 때에, 네 속도로 해봐.')}<button type="button" class="primary full" data-act="complete">실천했어요 <span aria-hidden="true">✓</span></button><div class="below-action"><button class="text-button" type="button" data-act="change">${r.action.minutes>1?'행동을 바꾸거나 더 작게 하기':'다른 행동으로 바꾸기'}</button></div><div class="divider"></div><div class="row between"><span class="micro-label">실제로 해본 뒤 완료를 남겨주세요.</span><button type="button" class="quiet-button" data-act="rest-dialog">오늘은 쉬어갈래요</button></div>`;
  return wizard();
}
function week() {
  return `<div class="week-grid">${recentDates(activeDay).map(d=>{const status=store.days[d]?.status;return `<div class="week-day"><span>${esc(new Date(`${d}T12:00:00`).toLocaleDateString('ko-KR',{weekday:'short'}))}</span><span class="day-dot ${status==='done'?'done':status==='rest'?'rest':''} ${d===activeDay?'today':''}" aria-label="${esc(shortDate(d))} ${status==='done'?'실천 완료':status==='rest'?'쉬어간 날':status==='planned'?'행동을 정한 날':'기록 없음'}">${status==='done'?'✓':status==='rest'?'☾':status==='planned'?'·':'—'}</span><span>${esc(shortDate(d))}</span></div>`;}).join('')}</div>`;
}
function garden() {
  const dates = completedDays(store, activeDay), count = dates.length, g = growth(count), last = recentDates(activeDay);
  const done = last.filter(d=>store.days[d]?.status==='done').length;
  const reflected = last.filter(d=>store.days[d]?.status==='done' && store.days[d].feedback==='good').length;
  return `<section class="garden-page"><div class="page-heading"><div class="eyebrow">싹이와 모아가는 작은 실천</div><h1>작은 실천이 모인 정원</h1><p class="subtext">하루에 씨앗 하나. 쉬어가도, 다시 돌아와도 이어서 자라요.</p></div><div class="methods-shortcut"><span>실천에서 나에게 맞는 방법을 찾아요</span><button type="button" class="text-button" data-tab="methods">내 방법 보기 ↗</button></div><div class="garden-hero"><div class="garden-companion">${characterImage('ssagi','2d')}<span>싹이와 함께, ${count}번의 작은 시작</span></div>${plant(count,true)}<h2 class="garden-name">나의 ${g.name}</h2><span class="count-pill">지금까지 ${count}일 실천 · 씨앗 ${count}개</span><p class="subtext" style="margin-top:15px">${g.next?`씨앗 ${g.remaining}개가 더 모이면 다음 모습으로 자라요.`:'나만의 작은 정원이 되었어요. 앞으로의 한 걸음도 차곡차곡 남겨봐요.'}</p><div class="growth-track">${[[0,'씨앗'],[1,'새싹'],[3,'잎'],[7,'꽃'],[14,'작은 정원']].map(([n,l])=>`<div class="growth-step ${count>=n?'reached':''}">${l}<br>${n}개</div>`).join('')}</div></div><section class="panel week-panel"><div class="row between"><h3>최근 7일의 발자국</h3><span class="micro-label">연속일보다, 다시 시작한 날</span></div>${week()}<div class="small-grid"><div class="stat"><strong>${done}일</strong><p>작은 행동을 해본 날</p></div><div class="stat"><strong>${reflected}번</strong><p>나에게 좋았다고 남긴 실천</p></div></div><p class="note">완료한 실천일을 세어요. 행복이나 건강을 평가하는 점수는 아니에요.</p></section><div class="below-action"><button type="button" class="text-button" data-tab="today">오늘의 한 걸음으로 돌아가기</button></div></section>`;
}
const feedbackLabel = {good:'나에게 좋았어요',neutral:'비슷해요',notfit:'잘 안 맞아요'};
function findMethod(key) {
  const pref=store.preferences?.[key];
  if(pref)return {key,...pref,policy:recommendationPolicy(store,pref.action,pref.value,activeDay)};
  for(const r of Object.values(store.days))if(r.action&&actionKey(r.action,r.value)===key)return {key,action:r.action,value:r.value,saved:false,policy:recommendationPolicy(store,r.action,r.value,activeDay)};
  const action=ACTION_LIBRARY.find(a=>a.id===key);
  return action?{key,action,value:action.value,saved:false,policy:recommendationPolicy(store,action,action.value,activeDay)}:null;
}
function policyText(policy) {
  if(!policy.blocked)return '';
  if(policy.reason==='preference')return '취향에 맞지 않아 추천에서 제외 중';
  if(policy.reason==='legacy')return '이전에 안 맞았다고 남겨 추천에서 제외 중';
  if(policy.reason==='too_much')return `${shortDate(policy.until)}까지 쉬고 더 작은 대안을 먼저 찾아요`;
  return `${shortDate(policy.until)}까지 추천을 잠시 쉬어요`;
}
function methodCard(g) {
  const canStart=store.days[activeDay]?.status!=='done'&&!g.policy.blocked;
  const evidence=!g.feedbackCount?'아직 느낌을 남기지 않았어요':g.good?`느낌 ${g.feedbackCount}번 중 <strong>좋았어요 ${g.good}번</strong>`:g.notfit?`느낌 ${g.feedbackCount}번 중 안 맞았어요 ${g.notfit}번`:`남긴 느낌 ${g.feedbackCount}번은 비슷했어요`;
  return `<article class="method-card"><div class="row between"><span class="method-category">${esc(label(g.value))} <span>· ${g.action.minutes}분</span></span><button type="button" class="method-bookmark" data-save-method="${esc(g.key)}" aria-pressed="${g.saved}" aria-label="${esc(g.action.title)} ${g.saved?'내 방법에서 빼기':'내 방법에 담기'}">${g.saved?'담았어요 ✓':'+ 담기'}</button></div><h3>${esc(g.action.title)}</h3><p class="method-count">${g.total}번 실천 · ${evidence}</p>${g.policy.blocked?`<p class="method-policy">${esc(policyText(g.policy))}</p>`:''}<div class="row between method-actions"><button type="button" class="secondary" data-start-method="${esc(g.key)}" ${canStart?'':'disabled'}>${store.days[activeDay]?.status==='done'?'다음 실천 때 선택':'오늘 다시 해보기'}</button>${g.policy.blocked?`<button type="button" class="text-button" data-allow-method="${esc(g.key)}">다시 추천받기</button>`:''}</div></article>`;
}
function methods() {
  const groups=methodSummary(store,activeDay),recent=groups.filter(g=>g.total>0),saved=groups.filter(g=>g.saved),paused=groups.filter(g=>g.policy.blocked);
  const dates=recentDates(activeDay),done=dates.filter(d=>store.days[d]?.status==='done').length,good=dates.filter(d=>store.days[d]?.status==='done'&&store.days[d].feedback==='good').length;
  return `<section class="methods-page"><div class="page-heading methods-heading"><div><div class="eyebrow">느루가 모아둔 나의 방법</div><h1>나에게 맞는 방법을 찾아가요</h1><p class="subtext">직접 해본 행동과 남겨둔 느낌에서, 다시 써볼 방법을 골라요.</p></div><span class="period-label">최근 7일<br>${shortDate(dates[0])} — ${shortDate(activeDay)}</span></div>
    <div class="discovery-summary"><span class="discovery-friend">${characterImage('neuru','2d')}</span><div><p class="micro-label">나의 작은 발견</p><h2>${done?`${done}일 실천하고, ${good}번 좋았다고 남겼어요`:'첫 번째 작은 발견을 기다리고 있어요'}</h2><p>${done?'같은 행동도 날마다 다를 수 있어요. 횟수와 느낌을 함께 살펴봐요.':'오늘 가능한 행동 하나를 해보고, 나에게 어땠는지 남겨보세요.'}</p></div></div>
    <section class="methods-section"><div class="row between section-line"><h2>직접 해본 행동</h2><span class="micro-label">최근 7일 · ${recent.length}가지</span></div>${recent.length?`<div class="method-grid">${recent.map(methodCard).join('')}</div>`:'<div class="empty-state"><h3>내 생활에 맞는 작은 방법 하나부터</h3><p class="subtext">아직 실천 기록이 없어요.<br>해본 행동과 느낌이 여기에 차곡차곡 남아요.</p><button type="button" class="primary" data-tab="today">오늘의 행동 고르기</button></div>'}<p class="note">실제 기록만 정리해요. 느낌을 남기지 않은 날은 좋고 나쁨으로 판단하지 않아요.</p></section>
    <section class="methods-section"><div class="row between section-line"><h2>다음에도 꺼내 쓸 방법</h2><span class="micro-label">내가 담아둔 ${saved.length}가지</span></div>${saved.length?`<div class="saved-methods">${saved.map(g=>`<article class="saved-method"><div><span class="micro-label">${esc(label(g.value))} · ${g.action.minutes}분 · ${g.total?'최근 7일에 '+g.total+'번 실천':g.lastDate?'최근 7일 실천 없음':'아직 실천 전'}</span><h3>${esc(g.action.title)}</h3>${g.policy.blocked?`<p class="method-policy">${esc(policyText(g.policy))}</p>`:''}</div><div class="saved-actions"><button type="button" class="secondary" data-start-method="${esc(g.key)}" ${store.days[activeDay]?.status==='done'||g.policy.blocked?'disabled':''}>${store.days[activeDay]?.status==='done'?'다음 실천 때 선택':'오늘 해보기'}</button><button type="button" class="text-button" data-save-method="${esc(g.key)}" aria-label="${esc(g.action.title)} 내 방법에서 빼기">담기 취소</button></div></article>`).join('')}</div>`:'<p class="methods-hint">좋았던 행동이나 다음에 해볼 행동의 담기 버튼을 눌러보세요.</p>'}${store.days[activeDay]?.status==='done'?'<p class="note">오늘은 이미 실천을 마쳤어요. 담아둔 방법은 다음 실천 때 골라볼 수 있어요.</p>':''}</section>
    ${paused.length?`<details class="paused-methods"><summary>추천을 조정한 행동 ${paused.length}가지</summary><p class="subtext">이전 느낌은 남겨두고, 원하면 다시 추천받도록 바꿀 수 있어요.</p>${paused.map(g=>`<div class="paused-row"><div><strong>${esc(g.action.title)}</strong><p>${esc(policyText(g.policy))}</p></div><button type="button" class="secondary" data-allow-method="${esc(g.key)}">다시 추천받기</button></div>`).join('')}</details>`:''}
    <div class="methods-footer"><p>오늘 필요한 것은 바뀔 수 있어요.<br>이 기록으로 성격이나 평생의 가치를 정하지 않아요.</p><button type="button" class="text-button" data-tab="garden">실천으로 자란 정원 보기 ↗</button></div></section>`;
}
function history() {
  const rows = Object.entries(store.days).filter(([d])=>d<=activeDay).sort(([a],[b])=>b.localeCompare(a));
  return `<section class="history-page"><div class="page-heading"><div class="eyebrow">나를 알아가는 발자국</div><h1>나를 알아가는 기록</h1><p class="subtext">어떤 행동이 나에게 맞았는지, 남겨둔 마음을 천천히 살펴봐요.</p></div>${rows.length?`<div class="history-list">${rows.map(([d,r])=>`<article class="history-entry"><div class="row between"><time class="history-date" datetime="${d}">${esc(longDate(d))}</time><span class="record-status">${r.status==='done'?'실천 완료':r.status==='rest'?'쉬어간 날':'행동을 정한 날'}</span></div><h3>${esc(r.action?.title || '잠시 쉬어가기')}</h3><div class="row"><span class="micro-label">${esc(label(r.value))}${r.action?' · '+r.action.minutes+'분':''}</span>${r.feedback?`<span class="micro-label"> · ${feedbackLabel[r.feedback]}</span>`:''}</div>${r.intention?`<p class="history-note">바라는 하루 · ${esc(r.intention)}</p>`:''}${r.note?`<p class="history-note">${esc(r.note)}</p>`:''}</article>`).join('')}</div><div class="below-action"><button type="button" class="text-button" data-act="export">기록 파일 내려받기</button></div>`:`<div class="empty-state"><h2>첫 번째 기록을 기다리고 있어요</h2><p class="subtext">오늘 가능한 행동을 하나 골라보세요.<br>아주 작은 일도 괜찮아요.</p><button type="button" class="primary" data-tab="today">오늘의 행동 고르기</button></div>`}</section>`;
}
function render(focus = false) {
  document.querySelectorAll('.main-nav [data-tab]').forEach(b=>{ if(b.dataset.tab===ui.tab)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current'); });
  const r=store.days[activeDay];
  main.classList.toggle('daily-choice',ui.tab==='today'&&ui.step===1&&(!r||ui.restResume));
  main.classList.toggle('daily-flow',ui.tab==='today'&&!main.classList.contains('daily-choice'));
  main.innerHTML = ui.tab==='methods'?methods():ui.tab==='garden'?garden():ui.tab==='history'?history():ui.tab==='friends'?friends():`<div class="today-layout">${intro()}<section class="panel" id="today-panel" aria-label="오늘의 작은 실천">${todayPanel()}</section>${ui.step===1&&(!r||ui.restResume)?landingStory():''}</div>`;
  if(focus) main.focus({preventScroll:true});
}
function showDialog(title, body) {
  modal.innerHTML = `<div class="row between"><h2 id="dialog-title">${esc(title)}</h2><button type="button" class="dialog-close" data-act="close" aria-label="닫기">×</button></div>${body}`;
  if(!modal.open)modal.showModal();
}
function download(data, filename) {
  const blob = new Blob([typeof data==='string'?data:JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});
  const a = document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),30000);
}
function settings() {
  const controls = storageBlocked
    ? '<button type="button" class="secondary" data-act="export-corrupt">읽지 못한 원본 내려받기</button><p>원본을 먼저 보관해주세요. 기록을 초기화한 다음, 정상적인 백업 파일을 가져올 수 있어요.</p>'
    : '<button type="button" class="secondary" data-act="export">기록 파일 내려받기</button><button type="button" class="secondary" data-act="backup-text">기록을 텍스트로 보관하기</button><label class="secondary file-label">기록 파일 가져오기<input type="file" id="import-file" accept=".json,application/json" class="screen-reader-only"></label><button type="button" class="secondary" data-act="import-text">기록 텍스트 가져오기</button>';
  showDialog('나의 기록 보관', `<p style="margin-top:18px">기록은 지금 쓰는 브라우저에만 저장돼요. 다른 기기와 자동으로 연결되지 않으며, 브라우저 데이터를 지우면 사라질 수 있어요.</p><div class="settings-actions">${controls}</div><ul class="help-list"><li>감정과 메모는 다른 이용자나 기관에 공유되지 않아요.</li><li>기록을 가져오면 새 날짜와 내 방법 설정을 추가해요. 겹치는 날짜와 설정은 현재 기록을 유지해요.</li><li>미래 날짜의 기록은 날짜가 오기 전까지 정원과 통계에 반영하지 않아요.</li></ul><div class="divider"></div><button type="button" class="text-button danger" data-act="clear-dialog">이 브라우저의 기록 지우기</button>`);
}
function todayGuard() {
  const next=dateKey();
  if(next===activeDay)return false;
  activeDay=next;ui.step=1;ui.restResume=false;ui.selected=null;hydrateToday();render();notify('새로운 하루가 시작됐어요. 어제의 기록은 보관했어요.');return true;
}
document.addEventListener('input', e=>{
  if(e.target.id==='intention')ui.intention=e.target.value;
  if(e.target.id==='reflection-note')ui.note=e.target.value;
});
document.addEventListener('click', async e=>{
  const b=e.target.closest('button,[data-tab]');if(!b)return;
  if(b.dataset.tab){ui.tab=b.dataset.tab;render(true);window.scrollTo({top:0,behavior:'instant'});return;}
  if(b.id==='settings'||b.id==='storage-info'){settings();return;}
  if(b.dataset.saveMethod){
    if(todayGuard())return;
    const m=findMethod(b.dataset.saveMethod);if(!m)return;
    if(commit(s=>setMethodSaved(s,m.action,m.value,!s.preferences?.[m.key]?.saved))){render();notify(store.preferences[m.key].saved?'내 방법에 담았어요. 다음 실천 때 다시 꺼내볼 수 있어요.':'담기만 취소했어요. 실천 기록과 느낌은 그대로예요.');}return;
  }
  if(b.dataset.allowMethod){
    if(todayGuard())return;
    const m=findMethod(b.dataset.allowMethod);if(!m)return;
    if(commit(s=>allowRecommendation(s,m.action,m.value,activeDay))){render();notify('다시 추천받을 수 있게 했어요. 이전 느낌은 그대로 남아 있어요.');}return;
  }
  if(b.dataset.startMethod){
    if(todayGuard())return;
    const m=findMethod(b.dataset.startMethod);if(!m)return;
    if(store.days[activeDay]?.status==='done'){notify('오늘은 이미 실천을 마쳤어요. 담아두고 다음에 골라봐요.');return;}
    if(m.policy.blocked){notify('추천을 잠시 쉬고 있어요. 원하면 다시 추천받기로 바꿔주세요.');return;}
    ui.tab='today';ui.step=2;ui.restResume=true;ui.value=m.value;ui.time=[1,5,10].find(n=>n>=m.action.minutes);ui.energy=ACTION_LIBRARY.find(a=>a.id===m.action.id)?.energy===2?'roomy':'gentle';ui.selected=m.action;render(true);window.scrollTo({top:0,behavior:'instant'});notify('선택한 행동을 확인하고, 이 행동으로 정하기를 눌러주세요.');return;
  }
  if(b.dataset.condition){
    const id=b.dataset.condition;
    ui.values=ui.values.includes(id)?ui.values.filter(v=>v!==id):[...ui.values,id];
    if(!ui.values.includes(ui.value))ui.value=ui.values[0]||null;
    render();main.querySelector(`[data-condition="${id}"]`)?.focus({preventScroll:true});return;
  }
  if(b.dataset.primary){ui.value=b.dataset.primary;render();main.querySelector(`[data-primary="${ui.value}"]`)?.focus({preventScroll:true});return;}
  if(b.dataset.friendStyle){ui.friendStyle=b.dataset.friendStyle;render();main.querySelector(`[data-friend-style="${ui.friendStyle}"]`)?.focus({preventScroll:true});return;}
  if(b.dataset.time){ui.time=Number(b.dataset.time);ui.selected=null;render();main.querySelector(`[data-time="${ui.time}"]`)?.focus({preventScroll:true});return;}
  if(b.dataset.energy){ui.energy=b.dataset.energy;ui.selected=null;render();main.querySelector(`[data-energy="${ui.energy}"]`)?.focus({preventScroll:true});return;}
  if(b.dataset.actionId){ui.selected=ACTION_LIBRARY.find(a=>a.id===b.dataset.actionId);render();main.querySelector(`[data-action-id="${ui.selected.id}"]`)?.focus({preventScroll:true});return;}
  if(b.dataset.feedback){if(store.days[activeDay]?.reflectionState!=='pending')return;ui.feedback=b.dataset.feedback;if(ui.feedback!=='notfit')ui.feedbackReason=null;main.querySelectorAll('[data-feedback]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.feedback===ui.feedback)));const reasons=main.querySelector('.reason-fieldset');if(reasons)reasons.hidden=ui.feedback!=='notfit';main.querySelectorAll('[data-feedback-reason]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.feedbackReason===ui.feedbackReason)));return;}
  if(b.dataset.feedbackReason){ui.feedbackReason=b.dataset.feedbackReason;main.querySelectorAll('[data-feedback-reason]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.feedbackReason===ui.feedbackReason)));return;}
  const action=b.dataset.act;if(!action)return;
  if(['suggest','plan','complete','reflect','skip-reflection','rest','confirm-rest','easier'].includes(action)&&todayGuard())return;
  if(action==='suggest'){if(!ui.value||!ui.values.length)return;if(!commit(s=>setConditions(s,ui.values,ui.value)))return;ui.step=2;ui.selected=null;ui.offset=0;render();main.querySelector('#today-panel')?.scrollIntoView({block:'start',behavior:'instant'});}
  if(action==='back'){ui.step=1;ui.selected=null;ui.restResume=true;render();main.querySelector('#today-panel')?.scrollIntoView({block:'start',behavior:'instant'});}
  if(action==='refresh'){ui.offset++;ui.selected=null;render();notify('행동의 순서를 바꿨어요. 직접 행동을 정해도 좋아요.');}
  if(action==='custom'){
    const input=main.querySelector('#custom-action');const title=input.value.trim();
    if(!title){notify('해보고 싶은 작은 행동을 적어주세요.');input.focus();return;}
    ui.selected={id:`custom-${activeDay}`,title,minutes:ui.time};render();notify('직접 적은 행동을 선택했어요.');
  }
  if(action==='plan'){
    if(!ui.selected)return;
    if(commit(s=>setPlan(s,activeDay,{...context(),action:ui.selected}))){ui.step=1;ui.restResume=false;hydrateToday();render(true);notify(unsaved?'행동을 정했어요. 기록을 파일로 보관해주세요.':'오늘의 행동을 정했어요. 편한 때에 해보세요.');}
  }
  if(action==='change'){hydrateToday();ui.step=2;ui.selected=ACTION_LIBRARY.find(a=>a.id===store.days[activeDay]?.action?.id)||store.days[activeDay]?.action||null;ui.restResume=true;render();}
  if(action==='easier'){
    if(!ui.selected||ui.selected.minutes<=1)return;
    const tiny=ACTION_LIBRARY.find(a=>a.baseId===ui.selected.id&&!recommendationPolicy(store,a,ui.value,activeDay).blocked);
    ui.selected=tiny||recommendations(store,{value:ui.value,time:1,energy:'gentle',today:activeDay})[0]||null;
    ui.time=1;ui.energy='gentle';render();notify('같은 조건의 1분 행동으로 줄였어요.');
  }
  if(action==='complete'){
    if(commit(s=>complete(s,activeDay))){hydrateToday();render(true);notify(unsaved?'실천을 남겼어요. 기록을 파일로 보관해주세요.':'오늘 씨앗 1개가 쌓였어요.');}
  }
  if(action==='reflect'){
    if(!ui.feedback&&!ui.note.trim()){notify('느낌을 고르거나 한 줄을 남겨주세요. 회고 없이 마쳐도 좋아요.');return;}
    if(commit(s=>saveReflection(s,activeDay,ui.feedback,ui.note.trim(),ui.feedbackReason))){hydrateToday();render();notify(unsaved?'느낌을 남겼어요. 기록을 파일로 보관해주세요.':'느낌을 저장하고 다음 추천에 반영했어요.');}
  }
  if(action==='skip-reflection'){if(commit(s=>skipReflection(s,activeDay))){hydrateToday();render(true);notify('회고 없이 마쳤어요. 오늘의 실천은 그대로예요.');}}
  if(action==='rest'||action==='confirm-rest'){
    if(commit(s=>recordRest(s,activeDay,context()))){modal.close();ui.restResume=false;hydrateToday();render(true);notify('쉬어간 날로 남겼어요. 정원은 그대로예요.');}
  }
  if(action==='rest-dialog')showDialog('오늘은 쉬어갈까요?', '<p>정해둔 행동을 쉬어간 날로 바꿔요. 지금까지 모은 씨앗은 그대로예요.</p><button type="button" class="primary full" data-act="confirm-rest">쉬어간 날로 남기기</button>');
  if(action==='resume'){ui.restResume=true;ui.step=1;hydrateToday();render();}
  if(action==='share'){
    const r=store.days[activeDay];const text=`오늘 나를 위해 한 작은 행동\n${r.action.title}\n아주 작은 한 걸음도 괜찮아요.`;
    try{await navigator.clipboard.writeText(text);notify('행동만 복사했어요. 개인 메모는 포함하지 않았어요.');}catch{showDialog('오늘의 행동 나누기',`<p>아래 글을 선택해 복사해주세요. 개인 메모는 포함하지 않았어요.</p><textarea readonly aria-label="공유할 행동">${esc(text)}</textarea>`);}
  }
  if(action==='export'){download(store,`나다운틈_기록_${activeDay}.json`);notify('파일 저장을 요청했어요. 저장이 안 되면 설정에서 텍스트로 보관할 수 있어요.');}
  if(action==='backup-text')showDialog('기록을 텍스트로 보관하기',`<p>아래 내용을 복사해 개인 메모에 보관할 수 있어요. 느낌과 메모가 포함되니 안전한 곳에 보관해주세요.</p><label class="input-label" for="backup-data">기록 텍스트</label><textarea id="backup-data" readonly style="min-height:210px">${esc(JSON.stringify(store,null,2))}</textarea><div class="below-action"><button type="button" class="primary" data-act="copy-backup">기록 텍스트 복사하기</button></div>`);
  if(action==='copy-backup'){
    const field=modal.querySelector('#backup-data');
    try{await navigator.clipboard.writeText(field.value);notify('기록 텍스트를 복사했어요. 안전한 개인 메모에 보관해주세요.');}
    catch{field.focus();field.select();notify('기록 텍스트를 선택했어요. 직접 복사해 보관해주세요.');}
  }
  if(action==='import-text')showDialog('기록 텍스트 가져오기','<p>나다운 틈 또는 기존 나다운 하루에서 보관한 기록을 붙여넣어주세요. 새 날짜와 설정을 추가하고 현재 기록을 유지해요.</p><label class="input-label" for="import-data">보관한 기록 텍스트</label><textarea id="import-data" maxlength="2097152" style="min-height:180px" placeholder="보관한 기록 텍스트를 여기에 붙여넣기"></textarea><div class="below-action"><button type="button" class="primary" data-act="preview-text-import">기록 확인하기</button></div>');
  if(action==='preview-text-import'){
    try{previewImport(validateStore(JSON.parse(modal.querySelector('#import-data').value)));}catch{notify('기록 텍스트의 형식을 확인해주세요. 기존 기록은 그대로예요.');}
  }
  if(action==='export-corrupt')download(corruptRaw,`나다운틈_원본보관_${activeDay}.json`);
  if(action==='close')modal.close();
  if(action==='clear-dialog')showDialog('기록을 지우기 전에', '<p>이 브라우저의 모든 실천과 메모가 사라져요. 필요한 기록은 먼저 내려받아주세요.</p><label class="input-label" for="delete-confirm">계속하려면 삭제라고 적어주세요</label><input class="input" id="delete-confirm" autocomplete="off"><div class="divider"></div><button type="button" class="secondary danger" data-act="confirm-clear">기록 모두 지우기</button>');
  if(action==='confirm-clear'){
    if(modal.querySelector('#delete-confirm').value!=='삭제'){notify('확인란에 삭제라고 적어주세요.');return;}
    try{localStorage.removeItem(KEY);}catch{notify('브라우저 저장 공간에 접근할 수 없어요. 설정을 확인해주세요.');return;}
    store=emptyStore();storageBlocked=false;corruptRaw=null;unsaved=false;ui.tab='today';ui.step=1;ui.restResume=false;ui.selected=null;hydrateToday();alertStorage();modal.close();render(true);notify('이 브라우저의 기록을 지웠어요.');
  }
});
function previewImport(incoming) {
  const keys=Object.keys(incoming.days),added=keys.filter(d=>!store.days[d]).length;
  const prefs=Object.keys(incoming.preferences||{}),newPrefs=prefs.filter(k=>!store.preferences?.[k]).length;
  const newConditions=!store.conditions&&!!incoming.conditions;
  if(added===0&&newPrefs===0&&!newConditions){showDialog('기록 파일 확인',`<p>추가할 새 기록이 없어요. 겹치는 날짜와 내 방법, 행복의 조건은 현재 기록을 그대로 유지해요.</p><button type="button" class="primary full" data-act="close">확인</button>`);return;}
  showDialog('기록 파일 확인',`<p>새 날짜 ${added}개와 내 방법 설정 ${newPrefs}개를 추가할 수 있어요.${newConditions?' 저장해둔 행복의 조건도 가져와요.':''} 겹치는 날짜 ${keys.length-added}개와 기존 설정은 현재 기록을 유지해요.</p><button type="button" class="primary full" id="confirm-import">새 기록 가져오기</button>`);
  modal.querySelector('#confirm-import').addEventListener('click',()=>{
    if(commit(s=>mergeStores(s,incoming))){modal.close();hydrateToday();render(true);notify(unsaved?'기록을 불러왔어요. 파일로 보관해주세요.':'기록을 안전하게 합쳤어요.');}
  },{once:true});
}
document.addEventListener('change', async e=>{
  if(e.target.id!=='import-file')return;
  const file=e.target.files[0];if(!file)return;
  if(file.size>2*1024*1024){notify('2MB 이하의 기록 파일을 선택해주세요.');e.target.value='';return;}
  try{
    const incoming=validateStore(JSON.parse(await file.text()));
    previewImport(incoming);
  }catch(error){notify(error.message==='Unexpected end of JSON input'?'기록 파일을 끝까지 읽지 못했어요.': '기록 파일의 형식이 올바르지 않아요. 기존 기록은 그대로예요.');}
});
document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();ui.tab='today';render(true);});
window.addEventListener('focus',todayGuard);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')todayGuard();});
window.addEventListener('storage',e=>{
  if(e.key!==KEY||storageBlocked||unsaved)return;
  try{store=e.newValue?validateStore(JSON.parse(e.newValue)):emptyStore();hydrateToday();ui.step=store.conditions&&!store.days[activeDay]?2:1;ui.selected=null;ui.restResume=false;render();notify('다른 탭에서 바뀐 기록을 불러왔어요.');}catch{storageBlocked=true;corruptRaw=e.newValue;alertStorage();}
});
setInterval(todayGuard,30000);
load();hydrateToday();render();
