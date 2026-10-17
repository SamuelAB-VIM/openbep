# CANBIM Revit Graphics and Materials Standard v0.1

Oct 17, 2026 · @Samuel Arsenault-Brassard

One set of line types, text styles and materials for every Revit project in Canada, named like the parameters: English names, French labels, no duplicates.

## Why one standard

Today every firm ships its own template, so a project with four firms has four sets of line weights, four "Dash" patterns and four names for the same concrete. Linked models print with mixed weights, materials can't be totalled by type, and the owner inherits the mess.

What already exists, and what we take from it:

| Standard | What it sets | What we keep |
| --- | --- | --- |
| [ISO 128-2:2020](https://cdn.standards.iteh.ai/samples/69129/38e651842df746fd990d29679e3c2e98/ISO-128-2-2020.pdf) | Line widths 0.13 to 2 mm in a √2 series; wide to narrow 2:1 | The width series |
| [ISO 3098-0](https://cdn.standards.iteh.ai/samples/24792/1811286881f24ea49763a66a747029c8/ISO-3098-0-1997.pdf) | Text heights 1.8, 2.5, 3.5, 5, 7, 10 mm | The height series |
| [AEC (UK) Revit standard](https://aecuk.files.wordpress.com/2010/06/aecukbimstandardforrevit-v1-0.pdf) | 16 pens per scale, prefixed names (`AEC_Dash 3mm`, `AEC_1-Solid`), Arial Narrow | Pens that thin out at smaller scales; prefixed names |
| [PSPC CADD Standard 2024](https://web.archive.org/web/20241215044218if_/https://publications.gc.ca/collections/collection_2024/spac-pspc/P26-4-2024-eng.pdf) | 7 weight classes (0.13 to 1.00 mm), Arial Narrow and Arial, 2.0 mm minimum, French accents required | The weight classes and 2.0 mm floor |
| [Metrolinx CADD/BIM manual](https://assets.metrolinx.com/image/upload/v1738161857/Documents/Engineering/Metrolinx_CADD_BIM_Standards_Manual.pdf) | 3.0 mm default text, legible at half size | The half-size test |
| [Open BIM Object Standard](https://masterspec.co.nz/filescust/CMS/Open%20BIM%20Object%20Standard%20Consultation%20Draft%20NZ.pdf) | Names as `Type_Subtype_Differentiator` | The material name pattern |

National Defence's template follows its own CAD/BIM Standard 2.3, which is only on DND's internal network. SQI's BIM requirements set no graphics or material rules.

## Rules for all three

The same rules as the [parameter dictionary](parameter-dictionary.md): names are code, French is for people.

| Rule | Why | Règle |
| --- | --- | --- |
| Names start with `CA_`, in English, no accents | Same name in every model, readable by scripts | Les noms commencent par `CA_`, en anglais, sans accents |
| Every item has an English and a French label in this document | French users read the label, not the name | Chaque élément a une étiquette anglaise et française |
| Metric only: mm on paper, mm or m in the model | Canada builds in metric | Métrique seulement |
| Sizes are given at print size, not model size | A 2.5 mm note is 2.5 mm on the sheet at any scale | Les tailles sont données à l'impression |
| The template ships only what this standard lists | Each extra line style, text type or material is a duplicate waiting to happen | Le gabarit contient seulement ce qui est listé ici |
| Project additions use `CA_X_` and are reported at handover | Lets the owner see what was added and why | Les ajouts de projet utilisent `CA_X_` |
| No brand names in names; brands go in a parameter | Products change, the name shouldn't | Pas de marque dans les noms |

## Line types

Eight pens, all from the ISO 128 width series, each one step thinner at smaller scales so a 1:200 plan doesn't turn black. Colour never sets the printed weight.

### Model line weights (mm on paper)

| Pen | Used for | 1:5 to 1:20 | 1:50 | 1:100 | 1:200 | 1:500 and smaller | Usage (FR) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Hatch, surface patterns | 0.13 | 0.13 | 0.13 | 0.13 | 0.13 | Hachures |
| 2 | Hidden, beyond, furniture | 0.18 | 0.18 | 0.13 | 0.13 | 0.13 | Caché, au-delà |
| 3 | Projection, fine detail | 0.25 | 0.25 | 0.18 | 0.18 | 0.13 | Projection fine |
| 4 | Projection, main outlines | 0.35 | 0.35 | 0.25 | 0.25 | 0.18 | Projection |
| 5 | Cut, minor elements (doors, windows) | 0.50 | 0.50 | 0.35 | 0.35 | 0.25 | Coupe, éléments mineurs |
| 6 | Cut, walls, slabs | 0.70 | 0.70 | 0.50 | 0.50 | 0.35 | Coupe, murs et dalles |
| 7 | Cut, structure, site boundary | 1.00 | 1.00 | 0.70 | 0.70 | 0.50 | Coupe, structure |
| 8 | Profile, ground line | 1.40 | 1.40 | 1.00 | 1.00 | 0.70 | Profil, ligne de sol |

Annotation pens keep one width at every scale: 1 = 0.13, 2 = 0.18, 3 = 0.25, 4 = 0.35, 5 = 0.50, 6 = 0.70, 7 = 1.00 (sheet border).

### Line patterns (lengths on paper)

| Name | Dashes and gaps (mm) | Used for | Nom (FR) |
| --- | --- | --- | --- |
| `CA_Solid` | continuous | Default | Continu |
| `CA_Hidden` | 3 dash, 1.5 gap | Hidden edges | Caché |
| `CA_Overhead` | 6 dash, 3 gap | Above the cut plane | Au-dessus |
| `CA_Centre` | 12 dash, 3 gap, 1.5 dash, 3 gap | Centrelines, grids | Axe |
| `CA_Demolish` | 1.5 dash, 1.5 gap | Elements to demolish | À démolir |
| `CA_Dot` | dot, 1.5 gap | Clearance zones, setbacks | Pointillé |
| `CA_PropertyLine` | 18 dash, 3 gap, 1.5 dash, 3 gap, 1.5 dash, 3 gap | Property and lot lines | Limite de propriété |
| `CA_Existing` | 9 dash, 3 gap | Existing to remain (civil) | Existant à conserver |

### Line styles

One pattern per pen where needed, named `CA_<pen>_<Pattern>`: for example `CA_2_Hidden`, `CA_3_Solid`, `CA_4_Overhead`, `CA_6_Solid`, `CA_3_Centre`, `CA_5_Demolish`. Revit's own line styles (`<Hidden>`, `<Overhead>`) are set to the same pens and patterns so both read the same.

### Object styles (key categories)

| Category | Projection pen | Cut pen | Pattern |
| --- | --- | --- | --- |
| Walls | 3 | 6 | Solid |
| Floors, roofs | 3 | 6 | Solid |
| Structural columns, framing | 4 | 7 | Solid |
| Doors, windows | 3 | 5 | Solid |
| Stairs, railings | 3 | 5 | Solid |
| Ceilings | 2 | 5 | Solid |
| Furniture, casework, equipment | 2 | 4 | Solid |
| Ducts, pipes, cable trays | 3 | 4 | Solid |
| Grids | 3 | — | `CA_Centre` |
| Topography (toposolid) | 3 | 8 | Solid |

Pens are a proposal checked against AEC (UK) and PSPC, not tested on a printed set yet.

## Text

Two fonts, five heights, and nothing below 2.5 mm, so every sheet can still be read when printed at half size.

- **Fonts:** Arial Narrow for notes, dimensions and tags; Arial for titles. Both are on every Windows machine, carry all French accents, and match PSPC. French text runs longer than English, which Narrow absorbs.
- **Case:** sentence case, not all capitals. CNIB's [Clear Print guide](https://cnib.ca/sites/default/files/2018-07/CNIB%20Clear%20Print%20Guide.pdf) advises against all-caps, and French capitals keep their accents (É, À). PSPC asks for upper case, so federal projects may override this.
- **Width factor 1.0, no italics, transparent background.**

### Text types

| Name | Font | Height (mm) | Used for | Usage (FR) |
| --- | --- | --- | --- | --- |
| `CA_Text_2.5` | Arial Narrow | 2.5 | Notes, tags, schedules | Notes, étiquettes |
| `CA_Text_2.5_Bold` | Arial Narrow | 2.5 | Note headings | Titres de notes |
| `CA_Text_3.5` | Arial Narrow | 3.5 | Room names, sub-headings | Noms de locaux |
| `CA_Text_5_Bold` | Arial | 5 | View titles | Titres de vues |
| `CA_Text_7_Bold` | Arial | 7 | Sheet titles | Titres de feuilles |

All heights come from the ISO 3098 series. 1.8 mm is not allowed, since PSPC requires approval below 2 mm and Metrolinx requires legibility at half size.

### Dimension types

| Name | Units | Text | Used for |
| --- | --- | --- | --- |
| `CA_Dim_Linear_mm` | mm, no decimals | `CA_Text_2.5` | Buildings |
| `CA_Dim_Linear_m` | m, 3 decimals | `CA_Text_2.5` | Site, civil, rail |
| `CA_Dim_Angular` | degrees, 1 decimal | `CA_Text_2.5` | All |
| `CA_Dim_Radial` | mm | `CA_Text_2.5` | All |
| `CA_Spot_Elevation_m` | m, 3 decimals | `CA_Text_2.5` | Levels, grading |
| `CA_Spot_Slope_Percent` | %, 1 decimal | `CA_Text_2.5` | Ramps, roofs, site |

Arrowheads: `CA_Arrow_Filled_15` for leaders, `CA_Tick_Diagonal` for dimensions.

### Bilingual sheets

When a sheet must be in both languages, tags read two parameters (`_EN` and `_FR`) and show them on two lines, French first in Quebec. Never type both languages into one note: the next edit updates one and forgets the other.

*Texte : Arial Narrow pour les notes, Arial pour les titres, hauteur minimale de 2,5 mm, minuscules avec accents. Sur une feuille bilingue, chaque étiquette lit deux paramètres, \_FR et \_EN.*

## Materials

A material is named for what it is, not for who made it or how thick it is. The layer sets the thickness, and the brand goes in Manufacturer and Model once a product is chosen.

### Name pattern

`CA_<Class>_<Type>_<Differentiator>`, following the Open BIM Object Standard pattern.

| Example | Class | Matériau (FR) |
| --- | --- | --- |
| `CA_Concrete_CastInPlace_35MPa` | Concrete | Béton coulé en place 35 MPa |
| `CA_Concrete_Precast_50MPa` | Concrete | Béton préfabriqué 50 MPa |
| `CA_Masonry_ConcreteBlock_Normal` | Masonry | Bloc de béton |
| `CA_Masonry_Brick_Clay` | Masonry | Brique d'argile |
| `CA_Metal_Steel_350W` | Metal | Acier 350W |
| `CA_Metal_Aluminium_Anodized` | Metal | Aluminium anodisé |
| `CA_Wood_Lumber_SPF` | Wood | Bois d'œuvre É-P-S |
| `CA_Wood_CLT` | Wood | Bois lamellé-croisé |
| `CA_Gypsum_Board_TypeX` | Gypsum | Gypse type X |
| `CA_Insulation_MineralWool_Batt` | Insulation | Laine minérale en matelas |
| `CA_Insulation_XPS_Board` | Insulation | Polystyrène extrudé |
| `CA_Membrane_AirVapour_SelfAdhered` | Membrane | Pare-air/vapeur autocollant |
| `CA_Glass_Laminated_Clear` | Glass | Verre feuilleté clair |
| `CA_Finish_Paint_Latex` | Finish | Peinture latex |
| `CA_Earth_Gravel_Granular_A` | Earth | Gravier granulaire A |

Classes are fixed: Concrete, Masonry, Metal, Wood, Gypsum, Insulation, Membrane, Glass, Finish, Plastic, Earth, Generic. `CA_Generic_<Class>` is only for LOD 100 and 200, before the material is known.

### Data each material must carry

| Revit field | When | Rule | Champ (FR) |
| --- | --- | --- | --- |
| Class | Always | One of the 12 classes | Classe |
| Description | Always | Plain English, shown in tags | Description |
| `CA_Description_FR` | Always | Plain French, shown in French tags | Description française |
| Keynote | LOD 300 and up | Masterformat section, such as 09 21 16 | Note-clé |
| Thermal: conductivity (W/(m·K)), density (kg/m³), specific heat (J/(kg·K)) | Energy analysis use | From the manufacturer or a cited reference table, never left at Revit's default | Propriétés thermiques |
| Structural: strength, modulus | Structural analysis use | From the structural engineer's specification | Propriétés structurales |
| Manufacturer, Model | LOD 400 and up | The product actually bought | Fabricant, modèle |

### Graphics and appearance

- **Cut and surface patterns** come from the material, not from overrides, so every view agrees. Each class has one cut pattern, such as `CA_Concrete`, `CA_Insulation_Batt` or `CA_Earth`, drawn with pen 1.
- **Appearance:** one appearance asset per material, Revit's own library or a plain colour. No imported textures unless the visualisation use is chosen, since they bloat the model.
- **No duplicates:** Revit copies a material on every family load. The CANBIM Sync add-in should flag any material not starting with `CA_` at each milestone.

The parameter dictionary's built-in `Material / Structural Material` field takes these names, so quantities can be totalled by material across a portfolio.

*Matériaux : nommés selon ce qu'ils sont (classe, type, précision), sans marque ni épaisseur. Chaque matériau porte une description en anglais et en français, ses propriétés thermiques si l'usage énergie est choisi, et son fabricant à partir du LOD 400.*

## Sources

Pages opened on 2026-10-17. Not readable: DND CAD/BIM Standard 2.3 (internal network), PSPC Revit template annex, US National CAD Standard drafting module and CSA B651 (paid).

- [ISO 128-2:2020 sample](https://cdn.standards.iteh.ai/samples/69129/38e651842df746fd990d29679e3c2e98/ISO-128-2-2020.pdf)
- [ISO 3098-0:1997 sample](https://cdn.standards.iteh.ai/samples/24792/1811286881f24ea49763a66a747029c8/ISO-3098-0-1997.pdf)
- [AEC (UK) BIM Standard for Revit v1.0](https://aecuk.files.wordpress.com/2010/06/aecukbimstandardforrevit-v1-0.pdf)
- [PSPC National CADD Standard 2024](https://web.archive.org/web/20241215044218if_/https://publications.gc.ca/collections/collection_2024/spac-pspc/P26-4-2024-eng.pdf)
- [US National CAD Standard FAQ](https://www.nationalcadstandard.org/ncs6/faqs.php)
- [Metrolinx CADD/BIM Standards Manual](https://assets.metrolinx.com/image/upload/v1738161857/Documents/Engineering/Metrolinx_CADD_BIM_Standards_Manual.pdf)
- [CNIB Clear Print Guide](https://cnib.ca/sites/default/files/2018-07/CNIB%20Clear%20Print%20Guide.pdf)
- [Open BIM Object Standard, NZ draft](https://masterspec.co.nz/filescust/CMS/Open%20BIM%20Object%20Standard%20Consultation%20Draft%20NZ.pdf)
- [bimstore bible v13.1 (archived)](https://web.archive.org/web/20220309004758if_/https://storage.googleapis.com/bimstore-uploads/uk/uploads/software/bimstore-bible-v13-1-published.pdf)
- [Revit API ThermalAsset](https://help.autodesk.com/cloudhelp/2026/ENU/Revit-API-MainReference/files/html/c4dac7e3-96e2-bc6c-1299-f696a253e879.htm)
- [DND BIM Template and Content User Guide v1.0](https://www.geniemdnquebec.ca/SalleTechniqueCommuns/DND_BIM_Template_and_Content_User_Guide_v1.0.pdf)
- [SQI exigences BIM](https://www.sqi.gouv.qc.ca/fileadmin/expertises/bim-pci/fr-gp-030.079_-exigences_bim_web.pdf)


