import { createContext, useContext } from "react";

/**
 * Sidebar collapse state, provided by the shared `<Sidebar>` so that
 * `<NavItem>` / `<SectionLabel>` can read whether the rail is collapsed
 * without the consuming app threading a `collapsed` prop through every item.
 *
 * The collapse state itself is OWNED BY THE APP (props `collapsed` /
 * `onToggleCollapse` on `<Sidebar>`); this context only mirrors it downward.
 */
export const CollapseContext = createContext<boolean>(false);

/** Read the sidebar collapse state from the nearest `<Sidebar>`. */
export const useCollapsed = (): boolean => useContext(CollapseContext);
