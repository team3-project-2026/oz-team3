export const FRIENDS = [
  { id:'tteumi', name:'틈이', subject:'문틈으로 들어온 빛', role:'작은 시작을 함께', line:'지금 할 수 있는 만큼만 해볼까?', description:'나에게 중요한 조건을 작은 행동으로 연결해요. 무엇부터 할지 망설일 때 첫걸음을 안내해요.', color:'sunlight' },
  { id:'moru', name:'모루', subject:'느긋한 이끼 몽돌', role:'쉬어가도 괜찮게', line:'오늘 쉬어가도, 네 자리는 여기 있어.', description:'잠깐 멈추고 싶은 날을 함께해요. 쉬는 동안에도 쌓아둔 실천은 사라지지 않아요.', color:'stone' },
  { id:'neuru', name:'느루', subject:'방법을 모으는 달팽이', role:'나에게 맞는 방법을 기억', line:'이건 너에게 어땠는지, 하나만 남겨볼래?', description:'짧은 회고와 직접 담아둔 행동을 모아요. 좋았던 방법은 다음에 다시 꺼내볼 수 있어요.', color:'shell' },
  { id:'shwimi', name:'쉼이', subject:'잠깐 멈추는 쉼표', role:'부담을 한 칸 덜어', line:'조금 부담스럽다면, 더 작게 바꾸자.', description:'오늘 가능한 시간과 여유를 살펴요. 선택한 행동이 버거우면 완료 전에 더 작은 대안을 찾아요.', color:'pause' },
  { id:'ssagi', name:'싹이', subject:'두 잎을 틔운 씨앗', role:'작은 실천을 차곡차곡', line:'작은 한 번도, 네가 해낸 하루야.', description:'하루 한 번의 실천을 정원으로 남겨요. 연속 기록을 겨루지 않고, 내가 돌아온 날을 모아요.', color:'seed' },
];

export const CONDITIONS = {
  relation:{title:'마음을 나누는 관계',example:'소중한 사람에게 안부 한마디',scope:'가까운 사람과 작은 연결을 만들어봐요.'},
  money:{title:'생활의 여유',example:'오늘 쓴 돈 한 가지만 적기',scope:'일상의 소비를 가볍게 살펴봐요. 투자·재무 판단을 대신하지 않아요.'},
  rest:{title:'휴식과 이완',example:'화면에서 눈을 떼고 잠깐 쉬기',scope:'마음과 몸을 잠시 쉬게 해요. 치료나 상담을 제공하지 않아요.'},
  health:{title:'가벼운 움직임',example:'편한 범위에서 어깨 움직이기',scope:'내 몸에 무리 없는 행동을 골라요. 운동 처방은 하지 않아요.'},
  freedom:{title:'나만의 시간',example:'지금 하고 싶은 것 하나 적기',scope:'나를 위해 고르는 작은 시간을 만들어요.'},
  achievement:{title:'작은 성취와 배움',example:'책이나 공부 자료 한 쪽 읽기',scope:'끝낼 수 있는 작은 부분부터 해봐요.'},
  stability:{title:'일상의 안정',example:'눈앞의 물건 하나 제자리 놓기',scope:'일상을 차분히 정돈하는 행동을 찾아요.'},
};

export function characterImage(id,style='2d',className='',priority=false){
  const f=FRIENDS.find(x=>x.id===id)||FRIENDS[0];
  const variant=style==='3d'?'3d':'2d';
  return `<img class="character ${className}" src="./assets/characters/${f.id}-${variant}.webp" width="${variant==='3d'?768:512}" height="${variant==='3d'?768:512}" alt="" ${priority?'fetchpriority="high"':'loading="lazy"'} decoding="async">`;
}
