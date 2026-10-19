// Unit tests for the lookup rules in translations/i18n.js.  Usage: node translations/tools/test_i18n.js
const fs = require('fs'), path = require('path'), assert = require('assert');
const src = fs.readFileSync(path.join(__dirname, '..', 'i18n.js'), 'utf8');
const { trText, i18nKey } = new Function(src.slice(src.indexOf('/*I18NCORE*/'), src.indexOf('/*/I18NCORE*/')) + ';return {trText, i18nKey}')();
const T = {
  'Issues ({1})': 'Problèmes ({1})', 'Walls': 'Murs', 'Concept': 'Concept', 'Step {1}': 'Étape {1}',
  'No rule set.': 'Aucune règle fixée.', 'Named people stay.': 'Les personnes nommées restent.',
  'Replacing key people': 'Remplacement des personnes clés', 'Light fixtures': 'Appareils d’éclairage',
  'LOD {1} at final design ({2} parameters)': 'LOD {1} en conception définitive ({2} paramètres)',
  'Owner: decisions made by the agreed date': 'Donneur d’ouvrage : décisions prises à la date convenue',
  'target {1}': 'cible {1}', 'May {1}': 'mai {1}', '{1} of {2} on target': '{1} sur {2} atteints',
};
const cases = [
  ['Walls', 'Murs'],
  ['Issues (66)', 'Problèmes (66)'],
  ['Walls, Concept', 'Murs, Concept'],
  ['· Walls', '· Murs'],
  ['Walls:', 'Murs :'],
  ['Replacing key people: No rule set. Named people stay.', 'Remplacement des personnes clés : Aucune règle fixée. Les personnes nommées restent.'],
  ['Light fixtures: LOD 300 at final design (6 parameters)', 'Appareils d’éclairage : LOD 300 en conception définitive (6 paramètres)'],
  ['Owner: decisions made by the agreed date: 20, 30; target 90', 'Donneur d’ouvrage : décisions prises à la date convenue : 20, 30; cible 90'],
  ['May 2026: 3 of 10 on target', 'mai 2026 : 3 sur 10 atteints'],
  ['2026-10-19', '2026-10-19'],
  ['Walls, Something new', null],
  ['IFC 4.3', null],
];
for (const [en, want] of cases) assert.strictEqual(trText(en, T, 'fr'), want, en);
assert.strictEqual(i18nKey('Concept 100% · 2027-04-30'), 'Concept {1}% · {2}');
assert.strictEqual(i18nKey('OpenBEP Builder v0.22'), 'OpenBEP Builder {1}');
assert.strictEqual(i18nKey('IFC4 and B1010 stay'), 'IFC4 and B1010 stay');
console.log(`${cases.length + 3} translation lookup tests passed`);
