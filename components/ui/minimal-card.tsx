import * as React from "react";

import { cn } from "@/lib/utils";

/* Adapted from cult-ui's MinimalCard (https://cult-ui.com/docs/components/minimal-card),
   re-themed onto Motif's FIXED card tokens (--surface/--border/--radius-lg) — gallery
   tiles must stay light even when a dark background is applied site-wide, so no --sd-*
   utilities here. The signature look: a padded outer card with an inset, hairline-framed
   media area. */

function MinimalCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="minimal-card"
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-2",
        "shadow-[var(--shadow-card)]",
        className,
      )}
      {...props}
    />
  );
}

/* Generic framed media slot — children fill it (Motif puts live <Background>
   previews here). 20px outer radius − 8px padding = 12px, so the frame stays
   concentric with the card. */
function MinimalCardMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="minimal-card-media"
      className={cn(
        "relative w-full overflow-hidden rounded-[12px] bg-[var(--surface-2)]",
        "shadow-[0_0_0_1px_oklch(0_0_0_/_0.07)]",
        className,
      )}
      {...props}
    />
  );
}

function MinimalCardImage({
  className,
  alt = "",
  ...props
}: React.ComponentProps<"img">) {
  return (
    <MinimalCardMedia className="h-[190px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={alt}
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
        {...props}
      />
    </MinimalCardMedia>
  );
}

function MinimalCardTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="minimal-card-title"
      className={cn(
        "mt-2 px-1 text-base leading-tight font-bold tracking-[-0.02em]",
        "text-[var(--ink)] [font-family:var(--font-display)]",
        className,
      )}
      {...props}
    />
  );
}

function MinimalCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="minimal-card-description"
      className={cn("px-1 pb-1 text-[0.8rem] text-[var(--muted)]", className)}
      {...props}
    />
  );
}

function MinimalCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="minimal-card-content" className={cn("p-1", className)} {...props} />
  );
}

function MinimalCardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="minimal-card-footer"
      className={cn("flex items-center px-1 pb-1", className)}
      {...props}
    />
  );
}

export {
  MinimalCard,
  MinimalCardMedia,
  MinimalCardImage,
  MinimalCardTitle,
  MinimalCardDescription,
  MinimalCardContent,
  MinimalCardFooter,
};
