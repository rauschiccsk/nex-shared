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

## v0.23.0
- `[nové]` **Okno spustené z NEX Managera sa otvorí tam, kde ste ho nechali** (`rememberLaunchWindow()`) — to isté ako
  v0.19.1 (opravná verzia z v0.19.0 pre aplikácie na v0.19.x), aby sa pri povýšení na novšiu verziu nestratilo.
  Aplikácia ju zavolá raz pri štarte (DEV-142).

## v0.22.0
- `[nové]` **Červená bodka pri záložke** (`<NavItem badge badgeTone="danger">`). Bodka pri záložke môže byť okrem
  oranžovej („niečo čaká na teba“) aj červená, keď je niečo pokazené — napríklad zlyhané kontroly. Bez `badgeTone`
  ostáva oranžová ako doteraz.

## v0.21.0
- `[nové]` **Hustý bočný panel** (`<Sidebar dense>`). Záložky majú 28 px namiesto 35 px a blok s logom je nižší:
  menší štvorec, názov a verzia sú v jednom riadku a celé sú v bublinke. Pätička je v jednom riadku a zmestí sa
  tak viac záložiek bez posúvania. Na dotykovej obrazovke ostáva každý riadok aspoň 44 px. Bez `dense` sa nemení nič.
- `[nové]` **Šírka bočného panela sa dá meniť ťahadlom** (`<Sidebar width onWidthChange minWidth maxWidth
  defaultWidth>`). Pravý okraj panela sa dá potiahnuť myšou alebo prstom a posunúť šípkami (Home/End = najužší a
  najširší). Dvojklik vráti predvolenú šírku a hranice platia vždy. Aplikácia dostane šírku raz, po skončení zmeny,
  a uloží si ju, kam chce. Len na širokej obrazovke a nie v zbalenom paneli. Bez `onWidthChange` ostáva panel
  pevný a široký 14rem.
- `[nové]` `ResizeHandle` — to isté ťahadlo pre ľubovoľný panel aplikácie (napr. pravý stĺpec). Je to `separator`
  s `aria-valuenow`, takže čítačka povie šírku.
- `[nové]` `SectionDivider` — tenká čiara medzi skupinami záložiek tam, kde skupina nepotrebuje nadpis.
- `[nové]` `UserCard` má slot `actions` pre malé ovládacie prvky aplikácie vedľa tlačidla Odhlásiť (napr. prepínač
  prítomnosti), takže pätička ostane v jednom riadku.

## v0.20.0
- `[vzhľad]` **Aplikácia sa dá používať na mobile a tablete.** Pod šírkou 1024 px (mobil, tablet na výšku)
  sa bočný panel schová za tlačidlo „Ponuka“ na začiatku hornej lišty a obsah dostane celú šírku. Panel sa
  vysunie cez obsah. Zavrie sa klávesou Esc, ťuknutím vedľa neho alebo výberom položky v ponuke. Zatvorený je
  skrytý aj pre klávesnicu a čítačku obrazovky. V zásuvke je panel vždy rozbalený s popismi a tlačidlo
  „Zúžiť“ sa mení na „Zavrieť ponuku“. Na počítači sa nemení nič.
- `[vzhľad]` **Na dotykovej obrazovke sa dá trafiť prstom.** Kde je hlavným ukazovateľom prst (`pointer: coarse`),
  majú tlačidlá, polia, výbery, záložky a riadky so zaškrtávacím políčkom aspoň 44 px. S myšou sa nemení nič.
  Pravidlo je vo vrstve `base`, takže ho výnimka v aplikácii (napr. `min-h-0`) prebije.
- `[vzhľad]` Horná lišta (`Header`) má výšku najmenej 2,5 rem namiesto pevných 2,5 rem — na dotykovej obrazovke
  narastie s tlačidlami v nej.
- `[vzhľad]` Tabuľky `DataTable`, `UsersPanel` a `SessionsPanel` sa na úzkej obrazovke posúvajú do strany vo
  vlastnom rámčeku namiesto odrezania. Dátumy relácií sa nezalamujú a riadok filtrov používateľov sa zalomí.
- `[nové]` `useShell()` povie, či je obrazovka úzka (`narrow`), a ponúka `closeMenu()`. Aplikácia, ktorá v
  bočnom paneli kreslí vlastný obsah podľa svojho stavu zúženia, má v zásuvke kresliť rozbalený obsah:
  `const { narrow } = useShell(); const collapsed = myCollapsed && !narrow;` (vzor: NEX Studio
  `components/layout/Sidebar.tsx`). Exportované sú aj `useWideScreen()` a `WIDE_SCREEN_QUERY`.
- `[nové]` Záložky v `SettingsShell` sú označené ako záložky (`role="tablist"`/`"tab"`, `aria-selected`) a na
  úzkej obrazovke sa posúvajú vo vlastnom rámčeku. Tlačidlo „Nový používateľ“ hlási `aria-expanded`.

## v0.19.0
- `[oprava]` **Strojopisné písmo sa konečne aj dodáva.** `--font-mono` si pýtal JetBrains Mono a Fira
  Code od prvého vydania tokenov a **ani jedno sa nikdy nedodalo** — presne tá istá chyba, akú
  v0.18.0 opravila pri Interi, len o písmo nižšie. Každá plocha s kódom (terminál agenta, bloky kódu
  v Špecifikácii a Znalostnej báze, identifikátory požiadaviek, čipy verzií) sa preto vykresľovala
  tým, čo mal kto na počítači — na každom stroji inak. Knižnica teraz nesie JetBrains Mono ako
  variabilné woff2 (`latin` + `latin-ext`, ~76 kB), hosťované u nás. Appka nemusí spraviť nič.
  SIL Open Font License.

## v0.18.1
- `[oprava]` **Brand: názov appky sa už nezalomí.** Bol písaný veľkosťou `text-sm`, čiže rástol spolu
  so základnou veľkosťou textu appky. Keď NEX Studio Visual zdvihlo `text-sm` zo 14 na 15 px,
  „NEX Studio Visual" prestal sadnúť na jeden riadok bočného panela, zalomil sa na dva a **posunul
  celú ponuku o ~15 px nadol** — až sa jej koniec schoval za rolovaciu lištu. Značka je pevná časť
  rámu a nemá sledovať veľkosť obsahového textu; je pripnutá na 14 px.

## v0.18.0
- `[oprava]` **Písmo Inter sa konečne aj dodáva.** `--font-sans` si Inter pýtal od prvého vydania
  tokenov, ale v postavenom CSS nebolo **ani jedno** pravidlo `@font-face` a žiadny súbor — appky
  teda ticho padali na systémové písmo prehliadača. Na Linuxe to býva tenká UI fontina, ktorá pri
  malých veľkostiach a slovenskej diakritike vyzerá zle. Knižnica teraz nesie Inter ako variabilné
  woff2 (podmnožiny `latin` + `latin-ext`, spolu ~132 kB, sťahuje sa len to, čo text potrebuje),
  hosťované u nás — nie z CDN. Appka nemusí spraviť nič, príde to cez `@import
  "nex-shared/tokens.css"`. SIL Open Font License.
- `[vzhľad]` **Potlačený text vo svetlom režime opravený na `#64748b`.** Doterajšia hodnota
  `#94a3b8` má na svetlom plátne kontrast **2,45 : 1** — pod normou AA pre bežný text. **Všetkých
  päť appiek** si ju nezávisle prepisovalo lokálnym `:root:not(.dark)` na presne tú istú hodnotu, čiže
  knižnica posielala chybu a každá appka za ňu platila. Opravené pri zdroji (4,55 : 1), appky môžu
  svoj lokálny prepis odstrániť.

## v0.17.0
- `[oprava]` **Zlúčené dve rozbehnuté vetvy.** Knižnica sa po v0.15.0 rozdvojila a nikdy nespojila:
  jedna vetva priniesla `MyAccountPanel` + tab `konto` (v0.15.1) a tlačidlo „Poslať test" pre
  Telegram (v0.15.2), druhá changelog a novú paletu (v0.16.0). Ani jedna nemala to druhé, takže
  appka na v0.15.x by povýšením na v0.16.0 **stratila „Moje konto"** — hoci changelog v0.16.0
  uvádza „bez zmeny API" (voči vlastnej línii pravdivo, voči v0.15.x nie). Táto verzia obsahuje
  obe línie naraz; povýšenie z ktorejkoľvek strany už nič neuberá.
- `[vzhľad]` **NavItem: pevná výška riadku 35 px.** Rozostup sa dovtedy nastavoval odsadením a
  výška z neho nikdy nevychádzala — emoji ikona sa vykresľuje vyššia než jej riadkový box a ťahala
  riadok so sebou (47 px pri `py-2`, 40 px pri `py-1.5`). Pevná výška + pevný rámček ikony 16×16 to
  ukotvia bez ohľadu na glyf. Pätnásť položiek zaberie ~555 px namiesto ~705 px, takže bočný panel
  prestal rolovať. Prevzaté z v0.15.3/v0.15.4.

## v0.16.0
- `[vzhľad]` **Nová paleta — schválený Vizuál dizajn.** Značkový akcent sa mení z indiga na **fialovú `#6d5efc`** (tlačidlá, odkazy, focus, verzný chip). Tmavý režim dostáva **hlbšie, teplejšie plochy** (plátno `#0e1116`, povrch `#161b22`, orámovanie `#2a323d`, text `#e6e9ee`) namiesto slate. Sémantické stavy zladené s dizajnom (info = tyrkysová `#22d3ee`). Svetlý režim ostáva svetlý, len s novým akcentom. Bez zmeny API — každý `var(--color-…)` konzument dostane nový vzhľad bez úpravy.

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
