"""Build the OpenBEP translation tables from the dictionary.

The dictionary (canbim_strings.csv) is the single source: column en is the exact
English text (the key), then one column per language, then where.
languages.csv names each language and says whether the language menu shows it.

Usage: python3 translations/build_i18n.py [app.html ...]   (default: app/bep-builder.html)
- Rewrites, in each app file, the blocks between /*I18N*/ /*/I18N*/ (the table),
  /*LANGS*/ /*/LANGS*/ (the language menu) and /*I18NCORE*/ /*/I18NCORE*/ (the lookup
  code, copied from i18n.js).
- Writes translations/strings.js, which every other site page loads with i18n.js.
Run it after every change to the CSV, then commit the rebuilt files.
"""
import csv, json, os, sys
here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(here)


def load():
    rows = list(csv.DictReader(open(os.path.join(here, 'canbim_strings.csv'), encoding='utf-8-sig')))
    langs = list(csv.DictReader(open(os.path.join(here, 'languages.csv'), encoding='utf-8-sig')))
    cols = [c for c in rows[0].keys() if c not in ('en', 'where')]
    table = {l: {r['en']: r[l] for r in rows if r.get(l)} for l in cols}
    menu = {x['code']: x['name'] for x in langs if x['show'].strip().lower() == 'yes'}
    return table, menu


def put(s, a, b, text):
    i = s.index(a) + len(a); j = s.index(b, i)
    return s[:i] + text + s[j:]


def main(apps):
    table, menu = load()
    js = open(os.path.join(here, 'i18n.js'), encoding='utf-8').read()
    core = js[js.index('/*I18NCORE*/') + 12:js.index('/*/I18NCORE*/')]
    dump = lambda o: json.dumps(o, ensure_ascii=False, separators=(',', ':'))
    for app in apps:
        s = open(app, encoding='utf-8').read()
        s = put(s, '/*I18N*/', '/*/I18N*/', dump(table))
        s = put(s, '/*LANGS*/', '/*/LANGS*/', dump(menu))
        s = put(s, '/*I18NCORE*/', '/*/I18NCORE*/', core)
        open(app, 'w', encoding='utf-8').write(s)
    with open(os.path.join(here, 'strings.js'), 'w', encoding='utf-8') as f:
        f.write('/* Built by translations/build_i18n.py from canbim_strings.csv. Do not edit. */\n')
        f.write('window.OPENBEP_LANGS=' + dump(menu) + ';\n')
        f.write('window.OPENBEP_STRINGS=' + dump(table) + ';\n')
    print({l: len(t) for l, t in table.items()}, 'menu:', list(menu))


if __name__ == '__main__':
    main(sys.argv[1:] or [os.path.join(root, 'app', 'bep-builder.html')])
