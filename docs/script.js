const STORAGE_KEY = 'mr-handyman-checklist-v1';
const SHARE_PARAM = 'state';

const checklistData = [
  {
    id: 'best-practices',
    title: 'Mr. Handyman Best Practices',
    intro:
      'Confirm the franchise-specific call flow foundations. Mr. Handyman does not participate in the Own The Number (OTN) program, so rely on live-answer processes instead.',
    tasks: [
      {
        id: 'live-answer',
        label: 'Ensure live answer coverage is in place',
        description:
          'Verify that the office or answering service is staffed for live answering during business hours and that a back-door number exists for technicians to reach the office quickly.',
      },
      {
        id: 'backdoor-number',
        label: 'Confirm technician back-door routing works',
        description:
          'Place a test call using the technician back-door number. Confirm it bypasses the main greeting and rings the internal support line immediately.',
      },
    ],
    suggestions: (state) => {
      const undone = state.tasks.filter((task) => !task.completed);
      if (!undone.length) {
        return 'Live answer coverage and documentation look complete. Consider capturing screenshots or recordings of the live-answer flow for proof-of-performance.';
      }
      return `Focus on ${undone
        .map((task) => `“${task.label}”`)
        .join(', ')}. Align with Customer Operations if coverage is outsourced.`;
    },
    crossCheck: (state) => {
      const fails = [];
      if (!state.byId('live-answer')) {
        fails.push('Live answer staffing has not been confirmed.');
      }
      if (!state.byId('backdoor-number')) {
        fails.push('Technician back-door routing still needs validation.');
      }
      if (!fails.length) {
        return {
          tone: 'success',
          message: 'All foundational Mr. Handyman best practices are confirmed.',
        };
      }
      return {
        tone: 'warning',
        message: fails.join(' '),
      };
    },
  },
  {
    id: 'time-frames',
    title: 'Time Frames & Answering Rules',
    intro:
      'Document operating hours, holidays, and fallback destinations to guarantee consistent coverage across daytime, after-hours, and holiday routing.',
    tasks: [
      {
        id: 'daytime-frame',
        label: 'Create and test the Daytime Time Frame',
        descriptionHtml:
          'Confirm the days/hours the office is open and configure the matching Daytime Time Frame. Test by placing a call during an in-window time.<div class="note-line"><strong>Confirmed hours:</strong> <span class="fill-line" aria-hidden="true"></span></div>',
      },
      {
        id: 'holiday-frame',
        label: 'Build a Holiday Time Frame for the current year',
        description:
          'Ask the franchise which holidays they will close for this year. Create those entries and document any partial-day coverage expectations.',
      },
      {
        id: 'holiday-routing',
        label: 'Verify holiday routing destination',
        description:
          'Confirm the customer’s choice for holiday handling (voicemail, mobile redirect, or answering service) and test at least one scenario.',
      },
    ],
    options: [
      {
        id: 'after-hours-destination',
        type: 'radio',
        legend: 'After-hours routing preference (Default/AfterHours Rule)',
        description:
          'Capture the selected after-hours handling so you can audit it later.',
        choices: [
          {
            value: 'voicemail',
            label: 'Send to voicemail on Clarity phone',
            note: 'Voicemail box:',
          },
          {
            value: 'cell-then-voicemail',
            label: 'Ring cell phone(s), then Clarity voicemail',
          },
          {
            value: 'answering-service',
            label: 'Forward to answering service',
            note: 'Forward to number:',
          },
        ],
      },
    ],
    suggestions: (state) => {
      if (!state.byId('holiday-frame')) {
        return 'List upcoming holidays with the owner and confirm the calendar is populated before launch.';
      }
      if (!state.optionSelected('after-hours-destination')) {
        return 'Capture the after-hours preference to make sure the answering rules align with the customer’s expectations.';
      }
      return 'Run a simulated after-hours call to be certain that the selected option matches production behavior.';
    },
    crossCheck: (state) => {
      const pending = [];
      if (!state.byId('daytime-frame')) pending.push('Daytime Time Frame missing.');
      if (!state.byId('holiday-frame')) pending.push('Holiday Time Frame not configured.');
      if (!state.optionSelected('after-hours-destination'))
        pending.push('After-hours destination not captured.');
      if (!state.byId('holiday-routing'))
        pending.push('Holiday routing destination still needs testing.');
      if (!pending.length) {
        return {
          tone: 'success',
          message:
            'Time frames and answering rules are fully documented. Remember to revisit annually to refresh holiday dates.',
        };
      }
      return {
        tone: 'warning',
        message: pending.join(' '),
      };
    },
  },
  {
    id: 'call-queue',
    title: 'Call Queue 301 (“Please Hold”)',
    intro:
      'Use Call Queue 301 only when a hold message is required after the first unanswered attempt. Configure the greeting and failover carefully.',
    tasks: [
      {
        id: 'queue-created',
        label: 'Create Call Queue 301 with “Please Hold” name',
        description:
          'Make sure all extensions are added to the Ring All strategy inside the queue.',
      },
      {
        id: 'queue-moh',
        label: 'Upload greeting and enable introductory playback',
        description:
          'Music on Hold should play the message: “Thank you for calling Mr. Handyman. All of our representatives are currently assisting other callers. Please remain on the line for the next available representative.”',
      },
      {
        id: 'queue-timeout',
        label: 'Set ring timeout to 30 seconds and configure failover',
        description:
          'After 30 seconds, redirect calls to the selected voicemail or answering service destination. Disable Call Queue 301 voicemail to avoid dual prompts.',
      },
    ],
    options: [
      {
        id: 'queue-failover',
        type: 'radio',
        legend: 'Queue 301 failover destination',
        choices: [
          { value: 'voicemail', label: 'Clarity voicemail inbox' },
          { value: 'answering-service', label: 'Answering service' },
          { value: 'user-300', label: 'Return to User 300 flow' },
        ],
      },
    ],
    suggestions: (state) => {
      if (!state.byId('queue-moh')) {
        return 'Confirm the introductory greeting has the approved Mr. Handyman script and meets audio quality standards.';
      }
      if (!state.optionSelected('queue-failover')) {
        return 'Select and document the queue failover destination to avoid circular routing.';
      }
      return 'Place a live test call that routes through the queue to experience the caller journey end-to-end.';
    },
    crossCheck: (state) => {
      const pending = [];
      if (!state.byId('queue-created')) pending.push('Queue 301 has not been created.');
      if (!state.byId('queue-moh')) pending.push('Introductory greeting upload is outstanding.');
      if (!state.byId('queue-timeout')) pending.push('Ring timeout or failover destination not confirmed.');
      if (!state.optionSelected('queue-failover'))
        pending.push('Failover destination not documented.');
      if (!pending.length) {
        return {
          tone: 'success',
          message: 'Call Queue 301 is production-ready.',
        };
      }
      return {
        tone: 'warning',
        message: pending.join(' '),
      };
    },
  },
  {
    id: 'user-300',
    title: 'User 300 Routing',
    intro:
      'Configure User 300 as the primary daytime answering point with appropriate failover and voicemail settings.',
    tasks: [
      {
        id: 'user-created',
        label: 'Create User 300 and attach Daytime Time Frame',
        description:
          'Ensure the Daytime Time Frame covers the correct schedule and rings all extensions in a simple hunt for 20 seconds.',
      },
      {
        id: 'user-unanswered',
        label: 'Configure unanswered path for daytime calls',
        description:
          'Select between voicemail, redirecting to cell phones, redirecting to Call Queue 301, or using the answering service.',
      },
      {
        id: 'user-failover',
        label: 'Add failover forwarding number',
        description:
          'Provide a backup number (answering service or mobile) in the failover field to protect against outages.',
      },
      {
        id: 'after-hours-rule',
        label: 'Create Default/AfterHours Answering Rule',
        description:
          'Confirm the customer’s preference and implement the matching after-hours behavior.',
      },
      {
        id: 'holiday-rule',
        label: 'Attach Holiday Time Frame routing',
        description:
          'Link the Holiday Time Frame and send callers to the customer’s preferred destination.',
      },
      {
        id: 'voicemail-disabled',
        label: 'Disable User 300 voicemail box',
        description:
          'Ensure the voicemail box is disabled so calls use the configured destination instead of storing in User 300.',
      },
    ],
    options: [
      {
        id: 'user-unanswered-option',
        type: 'radio',
        legend: 'Unanswered daytime handling',
        choices: [
          { value: 'voicemail', label: 'Voicemail on Clarity phone' },
          { value: 'cells-then-voicemail', label: 'Redirect to cell phone(s) then Clarity voicemail' },
          { value: 'queue-301', label: 'Redirect to Call Queue 301 ("Please Hold" message)' },
          { value: 'answering-service', label: 'Send to answering service' },
        ],
      },
    ],
    suggestions: (state) => {
      if (!state.byId('user-failover')) {
        return 'Add a failover destination in case the office loses connectivity or power.';
      }
      if (!state.optionSelected('user-unanswered-option')) {
        return 'Align on the preferred unanswered treatment and update the radio selection to track the decision.';
      }
      return 'Double-check the Daytime hunt order to confirm priority extensions ring first where needed.';
    },
    crossCheck: (state) => {
      const pending = [];
      if (!state.byId('user-created')) pending.push('User 300 not yet provisioned.');
      if (!state.byId('user-unanswered')) pending.push('Unanswered daytime path is incomplete.');
      if (!state.optionSelected('user-unanswered-option'))
        pending.push('Unanswered daytime option not documented.');
      if (!state.byId('user-failover')) pending.push('Failover forwarding number missing.');
      if (!state.byId('after-hours-rule')) pending.push('After-hours answering rule not configured.');
      if (!state.byId('holiday-rule')) pending.push('Holiday routing not linked.');
      if (!state.byId('voicemail-disabled')) pending.push('User 300 voicemail is still enabled.');
      if (!pending.length) {
        return {
          tone: 'success',
          message: 'User 300 routing is fully validated.',
        };
      }
      return {
        tone: 'warning',
        message: pending.join(' '),
      };
    },
  },
  {
    id: 'additional',
    title: 'Additional Required Configuration',
    intro:
      'Finalize the domain-wide settings, recordings, and integrations that support the franchise’s workflow.',
    tasks: [
      {
        id: 'extension-config',
        label: 'Configure each extension profile',
        description:
          'Add user names, enable voicemail-to-email, configure simul-ring to mobile devices, and turn on voicemail transcription.',
      },
      {
        id: 'call-recording',
        label: 'Enable call recording for all users/queues',
        description:
          'Either enable recordings individually or activate domain-wide recording if all call paths require retention.',
      },
      {
        id: 'default-moh',
        label: 'Upload “Mr. Handyman MOH” audio',
        description:
          'Set the uploaded file as the default Music on Hold for the account.',
      },
      {
        id: 'service-titan',
        label: 'Configure ServiceTitan integrations (if applicable)',
        description:
          'Follow the ServiceTitan wiki for inbound forwarding and outbound click-to-call settings. Note any API credentials or login requirements.',
      },
      {
        id: 'efax',
        label: 'Activate eFax service',
        description:
          'Confirm the owner’s preferred email address and finalize eFax routing.',
      },
    ],
    suggestions: (state) => {
      if (!state.byId('default-moh')) {
        return 'Upload the Mr. Handyman MOH file early; large audio files can take time to transcode.';
      }
      if (!state.byId('service-titan')) {
        return 'Coordinate with the ServiceTitan admin to verify API access before attempting configuration.';
      }
      return 'Consider documenting call recording retention timelines and who can retrieve the recordings.';
    },
    crossCheck: (state) => {
      const pending = [];
      if (!state.byId('extension-config')) pending.push('Extension profiles still need updates.');
      if (!state.byId('call-recording')) pending.push('Call recording not enabled everywhere.');
      if (!state.byId('default-moh')) pending.push('Default Music on Hold not uploaded.');
      if (!state.byId('service-titan')) pending.push('ServiceTitan integration unchecked.');
      if (!state.byId('efax')) pending.push('eFax activation not confirmed.');
      if (!pending.length) {
        return {
          tone: 'success',
          message: 'Additional configuration items are complete.',
        };
      }
      return {
        tone: 'warning',
        message: pending.join(' '),
      };
    },
  },
];

function encodeSharedState(data) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(JSON.stringify(data));
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeSharedState(value) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const decoder = new TextDecoder();
  const json = decoder.decode(bytes);
  return JSON.parse(json);
}

function createShareablePayload(state) {
  const payload = { tasks: {}, options: {} };
  if (!state) {
    return payload;
  }

  Object.entries(state.tasks || {}).forEach(([id, completed]) => {
    if (completed) {
      payload.tasks[id] = true;
    }
  });

  Object.entries(state.options || {}).forEach(([id, value]) => {
    if (Array.isArray(value)) {
      if (value.length) {
        payload.options[id] = value.map((item) => String(item));
      }
    } else if (value !== undefined && value !== null && value !== '') {
      payload.options[id] = String(value);
    }
  });

  if (!Object.keys(payload.tasks).length) {
    delete payload.tasks;
  }
  if (!Object.keys(payload.options).length) {
    delete payload.options;
  }

  return payload;
}

function applySharedStatePayload(targetState, payload) {
  if (!targetState || !payload || typeof payload !== 'object') {
    return;
  }

  targetState.tasks = {};
  targetState.options = {};

  if (payload.tasks && typeof payload.tasks === 'object') {
    Object.entries(payload.tasks).forEach(([id, completed]) => {
      if (completed) {
        targetState.tasks[id] = true;
      }
    });
  }

  if (payload.options && typeof payload.options === 'object') {
    Object.entries(payload.options).forEach(([id, value]) => {
      if (Array.isArray(value)) {
        if (value.length) {
          targetState.options[id] = value.map((item) => String(item));
        }
      } else if (value !== undefined && value !== null && value !== '') {
        targetState.options[id] = String(value);
      }
    });
  }
}

function loadSharedStateFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (!params.has(SHARE_PARAM)) {
      return { status: 'none' };
    }

    const encoded = params.get(SHARE_PARAM);
    if (!encoded) {
      return {
        status: 'error',
        message: 'Shared link was empty. Starting with a blank checklist.',
      };
    }

    const decoded = decodeSharedState(encoded);
    if (!decoded || typeof decoded !== 'object') {
      return {
        status: 'error',
        message: 'Shared link could not be read. Starting with a blank checklist.',
      };
    }

    return { status: 'success', state: decoded };
  } catch (error) {
    console.warn('Failed to read shared checklist state', error);
    return {
      status: 'error',
      message: 'Shared link could not be read. Starting with a blank checklist.',
    };
  }
}

function removeShareParamFromUrl() {
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(SHARE_PARAM)) {
      return;
    }
    url.searchParams.delete(SHARE_PARAM);
    window.history.replaceState({}, document.title, url.toString());
  } catch (error) {
    console.warn('Unable to clean share parameter from URL', error);
  }
}

const storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { tasks: {}, options: {} };
    } catch (error) {
      console.warn('Unable to read saved state:', error);
      return { tasks: {}, options: {} };
    }
  },
  save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Unable to persist state:', error);
    }
  },
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Unable to clear saved state:', error);
    }
  },
};

const savedState = storage.load();

let shareStatusElement = null;
let pendingShareImportMessage = '';
let pendingShareImportTone = 'info';

const sharedStateLoadResult = loadSharedStateFromUrl();
if (sharedStateLoadResult.status === 'success') {
  applySharedStatePayload(savedState, sharedStateLoadResult.state);
  storage.save(savedState);
  pendingShareImportMessage =
    'Loaded checklist progress from a shared link. Updates will now save to this device.';
  pendingShareImportTone = 'success';
  removeShareParamFromUrl();
} else if (sharedStateLoadResult.status === 'error') {
  pendingShareImportMessage = sharedStateLoadResult.message;
  pendingShareImportTone = 'warning';
  removeShareParamFromUrl();
}

let previewOverlay = null;
let previewDialog = null;
let previewBody = null;
let previewHideTimer = null;
let lastFocusedElement = null;
let previewFocusableElements = [];
let previewFirstFocusable = null;
let previewLastFocusable = null;
let livePreviewContainer = null;
let livePreviewBody = null;
let latestPreviewSnapshot = null;

function clearShareStatus() {
  if (!shareStatusElement) return;
  shareStatusElement.innerHTML = '';
  shareStatusElement.removeAttribute('data-tone');
  shareStatusElement.hidden = true;
}

function setShareStatus(message, tone = 'info', link) {
  if (!shareStatusElement) return;

  shareStatusElement.innerHTML = '';
  shareStatusElement.dataset.tone = tone;
  shareStatusElement.hidden = false;

  const messageEl = document.createElement('strong');
  messageEl.className = 'share-status__message';
  messageEl.textContent = message;
  shareStatusElement.appendChild(messageEl);

  if (link) {
    const linkBlock = document.createElement('div');
    linkBlock.className = 'share-status__link-block';

    const hint = document.createElement('span');
    hint.textContent = 'Share this link:';
    linkBlock.appendChild(hint);

    const anchor = document.createElement('a');
    anchor.className = 'share-status__link';
    anchor.href = link;
    anchor.textContent = link;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    linkBlock.appendChild(anchor);

    shareStatusElement.appendChild(linkBlock);
  }
}

function buildShareUrl() {
  const payload = createShareablePayload(savedState);
  const encoded = encodeSharedState(payload);
  const url = new URL(window.location.href);
  url.searchParams.set(SHARE_PARAM, encoded);
  return url.toString();
}

async function shareCurrentProgress() {
  const shareUrl = buildShareUrl();

  if (navigator.share) {
    const shareData = {
      title: 'Mr. Handyman Best Practices Checklist',
      text: 'Review the Mr. Handyman verification checklist progress I captured.',
      url: shareUrl,
    };
    try {
      if (!navigator.canShare || navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setShareStatus(
          'Share dialog opened. If you still need the URL, copy it from the link below.',
          'success',
          shareUrl
        );
        return;
      }
    } catch (error) {
      if (error && error.name === 'AbortError') {
        setShareStatus(
          'Share canceled. Copy the link below to send your progress manually.',
          'info',
          shareUrl
        );
        return;
      }
      console.warn('Web Share API failed, falling back to clipboard.', error);
    }
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus('Shareable link copied to your clipboard.', 'success', shareUrl);
      return;
    } catch (error) {
      console.warn('Clipboard write failed', error);
    }
  }

  setShareStatus('Copy this link to share your progress.', 'warning', shareUrl);
}

function setInsightMessage(target, title, message) {
  if (!target) return;
  target.innerHTML = '';
  const titleEl = document.createElement('strong');
  titleEl.textContent = title;
  target.appendChild(titleEl);

  if (message) {
    const messageEl = document.createElement('span');
    messageEl.className = 'section__insights-text';
    messageEl.textContent = message;
    target.appendChild(messageEl);
  }
}

function isElementVisible(element) {
  if (!element) return false;
  if (element.hasAttribute('hidden') || element.closest('[hidden]')) {
    return false;
  }
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden';
}

function preparePreviewFocusTrap() {
  if (!previewOverlay) return;
  const focusableSelector =
    'a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  previewFocusableElements = Array.from(
    previewOverlay.querySelectorAll(focusableSelector)
  ).filter((element) => isElementVisible(element));

  previewFirstFocusable =
    previewFocusableElements[0] || previewDialog || previewOverlay;
  previewLastFocusable =
    previewFocusableElements[previewFocusableElements.length - 1] ||
    previewFirstFocusable;
}

function createStateHelpers(section) {
  const taskStatus = (section.tasks || []).map((task) => ({
    ...task,
    completed: Boolean(savedState.tasks[task.id]),
  }));

  return {
    tasks: taskStatus,
    byId(id) {
      return Boolean(savedState.tasks[id]);
    },
    optionSelected(groupId) {
      const selection = savedState.options[groupId];
      if (Array.isArray(selection)) {
        return selection.length > 0;
      }
      return Boolean(selection);
    },
  };
}

function renderChecklist() {
  const container = document.getElementById('checklist');
  const sectionTemplate = document.getElementById('section-template');
  const taskTemplate = document.getElementById('task-template');
  const optionTemplate = document.getElementById('option-template');
  const radioTemplate = document.getElementById('radio-template');
  const checkboxTemplate = document.getElementById('checkbox-template');

  checklistData.forEach((section) => {
    const sectionFragment = sectionTemplate.content.cloneNode(true);
    const sectionEl = sectionFragment.querySelector('.section');
    sectionEl.dataset.sectionId = section.id;
    sectionFragment.querySelector('.section__title').textContent = section.title;
    sectionFragment.querySelector('.section__intro').textContent = section.intro;

    const contentEl = sectionFragment.querySelector('.section__content');

    (section.tasks || []).forEach((task) => {
      const taskFragment = taskTemplate.content.cloneNode(true);
      const taskEl = taskFragment.querySelector('.task');
      taskEl.dataset.taskId = task.id;

      const checkbox = taskFragment.querySelector('input[type="checkbox"]');
      checkbox.checked = Boolean(savedState.tasks[task.id]);
      taskEl.classList.toggle('completed', checkbox.checked);
      checkbox.addEventListener('change', () => {
        savedState.tasks[task.id] = checkbox.checked;
        taskEl.classList.toggle('completed', checkbox.checked);
        storage.save(savedState);
        updateProgress();
      });

      taskFragment.querySelector('.task__text').textContent = task.label;
      const descriptionEl = taskFragment.querySelector('.task__description');
      if (task.descriptionHtml) {
        descriptionEl.innerHTML = task.descriptionHtml;
      } else {
        descriptionEl.textContent = task.description || 'Add notes as needed.';
      }

      contentEl.appendChild(taskFragment);
    });

    (section.options || []).forEach((group) => {
      const optionFragment = optionTemplate.content.cloneNode(true);
      const fieldset = optionFragment.querySelector('fieldset');
      fieldset.dataset.groupId = group.id;
      fieldset.querySelector('legend').textContent = group.legend;
      if (group.description) {
        const desc = document.createElement('p');
        desc.className = 'options__description';
        desc.textContent = group.description;
        fieldset.appendChild(desc);
      }

      const storedValue = savedState.options[group.id];

      group.choices.forEach((choice) => {
        const template = group.type === 'checkbox' ? checkboxTemplate : radioTemplate;
        const optionNode = template.content.cloneNode(true);
        const input = optionNode.querySelector('input');
        const optionLabel = optionNode.querySelector('.option__label');

        if (group.type === 'radio') {
          input.type = 'radio';
          input.name = group.id;
          input.value = choice.value;
          input.checked = storedValue === choice.value;
        } else {
          input.type = 'checkbox';
          input.name = `${group.id}-${choice.value}`;
          input.value = choice.value;
          input.checked = Array.isArray(storedValue)
            ? storedValue.includes(choice.value)
            : false;
        }

        optionLabel.textContent = choice.label;
        if (choice.note) {
          const note = document.createElement('span');
          note.className = 'option__note';
          const labelSpan = document.createElement('span');
          labelSpan.textContent = choice.note;
          const lineSpan = document.createElement('span');
          lineSpan.className = 'fill-line';
          lineSpan.setAttribute('aria-hidden', 'true');
          note.appendChild(labelSpan);
          note.appendChild(lineSpan);
          optionLabel.appendChild(note);
        }

        input.addEventListener('change', () => {
          if (group.type === 'radio') {
            savedState.options[group.id] = input.value;
          } else {
            const current = Array.isArray(savedState.options[group.id])
              ? [...savedState.options[group.id]]
              : [];
            if (input.checked) {
              current.push(choice.value);
            } else {
              const index = current.indexOf(choice.value);
              if (index >= 0) current.splice(index, 1);
            }
            savedState.options[group.id] = current;
          }
          storage.save(savedState);
          updateProgress();
        });

        fieldset.appendChild(optionNode);
      });

      contentEl.appendChild(optionFragment);
    });

    const insightsEl = sectionFragment.querySelector('.section__insights');
    const suggestBtn = sectionFragment.querySelector('.btn-suggest');
    const crossCheckBtn = sectionFragment.querySelector('.btn-crosscheck');

    suggestBtn.addEventListener('click', () => {
      const helpers = createStateHelpers(section);
      const suggestion = section.suggestions ? section.suggestions(helpers) : '';
      if (suggestion) {
        setInsightMessage(insightsEl, 'AI Suggestion', suggestion);
        insightsEl.classList.add('is-visible');
        insightsEl.classList.remove('is-success');
        insightsEl.dataset.tone = 'info';
      } else {
        setInsightMessage(insightsEl, 'AI Suggestion', 'No suggestion available.');
        insightsEl.classList.add('is-visible');
        insightsEl.classList.remove('is-success');
        insightsEl.dataset.tone = 'info';
      }
    });

    crossCheckBtn.addEventListener('click', () => {
      const helpers = createStateHelpers(section);
      if (section.crossCheck) {
        const { tone, message } = section.crossCheck(helpers);
        setInsightMessage(insightsEl, 'Cross-check', message);
        insightsEl.classList.add('is-visible');
        insightsEl.dataset.tone = tone;
        insightsEl.classList.toggle('is-success', tone === 'success');
      }
    });

    container.appendChild(sectionFragment);
  });
}

function updateProgress() {
  const progressText = document.querySelector('.progress__summary');
  const progressBar = document.querySelector('.progress-bar');
  const progressBarFill = document.querySelector('.progress-bar__fill');
  const snapshot = getPreviewSnapshot();
  latestPreviewSnapshot = snapshot;

  if (progressBarFill) {
    progressBarFill.style.width = `${snapshot.percent}%`;
  }
  if (progressBar) {
    progressBar.setAttribute('aria-valuenow', snapshot.percent);
  }
  if (progressText) {
    progressText.textContent = `${snapshot.completed} of ${snapshot.total} checklist items captured (${snapshot.percent}%).`;
  }

  renderLivePreview(snapshot);
  refreshPreviewIfOpen(snapshot);
}

function bindControls() {
  shareStatusElement = document.getElementById('share-status');
  if (shareStatusElement) {
    clearShareStatus();
    if (pendingShareImportMessage) {
      setShareStatus(pendingShareImportMessage, pendingShareImportTone);
      pendingShareImportMessage = '';
      pendingShareImportTone = 'info';
    }
  }

  const clearButton = document.getElementById('btn-clear');
  clearButton.addEventListener('click', () => {
    if (confirm('This will remove all saved progress. Continue?')) {
      storage.clear();
      Object.keys(savedState.tasks).forEach((key) => delete savedState.tasks[key]);
      Object.keys(savedState.options).forEach((key) => delete savedState.options[key]);
      document.querySelectorAll('input[type="checkbox"]').forEach((input) => {
        input.checked = false;
      });
      document
        .querySelectorAll('input[type="radio"]:checked')
        .forEach((input) => (input.checked = false));
      updateProgress();
      document
        .querySelectorAll('.section__insights')
        .forEach((el) => el.classList.remove('is-visible'));
      clearShareStatus();
    }
  });

  const shareButton = document.getElementById('btn-share');
  if (shareButton) {
    shareButton.addEventListener('click', async () => {
      clearShareStatus();
      shareButton.disabled = true;
      try {
        await shareCurrentProgress();
      } finally {
        shareButton.disabled = false;
      }
    });
  }

  const previewButton = document.getElementById('btn-preview');
  if (previewButton) {
    previewButton.addEventListener('click', () => {
      lastFocusedElement = document.activeElement;
      openPreview();
    });
  }

  document.querySelectorAll('[data-preview-close]').forEach((element) => {
    element.addEventListener('click', closePreview);
  });
}

function init() {
  renderChecklist();
  bindControls();
  livePreviewContainer = document.getElementById('live-preview');
  livePreviewBody = livePreviewContainer
    ? livePreviewContainer.querySelector('.live-preview__body')
    : null;
  previewOverlay = document.getElementById('preview-overlay');
  previewDialog = previewOverlay ? previewOverlay.querySelector('.preview__dialog') : null;
  previewBody = previewDialog ? previewDialog.querySelector('.preview__body') : null;
  if (previewOverlay) {
    previewOverlay.addEventListener('click', (event) => {
      if (event.target === previewOverlay) {
        closePreview();
      }
    });
  }
  updateProgress();
}

document.addEventListener('DOMContentLoaded', init);

function computeSectionPreview(section) {
  const helpers = createStateHelpers(section);
  const items = [];

  (helpers.tasks || []).forEach((task) => {
    items.push({
      label: task.label,
      state: task.completed ? 'complete' : 'pending',
      text: task.completed ? 'Complete' : 'Needs attention',
    });
  });

  (section.options || []).forEach((group) => {
    if (group.type === 'radio') {
      const value = savedState.options[group.id];
      const choice = (group.choices || []).find((option) => option.value === value);
      items.push({
        label: group.legend,
        state: choice ? 'complete' : 'pending',
        text: choice ? choice.label : 'Not selected',
      });
    } else {
      const value = savedState.options[group.id];
      const selections = Array.isArray(value) ? value : [];
      const labels = (group.choices || [])
        .filter((option) => selections.includes(option.value))
        .map((option) => option.label);
      items.push({
        label: group.legend,
        state: labels.length ? 'complete' : 'pending',
        text: labels.length ? labels.join(', ') : 'No selections',
      });
    }
  });

  const crossCheck = section.crossCheck ? section.crossCheck(helpers) : null;
  const suggestion = section.suggestions ? section.suggestions(helpers) : '';

  return {
    title: section.title,
    completed: items.filter((item) => item.state === 'complete').length,
    total: items.length,
    items,
    crossCheck,
    suggestion,
  };
}

function getPreviewSnapshot() {
  const sections = checklistData.map((section) => computeSectionPreview(section));
  const totals = sections.reduce(
    (acc, section) => {
      acc.completed += section.completed;
      acc.total += section.total;
      return acc;
    },
    { completed: 0, total: 0 }
  );

  const percent = totals.total ? Math.round((totals.completed / totals.total) * 100) : 0;

  return {
    sections,
    completed: totals.completed,
    total: totals.total,
    percent,
  };
}

function renderLivePreview(snapshot = latestPreviewSnapshot || getPreviewSnapshot()) {
  if (!livePreviewBody) return;

  const data = snapshot || getPreviewSnapshot();
  const fragment = document.createDocumentFragment();

  const summary = document.createElement('div');
  summary.className = 'live-preview__summary';

  const summaryHeading = document.createElement('strong');
  summaryHeading.textContent = 'Snapshot overview';
  summary.appendChild(summaryHeading);

  const summaryDetail = document.createElement('span');
  summaryDetail.textContent = data.total
    ? `${data.completed} of ${data.total} environment items captured (${data.percent}%).`
    : 'No environment items have been captured yet.';
  summary.appendChild(summaryDetail);

  fragment.appendChild(summary);

  data.sections.forEach((section) => {
    const sectionEl = document.createElement('section');
    sectionEl.className = 'live-preview__section';

    const headerEl = document.createElement('div');
    headerEl.className = 'live-preview__section-header';

    const titleEl = document.createElement('h3');
    titleEl.className = 'live-preview__section-title';
    titleEl.textContent = section.title;
    headerEl.appendChild(titleEl);

    const progressEl = document.createElement('span');
    progressEl.className = 'live-preview__section-progress';
    progressEl.textContent = section.total ? `${section.completed}/${section.total}` : 'No items';
    headerEl.appendChild(progressEl);

    sectionEl.appendChild(headerEl);

    if (section.crossCheck && section.crossCheck.message) {
      const statusEl = document.createElement('p');
      statusEl.className = 'live-preview__section-status';
      statusEl.dataset.tone = section.crossCheck.tone || 'info';
      statusEl.textContent = section.crossCheck.message;
      sectionEl.appendChild(statusEl);
    }

    if (section.suggestion) {
      const suggestionEl = document.createElement('p');
      suggestionEl.className = 'live-preview__section-suggestion';
      suggestionEl.textContent = section.suggestion;
      sectionEl.appendChild(suggestionEl);
    }

    if (section.items.length) {
      const itemsList = document.createElement('ul');
      itemsList.className = 'live-preview__items';

      section.items.forEach((item) => {
        const itemRow = document.createElement('li');
        itemRow.className = 'live-preview__item';

        const label = document.createElement('span');
        label.className = 'live-preview__item-label';
        label.textContent = item.label;
        itemRow.appendChild(label);

        const status = document.createElement('span');
        status.className = 'live-preview__item-status';
        status.dataset.state = item.state;
        status.textContent = item.text;
        itemRow.appendChild(status);

        itemsList.appendChild(itemRow);
      });

      sectionEl.appendChild(itemsList);
    }

    fragment.appendChild(sectionEl);
  });

  livePreviewBody.innerHTML = '';
  livePreviewBody.appendChild(fragment);
}

function renderPreviewContent(snapshot = latestPreviewSnapshot || getPreviewSnapshot()) {
  if (!previewBody) return;

  const data = snapshot || getPreviewSnapshot();
  const fragment = document.createDocumentFragment();

  const summary = document.createElement('div');
  summary.className = 'preview__summary';
  summary.textContent = data.total
    ? `${data.completed} of ${data.total} environment items are configured.`
    : 'No configuration items defined.';
  fragment.appendChild(summary);

  data.sections.forEach((section) => {
    const sectionEl = document.createElement('section');
    sectionEl.className = 'preview__section';

    const headerEl = document.createElement('div');
    headerEl.className = 'preview__section-header';

    const titleEl = document.createElement('h3');
    titleEl.className = 'preview__section-title';
    titleEl.textContent = section.title;
    headerEl.appendChild(titleEl);

    const progressEl = document.createElement('span');
    progressEl.className = 'preview__section-progress';
    progressEl.textContent = section.total
      ? `${section.completed}/${section.total} complete`
      : 'No items';
    headerEl.appendChild(progressEl);

    sectionEl.appendChild(headerEl);

    if (section.crossCheck && section.crossCheck.message) {
      const statusEl = document.createElement('p');
      statusEl.className = 'preview__section-status';
      statusEl.dataset.tone = section.crossCheck.tone || 'info';
      statusEl.textContent = section.crossCheck.message;
      sectionEl.appendChild(statusEl);
    }

    if (section.suggestion) {
      const suggestionEl = document.createElement('p');
      suggestionEl.className = 'preview__section-suggestion';
      suggestionEl.textContent = section.suggestion;
      sectionEl.appendChild(suggestionEl);
    }

    if (section.items.length) {
      const itemsList = document.createElement('div');
      itemsList.className = 'preview__items';

      section.items.forEach((item) => {
        const itemRow = document.createElement('div');
        itemRow.className = 'preview__item';

        const label = document.createElement('span');
        label.className = 'preview__item-label';
        label.textContent = item.label;
        itemRow.appendChild(label);

        const status = document.createElement('span');
        status.className = 'preview__item-status';
        status.dataset.state = item.state;
        status.textContent = item.text;
        itemRow.appendChild(status);

        itemsList.appendChild(itemRow);
      });

      sectionEl.appendChild(itemsList);
    }

    fragment.appendChild(sectionEl);
  });

  previewBody.innerHTML = '';
  previewBody.appendChild(fragment);
  preparePreviewFocusTrap();
}

function refreshPreviewIfOpen(snapshot = latestPreviewSnapshot || getPreviewSnapshot()) {
  if (previewOverlay && previewOverlay.getAttribute('aria-hidden') === 'false') {
    renderPreviewContent(snapshot);
  }
}

function openPreview() {
  if (!previewOverlay) return;

  if (previewHideTimer) {
    clearTimeout(previewHideTimer);
    previewHideTimer = null;
  }

  renderPreviewContent(latestPreviewSnapshot || getPreviewSnapshot());
  previewOverlay.hidden = false;
  requestAnimationFrame(() => {
    previewOverlay.setAttribute('aria-hidden', 'false');
  });
  document.body.classList.add('no-scroll');

  const closeButton = previewOverlay.querySelector('.preview__close');
  const focusTarget =
    (previewFirstFocusable && previewOverlay.contains(previewFirstFocusable)
      ? previewFirstFocusable
      : null) ||
    closeButton ||
    previewDialog;
  if (focusTarget && typeof focusTarget.focus === 'function') {
    focusTarget.focus();
  }

  document.addEventListener('keydown', handlePreviewKeydown);
}

function closePreview() {
  if (!previewOverlay) return;

  previewOverlay.setAttribute('aria-hidden', 'true');
  if (previewHideTimer) {
    clearTimeout(previewHideTimer);
  }
  previewHideTimer = setTimeout(() => {
    previewOverlay.hidden = true;
    previewHideTimer = null;
  }, 200);

  document.body.classList.remove('no-scroll');
  document.removeEventListener('keydown', handlePreviewKeydown);
  previewFocusableElements = [];
  previewFirstFocusable = null;
  previewLastFocusable = null;

  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

function handlePreviewKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    closePreview();
    return;
  }

  if (event.key === 'Tab' && previewOverlay && previewOverlay.getAttribute('aria-hidden') === 'false') {
    const activeElement = document.activeElement;
    const first = previewFirstFocusable || previewDialog;
    const last = previewLastFocusable || first;

    if (!previewFocusableElements.length) {
      event.preventDefault();
      if (first && typeof first.focus === 'function') {
        first.focus();
      }
      return;
    }

    if (!previewOverlay.contains(activeElement)) {
      event.preventDefault();
      if (first && typeof first.focus === 'function') {
        first.focus();
      }
      return;
    }

    if (event.shiftKey) {
      if (activeElement === first) {
        event.preventDefault();
        if (last && typeof last.focus === 'function') {
          last.focus();
        }
      }
    } else if (activeElement === last) {
      event.preventDefault();
      if (first && typeof first.focus === 'function') {
        first.focus();
      }
    }
  }
}
