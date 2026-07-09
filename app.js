// =====================================================
// Registration Modal (mailto — no backend/DB involved)
// =====================================================
(function initRegModal() {
  const OWNER_EMAIL = 'warren@bp-u.net';

  const overlay   = document.getElementById('reg-overlay');
  const closeBtn  = document.getElementById('reg-close');
  const form      = document.getElementById('reg-form');
  const successEl = document.getElementById('reg-success');
  const successClose = document.getElementById('reg-success-close');
  const courseLabel  = document.getElementById('reg-course-label');

  let selectedCourse = '';

  // 강의 카드 클릭 → 모달 오픈
  document.querySelectorAll('.course-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      selectedCourse = card.querySelector('.course-title')?.textContent?.trim() || '강의';
      courseLabel.textContent = selectedCourse;
      resetModal();
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function resetModal() {
    form.classList.remove('hidden');
    successEl.classList.add('hidden');
    form.reset();
    setError('');
    document.querySelectorAll('.reg-field input').forEach(i => i.classList.remove('error'));
  }

  function setError(msg) {
    const el = document.getElementById('reg-error');
    if (el) el.textContent = msg;
  }

  function markError(inputId) {
    document.getElementById(inputId)?.classList.add('error');
  }

  function clearErrors(...ids) {
    ids.forEach(id => document.getElementById(id)?.classList.remove('error'));
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  successClose.addEventListener('click', closeModal);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();

    clearErrors('reg-name', 'reg-email', 'reg-phone');
    setError('');

    if (!name) { setError('이름을 입력해 주세요.'); markError('reg-name'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('올바른 이메일을 입력해 주세요.'); markError('reg-email'); return;
    }
    if (!phone) { setError('전화번호를 입력해 주세요.'); markError('reg-phone'); return; }

    const subject = `[수강 신청] ${selectedCourse} - ${name}`;
    const body = `강의: ${selectedCourse}\n이름: ${name}\n이메일: ${email}\n전화번호: ${phone}`;
    const mailtoUrl = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    form.classList.add('hidden');
    successEl.classList.remove('hidden');
    document.getElementById('reg-success-msg').textContent =
      `${name}님, 메일 앱이 열립니다. "${selectedCourse}" 신청 내용을 확인하시고 메일을 전송해 주세요.`;
  });
})();

// --- 1. Theme Toggle Logic ---
(function initTheme() {
  const htmlElement = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    htmlElement.classList.remove('dark');
    htmlElement.classList.add('light');
  } else {
    htmlElement.classList.add('dark');
    htmlElement.classList.remove('light');
  }
})();

// --- 2. Tab Control Logic (runs immediately — module scripts execute after DOM is ready) ---
(function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabContents.forEach(content => {
        if (content.id === targetTab) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  // --- Theme toggle button binding ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  themeToggleBtn.addEventListener('click', () => {
    if (htmlElement.classList.contains('dark')) {
      htmlElement.classList.remove('dark');
      htmlElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      htmlElement.classList.add('dark');
      htmlElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  });

  // --- 3. Copy to Clipboard Logic ---
  const copyButtons = document.querySelectorAll('[data-clipboard]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-clipboard');
      const tooltip = btn.querySelector('.tooltip');

      try {
        await navigator.clipboard.writeText(textToCopy);
        
        // Visual feedback
        btn.classList.add('copied');
        if (tooltip) {
          tooltip.textContent = '복사 완료!';
        }

        // Reset feedback after 2 seconds
        setTimeout(() => {
          btn.classList.remove('copied');
          if (tooltip) {
            tooltip.textContent = '복사하기';
          }
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
        if (tooltip) {
          tooltip.textContent = '복사 실패 😢';
        }
      }
    });
  });
});
