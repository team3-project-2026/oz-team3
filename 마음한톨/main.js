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




// [섹션4. 차명진] 고민 5개별 루틴 내용
//  money, job 키는 HTML 버튼의 data-plan 값과 똑같이 진행하고, tasks는 [할 일, 주기] 묶음 3개임
const plans = {
  money: {
    title: "티끌 모아 태산",
    desc: "돈 때문에 힘들다면 작은 소비 기록부터 시작해보자.",
    tasks: [["📝 오늘 쓴 돈 한 가지 기록하기", "매일"], ["📒 이번 주 지출 돌아보기", "매주"], ["💰 한 달에 1만 원 모으기", "매월"]]
  },
  job: {
    title: "나의 진로를 차근차근",
    desc: "조급해하지 말고 오늘 할 수 있는 준비부터 시작해보자.",
    tasks: [["📚 관심 분야 10분 공부하기", "매일"], ["🔎 채용 공고 하나 살펴보기", "매주"], ["📄 이력서 한 곳 수정하기", "매월"]]
  },
  love: {
    title: "내 마음을 지키는 관계",
    desc: "남의 마음만큼 나의 마음도 소중하게 살펴보자.",
    tasks: [["✏️ 오늘의 감정 한 줄 적기", "매일"], ["💌 편한 사람에게 안부 전하기", "매주"], ["💗 내가 원하는 관계 돌아보기", "매월"]]
  },
  future: {
    title: "불안을 작은 계획으로",
    desc: "먼 미래보다 지금 할 수 있는 작은 일 하나를 찾아보자.",
    tasks: [["🌱 오늘 할 일 한 가지 정하기", "매일"], ["🗂️ 필요한 정보 10분 알아보기", "매주"], ["⭐ 이번 달 목표 돌아보기", "매월"]]
  },
  rest: {
    title: "나를 돌보는 회복 루틴",
    desc: "쉴 때는 쉬어도 괜찮아. 나를 돌보는 것도 중요한 일이야.",
    tasks: [["☕ 10분 동안 편안히 쉬기", "매일"], ["🌿 나를 위한 시간 만들기", "매주"], ["🧸 나를 편안하게 해준 습관 기록", "매월"]]
  }
};


// [2] 화면에서 쓸 요소를 미리 찾아 두기 (HTML의 id·data-plan으로 찾아요)
const planButtons = document.querySelectorAll("[data-plan]");   // 왼쪽 버튼 5개
const planTitle = document.getElementById("planTitle");         // 카드 제목
const planDescription = document.getElementById("planDescription"); // 카드 설명
const planTasks = document.getElementById("planTasks");         // 할 일 3줄이 들어가는 상자


// [3] 카드 내용을 바꾸는 함수
function showPlan(planKey) {
  const plan = plans[planKey];               // 예) "job" → plans.job

  planTitle.textContent = plan.title;        // 제목 바꾸기
  planDescription.textContent = plan.desc;   // 설명 바꾸기

  planTasks.replaceChildren();               // 기존 할 일 3줄 지우기
  plan.tasks.forEach(([name, period]) => {   // 새 할 일을 한 줄씩 만들어 넣기
    const row = document.createElement("div");
    row.className = "task";

    const text = document.createElement("span");
    text.textContent = name;                 // 예) "📚 관심 분야 10분 공부하기"

    const badge = document.createElement("b");
    badge.textContent = period;              // 예) "매일"

    row.append(text, badge);
    planTasks.appendChild(row);
  });
}