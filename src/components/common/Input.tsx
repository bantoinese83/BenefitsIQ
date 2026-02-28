import * as React from "react"
import { cn } from "../../lib/utils"
import { type LucideIcon } from "lucide-react"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground mb-2 block uppercase tracking-wider",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  icon?: LucideIcon
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon: Icon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 flex flex-col group">
        {label && <Label htmlFor={props.id || props.name}>{label}</Label>}
        <div className="relative group/input">
          {Icon && (
            <Icon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors size-4"
            />
          )}
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-xl border border-input bg-card/50 px-4 py-2 text-sm shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 hover:border-accent-foreground/20",
              Icon && "pl-11",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs font-medium text-destructive mt-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, Label }
