import * as React from "react"

import { cn } from "@/lib/utils"

type SurfaceCardProps = React.ComponentProps<"div"> & {
  variant?: "panel" | "inner"
}

function SurfaceCard({
  className,
  variant = "panel",
  ...props
}: SurfaceCardProps) {
  return (
    <div
      data-slot="surface-card"
      data-variant={variant}
      className={cn(
        variant === "panel" ? "surface-card-panel rounded-2xl" : "surface-card-inner rounded-xl",
        className
      )}
      {...props}
    />
  )
}

export { SurfaceCard }
