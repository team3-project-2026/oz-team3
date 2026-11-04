import test from 'node:test';
import assert from 'node:assert/strict';
import { VALUES, ACTIONS, SMALL_ACTIONS, actionKey, emptyStore, dateKey, recentDates, validDate, validateStore, setPlan, complete, undo, recordRest, saveReflection, skipReflection, setConditions, completedDays, growth, recommendations, recommendationPolicy, recommendationReason, methodSummary, setMethodSaved, allowRecommendation, mergeStores } from '../dist/core.js';
const key='2026-11-03';
const plan=(value='rest',time=5)=>({value,time,energy:'gentle',intention:'내 속도로',action:ACTIONS.find(a=>a.value===value&&a.minutes<=time)});
test('browser local date follows the local calendar around UTC midnight',()=>{
  const old=process.env.TZ;process.env.TZ='Asia/Seoul';
  assert.equal(dateKey(new Date('2026-11-02T15:01:00Z')),'2026-11-03');
  process.env.TZ='America/Los_Angeles';assert.equal(dateKey(new Date('2026-11-03T01:00:00Z')),'2026-11-02');process.env.TZ=old;
});
test('calendar rolls across months and leap years',()=>{
  assert.deepEqual(recentDates('2026-03-01',3),['2026-02-27','2026-02-28','2026-03-01']);
  assert.equal(validDate('2026-02-30'),false);assert.equal(validDate('2028-02-29'),true);
});
test('all seven values have a gentle action within one minute',()=>{
  for(const v of VALUES){const rows=recommendations(emptyStore(),{value:v.id,time:1,energy:'gentle',today:key});assert.ok(rows.length);assert.ok(rows.every(a=>a.minutes<=1&&a.energy===1));}
});
test('planning never awards a bean and repeated completion awards only one day',()=>{
  const s=setPlan(emptyStore(),key,plan());assert.equal(completedDays(s,key).length,0);
  const done=complete(complete(s,key),key);assert.equal(completedDays(done,key).length,1);
  assert.throws(()=>setPlan(done,key,plan('health')));
});
test('completed actions stay fixed and rest days preserve previous growth',()=>{
  let s=complete(setPlan(emptyStore(),'2026-11-01',plan()),'2026-11-01');
  s=complete(setPlan(s,key,plan()),key);
  assert.throws(()=>undo(s,key));assert.throws(()=>recordRest(s,key,{value:null,time:1,energy:'gentle',intention:''}));
  assert.equal(completedDays(s,key).length,2);
  s=recordRest(s,'2026-11-04',{value:null,time:1,energy:'gentle',intention:''});assert.equal(completedDays(s,'2026-11-04').length,2);
});
test('future imported completion never awards a reward before its date',()=>{
  const s=complete(setPlan(emptyStore(),'2027-01-01',plan()),'2027-01-01');assert.equal(completedDays(s,key).length,0);
});
test('not-fitting actions are excluded from subsequent suggestions',()=>{
  let s=complete(setPlan(emptyStore(),'2026-11-02',plan()),'2026-11-02');s=saveReflection(s,'2026-11-02','notfit','안 맞았어요');
  const banned=s.days['2026-11-02'].action.id;assert.ok(recommendations(s,{value:'rest',time:5,energy:'gentle',today:key}).every(a=>a.id!==banned));
  for(const date of recentDates('2026-10-30',10)){s=saveReflection(complete(setPlan(s,date,plan()),date),date,'good');}
  assert.ok(recommendations(s,{value:'rest',time:5,energy:'gentle',today:key}).every(a=>a.id!==banned));
});
test('imports reject broken schemas without mutating current records',()=>{
  const original=setPlan(emptyStore(),key,plan());
  assert.throws(()=>validateStore({version:2,days:{'2026-02-30':original.days[key]}}));
  assert.throws(()=>validateStore({version:2,days:{[key]:{...original.days[key],action:{id:'bad',title:'bad',minutes:500}}}}));
  assert.throws(()=>validateStore({version:1,days:{}}));assert.equal(Object.keys(original.days).length,1);
});
test('import merges new dates and preserves current record on conflict',()=>{
  const a=complete(setPlan(emptyStore(),key,plan('rest')),key);let b=setPlan(emptyStore(),key,plan('health'));b=setPlan(b,'2026-11-02',plan('stability'));
  const merged=mergeStores(a,b);assert.equal(merged.days[key].status,'done');assert.equal(merged.days[key].value,'rest');assert.equal(Object.keys(merged.days).length,2);
});
test('custom text remains plain data and lengths are limited',()=>{
  const s=setPlan(emptyStore(),key,{...plan(),action:{id:'custom',title:'<img src=x onerror=alert(1)>',minutes:1}});
  assert.equal(s.days[key].action.title,'<img src=x onerror=alert(1)>');
  const done=saveReflection(complete(s,key),key,'good','x'.repeat(400));assert.equal(done.days[key].note.length,280);
});
test('growth uses cumulative completed days instead of a streak',()=>{
  assert.equal(growth(0).name,'씨앗');assert.equal(growth(1).name,'새싹');assert.equal(growth(3).name,'잎');assert.equal(growth(7).name,'꽃');assert.equal(growth(14).name,'작은 정원');assert.equal(growth(4).remaining,3);
});
const catalog=id=>ACTIONS.find(a=>a.id===id);
const recorded=(s,date,id,feedback='good',reason=null)=>{
  const a=catalog(id)||SMALL_ACTIONS.find(a=>a.id===id);
  const done=complete(setPlan(s,date,{value:a.value,time:a.minutes,energy:'gentle',intention:'',action:a}),date);
  return feedback===null?done:saveReflection(done,date,feedback,'',reason);
};
test('existing version 2 records keep notes, growth and legacy exclusions',()=>{
  const legacy={version:2,days:{'2026-11-01':{...recorded(emptyStore(),'2026-11-01','rest-3').days['2026-11-01'],feedback:'notfit',note:'원래 메모'}}};
  delete legacy.days['2026-11-01'].feedbackReason;
  const restored=validateStore(legacy);assert.equal(restored.days['2026-11-01'].note,'원래 메모');assert.equal(restored.days['2026-11-01'].feedbackReason,'legacy');
  assert.equal(completedDays(restored,key).length,1);assert.ok(recommendationPolicy(restored,catalog('rest-3'),'rest','2026-12-01').blocked);
});
test('burden feedback leads to a curated one-minute version',()=>{
  const s=recorded(emptyStore(),'2026-11-02','rest-3','notfit','too_much');
  const choices=recommendations(s,{value:'rest',time:5,energy:'gentle',today:key});
  assert.equal(choices[0].id,'rest-3-tiny');assert.equal(choices[0].minutes,1);assert.ok(choices.every(a=>a.id!=='rest-3'));
  assert.match(recommendationReason(s,choices[0],{value:'rest',time:5,energy:'gentle',today:key}),/1분 버전/);
});
test('timing feedback pauses both durations then automatically allows them',()=>{
  const s=recorded(emptyStore(),'2026-11-02','rest-3','notfit','timing');
  assert.ok(recommendationPolicy(s,catalog('rest-3'),'rest','2026-11-05').blocked);
  assert.equal(recommendationPolicy(s,catalog('rest-3'),'rest','2026-11-06').blocked,false);
  assert.ok(recommendationPolicy(s,SMALL_ACTIONS.find(a=>a.id==='rest-3-tiny'),'rest',key).blocked);
});
test('preference exclusion is respected until explicit restoration',()=>{
  let s=recorded(emptyStore(),'2026-11-02','rest-3','notfit','preference');
  assert.ok(recommendationPolicy(s,catalog('rest-3'),'rest','2027-01-01').blocked);
  s=allowRecommendation(s,catalog('rest-3'),'rest',key);assert.equal(recommendationPolicy(s,catalog('rest-3'),'rest',key).blocked,false);
  assert.equal(s.days['2026-11-02'].feedback,'notfit');
});
test('feedback without a reason pauses temporarily, and a fresh dislike overrides restoration',()=>{
  let s=recorded(emptyStore(),'2026-11-02','rest-3','notfit');
  assert.ok(recommendationPolicy(s,catalog('rest-3'),'rest',key).blocked);
  assert.equal(recommendationPolicy(s,catalog('rest-3'),'rest','2026-11-06').blocked,false);
  s=allowRecommendation(s,catalog('rest-3'),'rest',key);s=recorded(s,key,'rest-3','notfit','preference');
  assert.ok(recommendationPolicy(s,catalog('rest-3'),'rest',key).blocked);
});
test('saved methods survive creating a plan, resting and reloading',()=>{
  let s=setMethodSaved(emptyStore(),catalog('rest-3'),'rest');
  s=setPlan(s,key,plan());s=recordRest(s,'2026-11-04',{value:null,time:1,energy:'gentle',intention:''});
  s=validateStore(JSON.parse(JSON.stringify(s)));assert.equal(s.preferences['rest-3'].saved,true);
  assert.equal(methodSummary(s,'2026-11-04').find(g=>g.key==='rest-3').total,0);
});
test('saved methods do not bypass time, energy or preference filters',()=>{
  let s=setMethodSaved(emptyStore(),catalog('rest-3'),'rest');
  assert.ok(recommendations(s,{value:'rest',time:1,energy:'gentle',today:key}).every(a=>a.minutes===1));
  s=recorded(s,'2026-11-02','rest-3','notfit','preference');
  assert.ok(recommendations(s,{value:'rest',time:10,energy:'roomy',today:key}).every(a=>a.id!=='rest-3'));
});
test('weekly summaries separate completions, responses and good responses',()=>{
  let s=recorded(emptyStore(),'2026-11-01','rest-3','good');s=recorded(s,'2026-11-02','rest-3','neutral');s=recorded(s,key,'rest-3',null);
  s=recorded(s,'2027-01-01','rest-3','good');
  const g=methodSummary(s,key).find(g=>g.key==='rest-3');assert.equal(g.total,3);assert.equal(g.feedbackCount,2);assert.equal(g.good,1);assert.equal(g.neutral,1);
  assert.match(recommendationReason(s,catalog('rest-3'),{value:'rest',time:5,energy:'gentle',today:key}),/1번/);
});
test('custom methods with reused IDs are not conflated',()=>{
  let s=emptyStore();
  for(const [date,title] of [['2026-11-01','나만의 행동 A'],['2026-11-02','나만의 행동 B']])s=complete(setPlan(s,date,{...plan(),action:{id:'custom',title,minutes:1}}),date);
  assert.equal(methodSummary(s,key).length,2);
  assert.notEqual(actionKey(s.days['2026-11-01'].action,'rest'),actionKey(s.days['2026-11-02'].action,'rest'));
});
test('import keeps local preferences and adds new saved methods safely',()=>{
  const current=setMethodSaved(emptyStore(),catalog('rest-3'),'rest',false);
  let incoming=setMethodSaved(emptyStore(),catalog('rest-3'),'rest',true);incoming=setMethodSaved(incoming,catalog('rest-4'),'rest',true);
  const s=mergeStores(current,incoming);assert.equal(s.preferences['rest-3'].saved,false);assert.equal(s.preferences['rest-4'].saved,true);
  assert.throws(()=>validateStore({...s,preferences:{bad:s.preferences['rest-3']}}));
});
test('completed days preserve saved methods and confirmed feedback restrictions',()=>{
  let s=recorded(emptyStore(),key,'rest-3','notfit','preference');s=setMethodSaved(s,catalog('rest-3'),'rest');
  assert.throws(()=>undo(s,key));assert.equal(s.preferences['rest-3'].saved,true);
  assert.equal(recommendationPolicy(s,catalog('rest-3'),'rest',key).blocked,true);assert.equal(s.days[key].feedbackReason,'preference');
});
test('every longer action can offer a valid gentle one-minute alternative after burden feedback',()=>{
  for(const original of ACTIONS.filter(a=>a.minutes>1)){
    const s=recorded(emptyStore(),'2026-11-02',original.id,'notfit','too_much');
    const choices=recommendations(s,{value:original.value,time:1,energy:'gentle',today:key});
    const tiny=choices.find(a=>a.baseId===original.id);
    assert.ok(tiny,original.id);assert.ok(typeof tiny.title==='string'&&tiny.title.trim().length>0);
    assert.equal(tiny.minutes,1);assert.equal(tiny.energy,1);
    assert.doesNotThrow(()=>setPlan(s,key,{value:original.value,time:1,energy:'gentle',intention:'',action:tiny}));
  }
});
test('restoring a saved tiny variant also clears an inherited exclusion without erasing history',()=>{
  const tiny=SMALL_ACTIONS.find(a=>a.id==='rest-3-tiny');
  let s=recorded(emptyStore(),'2026-11-02','rest-3','notfit','preference');
  s=setMethodSaved(s,tiny,'rest');assert.ok(recommendationPolicy(s,tiny,'rest',key).blocked);
  s=allowRecommendation(s,tiny,'rest',key);s=validateStore(JSON.parse(JSON.stringify(s)));
  assert.equal(recommendationPolicy(s,tiny,'rest',key).blocked,false);
  assert.ok(recommendations(s,{value:'rest',time:1,energy:'gentle',today:key}).some(a=>a.id===tiny.id));
  assert.equal(s.days['2026-11-02'].feedbackReason,'preference');
  assert.equal(s.preferences[tiny.id].saved,true);
});

test('multiple conditions and one primary survive reload and conflict-safe import',()=>{
  let s=setConditions(emptyStore(),['rest','health'],'rest');
  s=validateStore(JSON.parse(JSON.stringify(s)));assert.deepEqual(s.conditions,{values:['rest','health'],primary:'rest'});
  const incoming=setConditions(emptyStore(),['relation'],'relation');
  assert.deepEqual(mergeStores(s,incoming).conditions,s.conditions);
  assert.deepEqual(mergeStores(emptyStore(),incoming).conditions,incoming.conditions);
  assert.throws(()=>setConditions(s,['rest'],'health'));assert.throws(()=>setConditions(s,[],'rest'));
  assert.doesNotThrow(()=>validateStore({version:2,days:{}}));
});
test('first completion timestamp is preserved through duplicate completion and reflection',()=>{
  const s=complete(setPlan(emptyStore(),key,plan()),key);
  assert.ok(s.days[key].completedAt);assert.equal(complete(s,key).days[key].completedAt,s.days[key].completedAt);
  const reflected=saveReflection(s,key,'good','잠깐의 쉼');
  assert.equal(reflected.days[key].completedAt,s.days[key].completedAt);
  assert.equal(saveReflection(reflected,key,'notfit','changed').days[key].note,'잠깐의 쉼');
  assert.equal(skipReflection(reflected,key).days[key].reflectionState,'saved');
});
test('skipping reflection is final while preserving the completed action and timestamp',()=>{
  const s=complete(setPlan(emptyStore(),key,plan()),key),skip=skipReflection(s,key);
  const restored=validateStore(JSON.parse(JSON.stringify(skip)));
  assert.equal(restored.days[key].status,'done');assert.equal(restored.days[key].reflectionState,'skipped');
  assert.equal(restored.days[key].completedAt,s.days[key].completedAt);
  assert.equal(saveReflection(restored,key,'good','later').days[key].feedback,null);
});
test('legacy confirmed reflections stay readable and cannot be overwritten',()=>{
  const done=complete(setPlan(emptyStore(),key,plan()),key);
  const legacy=JSON.parse(JSON.stringify(done));delete legacy.days[key].reflectionState;delete legacy.days[key].completedAt;
  legacy.days[key].feedback='good';legacy.days[key].note='기존 메모';
  const loaded=validateStore(legacy);assert.equal(loaded.days[key].reflectionState,'saved');
  assert.equal(saveReflection(loaded,key,'neutral','새 메모').days[key].note,'기존 메모');
});
