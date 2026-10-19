"""Check the OpenBEP dictionary against the BIM glossary and the site.

Usage: python3 translations/check_i18n.py [--fix] [--app] [--strict]
  --fix     correct French typography in canbim_strings.csv (no-break space before
            a colon and inside « », none before ; ? !, curly apostrophe), then check.
  --app     also report the strings the BEP Builder showed that have no translation
            (run node translations/tools/crawl_app.js first).
  --strict  treat --app findings as errors.

Errors (exit code 1):
  - a key that appears twice;
  - a {1} placeholder missing or added in a translation;
  - a word the glossary says to avoid, in a row whose English uses that term;
  - a row whose English uses a glossary term but whose translation has none of the
    approved words (list real exceptions in glossary_exceptions.csv);
  - French typography (see --fix);
  - app/bep-builder.html or strings.js not rebuilt after a dictionary change.
"""
import csv, json, os, re, sys
from collections import defaultdict

here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(here)
NBSP = ' '


def read(name):
    return list(csv.DictReader(open(os.path.join(here, name), encoding='utf-8-sig')))


def write_dict(rows):
    with open(os.path.join(here, 'canbim_strings.csv'), 'w', encoding='utf-8-sig', newline='') as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()), quoting=csv.QUOTE_ALL, lineterminator='\n')
        w.writeheader(); w.writerows(rows)


def fix_fr(t):
    t = re.sub(r"(?<=\w)'(?=\w)", '’', t)
    t = re.sub(r'[ \u202f]+:', NBSP + ':', t)
    t = re.sub(r'(?<=[^\s{}\d]):(?=\s)', NBSP + ':', t)
    t = re.sub(r'[ \u00a0\u202f]+([;?!])', r'\1', t)
    t = re.sub(r'«[ \u00a0\u202f]*', '«' + NBSP, t)
    t = re.sub(r'[ \u00a0\u202f]*»', NBSP + '»', t)
    return t


def typo_fr(t):
    out = []
    if re.search(r"(?<=\w)'(?=\w)", t): out.append("straight apostrophe (use ’)")
    if re.search(r'[ \u202f]:', t) or re.search(r'(?<=[^\s{}\d]):(?=\s)', t): out.append('colon needs a no-break space before it')
    if re.search(r'[ \u00a0\u202f][;?!]', t): out.append('no space before ; ? ! in Quebec usage')
    if re.search(r'«(?!\u00a0\S)|(?<=\s)\u00a0»|(?<!\u00a0)»', t): out.append('« » need one no-break space inside')
    return out


def forms(cell):
    return [f.strip() for f in (cell or '').split('|') if f.strip()]


def word(f):
    return re.compile(r'(?<![\w-])' + re.escape(f) + r'(?![\w-])', re.I)


def main(args):
    rows = read('canbim_strings.csv')
    if '--fix' in args:
        n = 0
        for r in rows:
            if r.get('fr'):
                f = fix_fr(r['fr'])
                if f != r['fr']: r['fr'] = f; n += 1
        write_dict(rows); print(f'Fixed French typography in {n} rows. Run build_i18n.py next.')
    langs = [c for c in rows[0].keys() if c not in ('en', 'where')]
    gloss = read('glossary.csv')
    exc = {(e['id'], e['en']) for e in read('glossary_exceptions.csv')} if os.path.exists(os.path.join(here, 'glossary_exceptions.csv')) else set()
    errors, warnings = defaultdict(list), defaultdict(list)

    seen = set()
    for r in rows:
        if r['en'] in seen: errors['Duplicate keys'].append(r['en'])
        seen.add(r['en'])
        ph = set(re.findall(r'\{\d+\}', r['en']))
        for l in langs:
            if r.get(l) and set(re.findall(r'\{\d+\}', r[l])) != ph:
                errors['Placeholders that differ from the English'].append(f'[{l}] {r["en"]}')
        if r.get('fr'):
            for p in typo_fr(r['fr']):
                errors['French typography (python3 translations/check_i18n.py --fix)'].append(f'{p}: {r["fr"]}')

    # The BEP Builder's own glossary (GLOSS in the app) is checked like dictionary rows.
    app = open(os.path.join(root, 'app', 'bep-builder.html'), encoding='utf-8').read()
    m = re.search(r'const GLOSS=(\[.*?\]);\n', app)
    checked = list(rows)
    if m:
        for g in json.loads(m.group(1)):
            for i in (0, 1):
                checked.append({'en': g['en'][i], 'where': 'app glossary', **{l: (g.get(l) or ['', ''])[i] for l in langs}})
                for p in typo_fr((g.get('fr') or ['', ''])[i]):
                    errors['French typography in the app glossary (GLOSS in app/bep-builder.html)'].append(f'{p}: {g["fr"][i]}')

    for g in gloss:
        en_re = [word(f) for f in forms(g['en'])]
        for f in forms(g.get('en_avoid')):
            for r in rows:
                if word(f).search(r['en']): warnings[f'English "{f}" (glossary: {g["id"]})'].append(r['en'])
        for l in langs:
            ok, bad = forms(g.get(l)), [word(f) for f in forms(g.get(l + '_avoid'))]
            if not ok and not bad: continue
            for r in checked:
                t = r.get(l)
                if not t or (g['id'], r['en']) in exc or not any(x.search(r['en']) for x in en_re): continue
                hit = [x.pattern for x in bad if x.search(t)]
                src = ' (app glossary)' if r.get('where') == 'app glossary' else ''
                if hit:
                    errors[f'Avoided word for "{g["id"]}" [{l}], use {" or ".join(ok[:2])}'].append(f'{r["en"]}  =>  {t}{src}')
                elif ok and not any(f.lower().replace("'", '’') in t.lower().replace("'", '’') for f in ok):
                    errors[f'Missing approved word for "{g["id"]}" [{l}]: {" / ".join(ok[:3])}'].append(f'{r["en"]}  =>  {t}{src}')

    # Built files must match the dictionary.
    sys.path.insert(0, here)
    import build_i18n
    table, menu = build_i18n.load()
    dump = lambda o: json.dumps(o, ensure_ascii=False, separators=(',', ':'))
    if app[app.index('/*I18N*/') + 8:app.index('/*/I18N*/')] != dump(table) or app[app.index('/*LANGS*/') + 9:app.index('/*/LANGS*/')] != dump(menu):
        errors['Not rebuilt'].append('app/bep-builder.html: run python3 translations/build_i18n.py')
    js = os.path.join(here, 'strings.js')
    if not os.path.exists(js) or dump(table) not in open(js, encoding='utf-8').read():
        errors['Not rebuilt'].append('translations/strings.js: run python3 translations/build_i18n.py')

    if '--app' in args:
        p = os.path.join(here, 'build', 'app_seen.json')
        if not os.path.exists(p):
            errors['App crawl'].append('run node translations/tools/crawl_app.js first')
        else:
            need = json.load(open(p, encoding='utf-8'))
            for l in langs:
                if l not in menu: continue
                miss = [x['en'] for x in need if not table[l].get(x['en'])]
                (errors if '--strict' in args else warnings)[f'Shown in the app with no [{l}] translation'].extend(miss)

    for kind, group in (('warning', warnings), ('ERROR', errors)):
        for title, items in group.items():
            if not items: continue
            print(f'\n{kind}: {title} ({len(items)})')
            for i in items[:40]: print('  ' + i[:220])
            if len(items) > 40: print(f'  ... and {len(items) - 40} more')
    total = sum(len(v) for v in errors.values())
    print(f'\n{len(rows)} rows, {len(gloss)} glossary terms, languages: {", ".join(langs)}. {total} errors, {sum(len(v) for v in warnings.values())} warnings.')
    return 1 if total else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
