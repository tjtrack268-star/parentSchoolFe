import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

    const variants = {
      default: "bg-[#3f2f85] text-white hover:bg-[#32256b] focus:ring-[#3f2f85]",
      outline: "border border-[#3f2f85] text-[#3f2f85] hover:bg-[#a3ade8]/20 focus:ring-[#3f2f85]",
      ghost: "text-[#3f2f85] hover:bg-[#a3ade8]/25 focus:ring-[#3f2f85]",
      secondary: "bg-[#a3ade8]/30 text-[#3f2f85] hover:bg-[#a3ade8]/45 focus:ring-[#3f2f85]",
    }

    const sizes = {
      default: "px-4 py-2 text-sm",
      sm: "px-3 py-1.5 text-xs",
      lg: "px-6 py-3 text-base",
    }

    return (
      <button ref={ref} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`} {...props} />
    )
  },
)

Button.displayName = "Button"

export { Button }

export default Button
