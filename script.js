/* 나다운 하루 — HTML, CSS, JavaScript만으로 만드는 작은 실천 기록 */
(() => {
  "use strict";

  const STORAGE_KEY = "nadown-haru-v1";
  const VALUES = {
    relationship: "관계", money: "돈", rest: "휴식", health: "건강",
    freedom: "자유", achievement: "성취", stability: "안정"
  };
  const MOODS = { calm: "마음이 여유로운 하루", light: "몸이 가벼운 하루", connected: "사람과 연결된 하루" };
  const VALUE_PHRASES = {
    relationship: "관계를", money: "돈을", rest: "휴식을", health: "건강을",
    freedom: "자유를", achievement: "성취를", stability: "안정을"
  };

  // 같은 행복을 골라도 원하는 하루의 모습에 따라 다른 행동을 제안해요.
  // [행동 이름, 설명, 그림 종류] 순서입니다. 여기에 새 행동을 추가해 보세요.
  const ACTIONS = {
    relationship: {
      calm: [
        ["고마운 마음 한 줄 적기", "떠오르는 사람에게 전하고 싶은 고마움을 적어 보세요.", "rest"],
        ["좋았던 대화 떠올리기", "마음이 따뜻해졌던 대화 한 장면을 기록해 보세요.", "rest"]
      ],
      light: [
        ["함께 걸을 약속 잡기", "가까운 사람에게 짧은 산책을 제안해 보세요.", "walk"],
        ["이웃에게 먼저 인사하기", "오늘 마주친 사람에게 밝은 인사를 건네 보세요.", "connect"]
      ],
      connected: [
        ["안부 메시지 보내기", "생각나는 사람에게 오늘 하루는 어떤지 물어보세요.", "connect"],
        ["진심 어린 칭찬 건네기", "가까운 사람의 좋은 점 하나를 말로 전해 보세요.", "connect"]
      ]
    },
    money: {
      calm: [
        ["오늘 쓴 돈 돌아보기", "지출 한 가지를 적고 나에게 필요했던 소비인지 살펴보세요.", "rest"],
        ["사고 싶은 것 잠시 적어두기", "바로 사기 전에 목록에 적고 하루의 여유를 주세요.", "rest"]
      ],
      light: [
        ["텀블러 챙겨 나가기", "집에서 마실 물을 준비하고 가볍게 밖으로 나가 보세요.", "walk"],
        ["장보기 목록 3개 적기", "지금 꼭 필요한 물건만 적어 가벼운 장보기를 준비해요.", "move"]
      ],
      connected: [
        ["돈 안 드는 약속 제안하기", "친구에게 공원 산책처럼 편안한 만남을 제안해 보세요.", "connect"],
        ["함께 쓸 물건 나눠보기", "새로 사기 전에 주변 사람과 빌리거나 나눌 수 있는지 살펴보세요.", "connect"]
      ]
    },
    rest: {
      calm: [
        ["10분 산책하기", "잠깐 바깥을 걸으며 나만의 시간을 가져요.", "walk"],
        ["따뜻한 차 한 잔 마시기", "화면을 잠시 내려놓고 차의 온기와 향에 집중해 보세요.", "rest"],
        ["3분 동안 천천히 숨 쉬기", "편안히 앉아 나의 속도로 숨을 들이쉬고 내쉬어 보세요.", "rest"]
      ],
      light: [
        ["5분 가볍게 스트레칭하기", "어깨와 등을 천천히 펴며 굳어 있던 몸을 깨워요.", "move"],
        ["햇살 보며 잠깐 걷기", "편안한 속도로 걸으며 바깥 공기를 느껴 보세요.", "walk"]
      ],
      connected: [
        ["편한 사람에게 안부 묻기", "잘 지내는지 짧게 물으며 편안한 마음을 나눠 보세요.", "connect"],
        ["함께 쉬는 시간 제안하기", "가까운 사람과 차 한 잔 마실 여유를 만들어 보세요.", "connect"]
      ]
    },
    health: {
      calm: [
        ["물 한 잔 천천히 마시기", "잠깐 쉬어 가며 몸에 필요한 물을 챙겨 주세요.", "rest"],
        ["잠들기 전 화면 내려놓기", "오늘은 잠들기 10분 전에 휴대폰을 쉬게 해 주세요.", "rest"]
      ],
      light: [
        ["10분 가볍게 걷기", "무리하지 않는 속도로 몸을 움직여 보세요.", "walk"],
        ["어깨와 목 천천히 풀기", "불편하지 않은 범위에서 가볍게 몸을 늘려 주세요.", "move"]
      ],
      connected: [
        ["함께 산책할 사람 찾기", "가까운 사람에게 짧은 산책을 제안해 보세요.", "connect"],
        ["건강한 한 끼 함께하기", "소중한 사람과 천천히 식사할 시간을 만들어 보세요.", "connect"]
      ]
    },
    freedom: {
      calm: [
        ["내가 좋아하는 노래 듣기", "다른 일을 잠깐 멈추고 좋아하는 노래 한 곡을 즐겨요.", "rest"],
        ["하고 싶은 일 하나 적기", "누구의 기대보다 지금 내가 원하는 것을 떠올려 보세요.", "rest"]
      ],
      light: [
        ["새로운 길로 걸어보기", "익숙한 동네에서 안전한 새로운 길을 골라 보세요.", "walk"],
        ["좋아하는 음악에 몸 움직이기", "정해진 방법 없이 한 곡 동안 자유롭게 움직여요.", "move"]
      ],
      connected: [
        ["내 취향 하나 나누기", "좋아하는 노래나 책 한 가지를 친구에게 소개해 보세요.", "connect"],
        ["하고 싶은 일 이야기하기", "가까운 사람에게 요즘 해 보고 싶은 일을 들려주세요.", "connect"]
      ]
    },
    achievement: {
      calm: [
        ["작은 할 일 하나 끝내기", "5분 안에 할 수 있는 일을 골라 차근차근 마무리해요.", "rest"],
        ["오늘 해낸 일 하나 적기", "아무리 작아도 괜찮아요. 나의 노력을 한 줄로 남겨요.", "rest"]
      ],
      light: [
        ["책상 위 5분 정리하기", "눈앞의 물건 몇 개만 제자리에 두어 보세요.", "move"],
        ["미뤘던 일 첫 단계 시작하기", "완성보다 시작에 집중해서 딱 5분만 움직여요.", "move"]
      ],
      connected: [
        ["작은 목표 함께 나누기", "오늘 해 보고 싶은 일 하나를 믿는 사람에게 말해 보세요.", "connect"],
        ["서로의 작은 성취 응원하기", "친구의 오늘을 듣고 함께 해낸 일을 찾아보세요.", "connect"]
      ]
    },
    stability: {
      calm: [
        ["내일 할 일 한 가지 적기", "내일을 위한 작은 계획 하나로 마음의 여유를 만들어요.", "rest"],
        ["익숙한 편안함 찾아보기", "나를 편안하게 하는 장소나 물건을 잠시 곁에 두세요.", "rest"]
      ],
      light: [
        ["가방 속 물건 정리하기", "자주 쓰는 물건을 정리하며 내일을 가볍게 준비해요.", "move"],
        ["익숙한 길 천천히 걷기", "편안한 길을 걸으며 나만의 일정한 리듬을 느껴요.", "walk"]
      ],
      connected: [
        ["믿는 사람과 마음 나누기", "오늘의 마음을 한 문장으로 편하게 전해 보세요.", "connect"],
        ["소중한 사람에게 안부 전하기", "짧은 인사로 서로의 일상에 따뜻함을 더해요.", "connect"]
      ]
    }
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  let storageAvailable = true;
  let storageWarning = "";
  let toastTimer;
  let midnightTimer;

  // UTC가 아닌 기기의 날짜를 사용해 자정에 오늘의 기록이 새로 시작돼요.
  function dateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
  let today = dateKey();

  function isValidDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split("-").map(Number);
    return year >= 2000 && dateKey(new Date(year, month - 1, day)) === value;
  }

  function defaultState() {
    return { version: 1, value: "rest", mood: "calm", actionIndex: 0, completedDates: [] };
  }

  function normalizeState(saved) {
    if (!saved || typeof saved !== "object" || saved.version !== 1 || !Array.isArray(saved.completedDates)) {
      throw new Error("Invalid saved record");
    }
    const value = Object.hasOwn(VALUES, saved.value) ? saved.value : "rest";
    const mood = Object.hasOwn(MOODS, saved.mood) ? saved.mood : "calm";
    const list = ACTIONS[value][mood];
    return {
      version: 1, value, mood,
      actionIndex: Number.isInteger(saved.actionIndex) && saved.actionIndex >= 0 && saved.actionIndex < list.length ? saved.actionIndex : 0,
      completedDates: [...new Set(saved.completedDates.filter(isValidDate))].sort()
    };
  }

  function readState() {
    let raw;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch {
      storageAvailable = false;
      storageWarning = "브라우저 저장을 사용할 수 없어 기록은 이 창에서만 유지돼요.";
      return null;
    }
    if (!raw) return null;
    try {
      return normalizeState(JSON.parse(raw));
    } catch {
      storageWarning = "저장된 기록을 읽지 못해 새 기록으로 시작했어요.";
      return null;
    }
  }

  let state = readState() || defaultState();

  function saveState() {
    if (!storageAvailable) return false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      storageAvailable = false;
      storageWarning = "브라우저 저장을 사용할 수 없어 기록은 이 창에서만 유지돼요.";
      return false;
    }
  }

  function toast(message) {
    const element = $("#toast");
    if (!element) return;
    clearTimeout(toastTimer);
    element.textContent = message;
    element.classList.add("is-visible");
    toastTimer = setTimeout(() => element.classList.remove("is-visible"), 4800);
  }

  function setText(selector, text) {
    const element = $(selector);
    if (element) element.textContent = text;
  }

  function renderSelections() {
    [["value", state.value], ["mood", state.mood]].forEach(([type, selected]) => {
      $$(`[data-${type}]`).forEach((button) => {
        const active = button.dataset[type] === selected;
        button.classList.toggle("is-selected", active);
        button.setAttribute("aria-checked", String(active));
        button.tabIndex = active ? 0 : -1;
      });
    });
    setText("#daily-summary", `${VALUE_PHRASES[state.value]} 위한 한 걸음`);
  }

  function renderAction() {
    const [title, description, scene] = ACTIONS[state.value][state.mood][state.actionIndex];
    setText("#action-eyebrow", `${VALUE_PHRASES[state.value]} 위한 오늘의 실천`);
    setText("#action-title", title);
    setText("#action-description", description);
    const art = $("#action-art");
    if (art) art.dataset.scene = scene;
  }

  function renderProgress() {
    const total = state.completedDates.length;
    const doneToday = state.completedDates.includes(today);
    const goal = Math.max(6, Math.ceil(total / 6) * 6);
    const currentBeans = total === 0 ? 0 : ((total - 1) % 6) + 1;
    const stage = currentBeans === 6 ? "flower" : currentBeans >= 3 ? "leaf" : "seed";
    const stageNames = { seed: "새싹", leaf: "잎", flower: "꽃" };

    setText("#today-count", doneToday ? "1" : "0");
    setText("#total-count", total);
    setText("#goal-count", goal);
    setText("#growth-stage", currentBeans === 6 ? "작은 실천 6개가 모여 꽃이 피었어요!" : `${stageNames[stage]} · 꽃을 피우기까지 ${6 - currentBeans}콩 남았어요.`);
    setText("#progress-label", goal === 6 ? "첫 목표" : "다음 목표");
    setText("#completion-note", doneToday ? "오늘의 작은 실천을 해냈어요. 내일 또 한 콩을 모아요." : "하루에 작은 행동 하나를 완료하면 콩 한 알이 쌓여요.");

    const completeButton = $("#complete-action");
    if (completeButton) {
      completeButton.disabled = doneToday;
      completeButton.classList.toggle("is-complete", doneToday);
      completeButton.textContent = doneToday ? "오늘도 해냈어요 ✓" : "완료했어요 ✓";
    }

    const dots = $("#bean-dots");
    if (dots) {
      dots.replaceChildren();
      dots.setAttribute("aria-label", `목표 6콩 중 ${currentBeans}콩`);
      for (let i = 0; i < 6; i += 1) {
        const dot = document.createElement("span");
        dot.className = `bean-dot${i < currentBeans ? " is-filled" : ""}`;
        dot.setAttribute("aria-hidden", "true");
        dots.append(dot);
      }
    }

    const jar = $("#bean-fill");
    if (jar) {
      jar.replaceChildren();
      for (let i = 0; i < currentBeans; i += 1) {
        const bean = document.createElement("span");
        bean.className = "bean";
        bean.dataset.index = String(i);
        bean.setAttribute("aria-hidden", "true");
        jar.append(bean);
      }
    }

    $$("#growth-track [data-stage]").forEach((element) => {
      const active = element.dataset.stage === stage;
      element.classList.toggle("is-active", active);
      if (active) element.setAttribute("aria-current", "step");
      else element.removeAttribute("aria-current");
    });
  }

  function render() {
    renderSelections();
    renderAction();
    renderProgress();
  }

  function refreshDay() {
    const current = dateKey();
    if (current !== today) {
      today = current;
      renderProgress();
    }
  }

  function scheduleMidnightRefresh() {
    clearTimeout(midnightTimer);
    const now = new Date();
    const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    midnightTimer = setTimeout(() => {
      refreshDay();
      scheduleMidnightRefresh();
    }, nextDay.getTime() - now.getTime() + 100);
  }

  // 클릭뿐 아니라 방향키 / Home / End로도 선택할 수 있어요.
  function bindChoices(type) {
    const buttons = $$(`[data-${type}]`);
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        refreshDay();
        state[type] = button.dataset[type];
        state.actionIndex = 0;
        render();
        if (!saveState()) toast(storageWarning);
      });
      button.addEventListener("keydown", (event) => {
        let next;
        if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (index + 1) % buttons.length;
        if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (index - 1 + buttons.length) % buttons.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = buttons.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        buttons[next].focus();
        buttons[next].click();
      });
    });
  }

  bindChoices("value");
  bindChoices("mood");

  $("#shuffle-action")?.addEventListener("click", () => {
    refreshDay();
    state.actionIndex = (state.actionIndex + 1) % ACTIONS[state.value][state.mood].length;
    renderAction();
    const saved = saveState();
    toast(saved ? "새로운 작은 실천을 골랐어요." : storageWarning);
  });

  $("#complete-action")?.addEventListener("click", () => {
    refreshDay();
    // 다른 탭에서 쌓은 기록도 함께 읽어 같은 날짜의 중복 적립을 막아요.
    const latest = storageAvailable ? readState() : null;
    if (latest) state.completedDates = [...new Set([...state.completedDates, ...latest.completedDates])].sort();
    if (state.completedDates.includes(today)) {
      renderProgress();
      toast("오늘의 콩은 이미 모았어요. 내일 다시 만나요!");
      return;
    }
    state.completedDates.push(today);
    state.completedDates.sort();
    const saved = saveState();
    renderProgress();
    document.body.classList.add("is-celebrating");
    setTimeout(() => document.body.classList.remove("is-celebrating"), 1400);
    toast(saved ? "잘했어요! 오늘의 작은 실천으로 1콩을 모았어요 🌱" : "1콩을 모았어요! 저장이 제한되어 이 창에서만 기록이 유지돼요.");
  });

  const aboutDialog = $("#about-dialog");
  $("#about-trigger")?.addEventListener("click", () => {
    if (aboutDialog && !aboutDialog.open) aboutDialog.showModal();
  });
  $$("[data-close-dialog]").forEach((button) => button.addEventListener("click", () => aboutDialog?.close()));
  aboutDialog?.addEventListener("click", (event) => {
    if (event.target === aboutDialog) {
      const rect = aboutDialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) aboutDialog.close();
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    const saved = readState();
    if (saved) state = saved;
    else if (event.newValue === null) state = defaultState();
    refreshDay();
    render();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      refreshDay();
      scheduleMidnightRefresh();
    }
  });
  window.addEventListener("focus", refreshDay);

  render();
  scheduleMidnightRefresh();
  if (storageWarning) setTimeout(() => toast(storageWarning), 700);
})();
