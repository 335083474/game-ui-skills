/* Portable data exchange. Pure validation is also available to Node tests. */
(function (root) {
  'use strict';
  const PACKAGE_VERSION = 'hades-draft-v2.10';
  const MAX_FILE_BYTES = 512 * 1024;
  const localIcon = /^components\/[a-z0-9][a-z0-9_-]*\.png$/;

  function requireText(value, field, allowEmpty = false) {
    if (typeof value !== 'string' || (!allowEmpty && !value.trim())) {
      throw new Error(field + ' must be a ' + (allowEmpty ? 'text' : 'nonempty text') + ' value');
    }
    return value;
  }
  function validate(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected a JSON object');
    if (input.schemaVersion !== undefined && input.schemaVersion !== 1) throw new Error('Unsupported schemaVersion; expected 1');
    if (!Array.isArray(input.options) || input.options.length < 2 || input.options.length > 4) throw new Error('Between two and four options are required');
    const result = {
      schemaVersion: 1,
      version: PACKAGE_VERSION,
      title: requireText(input.title, 'title'),
      subtitle: requireText(input.subtitle, 'subtitle', true),
      options: input.options.map((option, index) => {
        const key = 'options[' + index + ']';
        if (!option || typeof option !== 'object' || Array.isArray(option)) throw new Error(key + ' must be an object');
        if (!['Rare', 'Epic'].includes(option.rarity)) throw new Error(key + '.rarity must be Rare or Epic');
        const icon = requireText(option.icon, key + '.icon');
        if (!localIcon.test(icon)) throw new Error(key + '.icon must be a local components/name.png path without traversal or URLs');
        return {
          title: requireText(option.title, key + '.title'),
          rarity: option.rarity,
          description: requireText(option.description, key + '.description', true),
          stat: requireText(option.stat, key + '.stat', true),
          icon
        };
      })
    };
    return result;
  }
  function nextIndex(index, key, count) {
    if (!Number.isInteger(count) || count < 2 || count > 4) throw new Error('Option count must be 2–4');
    const current = Math.max(0, Math.min(count - 1, Number.isInteger(index) ? index : 0));
    if (key === 'Home') return 0;
    if (key === 'End') return count - 1;
    if (['ArrowDown', 'ArrowRight'].includes(key)) return (current + 1) % count;
    if (['ArrowUp', 'ArrowLeft'].includes(key)) return (current - 1 + count) % count;
    return current;
  }
  function parse(text) { return validate(JSON.parse(text.replace(/^\uFEFF/, ''))); }
  async function readFile(file) {
    if (!file) throw new Error('Choose a JSON file');
    if (file.size > MAX_FILE_BYTES) throw new Error('JSON file exceeds the 512 KiB limit');
    return parse(await file.text());
  }
  function download(data, filename = 'hades-scene-data.json') {
    const clean = validate(data);
    const blob = new Blob([JSON.stringify(clean, null, 2) + '\n'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const api = { PACKAGE_VERSION, MAX_FILE_BYTES, validate, nextIndex, parse, readFile, download };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HadesDataIO = api;
})(typeof window !== 'undefined' ? window : globalThis);
