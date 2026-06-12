// src/Button.tsx
import { jsx } from "react/jsx-runtime";
var BASE = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
var VARIANT = {
  primary: "bg-primary-600 text-white hover:bg-primary-500",
  secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700"
};
var SIZE = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm"
};
function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...rest
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      type,
      className: `${BASE} ${VARIANT[variant]} ${SIZE[size]} ${className}`.trim(),
      ...rest,
      children
    }
  );
}
export {
  Button
};
