# CANBIM universal Revit parameter list, v0.1 (draft)

One list of Revit parameters that every owner in Canada can ask for, tied to the LODs and BIM uses in the BEP Builder. Each parameter has one name and one fixed GUID. That way, "fire rating" means the same thing on every project and from every firm, and data can be combined across projects.

## Files

| File | What it is |
|---|---|
| `CANBIM_SharedParameters_v0.1.txt` | A Revit shared parameter file with 300 shared parameters in 8 groups. Load it in Revit under Manage › Shared Parameters. |
| `CANBIM_Parameters_Manifest_v0.1.csv` | The full list, one row per parameter and element type. It covers all 398 parameters: 300 shared and 98 Revit built-in. Each row gives the Revit categories, instance or type, the LOD it is required from, the BIM uses that need it, the IFC target, an example value, the placeholder values the checker rejects, and the English and French labels. |
| `gen_sp.py` | The script that writes the .txt and the manifest from the BEP Builder element library (`lb_all.json`, to be added). GUIDs are derived from names, so reruns give the same GUIDs. |

The BEP Builder (v0.22, step "Element requirements") exports the subset each project needs. That subset comes from the chosen BIM uses and target LODs. The export is a .txt file plus a binding list (CSV). The school example gives 153 shared parameters, 65 built-in parameters and 54 element types.

## Rules used

1. **Use Revit's built-in parameters wherever they exist.** For example, Fire Rating, Manufacturer, Model and Flow are built in. They are listed in the manifest as "Built-in" and never duplicated.
2. **One concept, one parameter.**
   - Our own data had "Fire-resistance rating" twice: walls and doors use Revit's built-in, dampers need a shared one. They are now one canonical entry, `CA_FireResistanceRating`, used only where Revit has no built-in.
   - "Acoustic rating", "Mounting type" and "Finish colour" were merged the same way.
   - 18 such groups were merged.
3. **Names.** Shared parameters use `CA_` plus the English label in PascalCase. NUMBER parameters carry the unit, for example `CA_DesignAirflow_Ls` or `CA_RatedPower_kW`. The French label is in the manifest.
4. **Data types.**
   - The file uses only the classic tokens that Autodesk's own IFC parameter file uses: TEXT, NUMBER, LENGTH, AREA, VOLUME, YESNO, INTEGER and MULTILINETEXT.
   - Engineering values such as power, flow and pressure are NUMBER, with the unit in the name. Autodesk's IFC parameter file does the same.
5. **GUIDs are fixed.**
   - Each GUID is a UUID v5 (namespace URL) of `urn:canbim:parameter:<name>`. Anyone can regenerate the same GUID from the name.
   - The research recommends publishing the list in the buildingSMART Data Dictionary (bSDD) later and deriving the GUIDs from the bSDD URIs. The bSDD Revit plugin already does this. That would change the GUIDs once, before v1.0.
6. **Groups.**
   - A parameter used across three or more disciplines goes in "01 Identity and asset".
   - Every other parameter goes in its main discipline: architecture, structure, mechanical, plumbing and fire, electrical, site and civil, or rail, bridges and tunnels.

## Adding and removing parameters in a model

- **Without an add-in:**
  - Revit loads the .txt, but each project parameter must be added and bound to its categories one at a time.
  - Revit cannot delete unused shared parameters in bulk. Autodesk staff confirm the user interface never fully purges them.
- **With Autodesk's Parameters Service** (needs Autodesk Construction Cloud and an administrator):
  - Bulk add is possible.
  - An uploaded .txt still needs its categories set, which is what the binding list supplies.
- **Proposed next step:**
  - Build a small add-in, or a tool on a Revit MCP server, that reads the binding list and makes the model match it.
  - It would add the missing parameters with the CANBIM GUIDs, bind them to the right categories, and remove the parameters that are not in the plan.
  - Two open-source Revit MCP servers can already create and bind shared parameters: Horizun (Apache-2.0) and LuDattilo (MIT). Neither reconciles a model against a required list.

## Limits of this draft

- **Not yet loaded in Revit.** The file follows the format of Autodesk's own file, but it should be tested in Revit 2025 to 2027.
- **Built-in parameter names vary.** Some vary by Revit version and are marked "verify" in the manifest.
- **Coverage.** The list covers the 63 element types in the BEP Builder, not every Revit category.
- **Wording.** Labels and descriptions are CANBIM's own. IFC targets are IFC 4.3 property sets.
