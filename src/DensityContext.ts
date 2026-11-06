import { createContext, useContext } from "react";

/**
 * v0.21.0 — whether the sidebar is dense: 28 px rows, a lower brand block and a one-line footer, so an app with many
 * entries keeps them all in view (NEX Studio Visual: 17 entries and more coming). Provided by the shared `<Sidebar
 * dense>`; `<NavItem>`, `<Brand>` and `<SectionDivider>` read it. Off by default — every other app keeps its look.
 * On a touch screen a row stays at least 44 px regardless (the `pointer: coarse` rule in `tokens.css`).
 */
export const DensityContext = createContext<boolean>(false);

/** Read whether the nearest `<Sidebar>` is dense. */
export const useDense = (): boolean => useContext(DensityContext);

/**
 * v0.34.0 — in a dense sidebar, 26 px rows instead of 28 (DEV-318: NEX Studio Visual holds 22 entries at 1280×800
 * without scrolling; the Director 06.11.2026 on lowering its rows by 2 px: „Súhlasím“). Provided by `<Sidebar dense
 * compactRows>`; read by `<NavItem>`. Off by default — an app on the template keeps its 28 px rows; it tightens only a
 * dense sidebar, and on a touch screen a row stays at least 44 px regardless.
 */
export const CompactRowsContext = createContext<boolean>(false);

/** Read whether the nearest `<Sidebar>` has compact rows. */
export const useCompactRows = (): boolean => useContext(CompactRowsContext);
