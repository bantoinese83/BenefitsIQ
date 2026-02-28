"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"
import { useTheme } from "next-themes"
import { cn } from "../../lib/utils"

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

/**
 * Animated theme toggler component with View Transition API support.
 */
export const AnimatedThemeToggler = ({
  className,
  duration = 500,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return

    const newTheme = resolvedTheme === "dark" ? "light" : "dark"

    // Fallback for browsers that don't support View Transitions
    if (!document.startViewTransition) {
      setTheme(newTheme)
      return
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme)
      })
    }).ready

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    )

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }, [resolvedTheme, setTheme, duration])

  if (!mounted) {
    return (
      <button
        className={cn(
          "relative inline-flex items-center justify-center rounded-xl p-2.5 text-muted-foreground transition-all border border-transparent hover:border-border",
          className
        )}
        disabled
      >
        <div className="w-5 h-5" />
      </button>
    )
  }

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl p-2.5 text-muted-foreground hover:text-primary transition-all hover:bg-primary/5 border border-transparent hover:border-primary/20",
        className
      )}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      {...props}
    >
      {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
