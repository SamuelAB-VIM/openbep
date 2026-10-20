# "A file format won't fix vague BIM" page

- `index.html` is served at https://openbep.com/formats/. It is **English only for now**: the argument is reviewed in English before it is translated.
- Once approved, translate it like the Why page: add `'formats/index.html': 'Formats page'` to `PAGES` in `translations/build_pages.py`, run `python3 translations/build_pages.py --extract`, fill the `fr` and `ja` cells in `translations/canbim_strings.csv`, then `python3 translations/check_i18n.py --fix && python3 translations/build_pages.py`, and add a language switcher (see `why/`).
- Every quote is word for word and every source was opened before it was cited. Never copy research notes, transcripts or licensed standards into the repository.
