"""Build the CANBIM translation table into the app.
Usage: python3 build_i18n.py app.js  -> rewrites the I18N block between /*I18N*/ and /*/I18N*/.
The CSV (canbim_strings.csv) is the master: column en is the key, one column per language."""
import csv, json, sys, os
here = os.path.dirname(os.path.abspath(__file__))
rows = list(csv.DictReader(open(os.path.join(here, 'canbim_strings.csv'), encoding='utf-8-sig')))
langs = [c for c in rows[0].keys() if c not in ('en', 'where')]
table = {l: {r['en']: r[l] for r in rows if r.get(l)} for l in langs}
app = sys.argv[1]; s = open(app, encoding='utf-8').read()
a = s.index('/*I18N*/') + len('/*I18N*/'); b = s.index('/*/I18N*/')
s = s[:a] + json.dumps(table, ensure_ascii=False, separators=(',', ':')) + s[b:]
open(app, 'w', encoding='utf-8').write(s)
print({l: len(t) for l, t in table.items()})
