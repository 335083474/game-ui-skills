(function(root) {
  'use strict';
  const DEFAULTS = Object.freeze({ volume: 70, largeText: false, reduceMotion: false });
  const CHOICES = Object.freeze([
    { id: 'help', label: "I'd be happy to help.", hint: 'Lend a hand', reply: "That's kind of you! The east bed needs a little company. Meet me by the green gate when you have a moment.", ending: "I'll bring the seed packets and a pot of tea. A garden grows better with someone to talk to.", result: 'Mara is looking forward to your visit.' },
    { id: 'ask', label: 'What are you planting?', hint: 'Ask a little more', reply: "Sweet peas, mostly. My sister used to grow them along this bridge. I thought the village could use that bit of color again.", ending: "She always said the crooked stems had the sweetest flowers. I think she was talking about people, too.", result: 'You learned why the garden matters to Mara.' },
    { id: 'later', label: 'Maybe another afternoon.', hint: 'Take your time', reply: "Of course. You've got a whole farm asking for your attention. The garden will still be here tomorrow.", ending: "And if tomorrow is busy too, just stop by for tea. You don't need to earn a seat at my table.", result: 'Mara leaves the invitation open.' }
  ]);
  function normalize(value) {
    const v = value && typeof value === 'object' ? value : {};
    return { volume: typeof v.volume === 'number' && Number.isFinite(v.volume) ? Math.round(Math.max(0, Math.min(100, v.volume))) : DEFAULTS.volume, largeText: typeof v.largeText === 'boolean' ? v.largeText : DEFAULTS.largeText, reduceMotion: typeof v.reduceMotion === 'boolean' ? v.reduceMotion : DEFAULTS.reduceMotion };
  }
  function equal(a,b) {return a.volume === b.volume && a.largeText === b.largeText && a.reduceMotion === b.reduceMotion;}
  function dialogue(id, final) {
    const choice = CHOICES.find(c => c.id === id);
    if (!choice) return { text: "There you are! I'm planting a small garden by the footbridge. Would you like to keep me company this afternoon?", step: '01 / A small invitation', choice: null, final: false };
    return { text: final ? choice.ending : choice.reply, step: final ? '03 / Until we meet again' : '02 / ' + choice.hint, choice, final: !!final };
  }
  root.WillowModel = Object.freeze({ DEFAULTS, CHOICES, normalize, equal, dialogue });
})(typeof globalThis !== 'undefined' ? globalThis : this);
