# Changelog — nex-shared

Zdieľaný FE dizajn-kit + utility pre ICC aplikácie. Každá verzia zodpovedá jednému git tagu
(`vX.Y.Z`). Aplikácie si nex-shared pripínajú na konkrétnu verziu a povyšujú sa opt-in
(NEX Studio auto-notify pri založení novej verzie appky).

**Značky pri zmenách** — číta ich aj auto-notify prompt v NEX Studiu a vykresľuje ako odznaky:

| Značka | Význam |
|---|---|
| `[vzhľad]` | Mení vzhľad aplikácie → po povýšení treba **vizuálny re-check** (uvidíš ho v náhľade Vizuál). |
| `[API]` | **Nekompatibilná** zmena komponentu/propu → povýšenie môže vyžadovať úpravu v appke. |
| `[nové]` | Nový komponent alebo voliteľná schopnosť (aditívne, nič nerozbije). |
| `[oprava]` | Oprava chyby. |

> **Pravidlo:** žiadna nová verzia (bump `package.json` + tag) bez záznamu v tomto súbore.
> Vynucuje to CI (`.github/workflows/changelog.yml`) — chýbajúca sekcia pre aktuálnu verziu = FAIL.

---

## v0.15.0
- `[vzhľad]` **AgentsPanel**: úrovne uvažovania sa zobrazujú po slovensky (Nízka / Stredná / Vysoká / Veľmi vysoká / Maximálna) namiesto surových hodnôt, panel prepísaný do ľudskej reči namiesto CLI žargónu (`--model`/`--effort`). Spätne kompatibilné — prop `efforts` bez zmeny, neznáme hodnoty ostávajú tak, ako sú.

## v0.14.0
- `[nové]` **UserForm**: pole Email je voliteľné cez `fieldSchema.email?` — chýbajúce/`true` = pôvodné správanie (zobrazené + povinné, byte-identické), `false` = skryté + nepovinné. Spätne kompatibilné (default nezmenený). Rieši appky, kde používatelia nemajú email (prihlásenie menom), bez mŕtveho DB stĺpca.

## v0.13.0
- `[vzhľad]` **SystemSettingsPanel**: zobrazuje ľudský `label` ako názov nastavenia + `unit` ako pasívnu príponu za editorom, surový `key` sa zmenší na malý info riadok. Voliteľné `label?`/`unit?` — nastavenie bez nich sa renderuje presne ako predtým. Spätne kompatibilné. Umožňuje plne slovenské, ľudské obrazovky nastavení.

## v0.12.0
- `[nové]` Nové komponenty pre jednotné ICC admin obrazovky: **DataTable**, **StatusBadge**, **IconButton**, **FormGrid**, **FormField**. Čisto aditívne — appka ich začne používať, keď chce.

---

## v0.6.0 – v0.11.0
Vydané **pred zavedením changelogu** (changelog doplnený 2026-07-21). Zmeny týchto verzií
sú dohľadateľné v git histórii: `git log --oneline v0.6.0..v0.11.0`. Od v0.12.0 sa každá
verzia dokumentuje vyššie.
