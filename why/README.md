# Why OpenBEP page

- `index.html` is the English master, served at https://openbep.com/why/.
- Each other language is generated into `<code>/index.html` (for example `fr/index.html`) from the site's one dictionary, `translations/canbim_strings.csv` (rows with `where` = `Why OpenBEP`). Don't edit the generated pages; edit the dictionary and rebuild.
- Every element with `data-i18n` is one sentence or block to translate, keyed by its exact English HTML.

## Change the English text

1. Edit `index.html`.
2. Run `python3 translations/build_pages.py --extract` to add the new English strings to the table.
3. Fill their cells in each language column, run `python3 translations/check_i18n.py --fix`, then `python3 translations/build_pages.py`. It lists any string still missing; a missing string shows in English.

## Add a language

1. Add the language to the dictionary as `translations/README.md` explains, and fill the `Why OpenBEP` rows.
2. Run `python3 translations/build_pages.py` to write `why/<code>/index.html`.
3. Add the language to `why/languages.js` and an `<link rel="alternate" hreflang>` line to the head of `index.html`, then rebuild.

## Sources

Every source is linked by its public URL and was opened before it was cited. Never copy research notes, access-to-information files or licensed standards into the repository.
