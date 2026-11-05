// [강해일] 3 문답 카드 선택 인터랙션
document.querySelectorAll("#answerList .answer-item").forEach(item => {
  item.addEventListener("click", () => {
    // 부모 안의 모든 답변 항목 초기화
    document.querySelectorAll("#answerList .answer-item").forEach(el => {
      el.classList.remove("bg-success-subtle", "border-success", "text-success", "fw-bold");
      el.querySelector("span:last-child").textContent = "○";
    });
    
    // 클릭한 항목만 활성화 스타일 적용
    item.classList.add("bg-success-subtle", "border-success", "text-success", "fw-bold");
    item.querySelector("span:last-child").textContent = "✓";
  });
});




// [섹션4. 차명진] 고민 5개별 루틴 내용 (Day13 배열 + 객체)
//  id는 HTML 버튼 id="btn-○○"의 ○○ 부분과 똑같아야 해요. 예) id: "money" → id="btn-money"
const routinePlans = [
  {
    id: "money",
    title: "티끌 모아 태산",
    desc: "돈 때문에 힘들다면 작은 소비 기록부터 시작해보자.",
    tasks: [
      { name: "오늘 쓴 돈 한 가지 기록하기", period: "매일" },
      { name: "이번 주 지출 돌아보기", period: "매주" },
      { name: "한 달에 1만 원 모으기", period: "매월" }
    ]
  },
  {
    id: "job",
    title: "나의 진로를 차근차근",
    desc: "조급해하지 말고 오늘 할 수 있는 준비부터 시작해보자.",
    tasks: [
      { name: "관심 분야 10분 공부하기", period: "매일" },
      { name: "채용 공고 하나 살펴보기", period: "매주" },
      { name: "이력서 한 곳 수정하기", period: "매월" }
    ]
  },
  {
    id: "love",
    title: "내 마음을 지키는 관계",
    desc: "남의 마음만큼 나의 마음도 소중하게 살펴보자.",
    tasks: [
      { name: "오늘의 감정 한 줄 적기", period: "매일" },
      { name: "편한 사람에게 안부 전하기", period: "매주" },
      { name: "내가 원하는 관계 돌아보기", period: "매월" }
    ]
  },
  {
    id: "future",
    title: "불안을 작은 계획으로",
    desc: "먼 미래보다 지금 할 수 있는 작은 일 하나를 찾아보자.",
    tasks: [
      { name: "오늘 할 일 한 가지 정하기", period: "매일" },
      { name: "필요한 정보 10분 알아보기", period: "매주" },
      { name: "이번 달 목표 돌아보기", period: "매월" }
    ]
  },
  {
    id: "rest",
    title: "나를 돌보는 회복 루틴",
    desc: "쉴 때는 쉬어도 괜찮아. 나를 돌보는 것도 중요한 일이야.",
    tasks: [
      { name: "10분 동안 편안히 쉬기", period: "매일" },
      { name: "나를 위한 시간 만들기", period: "매주" },
      { name: "나를 편안하게 해준 습관 기록", period: "매월" }
    ]
  }
];


// [2] 화면에서 바꿀 곳을 미리 찾아 두기 (Day15 getElementById)
const routineTitle = document.getElementById("planTitle");         // 카드 제목
const routineDesc = document.getElementById("planDescription");    // 카드 설명
const routineTasks = document.getElementById("planTasks");         // 할 일 3줄이 들어가는 상자


// [3] 카드 내용을 바꾸는 함수 (Day12 함수, Day15 createElement·appendChild)
function showRoutine(plan) {
  routineTitle.textContent = plan.title;   // 제목 바꾸기
  routineDesc.textContent = plan.desc;     // 설명 바꾸기
  routineTasks.textContent = "";           // 원래 있던 할 일 3줄 비우기 (Day20 다시 그리기)

  plan.tasks.forEach((task) => {           // 할 일을 한 줄씩 새로 만들어 넣기 (Day14 forEach)
    const row = document.createElement("div");
    row.classList.add("task");

    const name = document.createElement("span");
    name.textContent = task.name;          // 예) "관심 분야 10분 공부하기"

    const period = document.createElement("b");
    period.textContent = task.period;      // 예) "매일"

    row.appendChild(name);
    row.appendChild(period);
    routineTasks.appendChild(row);
  });
}


// [4] 누른 버튼만 초록색(active)으로 만드는 함수 (Day15 classList)
function selectRoutineButton(selectedButton) {
  routinePlans.forEach((plan) => {
    const button = document.getElementById(`btn-${plan.id}`);   // btn-money, btn-job ...
    button.classList.remove("active");                         // 5개 모두 초록색 빼기
  });
  selectedButton.classList.add("active");                      // 누른 버튼에만 초록색
}


// [5] 버튼 5개에 클릭 연결하기 (Day16 click 이벤트)
routinePlans.forEach((plan) => {
  const button = document.getElementById(`btn-${plan.id}`);
  button.addEventListener("click", () => {
    selectRoutineButton(button);   // 1) 버튼 색 바꾸기
    showRoutine(plan);             // 2) 카드 내용 바꾸기
  });
});
