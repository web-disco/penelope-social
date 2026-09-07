/**
 * UI recipes — Bakehouse design system, carried over so sizing and spacing
 * match the new Social styleguide.
 *
 * Two rules govern this file:
 *
 * 1. Each entry is the *effective* style of the original compound selector —
 *    the base rule plus every media-query override, already resolved for CSS
 *    specificity.
 *
 * 2. Every string is written out in full and must contain **no conflicting
 *    utilities**. Do not build a variant by concatenating a base string and an
 *    override — Tailwind resolves conflicts by stylesheet order, not by the
 *    order classes appear in the attribute.
 *
 * Headings are Sweet Sans Medium (sentence case), not Elmoder.
 *   display-xl 64 · display-l 40 · display-m 36 · display-s 28 · heading 24 · title 20
 * Body / footer: 20 intro · 18 body · 14 footer/btn · 12 caption
 */

const BTN_TYPO = 'text-center uppercase font-body font-medium leading-none no-underline'
const BTN_TRANSITION = 'transition-[background-color,color] duration-[350ms]'

/* --- Buttons ------------------------------------------------------------- */
export const btn = {
  /* .btn.primary */
  primary:
    `btn primary ${BTN_TYPO} ${BTN_TRANSITION} px-6 py-[18px] border-2 border-charcoal ` +
    'bg-charcoal text-beige hover:bg-beige hover:text-charcoal wf-md:block wf-xs:w-full',

  /* .btn.outline */
  outline:
    `btn outline ${BTN_TYPO} ${BTN_TRANSITION} px-6 py-[18px] border-2 border-green ` +
    'text-green hover:bg-green hover:text-beige wf-md:block wf-xs:w-full',

  /* Solid green fill — cream-canvas CTAs. */
  green:
    `btn green ${BTN_TYPO} ${BTN_TRANSITION} px-6 py-[18px] border-2 border-green ` +
    'bg-green text-beige hover:bg-charcoal hover:border-charcoal wf-md:block wf-xs:w-full',

  /* .btn.secondary — beige fill on dark surfaces (hero / charcoal / green) */
  secondary:
    `btn secondary ${BTN_TYPO} ${BTN_TRANSITION} px-6 py-[18px] border-2 border-beige ` +
    'bg-beige text-charcoal hover:bg-brand-transparent hover:text-beige wf-md:block wf-xs:w-full',

  /* Transparent beige outline on dark surfaces. */
  secondaryOutline:
    `btn secondary is-outline ${BTN_TYPO} ${BTN_TRANSITION} px-6 py-[18px] border-2 border-beige ` +
    'bg-brand-transparent text-beige hover:bg-beige hover:text-charcoal wf-md:block wf-xs:w-full',

  /** On-media hero primary — solid beige fill, charcoal text. */
  onMediaPrimary:
    `btn primary is-on-media ${BTN_TYPO} ${BTN_TRANSITION} px-6 py-[18px] border-2 border-beige rounded-none ` +
    'bg-beige text-charcoal hover:bg-brand-transparent hover:text-beige wf-md:block wf-xs:w-full',

  /* .btn.secondary.is-nav — 16px/18px padding, 12px text, hidden below 992px */
  navSolid:
    `btn secondary is-nav ${BTN_TYPO} ${BTN_TRANSITION} relative z-30 px-[18px] py-4 text-[12px] ` +
    'border-2 border-beige bg-beige text-charcoal hover:bg-brand-transparent hover:text-beige ' +
    'wf-md:hidden wf-xs:w-full',

  /* .btn.secondary.is-nav.is-outline — transparent until hover */
  navOutline:
    `btn secondary is-nav is-outline ${BTN_TYPO} ${BTN_TRANSITION} relative z-30 px-[18px] py-4 text-[12px] ` +
    'border-2 border-beige bg-brand-transparent text-beige hover:bg-beige hover:text-charcoal ' +
    'wf-md:hidden wf-xs:w-full',

  /* .btn.secondary.is-google-review — hidden 768–991, shown again at ≤767 */
  googleReview:
    `btn secondary is-google-review ${BTN_TYPO} ${BTN_TRANSITION} px-6 py-[18px] border-2 border-beige ` +
    'bg-beige text-charcoal hover:bg-brand-transparent hover:text-beige ' +
    'wf-md:hidden wf-sm:block wf-xs:w-full',
} as const

/* --- Paragraphs — intro is Bakehouse 20px --------------------------------
   Base body text is 18px/150% (Webflow `p` rule).                          */
export const paragraph = {
  intro:
    'paragraph is-intro text-charcoal font-body text-center mb-[10px] leading-[150%] text-[20px] ' +
    'font-normal wf-md:text-[18px] wf-sm:text-[17px] wf-xs:text-[16px]',

  /* .paragraph.is-intro.is-left */
  introLeft:
    'paragraph is-intro is-left text-charcoal font-body text-left max-w-[850px] not-italic ' +
    'mb-[10px] leading-[150%] text-[20px] font-normal wf-md:text-[18px] wf-sm:text-[17px] wf-xs:text-[16px]',

  /** Intro, beige on dark, left. */
  introLightLeft:
    'paragraph is-intro is-left is-light text-beige font-body text-left max-w-[850px] not-italic ' +
    'mb-[10px] leading-[150%] text-[20px] font-normal wf-md:text-[18px] wf-sm:text-[17px] wf-xs:text-[16px]',

  /** Story / section body paras — base p size (18 → 16). */
  bodyLg: 'paragraph is-body-lg text-charcoal font-body text-[18px] leading-[150%] wf-xs:text-[16px]',

  bodyLgLeft:
    'paragraph is-body-lg is-left text-charcoal font-body text-left max-w-[850px] ' +
    'text-[18px] leading-[150%] wf-xs:text-[16px]',

  body: 'paragraph is-body text-charcoal font-body text-[18px] leading-[150%] wf-xs:text-[16px]',
} as const

/* --- Containers -----------------------------------------------------------
   .container { max-width:1440px; padding:60px 25px }
   @767 { padding-block:80px }                                               */
const CONTAINER_SHARED =
  'w-full mx-auto px-[25px] no-underline transition-[background-color,color] duration-500'

export const container = `container ${CONTAINER_SHARED} max-w-[1440px] pt-section-pad pb-section-pad wf-sm:pt-section-pad-sm wf-sm:pb-section-pad-sm`

/** .container.no-top-padding — use after a hero that already has space.afterHero */
export const containerNoTop = `container no-top-padding ${CONTAINER_SHARED} max-w-[1440px] pt-0 pb-section-pad wf-sm:pb-section-pad-sm`

/** .container.half-top-padding — 40px, and 0 at ≤767 */
export const containerHalfTop = `container half-top-padding ${CONTAINER_SHARED} max-w-[1440px] pt-10 pb-section-pad wf-sm:pt-0 wf-sm:pb-section-pad-sm`

/** .container.is-footer — 1920; ≤767 flips to 80px top / 0 bottom. */
export const containerFooter = `container is-footer ${CONTAINER_SHARED} max-w-[1920px] pt-20 pb-5 wf-md:pt-[60px] wf-sm:pt-20 wf-sm:pb-0`

/* --- Menu cards / sub-headings ------------------------------------------- */
export const menuBtn =
  'menu-btn text-charcoal uppercase flex-row font-body text-[14px] font-medium leading-[130%] ' +
  'no-underline transition-opacity duration-[350ms] inline-flex relative hover:opacity-75'

/* Menu category H2 — Sweet Sans Medium display-s (28). */
export const pageSubHeading =
  'page-sub-heading normal-case text-charcoal mt-0 mb-space-24 ' +
  'font-body font-medium text-[28px] leading-none text-balance ' +
  'wf-md:text-[26px] wf-sm:text-[24px] wf-xs:text-[22px]'

export const pageSubHeadingSmall =
  'page-sub-heading small-margin normal-case text-charcoal mt-0 mb-space-16 ' +
  'font-body font-medium text-[28px] leading-none text-balance ' +
  'wf-md:text-[26px] wf-sm:text-[24px] wf-xs:text-[22px]'

/* --- Forms --------------------------------------------------------------- */
const FORM_FIELD_SHARED =
  'block w-full min-h-[50px] mb-[10px] px-3 pt-2 pb-1.5 align-middle text-[14px] ' +
  'leading-[1.42857143] border-2 border-charcoal bg-brand-transparent text-charcoal font-body wf-field'

export const formField = `form-field ${FORM_FIELD_SHARED}`

/** .form-field.textarea — height:150px */
export const formFieldTextarea = `form-field textarea ${FORM_FIELD_SHARED} h-[150px]`

/**
 * Atomic type steps.
 * Headings are Sweet Sans Medium + sentence case.
 * Intro / body stay on Sweet Sans Regular.
 */
export const typeScale = {
  /** Hero H1 over imagery. 64 → 56 / 46; phones (≤600 / xs) 32. */
  displayHero:
    'font-body font-medium normal-case text-[64px] leading-none text-balance ' +
    'wf-md:text-[56px] wf-sm:text-[46px] max-[600px]:text-[32px] wf-xs:text-[32px]',

  /** Page H1. 56 → 48 / 40; banner heroes drop to 32 on phones. */
  displayXl:
    'font-body font-medium normal-case text-[56px] leading-none text-balance ' +
    'wf-md:text-[48px] wf-sm:text-[40px] max-[600px]:text-[36px] wf-xs:text-[34px]',

  /** Phone-only override for on-photo heroes. Desktop/tablet steps stay on displayXl. */
  heroMobile:
    'max-[600px]:text-[32px] wf-xs:text-[32px]',

  /** 40 → 34 / 30 / 26. */
  displayL:
    'font-body font-medium normal-case text-[40px] leading-none text-balance ' +
    'wf-md:text-[34px] wf-sm:text-[30px] wf-xs:text-[26px]',

  /** Section H2. 36 → 32 / 28 / 26. */
  displayM:
    'font-body font-medium normal-case text-[36px] leading-none text-balance ' +
    'wf-md:text-[32px] wf-sm:text-[28px] wf-xs:text-[26px]',

  /** Menu category titles. 28 → 26 / 24 / 22. */
  displayS:
    'font-body font-medium normal-case text-[28px] leading-none text-balance ' +
    'wf-md:text-[26px] wf-sm:text-[24px] wf-xs:text-[22px]',

  heading: 'font-body font-medium normal-case text-[24px] leading-none text-balance',

  title: 'font-body font-medium normal-case text-[20px] leading-none text-balance',

  /** Drawer links — Sweet Sans Regular 42 → 32. */
  menuItem: 'font-body font-normal text-[42px] tracking-[-2px] leading-none wf-sm:text-[32px]',

  /** FAQ questions — Sweet Sans Medium 22. */
  faq: 'font-body font-medium text-[22px] leading-none text-balance',

  /** Lead copy — 20 → 18 / 17 / 16. */
  intro:
    'font-body font-normal text-[20px] leading-[150%] text-pretty ' +
    'wf-md:text-[18px] wf-sm:text-[17px] wf-xs:text-[16px]',

  /** Base body — 18 → 16. */
  bodyLg: 'font-body font-normal text-[18px] leading-[150%] text-pretty wf-xs:text-[16px]',

  /** Body, Sweet Sans Medium. */
  bodyLgSemibold: 'font-body font-medium text-[18px] leading-[150%] text-pretty wf-xs:text-[16px]',

  /** Base body — 18 → 16. */
  body: 'font-body font-normal text-[18px] leading-[150%] text-pretty wf-xs:text-[16px]',

  /** Eyebrows / small UI labels — Sweet Sans Medium 13 / tracking 0.08em. */
  label: 'font-body font-medium text-[13px] uppercase tracking-[0.08em] leading-[1.4]',

  /** Hero brand eyebrow — uppercase + tracking. */
  labelHero: 'font-body font-medium uppercase text-[13px] tracking-[0.08em] leading-[1.4]',

  /** Sentence-case eyebrow near logo / story. */
  labelHeroSoft: 'font-body font-medium normal-case text-[14px] tracking-[0.04em] leading-[1.4]',

  /** Captions / copyright — 12 uppercase. */
  caption: 'font-body font-medium text-[12px] uppercase tracking-[0.06em] leading-none',
} as const

/* --- Headings — Sweet Sans Medium, sentence case ------------------------ */
export const heading = {
  /** Page H1 (centred). */
  base: `heading normal-case text-charcoal text-center ${typeScale.displayXl}`,

  /** Page H1 (left). */
  left: `heading is-left normal-case text-charcoal text-left ${typeScale.displayXl}`,

  /** Section H2. */
  medium: `heading is-medium normal-case text-charcoal text-center my-0 ${typeScale.displayM}`,

  /** Light page H1 (footer newsletter / dark bands). */
  light: `heading is-light normal-case text-beige text-center ${typeScale.displayXl}`,

  /** Hero H1 over imagery. */
  lightLeft: `heading is-light is-left normal-case text-beige text-left ${typeScale.displayHero}`,

  /** Nav drawer links. */
  menuItem: `heading is-menu-item normal-case text-beige text-left ${typeScale.menuItem}`,
} as const

/** Spacing recipes — Bakehouse section pad is 60/40 so adjacent py stacks to 120/80. */
export const space = {
  /** Full gap after full-bleed heroes before page content (120 desktop / 80 mobile). */
  afterHero: 'mb-section-gap-y wf-sm:mb-section-gap-y-sm',
  /** Cream sections — 120 desktop / 80 mobile. */
  sectionY: 'py-section-pad wf-sm:py-section-pad-sm',
  /** First cream block after a hero (hero already provides the gap). */
  sectionYFirst: 'pt-0 pb-section-pad wf-sm:pb-section-pad-sm',
  /** Banded sections (green wave) — cream pad outside the band. */
  sectionYBand: 'py-section-pad wf-sm:py-section-pad-sm',
  sectionYNoTop: 'pt-0 pb-section-pad wf-sm:pb-section-pad-sm',
  sectionYHalfTop: 'pt-10 pb-section-pad wf-sm:pt-0 wf-sm:pb-section-pad-sm',

  /** Page side margin — Social's flat 25px. */
  gutter: 'px-[25px]',

  /** Gap between major blocks inside a section */
  sectionGap: 'gap-section-gap',
  sectionGapTop: 'mt-section-gap',

  /** Tight vertical stacks (8–16) */
  stackTight: 'gap-stack-tight',
  stack: 'gap-stack',

  /** Menu category rhythm — 120 desktop / 80 mobile; first has no top (hero gap). */
  menuCategory: 'mt-section-gap-y mb-0 first:mt-0 wf-sm:mt-section-gap-y-sm wf-sm:first:mt-0',
  menuGrid: 'gap-x-menu-col gap-y-menu-row',
} as const

/**
 * Bakehouse story / text+image: media 7 / copy 5, 3:2 image,
 * copy is flex-col gap-24 with the CTA in .story-cta after the text group.
 */
export const story = {
  grid: 'story-grid grid min-w-0 grid-cols-12 items-stretch gap-x-space-48 wf-md:gap-x-0 wf-md:gap-y-space-32',
  media: 'story-media col-span-7 w-full overflow-hidden wf-md:col-span-12',
  image: 'story-image block w-full object-cover aspect-[3/2]',
  copy: 'story-copy col-span-5 flex flex-col items-start gap-space-24 justify-end pb-space-48 wf-md:col-span-12 wf-md:justify-start wf-md:pb-0',
} as const

/** Layout shell — Social's 1440 content container, 25px sides. */
export const layout = {
  /** Page shell width only */
  max: 'max-w-[1440px]',

  /** Header / drawer top bar: Bakehouse 1920 + 25px. Page sections stay `shell` (1440). */
  navShell: 'relative w-full min-w-0 mx-auto px-[25px] max-w-[1920px]',

  /** Shell: centered 1440 + 25px side padding */
  shell: 'mx-auto w-full max-w-[1440px] px-[25px]',

  /** Shell without horizontal padding (when parent already has gutter) */
  shellBare: 'mx-auto w-full max-w-[1440px]',

  /** 12-column CSS grid · 24px column gap */
  grid: 'grid grid-cols-12 gap-x-space-24',

  /** Reading measures — copy only, never page shells */
  measureNarrow: 'max-w-[720px]',
  measure: 'max-w-[850px]',
  measureWide: 'max-w-[1000px]',
  measureVisit: 'max-w-[900px]',
} as const

export const radius = {
  none: 'rounded-none',
  softSm: 'rounded-soft-sm',
  soft: 'rounded-soft',
} as const

/** Eyebrows — always Sweet Sans label. */
export const eyebrow = {
  base: `eyebrow text-charcoal ${typeScale.label}`,
  light: `eyebrow is-light text-beige ${typeScale.labelHero}`,
} as const
