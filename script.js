// ==========================================================
// CONSCIOUS CHOICE - JSON-BASED SITE SCRIPT
// Works with index.html, module.html, data/site.json, data/module1-7.json
// ==========================================================

const MODULE_COUNT = 7;

// Decide which page we are on and initialize
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1);

  if (page === '' || page === 'index.html') {
    loadHomepage();
    setupSmoothScrolling();
  } else if (page === 'module.html') {
    loadModule();
  }

  // Nav highlighting works on both pages (safe if sections don’t exist)
  window.addEventListener('scroll', highlightNavSections);
});

// ==================== HOMEPAGE LOGIC ====================

async function loadHomepage() {
  try {
    // Load site-wide content
    const siteResponse = await fetch('data/site.json');
    if (!siteResponse.ok) {
      throw new Error('Failed to load data/site.json');
    }
    const siteData = await siteResponse.json();

    // Load each module file: module1.json ... module7.json
    const modulePromises = [];
    for (let id = 1; id <= MODULE_COUNT; id++) {
      modulePromises.push(
        fetch(`data/module${id}.json`).then(res => {
          if (!res.ok) throw new Error(`Failed to load data/module${id}.json`);
          return res.json();
        })
      );
    }
    const modulesData = await Promise.all(modulePromises);

    // Populate homepage
    populateHero(siteData.hero);
    populatePhilosophy(siteData.philosophy);
    populateModulesSection(siteData.modules, modulesData);
    populateAbout(siteData.about);
    populateFooter(siteData.footer);
  } catch (err) {
    console.error('Error loading homepage:', err);
  }
}

function populateHero(hero) {
  const titleEl = document.querySelector('.hero h1');
  const taglineEl = document.querySelector('.hero .tagline');
  const descEl = document.querySelector('.hero .description');
  const ctaEl = document.querySelector('.cta-button');

  if (titleEl) titleEl.textContent = hero.title;
  if (taglineEl) taglineEl.textContent = hero.tagline;
  if (descEl) {
    // hero.description can be string or array
    if (Array.isArray(hero.description)) {
      descEl.innerHTML = hero.description.map(p => `<p>${p}</p>`).join('');
    } else {
      descEl.textContent = hero.description;
    }
  }
  if (ctaEl) {
    ctaEl.textContent = hero.ctaText;
    ctaEl.href = hero.ctaLink;
  }
}

function populatePhilosophy(philosophy) {
  const titleEl = document.querySelector('.philosophy h2');
  const cardsEl = document.getElementById('philosophyCards');
  if (titleEl) titleEl.textContent = philosophy.title;
  if (!cardsEl) return;

  cardsEl.innerHTML = philosophy.cards
    .map(
      card => `
      <div class="philosophy-card">
        <h3>${card.title}</h3>
        <p>${card.text}</p>
      </div>
    `
    )
    .join('');
}

function populateModulesSection(modulesSection, modulesData) {
  const titleEl = document.querySelector('#modules h2');
  const introEl = document.querySelector('.modules-intro');
  const listEl = document.querySelector('.module-list');

  if (titleEl) titleEl.textContent = modulesSection.title;
  if (introEl) introEl.textContent = modulesSection.intro;
  if (!listEl) return;

  listEl.innerHTML = modulesData
    .map(
      (module, index) => `
      <div class="module-card" onclick="window.location.href='module.html?id=${module.id}'">
        <div class="module-number">${String(index + 1).padStart(2, '0')}</div>
        <h3>${module.title}</h3>
        <p class="module-role">${module.subtitle}</p>
        <p>${module.description.substring(0, 180)}...</p>
        <a href="module.html?id=${module.id}" class="module-link">
          ${module.questions.length} Scenarios →
        </a>
      </div>
    `
    )
    .join('');
}

function populateAbout(about) {
  const titleEl = document.querySelector('#about h2');
  const paragraphsContainer = document.getElementById('aboutParagraphs');
  const metaContainer = document.getElementById('projectMeta');

  if (titleEl) titleEl.textContent = about.title;
  if (paragraphsContainer) {
    paragraphsContainer.innerHTML = about.paragraphs
      .map(p => `<p>${p}</p>`)
      .join('');
  }
  if (metaContainer) {
    metaContainer.innerHTML = about.meta
      .map(item => `<p><strong>${item.label}:</strong> ${item.value}</p>`)
      .join('');
  }
}

function populateFooter(footer) {
  const footerText = document.getElementById('footerText') || document.querySelector('footer p');
  if (footerText) footerText.textContent = footer.text;
}

// ==================== SMOOTH SCROLL & NAV HIGHLIGHT ====================

function setupSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href.endsWith('.html')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function highlightNavSections() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - 200) {
      current = section.id;
    }
  });

  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// ==================== MODULE PAGE LOGIC ====================

let currentModuleData = null;
let currentQuestionIndex = 0;

async function loadModule() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const moduleId = parseInt(urlParams.get('id'), 10);

    if (!moduleId || moduleId < 1 || moduleId > MODULE_COUNT) {
      window.location.href = 'index.html';
      return;
    }

    const response = await fetch(`data/module${moduleId}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load data/module${moduleId}.json`);
    }
    currentModuleData = await response.json();

    // Header
    document.getElementById('moduleBadge').textContent = `Module ${currentModuleData.id}`;
    document.getElementById('moduleTitle').textContent = currentModuleData.title;
    document.getElementById('moduleSubtitle').textContent = currentModuleData.subtitle;
    document.getElementById('moduleDescription').textContent = currentModuleData.description;
    document.title = `${currentModuleData.title} - Conscious Choice`;

    // Total questions
    document.getElementById('totalQuestions').textContent =
      currentModuleData.questions.length;

    // Render questions
    renderQuestions();

    // Keyboard support & initial progress
    setupOptionKeyboardSupport();
    showQuestion(0);
    setupNextModuleButton(moduleId);

    document.getElementById('completionMessage').textContent =
      currentModuleData.completionMessage;
  } catch (err) {
    console.error('Error loading module:', err);
  }
}

// Utility: pure Fisher–Yates shuffle
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderQuestions() {
  const container = document.getElementById('questionsContainer');
  if (!container) return;

  container.innerHTML = currentModuleData.questions
    .map((q, index) => {
      const shuffledOptions = shuffleArray(q.options);
      const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

      return `
      <div class="question-card" id="question${index}" ${index === 0 ? 'style="display: block;"' : ''}>
        <div class="question-number">Question ${index + 1}</div>
        <div class="scenario">
          <h2>${q.title}</h2>
          <p>${q.scenario}</p>
          <p class="question-text"><strong>${q.question}</strong></p>
        </div>
        <div class="options">
          ${shuffledOptions
            .map(
              (opt, i) => `
            <div class="option"
                 data-correct="${opt.correct}"
                 data-question-index="${index}"
                 tabindex="0"
                 role="button"
                 aria-pressed="false"
                 onclick="selectOption(${index}, this)">
              <div class="option-content">
                <div class="option-letter">${letters[i] || ''}</div>
                <div>
                  <div class="option-text">${opt.text}</div>
                  <div class="feedback">
                    <strong>${opt.correct ? '✓ Best answer!' : '❌ Not the best choice.'}</strong>
                    ${opt.feedback}
                  </div>
                </div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
        <div class="resources">
          <h3>Learn More</h3>
          <ul>
            ${q.resources
              .map(res => `<li><a href="${res.url}" target="_blank">${res.title}</a></li>`)
              .join('')}
          </ul>
        </div>
        <div class="navigation-buttons">
          <button class="btn-secondary" onclick="${
            index === 0
              ? "window.location.href='index.html#modules'"
              : `showQuestion(${index - 1})`
          }">
            ${index === 0 ? 'Back to Modules' : 'Previous Question'}
          </button>
          <button class="btn-primary" onclick="${
            index === currentModuleData.questions.length - 1
              ? `handleComplete(${index})`
              : `handleNext(${index})`
          }">
            ${
              index === currentModuleData.questions.length - 1
                ? 'Complete Module'
                : 'Next Question'
            }
          </button>
        </div>
      </div>
    `;
    })
    .join('');
}

// Single-selection behavior + ARIA
function selectOption(questionIndex, optionElement) {
  const questionCard = document.getElementById(`question${questionIndex}`);
  if (!questionCard) return;

  const options = questionCard.querySelectorAll('.option');

  options.forEach(opt => {
    opt.classList.remove('selected', 'correct', 'incorrect');
    opt.setAttribute('aria-pressed', 'false');
  });

  optionElement.classList.add('selected');
  optionElement.setAttribute('aria-pressed', 'true');

  if (optionElement.dataset.correct === 'true') {
    optionElement.classList.add('correct');
  } else {
    optionElement.classList.add('incorrect');
  }
}

// Keyboard support for options (Arrow keys + Enter/Space)
function setupOptionKeyboardSupport() {
  const optionElements = document.querySelectorAll('.option');

  optionElements.forEach(opt => {
    opt.addEventListener('keydown', e => {
      const key = e.key;
      const group = opt.parentElement;
      const options = Array.from(group.querySelectorAll('.option'));
      const idx = options.indexOf(opt);

      if (key === 'ArrowDown' || key === 'ArrowRight') {
        e.preventDefault();
        const next = options[(idx + 1) % options.length];
        next.focus();
      } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
        e.preventDefault();
        const prev = options[(idx - 1 + options.length) % options.length];
        prev.focus();
      } else if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        const qIndex = parseInt(opt.dataset.questionIndex, 10);
        selectOption(qIndex, opt);
      }
    });
  });
}

// Helpers for "nudge" before moving on
function hasSelection(questionIndex) {
  const card = document.getElementById(`question${questionIndex}`);
  if (!card) return false;
  return !!card.querySelector('.option.selected');
}

function handleNext(currentIndex) {
  if (!hasSelection(currentIndex)) {
    alert("You haven't selected anything yet. Please choose an option before continuing.");
    return;
  }
  showQuestion(currentIndex + 1);
}

function handleComplete(currentIndex) {
  if (!hasSelection(currentIndex)) {
    alert("You haven't selected anything yet. Please choose an option before finishing the module.");
    return;
  }
  completeModule();
}

// Show a specific question and update progress
function showQuestion(index) {
  const questions = document.querySelectorAll('.question-card');
  questions.forEach(q => (q.style.display = 'none'));

  const target = document.getElementById(`question${index}`);
  if (target) {
    target.style.display = 'block';
    currentQuestionIndex = index;

    // Progress text
    const currentSpan = document.getElementById('currentQuestion');
    if (currentSpan) currentSpan.textContent = index + 1;

    // Progress bar
    const progressBar = document.getElementById('progressBar');
    if (progressBar && currentModuleData) {
      const percent = ((index + 1) / currentModuleData.questions.length) * 100;
      progressBar.style.width = `${percent}%`;
    }

    // Focus first option for keyboard users
    const firstOption = target.querySelector('.option');
    if (firstOption) {
      firstOption.focus();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Completion card
function completeModule() {
  const questions = document.querySelectorAll('.question-card');
  questions.forEach(q => (q.style.display = 'none'));

  const completionCard = document.getElementById('completionCard');
  if (completionCard) {
    completionCard.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const progressBar = document.getElementById('progressBar');
  if (progressBar) progressBar.style.width = '100%';
}

// Next-module button in completion card
function setupNextModuleButton(currentModuleId) {
  const nextModuleBtn = document.getElementById('nextModuleBtn');
  if (!nextModuleBtn) return;

  const nextModuleId = currentModuleId + 1;
  if (nextModuleId <= MODULE_COUNT) {
    nextModuleBtn.textContent = 'Next Module';
    nextModuleBtn.onclick = () =>
      (window.location.href = `module.html?id=${nextModuleId}`);
  } else {
    nextModuleBtn.textContent = 'Back to Home';
    nextModuleBtn.onclick = () => (window.location.href = 'index.html');
  }
}
