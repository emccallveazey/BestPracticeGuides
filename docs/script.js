const STORAGE_KEY = 'mr-handyman-checklist-v1';
const SHARE_PARAM = 'state';

const checklistData = [
  {
    id: 'best-practices',
    title: 'Mr. Handyman Best Practices',
    intro:
      'Confirm the franchise-specific call flow foundations. Mr. Handyman does not participate in the Own The Number (OTN) program, so rely on live-answer processes instead.',
    suggestions: () =>
      'Document who provides live answer coverage and keep the technician hotline information handy for quick updates.',
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
    closingChecklist: [
      {
        id: 'installation-confirmation',
        label: 'Installation Confirmation',
      },
      {
        id: 'test-calls',
        label: 'Inbound/Outbound Test Calls Completed and Outbound CID Confirmed with Customer',
      },
      {
        id: 'texting-enabled',
        label: 'Texting Enabled and tested inbound and outbound SMS and MMS',
      },
      {
        id: 'devices-online',
        label: 'Confirm All Devices are Online at Time of Install',
      },
      {
        id: 'coa-tools',
        label: 'Confirm COA mobile and COA webphone has been Installed and tested',
      },
      {
        id: 'routing-tests',
        label: 'Test Calls placed to confirm call routing accuracy',
      },
      {
        id: 'hours-routing',
        label: 'Confirm Business Hours and Afterhours Routing is in Place',
      },
      {
        id: 'porting-poc',
        label:
          'Contacted the Point of Contact (POC) on the day of porting to confirm if they need anything else and to inform them of handoff email',
      },
      {
        id: 'required-routing',
        label: 'Required Routing Required for this franchise?',
      },
      {
        id: 'best-practice-followed',
        label: 'If Yes, Was Best Practice Guide Followed?',
      },
      {
        id: 'portal-training',
        label: 'Portal Training Completed and with who?',
      },
      {
        id: 'portal-home-review',
        label: 'Review Portal Home and Active call List',
      },
      {
        id: 'timeframe-review',
        label: 'Review Timeframes and how to adjust',
      },
      {
        id: 'call-history-review',
        label: 'Review Call History, Call Recordings and Cradle to Grave',
      },
      {
        id: 'messaging-voicemail-review',
        label: 'Review Portal Messaging and Voicemail',
      },
      {
        id: 'miscellaneous',
        label: 'Miscellaneous',
      },
      {
        id: 'rabbit-run',
        label: "Rabbit Run Cellular Enabled and Tested at Customer's Location",
      },
      {
        id: 'failover-tested',
        label: "Failover Enabled and Tested at Customer's Location",
      },
      {
        id: 'vertex-configured',
        label: 'Vertex Configured/Tested with POS',
      },
      {
        id: 'api-configured',
        label: 'API enabled/configured',
      },
      {
        id: 'fax-tested',
        label: 'Fax configured and tested inbound/outbound',
      },
      {
        id: 'summary',
        label: 'Summary - All features enabled from quote',
      },
      {
        id: 'network-overview',
        label:
          'Network: (ISP--->Modem---->RabbitRun/Router/Switch/Firewall--->Phones) (Also Add this to the Network Notes section of CBS)',
      },
      {
        id: 'network-example',
        label:
          'Example: Spectrum--->Motorola SB6121--->RRT200-->Stemeo POE104--->Poly VVX350',
      },
      {
        id: 'dhcp-static',
        label: 'DHCP/Static, if static list details',
      },
      {
        id: 'pos-details',
        label: 'POS Details',
      },
      {
        id: 'pos-provider',
        label: 'POS Provider, Ports Opened, POS Firewall Settings',
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
  const payload = { tasks: {}, options: {}, closing: {} };
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

  if (state.closing && typeof state.closing === 'object') {
    Object.entries(state.closing).forEach(([id, value]) => {
      if (!value || typeof value !== 'object') return;
      const entry = {};
      if (value.response) {
        entry.response = String(value.response);
      }
      if (value.note) {
        entry.note = String(value.note);
      }
      if (entry.response || entry.note) {
        payload.closing[id] = entry;
      }
    });
  }

  if (!Object.keys(payload.closing).length) {
    delete payload.closing;
  }

  return payload;
}

function applySharedStatePayload(targetState, payload) {
  if (!targetState || !payload || typeof payload !== 'object') {
    return;
  }

  targetState.tasks = {};
  targetState.options = {};
  targetState.closing = {};

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

  if (payload.closing && typeof payload.closing === 'object') {
    Object.entries(payload.closing).forEach(([id, value]) => {
      if (!value || typeof value !== 'object') return;
      const entry = {};
      if (value.response) {
        entry.response = String(value.response);
      }
      if (value.note) {
        entry.note = String(value.note);
      }
      if (entry.response || entry.note) {
        targetState.closing[id] = entry;
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
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        tasks: parsed.tasks || {},
        options: parsed.options || {},
        closing: parsed.closing || {},
      };
    } catch (error) {
      console.warn('Unable to read saved state:', error);
      return { tasks: {}, options: {}, closing: {} };
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
if (!savedState.tasks) savedState.tasks = {};
if (!savedState.options) savedState.options = {};
if (!savedState.closing) savedState.closing = {};

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
let demoOverlay = null;
let demoDialog = null;
let demoStepIndicator = null;
let demoStepTitle = null;
let demoStepText = null;
let demoPrevButton = null;
let demoNextButton = null;
let demoCloseButtons = [];
let demoCurrentStep = 0;
let demoActive = false;
let demoStateBackup = null;
let demoHighlightedElement = null;
let demoHideTimer = null;
let demoReturnFocus = null;

const demoSamplePayload = {
  tasks: {
    'daytime-frame': true,
    'holiday-frame': true,
    'queue-created': true,
    'queue-moh': true,
    'queue-timeout': true,
    'user-created': true,
    'user-unanswered': true,
    'user-failover': true,
    'after-hours-rule': true,
    'holiday-rule': true,
    'voicemail-disabled': true,
    'extension-config': true,
    'call-recording': true,
    'default-moh': true,
  },
  options: {
    'after-hours-destination': 'answering-service',
    'queue-failover': 'answering-service',
    'user-unanswered-option': 'queue-301',
  },
  closing: {
    'installation-confirmation': { response: 'yes' },
    'test-calls': { response: 'yes' },
    'devices-online': { response: 'yes' },
    'porting-poc': {
      response: 'yes',
      note: 'Confirmed needs met and sent handoff email',
    },
    'portal-training': { response: 'yes', note: 'Owner and office manager' },
    summary: { response: 'yes' },
    'network-overview': {
      response: 'yes',
      note: 'Spectrum → Motorola SB6121 → RRT200 → Stemeo POE104 → Poly VVX350',
    },
    'failover-tested': { response: 'no', note: 'Awaiting failover hardware delivery' },
  },
};

const demoSteps = [
  {
    id: 'progress',
    target: '.progress',
    title: 'Track overall progress',
    description:
      'The progress bar updates automatically as you check off items, showing stakeholders how much of the launch plan is complete.',
  },
  {
    id: 'timeframes',
    target: '.section[data-section-id="time-frames"]',
    title: 'Review AI suggestions and cross-checks',
    description:
      'Each section provides AI suggestions and cross-check callouts. Use them to confirm holiday routing and other time frame details before go-live.',
  },
  {
    id: 'closing',
    target: '.section[data-section-id="user-300"] .closing-checklist',
    title: 'Capture installation sign-off',
    description:
      'The closing checklist stores franchise sign-off responses and notes so you can document why any remaining items are pending.',
  },
  {
    id: 'share',
    target: '#btn-share',
    title: 'Generate a shareable link',
    description:
      'Share Progress Link packages the current state into a URL for teammates or leadership. Copy it directly or open the Web Share dialog.',
  },
  {
    id: 'preview',
    target: '#live-preview',
    title: 'Show the environment preview',
    description:
      'The live environment preview summarizes completion counts, cross-check results, and guidance so you can present readiness in real time.',
  },
];

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

function cloneDemoState(state) {
  try {
    return JSON.parse(
      JSON.stringify(
        state || {
          tasks: {},
          options: {},
          closing: {},
        }
      )
    );
  } catch (error) {
    console.warn('Unable to clone checklist state for demo backup.', error);
    return { tasks: {}, options: {}, closing: {} };
  }
}

function applyDemoPayload(payload) {
  applySharedStatePayload(savedState, payload);
  storage.save(savedState);
  renderChecklist();
  updateProgress();
}

function restoreStateFromBackup(backup) {
  const source = backup || { tasks: {}, options: {}, closing: {} };

  savedState.tasks = {};
  if (source.tasks && typeof source.tasks === 'object') {
    Object.entries(source.tasks).forEach(([id, value]) => {
      if (value) {
        savedState.tasks[id] = true;
      }
    });
  }

  savedState.options = {};
  if (source.options && typeof source.options === 'object') {
    Object.entries(source.options).forEach(([id, value]) => {
      if (Array.isArray(value)) {
        savedState.options[id] = [...value];
      } else if (value !== undefined && value !== null) {
        savedState.options[id] = value;
      }
    });
  }

  savedState.closing = {};
  if (source.closing && typeof source.closing === 'object') {
    Object.entries(source.closing).forEach(([id, value]) => {
      if (!value || typeof value !== 'object') return;
      const entry = {};
      if (value.response) entry.response = value.response;
      if (value.note) entry.note = value.note;
      if (entry.response || entry.note) {
        savedState.closing[id] = entry;
      }
    });
  }

  storage.save(savedState);
  renderChecklist();
  updateProgress();
}

function clearDemoHighlight() {
  if (demoHighlightedElement) {
    demoHighlightedElement.classList.remove('demo-highlight');
    demoHighlightedElement = null;
  }
}

function highlightDemoTarget(selector) {
  clearDemoHighlight();
  if (!selector) return;

  const element = document.querySelector(selector);
  if (!element) {
    return;
  }

  element.classList.add('demo-highlight');
  if (typeof element.scrollIntoView === 'function') {
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  }
  demoHighlightedElement = element;
}

function updateDemoControls() {
  if (!demoActive) {
    return;
  }

  const totalSteps = demoSteps.length;
  const currentIndex = Math.min(Math.max(demoCurrentStep, 0), totalSteps - 1);
  const step = demoSteps[currentIndex];

  if (demoStepIndicator) {
    demoStepIndicator.textContent = `Step ${currentIndex + 1} of ${totalSteps}`;
  }
  if (demoStepTitle) {
    demoStepTitle.textContent = step ? step.title : '';
  }
  if (demoStepText) {
    demoStepText.textContent = step ? step.description : '';
  }

  if (demoPrevButton) {
    demoPrevButton.disabled = currentIndex === 0;
  }

  if (demoNextButton) {
    demoNextButton.textContent = currentIndex === totalSteps - 1 ? 'Finish' : 'Next';
  }

  if (step && step.target) {
    highlightDemoTarget(step.target);
  } else {
    clearDemoHighlight();
  }
}

function goToDemoStep(index) {
  if (!demoActive) {
    return;
  }

  demoCurrentStep = Math.min(Math.max(index, 0), demoSteps.length - 1);
  updateDemoControls();
}

function openDemoOverlay() {
  if (!demoOverlay) return;

  if (demoHideTimer) {
    clearTimeout(demoHideTimer);
    demoHideTimer = null;
  }

  demoOverlay.hidden = false;
  requestAnimationFrame(() => {
    demoOverlay.setAttribute('aria-hidden', 'false');
  });
  document.body.classList.add('no-scroll');

  const focusTarget = demoDialog || demoOverlay;
  if (focusTarget && typeof focusTarget.focus === 'function') {
    focusTarget.focus();
  }

  document.addEventListener('keydown', handleDemoKeydown);
}

function closeDemoOverlay() {
  if (!demoOverlay) return;

  demoOverlay.setAttribute('aria-hidden', 'true');
  if (demoHideTimer) {
    clearTimeout(demoHideTimer);
  }
  demoHideTimer = setTimeout(() => {
    demoOverlay.hidden = true;
    demoHideTimer = null;
  }, 200);

  document.body.classList.remove('no-scroll');
  document.removeEventListener('keydown', handleDemoKeydown);
}

function handleDemoKeydown(event) {
  if (!demoActive) {
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    endDemoPresentation();
    return;
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    if (demoCurrentStep < demoSteps.length - 1) {
      goToDemoStep(demoCurrentStep + 1);
    } else {
      endDemoPresentation();
    }
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    if (demoCurrentStep > 0) {
      goToDemoStep(demoCurrentStep - 1);
    }
  }
}

function startDemoPresentation() {
  if (demoActive) {
    goToDemoStep(0);
    return;
  }

  demoActive = true;
  demoReturnFocus = document.activeElement;
  demoStateBackup = cloneDemoState(savedState);
  applyDemoPayload(demoSamplePayload);

  if (shareStatusElement) {
    setShareStatus(
      'Presentation demo loaded example data. Advance through the walkthrough or end the demo to restore your saved work.',
      'info'
    );
  }

  openDemoOverlay();
  goToDemoStep(0);
}

function endDemoPresentation() {
  if (!demoActive) {
    return;
  }

  demoActive = false;
  closeDemoOverlay();
  clearDemoHighlight();
  restoreStateFromBackup(demoStateBackup);
  demoStateBackup = null;

  if (shareStatusElement) {
    setShareStatus('Presentation demo closed. Your saved progress has been restored.', 'success');
  }

  const focusTarget = demoReturnFocus && typeof demoReturnFocus.focus === 'function' ? demoReturnFocus : null;
  demoReturnFocus = null;
  if (focusTarget) {
    focusTarget.focus();
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

  const closingStatus = (section.closingChecklist || []).map((item) => {
    const entry = (savedState.closing && savedState.closing[item.id]) || {};
    return {
      ...item,
      response: entry.response || '',
      note: entry.note || '',
    };
  });

  return {
    tasks: taskStatus,
    closing: closingStatus,
    hasClosingResponses: closingStatus.some((item) => item.response || item.note),
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

  if (!container) {
    return;
  }

  container.innerHTML = '';

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

    if (section.closingChecklist && section.closingChecklist.length) {
      const closingWrapper = document.createElement('div');
      closingWrapper.className = 'closing-checklist';

      const closingHeading = document.createElement('h3');
      closingHeading.className = 'closing-checklist__title';
      closingHeading.textContent = 'Closing Checklist';
      closingWrapper.appendChild(closingHeading);

      section.closingChecklist.forEach((item) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'closing-checklist__item';

        const label = document.createElement('h4');
        label.className = 'closing-checklist__label';
        label.textContent = item.label;
        itemEl.appendChild(label);

        const controls = document.createElement('div');
        controls.className = 'closing-checklist__controls';

        const responseGroup = document.createElement('label');
        responseGroup.className = 'closing-checklist__response';
        responseGroup.textContent = 'Response';

        const select = document.createElement('select');
        select.className = 'closing-response';
        select.dataset.closingId = item.id;
        ['','yes','na','no'].forEach((value) => {
          const option = document.createElement('option');
          option.value = value;
          if (!value) {
            option.textContent = 'Select';
          } else if (value === 'yes') {
            option.textContent = 'Yes';
          } else if (value === 'na') {
            option.textContent = 'N/A';
          } else {
            option.textContent = 'No';
          }
          select.appendChild(option);
        });

        const savedEntry = (savedState.closing && savedState.closing[item.id]) || {};
        if (savedEntry.response) {
          select.value = savedEntry.response;
        }

        select.addEventListener('change', () => {
          const entry = savedState.closing[item.id] || {};
          entry.response = select.value;
          if (!entry.response && !entry.note) {
            delete savedState.closing[item.id];
          } else {
            savedState.closing[item.id] = entry;
          }
          storage.save(savedState);
          updateProgress();
        });

        responseGroup.appendChild(select);
        controls.appendChild(responseGroup);

        const noteGroup = document.createElement('label');
        noteGroup.className = 'closing-checklist__notes';
        noteGroup.textContent = 'Notes / Why?';

        const noteField = document.createElement('textarea');
        noteField.className = 'closing-note';
        noteField.dataset.closingId = item.id;
        noteField.rows = 2;
        noteField.placeholder = 'Explain why (required if “No”).';
        noteField.value = savedEntry.note || '';
        noteField.addEventListener('input', () => {
          const entry = savedState.closing[item.id] || {};
          entry.note = noteField.value.trim();
          if (!entry.response && !entry.note) {
            delete savedState.closing[item.id];
          } else {
            savedState.closing[item.id] = entry;
          }
          storage.save(savedState);
          updateProgress();
        });

        noteGroup.appendChild(noteField);
        controls.appendChild(noteGroup);

        itemEl.appendChild(controls);
        closingWrapper.appendChild(itemEl);
      });

      contentEl.appendChild(closingWrapper);
    }

    container.appendChild(sectionFragment);
  });

  if (demoActive) {
    requestAnimationFrame(() => {
      goToDemoStep(demoCurrentStep);
    });
  }

  refreshSectionInsights();
}

function refreshSectionInsights() {
  checklistData.forEach((section) => {
    const sectionEl = document.querySelector(
      `.section[data-section-id="${section.id}"]`
    );
    if (!sectionEl) return;

    const insightsEl = sectionEl.querySelector('.section__insights');
    if (!insightsEl) return;

    const helpers = createStateHelpers(section);
    const suggestion = section.suggestions ? section.suggestions(helpers) : '';
    const message = suggestion ? suggestion.trim() : '';

    insightsEl.innerHTML = '';
    if (message) {
      const titleEl = document.createElement('strong');
      titleEl.textContent = 'AI Suggestion';
      insightsEl.appendChild(titleEl);

      const messageEl = document.createElement('span');
      messageEl.className = 'section__insights-text';
      messageEl.textContent = message;
      insightsEl.appendChild(messageEl);

      insightsEl.classList.add('is-visible');
      insightsEl.dataset.tone = 'info';
    } else {
      insightsEl.classList.remove('is-visible');
      insightsEl.removeAttribute('data-tone');
    }
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
  refreshSectionInsights();
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
      Object.keys(savedState.closing).forEach((key) => delete savedState.closing[key]);
      document.querySelectorAll('input[type="checkbox"]').forEach((input) => {
        input.checked = false;
      });
      document
        .querySelectorAll('input[type="radio"]:checked')
        .forEach((input) => (input.checked = false));
      document.querySelectorAll('.closing-response').forEach((select) => {
        select.value = '';
      });
      document.querySelectorAll('.closing-note').forEach((textarea) => {
        textarea.value = '';
      });
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

  const demoButton = document.getElementById('btn-demo');
  if (demoButton) {
    demoButton.addEventListener('click', startDemoPresentation);
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

  demoOverlay = document.getElementById('demo-overlay');
  if (demoOverlay) {
    demoDialog = demoOverlay.querySelector('.demo__dialog');
    demoStepIndicator = demoOverlay.querySelector('.demo__step-indicator');
    demoStepTitle = demoOverlay.querySelector('.demo__step-title');
    demoStepText = demoOverlay.querySelector('.demo__step-text');
    demoPrevButton = demoOverlay.querySelector('[data-demo-prev]');
    demoNextButton = demoOverlay.querySelector('[data-demo-next]');
    demoCloseButtons = Array.from(demoOverlay.querySelectorAll('[data-demo-close]'));

    if (demoPrevButton) {
      demoPrevButton.addEventListener('click', () => {
        goToDemoStep(demoCurrentStep - 1);
      });
    }

    if (demoNextButton) {
      demoNextButton.addEventListener('click', () => {
        if (demoCurrentStep >= demoSteps.length - 1) {
          endDemoPresentation();
        } else {
          goToDemoStep(demoCurrentStep + 1);
        }
      });
    }

    demoCloseButtons.forEach((element) => {
      element.addEventListener('click', endDemoPresentation);
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

  (section.closingChecklist || []).forEach((item) => {
    const entry = (savedState.closing && savedState.closing[item.id]) || {};
    const response = entry.response || '';
    const note = entry.note || '';
    const labelMap = {
      yes: 'Yes',
      na: 'N/A',
      no: 'No',
    };
    const responseLabel = labelMap[response] || '';

    let state = responseLabel ? 'complete' : 'pending';
    let text = responseLabel || 'No response';

    if (responseLabel) {
      if (response === 'no' && !note) {
        state = 'pending';
        text = 'No – add reason';
      } else if (note) {
        text = `${responseLabel} – ${note}`;
      }
    }

    items.push({
      label: item.label,
      state,
      text,
    });
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
