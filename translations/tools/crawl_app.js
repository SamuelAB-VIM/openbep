// Opens the BEP Builder in a headless browser, walks every step of both
// examples with all sections open (in English, then again in French to catch
// page errors, then in English with a country other than Canada), then opens the other site pages (Scorecard), and lists the dictionary rows the app
// needed (numbers already replaced by {1}, {2}...) and whether French exists.
// Writes translations/build/app_seen.json; check_i18n.py --app reads it.
// Usage: node translations/tools/crawl_app.js   (needs Playwright + Chromium;
// set CHROMIUM=/path/to/chrome to use a browser that is already installed)
const { chromium } = require('playwright');
const { pathToFileURL } = require('node:url');
const { writeFileSync, mkdirSync } = require('node:fs');
const path = require('node:path');

(async () => {
const here = __dirname;
const root = path.resolve(here, '..', '..');
const app = pathToFileURL(path.join(root, 'app', 'bep-builder.html')).href;
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage();
page.on('dialog', d => d.dismiss());
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.goto(app);
await page.evaluate(() => { localStorage.clear(); });
await page.reload();
const openAll = () => page.evaluate(() => { document.querySelectorAll('details').forEach(d => { d.open = true }); document.querySelectorAll('[data-fall="1"]').forEach(b => b.click()); const ws = document.querySelector('[data-showws]'); if (ws && !ws.checked) ws.click(); });
const seen = new Map();
const walk = async () => { for (const ex of ['school', 'rail']) {
  const b = page.locator(`[data-ex="${ex}"]`).first();
  if (await b.count()) { await b.click(); await page.waitForTimeout(200); }
  const steps = await page.locator('#steps [data-step]').count();
  for (let i = 1; i <= steps; i++) {
    await page.locator(`#steps [data-step="${i}"]`).click();
    await page.waitForTimeout(150);
    await openAll(); await page.waitForTimeout(150);
  }
} };
await walk();
for (const [k, w, fr] of await page.evaluate(() => window.__canbimStrings())) if (!seen.has(k)) seen.set(k, [w, fr]);
await page.selectOption('#langSel', 'fr');
await walk();
// Outside Canada the app swaps Canadian references for neutral wording; record that wording too.
if (await page.locator('#ctrySel').count()) {
  await page.evaluate(() => { localStorage.clear(); }); await page.reload();
  await page.selectOption('#ctrySel', 'jp'); await walk();
  for (const [k, w, fr] of await page.evaluate(() => window.__canbimStrings())) if (!seen.has(k)) seen.set(k, [w, fr]);
}

// Other site pages use translations/i18n.js; record what they show too.
for (const rel of ['app/scorecard.html']) {
  const p2 = await browser.newPage();
  p2.on('pageerror', e => errors.push(rel + ': ' + String(e)));
  p2.on('dialog', d => d.dismiss());
  await p2.goto(pathToFileURL(path.join(root, rel)).href);
  for (const id of ['#exBtn', '#reportBtn']) if (await p2.locator(id).count()) { await p2.locator(id).first().click(); await p2.waitForTimeout(300); }
  await p2.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true }));
  await p2.waitForTimeout(200);
  for (const k of await p2.evaluate(() => window.openbepStrings ? window.openbepStrings() : [])) {
    const r = await p2.evaluate(k => { const F = (window.OPENBEP_STRINGS || {}).fr || {}; if (k.endsWith('…') || !/[a-z]{3}/.test(k)) return null; if (F[k]) return [k, true]; if (trText(k, F, 'fr')) return null; return [i18nKey(k), !!F[i18nKey(k)]]; }, k);
    if (r && !seen.has(r[0])) seen.set(r[0], [rel, r[1]]);
  }
  await p2.selectOption('select[data-i18n-lang]', 'fr');
  await p2.waitForTimeout(200);
  await p2.close();
}
await browser.close();
mkdirSync(path.join(root, 'translations', 'build'), { recursive: true });
writeFileSync(path.join(root, 'translations', 'build', 'app_seen.json'), JSON.stringify([...seen.entries()].map(([k, [w, fr]]) => ({ en: k, where: w, fr })), null, 1));
const missing = [...seen.values()].filter(v => !v[1]).length;
console.log(`${seen.size} dictionary rows needed, ${missing} without French`);
if (errors.length) { console.error('Page errors:\n' + errors.join('\n')); process.exitCode = 1; }
})();
