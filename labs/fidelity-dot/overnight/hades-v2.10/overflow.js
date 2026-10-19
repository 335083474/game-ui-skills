/* DOM measurement, not character-count heuristics. Requires browser verification. */
(function () {
  'use strict';
  let frame = 0;
  function exceeds(element) {
    return !!element && (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1);
  }
  function measure() {
    frame = 0;
    document.querySelectorAll('.row').forEach(row => {
      const fields = [];
      if (exceeds(row.querySelector('.title-name'))) fields.push('title');
      if (exceeds(row.querySelector('.title-line'))) fields.push('title/rarity');
      if (exceeds(row.querySelector('.description'))) fields.push('description');
      if (exceeds(row.querySelector('.stat'))) fields.push('stat');
      if (exceeds(row.querySelector('.text'))) fields.push('content region');
      const warning = row.querySelector('.overflow-note');
      if (warning) {
        warning.hidden = fields.length === 0;
        warning.textContent = fields.length ? 'Clipped ' + [...new Set(fields)].join(', ') + ' · open Full text' : '';
      }
      row.dataset.overflow = fields.length ? 'true' : 'false';
    });
    const heading = document.getElementById('scene-title');
    const subtitle = document.getElementById('scene-subtitle');
    const bannerWarning = document.getElementById('banner-warning');
    if (bannerWarning) bannerWarning.hidden = !exceeds(heading) && !exceeds(subtitle);
    const tip = document.getElementById('tooltip-text');
    const tipWarning = document.getElementById('tooltip-overflow');
    if (tipWarning) tipWarning.hidden = !exceeds(tip) && !exceeds(document.getElementById('tooltip-title'));
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(measure); }
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
  function observe(root) {
    if (observer) {
      observer.disconnect();
      root.querySelectorAll('.row,.scene-banner,.scene-tooltip').forEach(element => observer.observe(element));
    }
    schedule();
  }
  window.addEventListener('resize', schedule);
  document.addEventListener('load', schedule, true);
  if (document.fonts) {
    document.fonts.ready.then(schedule);
    document.fonts.addEventListener('loadingdone', schedule);
  }
  window.HadesOverflow = { schedule, observe, measure };
})();
