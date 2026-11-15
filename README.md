# nex-shared

NEX shared frontend library — canonical design tokens + UI primitives (E1 unification; **NEX Studio is the
vzor**). Pre-built ESM (tsup); `dist/` is committed so consumers install it as a git-dep without a build step.

## Consume

```jsonc
// package.json
"dependencies": { "nex-shared": "github:rauschiccsk/nex-shared#v0.1.0" }
```

```css
/* src/index.css — AFTER @import "tailwindcss"; */
@import "nex-shared/tokens.css";           /* shared @theme + @custom-variant dark + @layer components */
@source "../node_modules/nex-shared/dist"; /* let Tailwind v4 detect utility classes used by shipped components */
```

```tsx
import { Button } from "nex-shared";
<Button variant="primary">Uložiť</Button>
```

Requires React ^19 + Tailwind ^4.3 (peer deps).

## Language (v0.36.0)

Every text of the library comes from a catalog per language (`src/locales/sk.ts` is the source of keys, `hu.ts` is
typed against it). The app tells the library the person's language — and may add its own texts to the same catalogs:

```tsx
import { I18nProvider, useT } from "nex-shared";

<I18nProvider language={user.language} messages={{ sk: appSk, hu: appHu }}>
  <App />
</I18nProvider>;

const t = useT();
t("users.title");                  // the library's text in the person's language
t("app.invoice.title");            // the app's own text, same catalogs
t("users.count", { count: 3 });    // plural form by the language's rules
```

Without a provider the library speaks Slovak, as before. `MyAccountPanel` offers the choice of language when the app
passes `languages` (more than one) and `onLanguageChange`. Dates follow the language (`useLanguage().locale`,
`formatDateTime`). A text written into a component instead of a catalog fails `test/no-text-outside-catalogs.test.mjs`.
