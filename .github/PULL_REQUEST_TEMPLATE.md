## What kind of PR is this?

- [ ] 🎨 New background
- [ ] 🐛 Bug fix
- [ ] 📝 Docs / other

## For new backgrounds

**Name / slug:**

**Screenshot or clip** (required — show it full-page, not just the card):

**Checklist:**

- [ ] One background per PR; file is `backgrounds/<slug>.tsx` copied from `_template.tsx`
- [ ] `meta`, `Background`, and `code` exports all filled in; slug matches the filename
- [ ] Registered in `backgrounds/index.ts` (import + array entry)
- [ ] `code` snippet is self-contained and works when pasted into a fresh project
- [ ] Animation pauses when `playing` is `false`
- [ ] `prefers-reduced-motion: reduce` fallback included
- [ ] If `isDark: true`: site chrome stays readable when applied full-page
- [ ] `npx tsc --noEmit` and `npm run lint` pass

## For everything else

Describe what changed and why:
