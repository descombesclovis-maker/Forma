'use strict';

(() => {
  const questions = [
    {
      label: '01 / Le nom de votre entreprise',
      shortLabel: 'Entreprise',
      placeholder: 'Comment s’appelle votre entreprise ?',
      type: 'text',
      maxLength: 90,
    },
    {
      label: '02 / Votre secteur d’activité',
      shortLabel: 'Activité',
      placeholder: 'Que fait votre entreprise ?',
      type: 'text',
      maxLength: 140,
    },
    {
      label: '03 / L’objectif de votre site',
      shortLabel: 'Objectif',
      placeholder: 'Que souhaitez-vous accomplir ?',
      type: 'text',
      maxLength: 180,
    },
    {
      label: '04 / Votre univers',
      shortLabel: 'Univers',
      placeholder: 'Quels mots définissent votre style ?',
      type: 'text',
      maxLength: 180,
    },
    {
      label: '05 / Pour garder le contact',
      shortLabel: 'Contact',
      placeholder: 'Votre adresse e-mail',
      type: 'email',
      maxLength: 150,
    },
  ];

  const root = document.getElementById('segments');
  const space = document.getElementById('formSpace');
  const indicator = document.getElementById('stepIndicator');
  const completion = document.getElementById('completion');
  const summary = document.getElementById('summaryValues');
  const progressFill = document.getElementById('progressFill');
  const progressLabel = document.getElementById('progressLabel');
  const reviewButton = document.getElementById('reviewButton');

  if (!root || !space || !indicator || !completion || !summary || !progressFill || !progressLabel || !reviewButton) {
    return;
  }

  const saved = Array(questions.length).fill('');
  const drafts = [...saved];
  let unlocked = 0;
  let active = 0;
  let returnTo = null;
  let newlyUnfolded = null;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  const arrowIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M12.5 5.5 19 12l-6.5 6.5"/></svg>';

  function activeBar(index) {
    const question = questions[index];
    const draft = drafts[index];
    return `<li class="segment-row ${newlyUnfolded === index ? 'is-new' : ''}">
      <form class="segment is-active" data-step="${index}" novalidate>
        <div class="segment-top">
          <label class="segment-question" for="answer-${index}">${escapeHtml(question.label)}</label>
          <span class="segment-check" aria-hidden="true">✳</span>
        </div>
        <div class="segment-entry">
          <input class="segment-input" id="answer-${index}" name="answer"
            type="${question.type}" maxlength="${question.maxLength}"
            placeholder="${escapeHtml(question.placeholder)}"
            value="${escapeHtml(draft)}" autocomplete="off" required aria-describedby="error-${index}" />
          <button class="segment-arrow" type="submit" aria-label="Valider cette réponse et continuer"
            title="Valider et continuer" ${draft.trim() ? '' : 'disabled'}>${arrowIcon}</button>
        </div>
        <span id="error-${index}" class="field-error" role="alert"></span>
      </form>
    </li>`;
  }

  function completedBar(index) {
    const question = questions[index];
    return `<li class="segment-row">
      <button class="segment is-complete" type="button" data-edit="${index}"
        aria-label="Modifier la réponse : ${escapeHtml(question.shortLabel)} — ${escapeHtml(saved[index])}">
        <span class="segment-top">
          <span class="segment-question">${escapeHtml(question.label)}</span>
          <span class="segment-check" aria-hidden="true">✓</span>
        </span>
        <span class="segment-entry">
          <span class="segment-value-wrap"><span class="segment-value">${escapeHtml(saved[index])}</span></span>
          <span class="segment-pencil" aria-hidden="true">↗</span>
        </span>
      </button>
    </li>`;
  }

  function render(focusField = true) {
    const pieces = [];
    for (let i = 0; i <= unlocked; i += 1) {
      if (i === active) {
        pieces.push(activeBar(i));
      } else if (saved[i]) {
        pieces.push(completedBar(i));
      }
    }

    root.innerHTML = pieces.join('');
    const isComplete = active === -1;

    space.dataset.unlocked = String(unlocked);
    space.classList.toggle('is-finished', isComplete);
    completion.hidden = !isComplete;

    const done = saved.filter(Boolean).length;
    progressFill.style.width = Math.round((done / questions.length) * 100) + '%';
    progressLabel.textContent = String(Math.round((done / questions.length) * 100)).padStart(2, '0') + '% COMPLÉTÉ';
    const stepNumber = isComplete ? questions.length : active + 1;
    indicator.innerHTML = String(stepNumber).padStart(2, '0') + ' <span>/ ' + String(questions.length).padStart(2, '0') + '</span>';

    if (isComplete) {
      summary.innerHTML = questions.map((q, i) => `<div><dt>${escapeHtml(q.shortLabel)}</dt><dd>${escapeHtml(saved[i])}</dd></div>`).join('');
    }

    newlyUnfolded = null;
    if (focusField && !isComplete) {
      const input = root.querySelector('.segment-input');
      if (input) {
        requestAnimationFrame(() => {
          if (input.isConnected) input.focus({ preventScroll: true });
        });
      }
    }
  }

  root.addEventListener('input', (event) => {
    const input = event.target.closest('.segment-input');
    if (!input) return;
    const form = input.closest('form');
    const index = Number(form.dataset.step);
    if (!Number.isInteger(index) || index < 0 || index >= questions.length) return;

    drafts[index] = input.value;
    const arrow = form.querySelector('.segment-arrow');
    if (arrow) arrow.disabled = !input.value.trim();
    const error = form.querySelector('.field-error');
    if (error) error.textContent = '';
  });

  root.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.target.closest('form[data-step]');
    if (!form) return;

    const index = Number(form.dataset.step);
    if (index !== active) return;
    const input = form.querySelector('input');
    const error = form.querySelector('.field-error');
    if (!input || !error) return;

    const value = input.value.trim().replace(/\s+/g, ' ');
    if (!value) {
      error.textContent = 'Indiquez une réponse pour continuer.';
      input.focus();
      return;
    }
    if (questions[index].type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error.textContent = 'Saisissez une adresse e-mail valide.';
      input.focus();
      return;
    }

    saved[index] = value;
    drafts[index] = value;

    if (index === unlocked) {
      if (unlocked < questions.length - 1) {
        unlocked += 1;
        active = unlocked;
        newlyUnfolded = active;
      } else {
        active = -1;
      }
      returnTo = null;
    } else {
      active = returnTo === null ? unlocked : returnTo;
      returnTo = null;
    }

    render();
  });

  root.addEventListener('click', (event) => {
    const editButton = event.target.closest('button[data-edit]');
    if (!editButton) return;

    const index = Number(editButton.dataset.edit);
    if (!Number.isInteger(index) || !saved[index]) return;
    if (returnTo === null) returnTo = active;
    active = index;
    drafts[index] = saved[index];
    render();
  });

  reviewButton.addEventListener('click', () => {
    if (returnTo === null) returnTo = active;
    active = 0;
    drafts[0] = saved[0];
    render();
  });

  render(false);
})();
