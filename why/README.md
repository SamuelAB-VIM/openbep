# Why OpenBEP page

- `index.html` is the English master, served at https://openbep.com/why/.
- Each other language is generated into `<code>/index.html` (for example `fr/index.html`) from the table `translations/site_strings.csv`. Don't edit the generated pages; edit the table and rebuild.
- Every element with `data-i18n` is one sentence or block to translate, keyed by its exact English HTML.

## Change the English text

1. Edit `index.html`.
2. Run `python3 translations/build_pages.py --extract` to add the new English strings to the table.
3. Fill their cells in each language column, then run `python3 translations/build_pages.py`. It lists any string still missing; a missing string shows in English.

## Add a language

1. Add a column to `translations/site_strings.csv` named with the language code (`ja`, `es`, ...) and fill it.
2. Run `python3 translations/build_pages.py` to write `why/<code>/index.html`.
3. Add the language to `why/languages.js` and an `<link rel="alternate" hreflang>` line to the head of `index.html`, then rebuild.

## Sources

Every source is linked by its public URL and was opened before it was cited. Never copy research notes, access-to-information files or licensed standards into the repository.
