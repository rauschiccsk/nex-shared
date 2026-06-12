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
