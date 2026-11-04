export const VERSION = 2;
export const VALUES = [
  { id: 'relation', label: '관계', hint: '마음을 나누고 싶어요', icon: 'heart' },
  { id: 'money', label: '돈', hint: '돈 걱정을 조금 덜고 싶어요', icon: 'wallet' },
  { id: 'rest', label: '휴식', hint: '잠깐 쉬어가고 싶어요', icon: 'moon' },
  { id: 'health', label: '건강', hint: '몸을 가볍게 돌보고 싶어요', icon: 'sun' },
  { id: 'freedom', label: '자유', hint: '내가 고르는 시간이 필요해요', icon: 'wind' },
  { id: 'achievement', label: '성취', hint: '작은 일 하나를 끝내고 싶어요', icon: 'flag' },
  { id: 'stability', label: '안정', hint: '일상을 차분히 정돈하고 싶어요', icon: 'home' },
];

const tasks = {
  relation: [
    ['고마운 사람에게 안부 한 줄 보내기', 1], ['함께한 좋은 순간 하나 떠올리기', 1],
    ['소중한 사람의 이야기를 잠깐 듣기', 5], ['내 마음을 전할 짧은 메모 쓰기', 5],
    ['가까운 사람과 휴대폰 없이 이야기하기', 10, 2], ['함께하고 싶은 약속 하나 제안하기', 10, 2],
  ],
  money: [
    ['오늘 쓴 돈 한 가지만 적어보기', 1], ['사고 싶은 것을 바로 사지 않고 적어두기', 1],
    ['이번 주 결제 예정 한 건 확인하기', 5], ['사용하지 않는 구독 한 가지 찾아보기', 5],
    ['최근 지출을 보며 만족했던 소비 표시하기', 10, 2], ['다음 주에 쓸 돈의 항목만 적어보기', 10, 2],
  ],
  rest: [
    ['하던 일을 잠시 멈추고 편히 앉기', 1], ['화면에서 눈을 떼고 먼 곳 바라보기', 1],
    ['좋아하는 노래 한 곡 듣기', 5], ['할 일 없이 창밖을 바라보기', 5],
    ['휴대폰을 내려놓고 조용히 쉬기', 10], ['편안한 곳에서 여유롭게 차 한 잔 마시기', 10],
  ],
  health: [
    ['몸이 편한 자세로 어깨를 가볍게 움직이기', 1], ['잠깐 일어나 몸의 느낌 살펴보기', 1],
    ['무리 없는 속도로 잠깐 걷기', 5], ['오늘 편히 잘 시간을 정해두기', 5],
    ['가까운 곳을 천천히 산책하기', 10, 2], ['다음 끼니에 먹을 간단한 식사 준비하기', 10, 2],
  ],
  freedom: [
    ['지금 하고 싶은 것 하나 적기', 1], ['오늘 미뤄도 되는 일 하나 골라보기', 1],
    ['누가 시키지 않은 일을 하나 해보기', 5], ['내가 고른 음악이나 글을 즐기기', 5],
    ['일정 없는 나만의 시간 보내기', 10], ['가까운 곳에서 새로운 풍경 찾아보기', 10, 2],
  ],
  achievement: [
    ['미뤄둔 일을 시작할 첫 동작만 하기', 1], ['오늘 끝내고 싶은 일 하나 적기', 1],
    ['책이나 공부 자료 한 쪽 읽기', 5], ['끝낼 수 있는 작은 일 하나 처리하기', 5],
    ['진행 중인 일의 아주 작은 부분 마무리하기', 10, 2], ['배운 것을 내 말로 세 줄 정리하기', 10, 2],
  ],
  stability: [
    ['책상 위 물건 하나 제자리 놓기', 1], ['지금 신경 쓰이는 일 하나 적어두기', 1],
    ['내일 필요한 물건 한 가지 챙기기', 5], ['오늘 남은 일의 순서만 정해보기', 5],
    ['눈에 보이는 작은 공간 정돈하기', 10, 2], ['다음 하루의 일정과 쉴 시간 확인하기', 10, 2],
  ],
};
export const ACTIONS = Object.entries(tasks).flatMap(([value, rows]) => rows.map(([title, minutes, energy = 1], i) => ({ id: `${value}-${i + 1}`, value, title, minutes, energy })));
const tinyTitles = {
  relation: ['안부 한마디 물어보기', '전하고 싶은 마음 한 문장만 적기', '휴대폰을 내려두고 안부 한마디 나누기', '함께하고 싶은 시간 하나만 떠올리기'],
  money: ['가장 가까운 결제일 하나만 확인하기', '사용하지 않는 구독 하나만 떠올리기', '만족했던 소비 한 가지만 떠올리기', '다음 주에 쓸 돈 항목 하나만 적기'],
  rest: ['좋아하는 노래의 첫 부분만 잠깐 듣기', '창밖 한 곳을 1분 바라보기', '화면을 내려놓고 편히 1분 앉아있기', '마시던 음료를 천천히 한 모금 음미하기'],
  health: ['몸이 편한 범위에서 잠깐 천천히 움직이기', '오늘 잠자리에 들 시간만 정해보기', '무리 없는 곳에서 1분만 천천히 걷기', '다음 끼니에 먹을 것 하나만 정하기'],
  freedom: ['지금 내가 원하는 행동 하나만 골라보기', '내가 고른 음악이나 글을 1분 즐기기', '일정 없는 1분 가져보기', '주변에서 처음 눈에 띄는 풍경 하나 찾기'],
  achievement: ['책이나 공부 자료의 첫 문장만 읽기', '작은 일을 끝낼 첫 동작만 해보기', '진행 중인 일의 다음 한 줄만 정리하기', '배운 것을 한 문장만 적기'],
  stability: ['내일 쓸 물건 하나만 꺼내두기', '다음에 할 일 하나만 정하기', '눈에 보이는 물건 하나만 제자리 놓기', '내일 첫 일정 하나만 확인하기'],
};
export const SMALL_ACTIONS = ACTIONS.filter(a => a.minutes > 1).map(a => ({ id: `${a.id}-tiny`, baseId:a.id, value:a.value, title:tinyTitles[a.value][Number(a.id.split('-').at(-1)) - 3], minutes:1, energy:1 }));
export const ACTION_LIBRARY = [...ACTIONS, ...SMALL_ACTIONS];
const ACTION_BY_ID=new Map(ACTION_LIBRARY.map(a=>[a.id,a]));
export const FEEDBACK_REASONS = [
  { id:'too_much', label:'오늘은 부담스러웠어요', detail:'같은 필요를 위한 더 작은 행동부터' },
  { id:'timing', label:'시간·장소가 안 맞았어요', detail:'잠시 보류하고 다른 행동을 먼저' },
  { id:'preference', label:'이 행동이 취향에 안 맞아요', detail:'추천에서 빼두고 원하면 다시 허용' },
];
export const emptyStore = () => ({ version: VERSION, days: {}, preferences:{}, conditions:null });
export const dateKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export function validDate(key) {
  if (typeof key !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const [y, m, d] = key.split('-').map(Number);
  const check = new Date(y, m - 1, d, 12);
  return y >= 2000 && y <= 2199 && dateKey(check) === key;
}
export function recentDates(today = dateKey(), count = 7) {
  if (!validDate(today)) throw new Error('날짜를 확인해주세요.');
  const [y, m, d] = today.split('-').map(Number);
  return Array.from({ length: count }, (_, i) => dateKey(new Date(y, m - 1, d - count + i + 1, 12)));
}
const plain = x => x && typeof x === 'object' && !Array.isArray(x) && Object.getPrototypeOf(x) === Object.prototype;
const short = (v, n, fallback = '') => typeof v === 'string' ? v.slice(0, n) : fallback;
export function actionKey(action, value) {
  const known=ACTION_BY_ID.get(action.id);
  return known&&known.title===action.title&&known.minutes===action.minutes&&known.value===value ? known.id : `custom|${value}|${action.minutes}|${action.title.trim()}`;
}
function cleanAction(action, maxMinutes=10) {
  if(!plain(action)||typeof action.id!=='string'||!action.id||typeof action.title!=='string'||!action.title.trim()||action.title.length>100||!Number.isInteger(action.minutes)||action.minutes<1||action.minutes>maxMinutes)throw new Error('행동 기록을 확인해주세요.');
  return { id:action.id.slice(0,80), title:action.title.trim(), minutes:action.minutes };
}
export function validateStore(input) {
  if (!plain(input) || input.version !== VERSION || !plain(input.days)) throw new Error('나다운 틈 또는 기존 나다운 하루의 기록 파일인지 확인해주세요.');
  if (Object.keys(input.days).length > 10000) throw new Error('기록이 너무 많아요. 파일을 확인해주세요.');
  const result = emptyStore();
  for (const [key, r] of Object.entries(input.days)) {
    if (!validDate(key) || !plain(r) || !['planned', 'done', 'rest'].includes(r.status)) throw new Error('기록의 날짜나 상태가 올바르지 않아요.');
    if (r.value != null && !VALUES.some(v => v.id === r.value)) throw new Error('알 수 없는 가치가 들어 있어요.');
    if (!['gentle', 'roomy'].includes(r.energy) || ![1, 5, 10].includes(r.time)) throw new Error('기록의 시간 정보를 확인해주세요.');
    let action = null;
    if (r.status !== 'rest') {
      if(!r.value)throw new Error('행동 기록을 확인해주세요.');
      action = cleanAction(r.action,r.time);
    }
    if (r.feedback != null && !['good', 'neutral', 'notfit'].includes(r.feedback)) throw new Error('느낌 기록을 확인해주세요.');
    const reason=Object.hasOwn(r,'feedbackReason') ? r.feedbackReason : (r.feedback==='notfit'?'legacy':null);
    if(reason!=null&&!['too_much','timing','preference','legacy'].includes(reason))throw new Error('느낌의 이유를 확인해주세요.');
    const reflectionState=r.status==='done' ? (r.reflectionState || (r.feedback||r.note?'saved':'pending')) : null;
    if(reflectionState!=null&&!['pending','saved','skipped'].includes(reflectionState))throw new Error('회고 상태를 확인해주세요.');
    result.days[key] = {
      status: r.status, value: r.value || null, energy: r.energy, time: r.time, action,
      intention: short(r.intention, 80), note: short(r.note, 280), feedback: r.feedback || null,
      feedbackReason: r.feedback==='notfit' ? reason : null,
      reflectionState, completedAt:r.status==='done'?short(r.completedAt,40):'',
      updatedAt: short(r.updatedAt, 40),
    };
  }
  if(input.preferences!=null){
    if(!plain(input.preferences)||Object.keys(input.preferences).length>10000)throw new Error('내 방법의 기록을 확인해주세요.');
    for(const [key,pref] of Object.entries(input.preferences)){
      if(!plain(pref)||!VALUES.some(v=>v.id===pref.value)||typeof pref.saved!=='boolean')throw new Error('내 방법의 기록을 확인해주세요.');
      const action=cleanAction(pref.action);
      if(key!==actionKey(action,pref.value))throw new Error('내 방법의 행동을 확인해주세요.');
      if(!Array.isArray(pref.allowDates)||pref.allowDates.length>10000||!pref.allowDates.every(validDate))throw new Error('추천 설정을 확인해주세요.');
      result.preferences[key]={action,value:pref.value,saved:pref.saved,allowDates:[...new Set(pref.allowDates)]};
    }
  }
  if(input.conditions!=null){
    const c=input.conditions;
    if(!plain(c)||!Array.isArray(c.values)||!c.values.length||c.values.length>VALUES.length||!c.values.every(id=>VALUES.some(v=>v.id===id))||!c.values.includes(c.primary))throw new Error('행복의 조건을 확인해주세요.');
    result.conditions={values:[...new Set(c.values)],primary:c.primary};
  }
  return result;
}
export function setConditions(store,values,primary){
  return validateStore({...store,conditions:{values,primary}});
}
export function setPlan(store, key, plan) {
  if (!validDate(key)) throw new Error('날짜를 확인해주세요.');
  if (store.days[key]?.status === 'done') throw new Error('오늘 완료한 행동은 그대로 간직해요. 새 행동은 다음 날 골라주세요.');
  return validateStore({ ...store, days: { ...store.days, [key]: { ...plan, status: 'planned', feedback: null, feedbackReason:null, note: '', updatedAt: new Date().toISOString() } } });
}
export function complete(store, key) {
  const r = store.days[key];
  if (!r || r.status === 'rest') throw new Error('먼저 오늘의 행동을 골라주세요.');
  if (r.status === 'done') return store;
  const now=new Date().toISOString();
  return { ...store, days: { ...store.days, [key]: { ...r, status: 'done', completedAt:now, reflectionState:'pending', updatedAt:now } } };
}
export function undo(store, key) {
  const r = store.days[key];
  if (!r || r.status !== 'done') return store;
  throw new Error('완료한 실천은 다시 바꾸지 않아요. 내일 새 행동을 골라주세요.');
}
export function recordRest(store, key, context) {
  if (store.days[key]?.status === 'done') throw new Error('오늘은 실천을 마쳤어요. 완료 기록은 그대로 간직해요.');
  return validateStore({ ...store, days: { ...store.days, [key]: { ...context, status: 'rest', action: null, note: '', feedback: null, feedbackReason:null, updatedAt: new Date().toISOString() } } });
}
export function saveReflection(store, key, feedback, note = '', reason=null) {
  if (store.days[key]?.status !== 'done') throw new Error('실천한 뒤 느낌을 남길 수 있어요.');
  const current=store.days[key];
  if(current.reflectionState==='saved'||current.reflectionState==='skipped'||current.feedback||current.note)return store;
  if(!feedback&&!String(note).trim())throw new Error('느낌을 고르거나 한 줄을 남겨주세요.');
  const preferences={...store.preferences};
  const id=actionKey(store.days[key].action,store.days[key].value);
  if(feedback==='notfit'&&preferences[id])preferences[id]={...preferences[id],allowDates:preferences[id].allowDates.filter(d=>d!==key)};
  return validateStore({ ...store, preferences, days: { ...store.days, [key]: { ...store.days[key], feedback, feedbackReason:feedback==='notfit'?reason:null, note, reflectionState:'saved', updatedAt: new Date().toISOString() } } });
}
export function skipReflection(store,key){
  const r=store.days[key];
  if(r?.status!=='done')throw new Error('실천한 뒤 회고를 고를 수 있어요.');
  if(r.reflectionState==='saved'||r.reflectionState==='skipped'||r.feedback||r.note)return store;
  return validateStore({...store,days:{...store.days,[key]:{...r,reflectionState:'skipped',updatedAt:new Date().toISOString()}}});
}
export function completedDays(store, today = dateKey()) {
  return Object.entries(store.days).filter(([d, r]) => d <= today && r.status === 'done').map(([d]) => d).sort();
}
export function growth(count) {
  const stages = [ [0, '씨앗', 1], [1, '새싹', 3], [3, '잎', 7], [7, '꽃', 14], [14, '작은 정원', null] ];
  const [threshold, name, next] = stages.filter(s => count >= s[0]).at(-1);
  return { threshold, name, next, remaining: next == null ? 0 : next - count };
}
export const addDays=(key,count)=>{
  const [y,m,d]=key.split('-').map(Number);
  return dateKey(new Date(y,m-1,d+count,12));
};
function actionHistory(store,action,value,today) {
  const key=actionKey(action,value);
  return Object.entries(store.days).filter(([d,r])=>d<=today&&r.status==='done'&&r.action&&actionKey(r.action,r.value)===key).sort(([a],[b])=>a.localeCompare(b));
}
export function recommendationPolicy(store,action,value,today=dateKey()) {
  const key=actionKey(action,value),allowed=new Set(store.preferences?.[key]?.allowDates||[]);
  for(const [d,r] of actionHistory(store,action,value,today).reverse()){
    if(r.feedback!=='notfit'||allowed.has(d))continue;
    const reason=r.feedbackReason??null;
    if(reason==='preference'||reason==='legacy')return {blocked:true,reason,until:null};
    const until=addDays(d,3);
    if(today<=until)return {blocked:true,reason,until};
  }
  const variant=SMALL_ACTIONS.find(a=>a.id===action.id&&a.title===action.title&&a.minutes===action.minutes&&a.value===value);
  if(variant){
    const base=ACTIONS.find(a=>a.id===variant.baseId),parent=recommendationPolicy(store,base,value,today);
    if(parent.blocked&&parent.reason!=='too_much')return {...parent,parentKey:base.id};
  }
  return {blocked:false,reason:null,until:null};
}
export function setMethodSaved(store, action, value, saved=true) {
  const key=actionKey(action,value),pref=store.preferences?.[key];
  return validateStore({...store,preferences:{...store.preferences,[key]:{action,value,saved,allowDates:pref?.allowDates||[]}}});
}
export function allowRecommendation(store, action, value, today=dateKey()) {
  const key=actionKey(action,value),pref=store.preferences?.[key];
  const dates=actionHistory(store,action,value,today).filter(([,r])=>r.feedback==='notfit').map(([d])=>d);
  let next=validateStore({...store,preferences:{...store.preferences,[key]:{action,value,saved:pref?.saved||false,allowDates:[...new Set([...(pref?.allowDates||[]),...dates])]}}});
  const variant=SMALL_ACTIONS.find(a=>a.id===key);
  if(variant)next=allowRecommendation(next,ACTIONS.find(a=>a.id===variant.baseId),value,today);
  return next;
}
export function methodSummary(store, today=dateKey(), days=7) {
  const start=recentDates(today,days)[0],groups=new Map();
  for(const [d,r] of Object.entries(store.days)){
    if(d>today||r.status!=='done'||!r.action)continue;
    const key=actionKey(r.action,r.value);
    if(!groups.has(key))groups.set(key,{key,action:r.action,value:r.value,total:0,feedbackCount:0,good:0,neutral:0,notfit:0,lastDate:d});
    const g=groups.get(key);if(d>g.lastDate)g.lastDate=d;
    if(d>=start){g.total++;if(r.feedback){g.feedbackCount++;g[r.feedback==='good'?'good':r.feedback==='neutral'?'neutral':'notfit']++;}}
  }
  for(const [key,pref] of Object.entries(store.preferences||{})){
    if(pref.saved&&!groups.has(key))groups.set(key,{key,action:pref.action,value:pref.value,total:0,feedbackCount:0,good:0,neutral:0,notfit:0,lastDate:''});
  }
  return [...groups.values()].map(g=>({...g,saved:!!store.preferences?.[g.key]?.saved,policy:recommendationPolicy(store,g.action,g.value,today)})).filter(g=>g.total||g.saved||g.policy.blocked).sort((a,b)=>b.good-a.good||b.total-a.total||b.lastDate.localeCompare(a.lastDate));
}
export function recommendationReason(store,action,{value,time,energy,today=dateKey()}) {
  const good=actionHistory(store,action,value,today).filter(([,r])=>r.feedback==='good').length;
  if(good)return `이전에 ${good}번 좋았다고 남긴 행동이에요. 오늘은 ${action.minutes}분으로 해볼 수 있어요.`;
  const known=ACTION_LIBRARY.find(a=>a.id===action.id&&a.title===action.title&&a.minutes===action.minutes&&a.value===value);
  if(known?.baseId){
    const base=ACTIONS.find(a=>a.id===known.baseId);
    if(actionHistory(store,base,value,today).some(([,r])=>r.feedback==='notfit'&&r.feedbackReason==='too_much'))return `이전에 ‘${base.title}’가 부담스러웠다는 기록을 참고해 1분 버전으로 줄였어요.`;
  }
  if(store.preferences?.[actionKey(action,value)]?.saved)return `내 방법에 담아둔 행동이에요. ${action.minutes}분이면 해볼 수 있어요.`;
  const why={relation:'마음을 나눌 작은 틈을 만들어요.',money:'돈에 관해 한 가지만 확인해봐요.',rest:'잠시 멈추고 쉬어갈 틈을 만들어요.',health:'몸을 가볍게 돌보는 시간을 가져요.',freedom:'내가 고르는 시간을 만들어봐요.',achievement:'끝낼 수 있는 작은 부분부터 시작해요.',stability:'눈앞의 한 가지를 차분히 정리해요.'};
  return `${why[value]||'나를 위한 작은 행동이에요.'} ${action.minutes}분으로${energy==='gentle'?' 가볍게':''} 해볼 수 있어요.`;
}
export function recommendations(store, { value, time, energy, today = dateKey(), offset = 0 }) {
  const past = Object.entries(store.days).filter(([d, r]) => d <= today && r.status==='done' && r.action);
  const recent = new Set(recentDates(today, 8).slice(0, -1));
  const variants=SMALL_ACTIONS.filter(a=>store.preferences?.[a.id]?.saved||past.some(([,r])=>actionKey(r.action,r.value)===a.id||(actionKey(r.action,r.value)===a.baseId&&r.feedback==='notfit'&&r.feedbackReason==='too_much')));
  const candidates = [...ACTIONS,...variants].filter(a => a.value === value && a.minutes <= time && (energy === 'roomy' || a.energy === 1));
  const rated = candidates.map((a, index) => {
    let score = store.preferences?.[a.id]?.saved ? 4 : 0;
    const excluded = recommendationPolicy(store,a,value,today).blocked;
    for (const [d, r] of past) {
      if(a.baseId&&actionKey(r.action,r.value)===a.baseId&&r.feedback==='notfit'&&r.feedbackReason==='too_much'&&d>=addDays(today,-7))score+=30;
      if (actionKey(r.action,r.value) !== a.id) continue;
      if (r.feedback === 'good') score += 2;
      if (recent.has(d)) score -= 8;
    }
    return { a, score, index, excluded };
  });
  const acceptable = rated.filter(r => !r.excluded);
  const pool = acceptable.length ? acceptable : [];
  const salt = [...today].reduce((sum, c) => sum + c.charCodeAt(0), 0) + offset;
  return pool.sort((a, b) => b.score - a.score || ((a.index + salt) % candidates.length) - ((b.index + salt) % candidates.length)).slice(0, 3).map(r => r.a);
}
export function mergeStores(current, incoming) {
  const a = validateStore(current), b = validateStore(incoming);
  return { version: VERSION, days: { ...b.days, ...a.days }, preferences:{...b.preferences,...a.preferences}, conditions:a.conditions||b.conditions };
}
