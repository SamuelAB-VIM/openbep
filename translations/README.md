# CANBIM translation library

- `canbim_strings.csv` is the master: column `en` is the exact English text shown in the app (the key), then one column per language (`fr`, `ja`, ...), and `where` (the app step it appears in).
- To add a language, add a column. To fix a translation, edit its cell; never edit the app text for a translation.
- Build: `python3 build_i18n.py <path to app-v3.js>` embeds the table; then rebuild the HTML.
- The app's "Strings to translate (CSV)" button (in the Glossary) exports every string it has shown, with the current translations, so new text can be added to the master.
- A string that is missing in a language shows in English.
- French: Quebec usage and typography (OQLF), filled 2026-10-17 for 3,151 strings. Judgment calls to review: stage names (Conception préliminaire / définitive), "maquette d'archives" for record model, "décision d'un tiers (adjudication)", "Plan de livraison" for delivery plan.
