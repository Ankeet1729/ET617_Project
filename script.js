// Codemitra Quiz App
// Minimal, accessible, responsive quiz UI

const apiBase = '';
const testStudent = { grade: 'middle', locale: 'en-IN' };
const app = document.getElementById('app');

// --- Helpers ---
function fetchJSON(url) {
  return fetch(url).then(r => {
    if (!r.ok) throw new Error('Failed to fetch: ' + url);
    return r.json();
  });
}
function saveProgress(moduleId, data) {
  localStorage.setItem('quizProgress_' + moduleId, JSON.stringify(data));
}
function loadProgress(moduleId) {
  const d = localStorage.getItem('quizProgress_' + moduleId);
  return d ? JSON.parse(d) : null;
}
function clearProgress(moduleId) {
  localStorage.removeItem('quizProgress_' + moduleId);
}
function cacheOptionImage(moduleId, qIdx, optionText, url) {
  localStorage.setItem(`optionImg_${moduleId}|${qIdx}|${optionText}`, url);
}
function getCachedOptionImage(moduleId, qIdx, optionText) {
  return localStorage.getItem(`optionImg_${moduleId}|${qIdx}|${optionText}`);
}

// --- Option image stub ---
function generateOptionImageStub(optionText) {
  // Return placeholder.png or a simple SVG data URL
  if (!optionText) return '/images/placeholder.png';
  // SVG fallback: colored circle with text
  const svg = `<svg width='32' height='32' xmlns='http://www.w3.org/2000/svg'><rect width='32' height='32' rx='6' fill='%2300C2A8'/><text x='16' y='21' font-size='16' text-anchor='middle' fill='white' font-family='Arial'>${optionText[0] ? optionText[0].toUpperCase() : '?'}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// --- UI Rendering ---
function showError(msg, retryFn) {
  app.innerHTML = `<section class="card"><div>${msg}</div><button class="btn" id="retryBtn">Retry</button></section>`;
  document.getElementById('retryBtn').onclick = retryFn;
}

function focusMain() {
  app.focus();
}

function renderModuleList() {
  fetchJSON(apiBase + '/data/modules.json')
    .then(modules => {
      app.innerHTML = `<header><h1 style="text-align:center;margin-bottom:24px;">Quiz Modules</h1></header><section id="module-list"></section>`;
      const list = document.getElementById('module-list');
      modules.forEach((mod, i) => {
        const score = mod.last_score !== undefined ? `<div class='card-desc'>Score: <b>${mod.last_score}</b></div>` : '';
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<div class='card-title'>${mod.title}</div><div class='card-desc'>${mod.description || ''}</div>${score}<button class='btn' id='start-${i}'>Start Quiz</button>`;
        list.appendChild(card);
        card.querySelector('button').onclick = () => startQuiz(mod, i);
      });
      focusMain();
    })
    .catch(() => showError('Could not load modules.', renderModuleList));
}

function startQuiz(module, moduleIdx) {
  fetchJSON(apiBase + module.quiz_url)
    .then(quizData => {
      // Normalize questions
      let questions = [];
      if (Array.isArray(quizData.multiple_choice)) questions = questions.concat(quizData.multiple_choice.map(q => ({...q, type:'mcq'})));
      if (Array.isArray(quizData.true_false)) questions = questions.concat(quizData.true_false.map(q => ({...q, type:'tf'})));
      if (!questions.length) throw new Error('No questions found');
      runQuiz(module, questions, moduleIdx);
    })
    .catch(() => showError('Could not load quiz.', () => startQuiz(module, moduleIdx)));
}

function runQuiz(module, questions, moduleIdx) {
  const moduleId = module.id || module.title || 'module'+moduleIdx;
  let progress = loadProgress(moduleId) || { answers: Array(questions.length).fill(null), current: 0 };
  let { answers, current } = progress;
  let finished = false;

  function save() {
    saveProgress(moduleId, { answers, current });
  }
  function goTo(idx) {
    current = Math.max(0, Math.min(idx, questions.length-1));
    save();
    render();
  }
  function selectOption(optIdx) {
    answers[current] = optIdx;
    save();
    render();
  }
  function finishQuiz() {
    finished = true;
    clearProgress(moduleId);
    renderResults();
  }
  function render() {
    if (finished) return;
    const q = questions[current];
    // Progress bar
    const percent = Math.round(((current+1)/questions.length)*100);
    app.innerHTML = `
      <header style="width:100%">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div><b>${current+1} / ${questions.length}</b></div>
          <button class="btn" id="exitBtn" style="background:var(--accent);padding:8px 18px;font-size:0.95rem;">Exit</button>
        </div>
        <div class="progress-bar" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar-fill" style="width:${percent}%"></div>
        </div>
      </header>
      <section class="card" id="question-card">
        <div class="card-title" id="question-text">${q.question}</div>
        <ul class="quiz-options" role="radiogroup" aria-labelledby="question-text">
          ${q.options.map((opt, i) => {
            let imgUrl = (q.option_images && q.option_images[i]) || getCachedOptionImage(moduleId, current, opt);
            if (!imgUrl) {
              imgUrl = generateOptionImageStub(opt);
              cacheOptionImage(moduleId, current, opt, imgUrl);
            }
            return `<li class="quiz-option${answers[current]===i?' selected':''}" role="radio" aria-checked="${answers[current]===i}" tabindex="0" data-idx="${i}">
              <img src="${imgUrl}" alt="" aria-hidden="true" />
              <span>${opt}</span>
            </li>`;
          }).join('')}
        </ul>
        <div style="display:flex;gap:12px;justify-content:space-between;margin-top:16px;">
          <button class="btn" id="prevBtn" ${current===0?'disabled':''}>Prev</button>
          <button class="btn" id="nextBtn" ${answers[current]==null?'disabled':''}>Next</button>
          <button class="btn" id="finishBtn">Save & Finish</button>
        </div>
      </section>
    `;
    // Option selection
    const opts = Array.from(document.querySelectorAll('.quiz-option'));
    opts.forEach((el, i) => {
      el.onclick = () => selectOption(i);
      el.onkeydown = e => {
        if (e.key === ' ' || e.key === 'Enter') { selectOption(i); }
        if (e.key >= '1' && e.key <= String(opts.length)) selectOption(Number(e.key)-1);
      };
    });
    // Keyboard navigation
    document.getElementById('prevBtn').onclick = () => goTo(current-1);
    document.getElementById('nextBtn').onclick = () => goTo(current+1);
    document.getElementById('finishBtn').onclick = finishQuiz;
    document.getElementById('exitBtn').onclick = renderModuleList;
    // Keyboard: left/right arrows, 1-4, Enter
    app.onkeydown = e => {
      if (e.key === 'ArrowLeft') goTo(current-1);
      if (e.key === 'ArrowRight' && answers[current]!=null) goTo(current+1);
      if (e.key === 'Enter' && answers[current]!=null) goTo(current+1);
      if (e.key >= '1' && e.key <= String(opts.length)) selectOption(Number(e.key)-1);
    };
    // Focus management
    setTimeout(() => {
      document.getElementById('question-card').focus();
    }, 0);
  }
  function renderResults() {
    // Score calculation
    let score = 0;
    let review = questions.map((q, i) => {
      const correct = q.answer;
      const selected = answers[i];
      const isCorrect = selected != null && q.options[selected] === correct;
      if (isCorrect) score++;
      return { q, selected, isCorrect };
    });
    app.innerHTML = `<section class="card"><h2>Quiz Results</h2><div style="margin-bottom:12px;">Score: <b>${score} / ${questions.length}</b></div><ul style="padding:0;list-style:none;">${review.map((r, i) => `
      <li style="margin-bottom:18px;">
        <div><b>Q${i+1}:</b> ${r.q.question}</div>
        <div style="margin:4px 0 0 0;">Your answer: <span style="color:${r.isCorrect?'var(--accent)':'#e11d48'}">${r.selected!=null?r.q.options[r.selected]:'(none)'}</span></div>
        <div>Correct: <b>${r.q.answer}</b></div>
        <div style="color:var(--text-muted);font-size:0.98em;">${r.q.explanation||''}</div>
      </li>`).join('')}</ul>
      <button class="btn" id="backBtn">Back to Modules</button>
    </section>`;
    document.getElementById('backBtn').onclick = renderModuleList;
    focusMain();
  }
  render();
  focusMain();
}

// --- App Init ---
renderModuleList();
