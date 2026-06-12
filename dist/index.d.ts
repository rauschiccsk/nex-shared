import * as react from 'react';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Visual style. Defaults to `primary`. */
    variant?: ButtonVariant;
    /** Padding/text scale. Defaults to `md`. */
    size?: ButtonSize;
    children?: ReactNode;
}
declare function Button({ variant, size, className, children, type, ...rest }: ButtonProps): react.JSX.Element;

export { Button, type ButtonProps, type ButtonSize, type ButtonVariant };
