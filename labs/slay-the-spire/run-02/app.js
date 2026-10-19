(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const dialogue = {
    opening: { title: 'You have come a long way.', text: 'The stairs remember every footstep, but I prefer to remember names. Sit, traveller. What have you brought to my door?', chapter: 'First meeting' },
    road: { title: 'A safe road is a patient road.', text: 'Take the eastern stair when the bells fall silent. The western door leads somewhere shorter, but it asks a price of everyone who passes.', endingTitle: 'An eastern path', ending: 'Maera marks a quiet stair on a scrap of paper. “Wait for the last bell,” she says. You leave with a direction, and a little less haste.', reply: 'I will wait for the last bell.' },
    seal: { title: 'So you noticed the red seal.', text: 'That record belongs to someone who has not returned. I keep it closed because a promise can outlive its owner. Would you keep such a promise?', endingTitle: 'A promise kept', ending: 'You leave the record untouched. Maera slides it back into its recess. “Then you understand,” she says. The silence between you feels less cold.', reply: 'Some things deserve to stay sealed.' },
    fire: { title: 'Even a small flame needs company.', text: 'I used to keep watch alone. It made every hour feel twice as long. Stay a moment, if you can spare it. There is no riddle hidden in that request.', endingTitle: 'A moment of warmth', ending: 'You sit beside the iron bowl until the coal burns gold. Maera speaks of an ordinary summer, far below the Spire. For a moment, neither of you is waiting.', reply: 'I can spare a moment.' }
  };
  const replies = [
    { id: 'road', title: 'Ask about the road ahead.', detail: 'Learn which stair the keeper would choose.' },
    { id: 'seal', title: 'Ask about the sealed record.', detail: 'Find out why it remains unread.' },
    { id: 'fire', title: 'Offer to sit by the fire.', detail: 'Give the keeper a little company.' }
  ];
  let dialogueState = { node: 'opening', branch: null };
  function renderDialogue(focus = false) {
    const { node, branch } = dialogueState;
    const entry = node === 'opening' ? dialogue.opening : dialogue[branch];
    $('speech-title').textContent = node === 'ending' ? entry.endingTitle : entry.title;
    $('speech-text').textContent = node === 'ending' ? entry.ending : entry.text;
    $('chapter-label').textContent = node === 'opening' ? 'First meeting' : node === 'ending' ? 'Conversation complete' : 'A different thread';
    $('response-label').textContent = node === 'ending' ? 'Until the next meeting' : 'Your reply';
    $('dialogue-back').disabled = node === 'opening';
    $('choices').replaceChildren();
    if (node === 'opening') {
      replies.forEach((reply, index) => {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'choice'; button.dataset.choice = reply.id;
        const number = document.createElement('span'); number.className = 'choice-number'; number.textContent = String(index + 1).padStart(2, '0'); number.setAttribute('aria-hidden', 'true');
        const label = document.createElement('span'); label.textContent = reply.title;
        const detail = document.createElement('small'); detail.textContent = reply.detail; label.append(detail);
        const arrow = document.createElement('span'); arrow.className = 'choice-arrow'; arrow.textContent = '›'; arrow.setAttribute('aria-hidden', 'true');
        button.append(number, label, arrow);
        button.addEventListener('click', () => { dialogueState = { node: 'branch', branch: reply.id }; renderDialogue(true); });
        $('choices').append(button);
      });
    } else {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'sui-action ending-action';
      const span = document.createElement('span'); span.textContent = node === 'ending' ? 'Speak again' : 'Continue'; button.append(span);
      if (node === 'branch') {
        const reply = document.createElement('p'); reply.className = 'spoken-reply'; reply.textContent = `Your reply: “${entry.reply}”`; $('choices').append(reply);
      }
      button.addEventListener('click', () => { dialogueState = node === 'ending' ? { node: 'opening', branch: null } : { node: 'ending', branch }; renderDialogue(true); });
      $('choices').append(button);
    }
    if (focus) $('speech').focus({ preventScroll: true });
  }
  function resetDialogue() { dialogueState = { node: 'opening', branch: null }; renderDialogue(true); }
  $('dialogue-back').addEventListener('click', resetDialogue);
  $('dialogue-restart').addEventListener('click', resetDialogue);

  const storageKey = 'ember-archive.run02.preferences.v1';
  const defaults = Object.freeze({ volume: 70, largeText: false, reduceMotion: false });
  function normalize(value) {
    return { volume: Number.isFinite(value?.volume) ? Math.max(0, Math.min(100, Math.round(value.volume))) : defaults.volume, largeText: typeof value?.largeText === 'boolean' ? value.largeText : false, reduceMotion: typeof value?.reduceMotion === 'boolean' ? value.reduceMotion : false };
  }
  let saved = { ...defaults }, storageAvailable = true;
  try { const existing = localStorage.getItem(storageKey); if (existing) saved = normalize(JSON.parse(existing)); }
  catch { storageAvailable = false; }
  let draft = { ...saved };
  function isDirty() { return Object.keys(defaults).some(key => draft[key] !== saved[key]); }
  function previewSettings() {
    document.body.classList.toggle('large-text', draft.largeText);
    document.body.classList.toggle('reduce-motion', draft.reduceMotion);
    $('volume').style.setProperty('--volume', `${draft.volume}%`);
    $('volume-value').value = `${draft.volume}%`;
    $('preview-mode').textContent = draft.largeText ? '✓ Large text active' : 'Standard text';
    $('save-state').textContent = isDirty() ? 'Unsaved preview' : 'Saved';
    $('save-state').classList.toggle('dirty', isDirty());
  }
  function fillForm() { $('volume').value = draft.volume; $('large-text').checked = draft.largeText; $('reduce-motion').checked = draft.reduceMotion; previewSettings(); }
  $('settings-form').addEventListener('input', () => {
    draft = { volume: Number($('volume').value), largeText: $('large-text').checked, reduceMotion: $('reduce-motion').checked };
    previewSettings(); $('settings-status').textContent = isDirty() ? 'Previewing changes. Save to keep them, or cancel to undo.' : 'Your saved settings are active.';
  });
  $('settings-form').addEventListener('submit', event => {
    event.preventDefault();
    try { localStorage.setItem(storageKey, JSON.stringify(draft)); saved = { ...draft }; storageAvailable = true; previewSettings(); $('settings-status').textContent = 'Settings saved on this browser. They will remain after refresh.'; }
    catch { storageAvailable = false; $('settings-status').textContent = 'Could not save: browser storage is unavailable. Your preview remains unsaved.'; }
  });
  $('cancel-settings').addEventListener('click', () => { draft = { ...saved }; fillForm(); $('settings-status').textContent = 'Changes cancelled. Last saved settings restored.'; });
  $('restore-defaults').addEventListener('click', () => { draft = { ...defaults }; fillForm(); $('settings-status').textContent = 'Defaults previewed: volume 70%, standard text, motion on. Save to keep; Cancel to undo.'; });
  function route() {
    const current = location.hash === '#settings' ? 'settings' : 'dialogue';
    for (const id of ['dialogue', 'settings']) $(id).hidden = id !== current;
    document.querySelectorAll('[data-route]').forEach(link => { if (link.dataset.route === current) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); });
    document.title = `${current === 'settings' ? 'Journey Settings' : 'A Keeper of Small Fires'} · The Ember Archive`;
  }
  window.addEventListener('hashchange', route);
  renderDialogue(); fillForm(); route();
  if (!storageAvailable) $('settings-status').textContent = 'Saved preferences could not be read. Defaults are active; saving may be unavailable.';
})();
