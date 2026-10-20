/* ==========================================================================
   Young Web Solutions (YWS) — Interactive UI Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* 1. Sticky Header Scroll Effect */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    }, { passive: true });
  }

  /* 2. Mobile Navigation Toggle */
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const expanded = navLinks.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  /* 3. Hero Interactive Before / After Transformation Switcher */
  const modeButtons = document.querySelectorAll('.mode-switch__btn');
  const previewStage = document.getElementById('hero-preview-stage');
  if (modeButtons.length && previewStage) {
    const states = {
      after: {
        isBefore: false,
        badgeClass: 'preview-badge--new',
        badgeText: 'Nachher · Frisches Design & Klare Struktur',
        title: 'Aufgeräumtes Layout, moderner Stil & sofort startklarer Code.',
        desc: 'Ihre bestehenden Inhalte wirken endlich zeitgemäß, sind auf jedem Smartphone perfekt lesbar und werden Ihnen als fertiges HTML/CSS-Paket übergeben.',
        metrics: [
          { val: 'Modern', label: 'Optik & Layout', cls: 'metric-box__val--good' },
          { val: '100 %', label: 'Code-Übergabe', cls: 'metric-box__val--good' },
          { val: '0 € Risiko', label: 'Zufriedenheitsgarantie', cls: 'metric-box__val--good' }
        ]
      },
      before: {
        isBefore: true,
        badgeClass: 'preview-badge--old',
        badgeText: 'Vorher · In die Jahre gekommene Homepage',
        title: 'Unruhiges Layout, veraltete Optik & unübersichtliche Navigation.',
        desc: 'Eigentlich gute Inhalte gehen in einem veralteten Design unter. Auf dem Smartphone wirkt die Seite zusammengeschoben und wenig einladend.',
        metrics: [
          { val: 'Veraltet', label: 'Optischer Eindruck', cls: 'metric-box__val--bad' },
          { val: 'Unklar', label: 'Seitenstruktur', cls: 'metric-box__val--bad' },
          { val: 'Schwierig', label: 'Mobile Darstellung', cls: 'metric-box__val--bad' }
        ]
      }
    };

    modeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        const state = states[view];
        if (!state) return;

        modeButtons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        previewStage.classList.toggle('is-before', state.isBefore);
        previewStage.innerHTML = `
          <div>
            <span class="preview-badge ${state.badgeClass}">${state.badgeText}</span>
            <h3 class="h3-title" style="margin-bottom:0.5rem;">${state.title}</h3>
            <p style="color:var(--text-muted);font-size:0.93rem;">${state.desc}</p>
          </div>
          <div class="preview-metrics">
            ${state.metrics.map(m => `
              <div class="metric-box">
                <span class="metric-box__val ${m.cls}">${m.val}</span>
                <span class="metric-box__label">${m.label}</span>
              </div>
            `).join('')}
          </div>
        `;
      });
    });
  }

  /* 4. Interactive Package Finder on angebote.html */
  const finderOptions = document.querySelectorAll('.finder-option');
  const finderResult = document.getElementById('finder-result');
  const packageCards = document.querySelectorAll('.package-card[data-package-id]');

  const recommendations = {
    freshup: {
      name: 'Paket 01: Fresh-Up (590 €)',
      text: 'Ideal für Sie: Ihre bestehenden Inhalte stehen bereits – wir verpassen Ihrer Seite ein schickes, modernes Gewand und übergeben Ihnen den fertigen Code.',
      cardId: 'freshup',
      selectValue: 'Fresh-Up (Basispaket – 590 €)'
    },
    evolution: {
      name: 'Paket 02: Evolution (990 €)',
      text: 'Unsere Empfehlung: Wir überarbeiten Ihre Seite optisch und ergänzen gezielt neue Bereiche oder Inhalte in 2 persönlichen Abstimmungsrunden.',
      cardId: 'evolution',
      selectValue: 'Evolution (Medium-Paket – 990 €)'
    },
    signature: {
      name: 'Paket 03: Signature (1.890 €)',
      text: 'Perfekt für besondere Ansprüche: Maßgeschneiderte Zusatz-Features, individuelles Konzept und mehrere intensive Abstimmungsrunden.',
      cardId: 'signature',
      selectValue: 'Signature (Pro-Paket – 1.890 €)'
    }
  };

  if (finderOptions.length && finderResult) {
    finderOptions.forEach((opt) => {
      opt.addEventListener('click', () => {
        const key = opt.getAttribute('data-recommend');
        const rec = recommendations[key];
        if (!rec) return;

        finderOptions.forEach((o) => o.classList.remove('is-selected'));
        opt.classList.add('is-selected');

        packageCards.forEach((card) => {
          card.classList.toggle(
            'is-recommended-highlight',
            card.getAttribute('data-package-id') === rec.cardId
          );
        });

        finderResult.innerHTML = `
          <div>
            <strong style="color:var(--yws-navy);display:block;font-size:1.02rem;">${rec.name}</strong>
            <span style="color:var(--text-muted);font-size:0.9rem;">${rec.text}</span>
          </div>
          <a href="#anfrage" class="btn btn--primary btn--sm" data-select-package="${rec.selectValue}">
            Dieses Paket wählen →
          </a>
        `;

        bindPackageSelectButtons();
      });
    });
  }

  /* 5. Pre-fill Package Selection in Inquiry Form */
  function bindPackageSelectButtons() {
    const selectButtons = document.querySelectorAll('[data-select-package]');
    const packageSelect = document.getElementById('package-select');
    selectButtons.forEach((btn) => {
      btn.onclick = () => {
        const val = btn.getAttribute('data-select-package');
        if (packageSelect && val) {
          packageSelect.value = val;
        }
      };
    });
  }
  bindPackageSelectButtons();

  // Check URL query param ?paket=...
  const params = new URLSearchParams(window.location.search);
  const paketParam = params.get('paket');
  const packageSelect = document.getElementById('package-select');
  if (paketParam && packageSelect && recommendations[paketParam]) {
    packageSelect.value = recommendations[paketParam].selectValue;
  }

  /* 6. FAQ Accordion */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : '0px';
    });
  });

  /* 7. Contact / Package Inquiry Form Submission (Direktversand via FormSubmit an manuel.jung@online.de) */
  const TARGET_EMAIL = 'manuel.jung@online.de';
  const forms = document.querySelectorAll('.js-inquiry-form');

  forms.forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const feedback = form.querySelector('.form-feedback');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';

      const nameVal = (form.querySelector('[name="name"]')?.value || '').trim();
      const emailVal = (form.querySelector('[name="email"]')?.value || '').trim();
      const websiteVal = (form.querySelector('[name="website"]')?.value || '').trim() || 'Keine Angabe';
      const packageVal = (form.querySelector('[name="package"]')?.value || '').trim() || 'Keine Auswahl';
      const messageVal = (form.querySelector('[name="message"]')?.value || '').trim() || 'Keine Nachricht';

      const subject = `Neue Website-Anfrage (${packageVal}) von ${nameVal}`;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Wird gesendet …';
      }

      try {
        const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: subject,
            Name: nameVal,
            Email: emailVal,
            Paket: packageVal,
            Website: websiteVal,
            Nachricht: messageVal,
            _template: 'table'
          })
        });

        const result = await response.json();

        if (response.ok && (result.success === 'true' || result.success === true)) {
          if (feedback) {
            feedback.innerHTML = `Vielen Dank, <strong>${nameVal || 'Ihnen'}</strong>! Ihre unverbindliche Anfrage zum Paket „${packageVal}“ ist eingegangen und wurde per E-Mail an <strong>${TARGET_EMAIL}</strong> gesendet.`;
            feedback.classList.add('is-visible');
          }
          form.reset();
        } else {
          if (feedback) {
            feedback.innerHTML = `Hinweis: ${result.message || 'Bitte bestätigen Sie ggf. noch einmalig die Aktivierungs-Mail von FormSubmit in Ihrem Postfach (' + TARGET_EMAIL + ').'}`;
            feedback.classList.add('is-visible');
          }
        }
      } catch (err) {
        if (feedback) {
          feedback.innerHTML = `Beim Senden ist ein Verbindungsfehler aufgetreten. Bitte versuchen Sie es in einem Moment erneut.`;
          feedback.classList.add('is-visible');
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  });
});
