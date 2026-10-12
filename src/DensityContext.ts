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
