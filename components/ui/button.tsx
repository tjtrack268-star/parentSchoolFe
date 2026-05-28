import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-[#3f2f85] text-white hover:bg-[#32256b] focus:ring-[#3f2f85]",
        outline: "border border-[#3f2f85] text-[#3f2f85] hover:bg-[#a3ade8]/20 focus:ring-[#3f2f85]",
        ghost: "text-[#3f2f85] hover:bg-[#a3ade8]/25 focus:ring-[#3f2f85]",
        secondary: "bg-[#a3ade8]/30 text-[#3f2f85] hover:bg-[#a3ade8]/45 focus:ring-[#3f2f85]",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus:ring-destructive",
        link: "text-[#3f2f85] underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-2 text-sm",
        sm: "px-3 py-1.5 text-xs",
        lg: "px-6 py-3 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
)

Button.displayName = "Button"

export { Button }
export default Button
