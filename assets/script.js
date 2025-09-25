(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Theme toggle with localStorage
  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'light') root.classList.add('light');
    else root.classList.remove('light');
    localStorage.setItem('theme', theme);
    const toggle = $('#themeToggle');
    if (toggle) toggle.textContent = theme === 'light' ? '☀️' : '🌙';
  }
  function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(saved || (prefersLight ? 'light' : 'dark'));
  }

  // Accordion behavior
  function initAccordions() {
    $$('.accordion').forEach(acc => {
      $$('.accordion-trigger', acc).forEach(btn => {
        btn.addEventListener('click', () => {
          const expanded = btn.getAttribute('aria-expanded') === 'true';
          btn.setAttribute('aria-expanded', String(!expanded));
          const panel = btn.nextElementSibling;
          if (!panel) return;
          panel.style.display = expanded ? 'none' : 'grid';
        });
        // Default closed
        btn.setAttribute('aria-expanded', 'false');
        const panel = btn.nextElementSibling;
        if (panel) panel.style.display = 'none';
      });
    });
  }

  // Copy single task
  function initCopyButtons() {
    $$('.btn.copy').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-clip') || '';
        try {
          await navigator.clipboard.writeText(text);
          toast('Task copied to clipboard');
        } catch (e) {
          console.warn('Clipboard failed, falling back', e);
          fallbackCopy(text);
        }
      });
    });
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
    toast('Task copied to clipboard');
  }

  // Copy all tasks
  function initCopyAll() {
    const btn = $('#copyAllTasks');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const texts = $$('.task-panel .btn.copy').map(b => b.getAttribute('data-clip'));
      const joined = texts.join('\n');
      try {
        await navigator.clipboard.writeText(joined);
        toast('All Student Tasks copied');
      } catch {
        fallbackCopy(joined);
      }
    });
  }

  // Console helpers
  const consoleBox = $('#console');
  function log(line) {
    if (!consoleBox) return;
    consoleBox.textContent += (consoleBox.textContent ? '\n' : '') + line;
    consoleBox.scrollTop = consoleBox.scrollHeight;
  }
  function clearConsole() {
    if (!consoleBox) return;
    consoleBox.textContent = '';
  }

  // Example flow
  function initExampleFlow() {
    $('#playExample')?.addEventListener('click', async () => {
      clearConsole();
      const lines = [
        'Step 1: Login successful',
        'Step 2: Downloaded 235 symbols',
        'Step 3: Live LTP for INFY = 1532.50',
        'Step 4: EMA(20) = 1525.80',
        'Step 5: Signal Generated: BUY',
        'Step 6: Order Placed at 1532.50 | SL=1501.85 | Target=1578.47',
        'Step 7: Price up +1% | New SL=1518.00',
        'Step 8: Running in Paper Trade mode',
        'Step 9: Trade closed at Target 1578.47',
        'Step 10: Strategy completed'
      ];
      for (const l of lines) {
        log(l);
        await new Promise(r => setTimeout(r, 450));
      }
    });
    $('#clearConsole')?.addEventListener('click', clearConsole);
  }

  // Guided Tour: highlights each step card, opens first panel
  function initGuidedTour() {
    const btn = $('#startTour');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const cards = $$('.step-card');
      for (const card of cards) {
        card.classList.add('highlight');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstTrigger = $('.accordion-trigger', card);
        if (firstTrigger && firstTrigger.getAttribute('aria-expanded') === 'false') {
          firstTrigger.click();
        }
        await new Promise(r => setTimeout(r, 900));
        card.classList.remove('highlight');
      }
      toast('Guided tour finished');
    });
  }

  // Scroll to top
  function initScrollTop() {
    $('#scrollTop')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Tiny toast
  function toast(message) {
    const t = document.createElement('div');
    t.textContent = message;
    t.style.position = 'fixed';
    t.style.bottom = '18px';
    t.style.right = '18px';
    t.style.padding = '10px 12px';
    t.style.borderRadius = '10px';
    t.style.background = 'rgba(15,25,55,0.9)';
    t.style.color = 'white';
    t.style.border = '1px solid rgba(255,255,255,0.15)';
    t.style.boxShadow = '0 10px 30px rgba(0,0,0,0.35)';
    t.style.zIndex = '9999';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1400);
  }

  // Event bindings
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    $('#themeToggle')?.addEventListener('click', () => {
      const isLight = document.documentElement.classList.contains('light');
      applyTheme(isLight ? 'dark' : 'light');
    });

    initAccordions();
    initCopyButtons();
    initCopyAll();
    initExampleFlow();
    initGuidedTour();
    initScrollTop();
  });
})();
