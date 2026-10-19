(() => {
  'use strict';
  const M = window.WillowModel, $ = id => document.getElementById(id), KEY = 'willowbrook.run02.preferences.v1';
  let saved = { ...M.DEFAULTS }, storageReady = true, draft, selection = null, final = false;
  try { const raw = localStorage.getItem(KEY); if (raw) saved = M.normalize(JSON.parse(raw)); } catch { storageReady = false; }
  draft = { ...saved };
  const dirty = () => !M.equal(saved, draft);
  function updatePreferences(syncInputs = false) {
    document.body.classList.toggle('large-text', draft.largeText);
    document.body.classList.toggle('reduce-motion', draft.reduceMotion);
    if (syncInputs) { $('volume').value = draft.volume; $('large-text').checked = draft.largeText; $('reduce-motion').checked = draft.reduceMotion; }
    $('volume-output').textContent = draft.volume + '%';
    $('large-state').textContent = draft.largeText ? 'On' : 'Off'; $('motion-state').textContent = draft.reduceMotion ? 'On' : 'Off';
    $('preview-caption').textContent = `${draft.largeText ? 'Large' : 'Standard'} text · ${draft.reduceMotion ? 'Meadow motion off' : 'Meadow motion on (unless device reduces motion)'}`;
    $('save-marker').textContent = dirty() ? 'Unsaved preview' : 'Saved preferences'; $('save-marker').classList.toggle('is-dirty', dirty());
    $('global-state').textContent = dirty() ? 'Unsaved comfort preview · Save or cancel in Settings' : 'Your pace. Your valley.';
    $('save-settings').disabled = !dirty(); $('cancel-settings').disabled = !dirty();
  }
  function renderDialogue() {
    const state = M.dialogue(selection, final);
    $('npc-text').textContent = state.text; $('dialogue-step').textContent = state.step;
    $('responses').replaceChildren(); $('responses').hidden = !!state.choice; $('dialogue-actions').hidden = !state.choice;
    $('choice-echo').hidden = !state.choice;
    if (state.choice) {
      $('choice-echo').textContent = final ? '✓ ' + state.choice.result : '✓ You said: “' + state.choice.label + '”';
      $('continue-dialogue').hidden = final;
      $('restart-dialogue').textContent = final ? 'Start a new conversation' : 'Start again';
    } else M.CHOICES.forEach((choice,index) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'reply-button';
      const n = document.createElement('span'); n.className = 'reply-number'; n.textContent = String(index + 1).padStart(2,'0');
      const label = document.createElement('span'); label.textContent = choice.label;
      const hint = document.createElement('small'); hint.textContent = choice.hint;
      button.append(n,label,hint); button.addEventListener('click', () => { selection = choice.id; final = false; renderDialogue(); $('continue-dialogue').focus(); });
      $('responses').append(button);
    });
  }
  function resetDialogue() {selection = null; final = false; renderDialogue(); $('responses').querySelector('button').focus();}
  $('continue-dialogue').addEventListener('click', () => {final = true; renderDialogue(); $('back-dialogue').focus();});
  $('back-dialogue').addEventListener('click', resetDialogue); $('restart-dialogue').addEventListener('click', resetDialogue);
  $('volume').addEventListener('input', e => {draft.volume = Number(e.target.value); updatePreferences(); $('settings-status').textContent = 'Volume preference changed. Save to keep this value; no sound is playing.';});
  for (const [id,key] of [['large-text','largeText'],['reduce-motion','reduceMotion']]) $(id).addEventListener('change', e => {draft[key] = e.target.checked; updatePreferences(); $('settings-status').textContent = 'Comfort preview updated. Save to keep it, or Cancel to restore saved choices.';});
  $('settings-form').addEventListener('submit', e => {
    e.preventDefault();
    try { localStorage.setItem(KEY, JSON.stringify(draft)); saved = {...draft}; storageReady = true; updatePreferences(); $('settings-status').textContent = '✓ Preferences saved on this browser. They will remain after a refresh.'; }
    catch { storageReady = false; $('settings-status').textContent = 'Storage is unavailable. Your preview works for this visit, but could not be saved. You can retry Save changes.'; }
  });
  $('cancel-settings').addEventListener('click', () => {draft = {...saved}; updatePreferences(true); $('settings-status').textContent = 'Changes cancelled. Your last saved preferences are restored.';});
  $('restore-defaults').addEventListener('click', () => {draft = {...M.DEFAULTS}; updatePreferences(true); $('settings-status').textContent = dirty() ? 'Defaults are previewed: 70% volume, standard text, motion on. Save changes to keep them, or Cancel to undo.' : 'Your saved preferences already match the defaults.';});
  function route() {
    const settings = location.hash === '#settings';
    $('settings-screen').hidden = !settings; $('dialogue-screen').hidden = settings;
    $('nav-settings').setAttribute('aria-current', settings ? 'page' : 'false'); $('nav-dialogue').setAttribute('aria-current', settings ? 'false' : 'page');
    document.title = 'Willowbrook · ' + (settings ? 'Settings' : 'A little conversation');
  }
  window.addEventListener('hashchange', route);
  window.addEventListener('storage', e => {if (e.key === KEY) {try {saved = M.normalize(e.newValue ? JSON.parse(e.newValue) : M.DEFAULTS); updatePreferences(); $('settings-status').textContent = 'Saved preferences changed in another tab. Cancel loads those saved values, or Save keeps this preview.';} catch { $('settings-status').textContent = 'Another tab supplied invalid preference data. Your current preview is unchanged.';}}});
  updatePreferences(true); renderDialogue(); route();
  if (!storageReady) $('settings-status').textContent = 'Browser storage could not be read. Defaults are previewed; saving may be unavailable.';
})();
