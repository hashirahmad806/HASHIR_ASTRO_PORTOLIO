# Design System Master File — Nocturne Basalt & Verdigris Jade

> **System:** Hashir Ahmad — Personal Engineering & AI Systems Portfolio  
> **Architecture:** Astro SSG + Tailwind CSS + GSAP ScrollTrigger + Optical Lens Motion  
> **Direction:** Apple-Grade Nocturne Minimalism × Google-Lens Optical Inspection × HCI Precision

---

## 1. Color Architecture (Nocturne Basalt & Verdigris Jade)

Deliberately rejects cliché AI purple/blue gradients and pure `#000000` voids. Uses deep volcanic basalt surfaces paired with warm mineral alabaster typography, optical verdigris jade (`#4FE3B5`) for focus & telemetry, and champagne copper (`#E8B88A`) for human editorial warmth.

| Role | Hex / Value | CSS Variable | Contrast vs `--bg-void` |
|------|-------------|--------------|-------------------------|
| Night Void | `#080B0A` | `--bg-void` | Base |
| Elevated Basalt | `#0F1412` | `--bg-surface` | Surface L1 |
| Machined Card Core | `#151C19` | `--bg-elevated` | Surface L2 |
| Recessed Well / Code | `#0B0F0D` | `--bg-recessed` | Inset |
| Alabaster Primary Text | `#F2EFE9` | `--text-primary` | ~16.8:1 (AAA) |
| Mineral Silver Body | `#B6C2BC` | `--text-secondary` | ~9.6:1 (AAA) |
| Slate Sage Muted | `#85948D` | `--text-muted` | ~5.4:1 (AA) |
| Verdigris Jade Accent | `#4FE3B5` | `--accent-jade` | ~11.8:1 (AAA) |
| On Jade CTA | `#06130F` | `--on-accent-jade` | ~11.8:1 |
| Champagne Copper Accent | `#E8B88A` | `--accent-copper` | ~10.4:1 (AAA) |
| Hairline Border | `rgba(242, 239, 233, 0.08)` | `--border-hairline` | Subtle frame |
| Optical Jade Border | `rgba(79, 227, 181, 0.28)` | `--border-jade` | Active focus |
| Focus Ring | `#4FE3B5` (2px, 3px offset) | `--ring-focus` | WCAG 2.2 AAA |
| Error / Destructive | `#F87171` | `--color-error` | Accessible dark-mode red |

---

## 2. Typography Pairing

- **Display / Headlines:** `Bricolage Grotesque` (weights 500–800, optical size `12..96`, tight tracking `-0.03em`)
- **Editorial Serif Accents:** `Newsreader` (italic weight 400–500 for humanized verbs & pull-quotes)
- **Body / UI Copy:** `Plus Jakarta Sans` (weights 400–600, `16px–18px` base, `line-height: 1.65`, `max-width: 65ch`)
- **Telemetry / Code / Indices:** `DM Mono` (weights 400–500, uppercase tracked `0.12em` micro-labels, `font-variant-numeric: tabular-nums`)

Google Fonts URL:
`https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Newsreader:ital,opsz,wght@1,6..72,400;1,6..72,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap`

---

## 3. Haptic & Optical Surface Language

- **Double-Bezel Hardware Containers:** Outer shell (`#0F1412`, `1px` border `rgba(242,239,233,0.08)`, `p-1.5`, `rounded-[28px]`) wrapping an inner core (`#151C19`, `shadow-[inset_0_1px_0_rgba(242,239,233,0.07)]`, `rounded-[22px]`).
- **Button-in-Button CTAs:** Pill buttons (`rounded-full`, `min-h-[44px]`) with trailing circular icon badge (`w-8 h-8 rounded-full`) that shifts diagonally on hover and compresses (`scale(0.97)`) on press.
- **Google Lens Optical Motion:**
  - Corner viewfinder reticles (`┌ ┐ └ ┘`) appear around inspected cards/portraits.
  - GSAP `quickTo` damped radial spotlight (`--lens-x`, `--lens-y`) illuminates hidden optical telemetry layers without triggering layout reflows.
  - Scroll-triggered optical focus reveal: `opacity: 0; transform: translateY(20px); filter: blur(6px)` resolving cleanly to crisp focus (`filter: blur(0px)`), immediately disabled under `prefers-reduced-motion: reduce`.

---

## 4. HCI & Human Factors Standards

- **Fitts's Law:** All interactive targets ≥ `44×44px` with ≥ `8px` spacing.
- **Hick's Law:** Primary nav limited to 6 high-clarity anchors + CV/Contact CTA; progressive disclosure via Architecture Modal & Lens Inspect mode.
- **Miller's Law:** Grouped scannable chunks (3–5 items per row/band) + 6-second Recruiter Snapshot strip.
- **WCAG 2.2 AA/AAA:** High contrast (`≥ 5.4:1` even on muted labels), semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`), full keyboard navigation (`Tab`, `Escape`, focus trap inside modals, `⌘K` / `/` quick command palette), zero emojis as UI icons (crisp Lucide / custom SVGs only).
