/**
 * Tailwind translations of the Webflow classes that appear on many elements.
 *
 * Two rules govern this file:
 *
 * 1. Each entry is the *effective* style of the original compound selector —
 *    the base rule plus every media-query override, already resolved for CSS
 *    specificity. (Webflow's media blocks don't raise specificity, so e.g.
 *    `.heading.is-medium { font-size: 62px }` still beats `.heading { font-size:
 *    64px }` inside the 991px block.)
 *
 * 2. Every string is written out in full and must contain **no conflicting
 *    utilities**. Do not build a variant by concatenating a base string and an
 *    override — Tailwind resolves conflicts by stylesheet order, not by the
 *    order classes appear in the attribute, so `${BASE} py-4` can silently keep
 *    the base's `py-[18px]`.
 *
 * The original Webflow class name is kept as the first token of each string. It
 * matches no CSS rule, but it keeps the DOM recognisable against the old site
 * and lets the parity comparator select elements the same way on both.
 *
 * Values are read from penelope-social.webflow.shared.0467e5148.min.css.
 */

/* --- Buttons --------------------------------------------------------------
   .btn { text-align:center; text-transform:uppercase; padding:18px 24px;
          font-family:Sweet Sans Pro; font-weight:500; line-height:100%;
          text-decoration:none; transition:background-color .35s,color .35s }
   @991 { line-height:100%; display:block }   @479 { width:100% }
   .btn.secondary { border:2px solid beige; background:beige; color:charcoal }
   @991 { display:none }
   .btn.secondary.is-nav { z-index:30; padding:16px 18px; font-size:12px;
                           position:relative }                               */

const BTN_TYPO = 'text-center uppercase font-body font-medium leading-none no-underline'
const BTN_TRANSITION = 'transition-[background-color,color] duration-[350ms]'

export const btn = {
  /* .btn.primary */
  primary:
    `btn primary ${BTN_TYPO} ${BTN_TRANSITION} px-6 py-[18px] border-2 border-charcoal ` +
    'bg-charcoal text-beige hover:bg-beige hover:text-charcoal wf-md:block wf-xs:w-full',

  /* .btn.outline */
  outline:
    `btn outline ${BTN_TYPO} ${BTN_TRANSITION} px-6 py-[18px] border-2 border-green ` +
    'text-green hover:bg-green hover:text-beige wf-md:block wf-xs:w-full',

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

/* --- Headings -------------------------------------------------------------
   .heading { color:charcoal; text-align:center; font-family:Elmoder;
              font-size:82px; line-height:100%; overflow:hidden }
   @991 {64px}  @767 {mt:0; mb:10px; 54px; line-height:120%}  @479 {34px}
   Margins otherwise come from Webflow's base h1/h2 rules (20px / 10px).      */
export const heading = {
  base:
    'heading text-charcoal text-center font-heading text-[82px] leading-none overflow-hidden ' +
    'wf-md:text-[64px] wf-sm:mt-0 wf-sm:mb-[10px] wf-sm:text-[54px] wf-sm:leading-[120%] wf-xs:text-[34px]',

  /* .heading.is-left */
  left:
    'heading is-left text-charcoal text-left font-heading text-[82px] leading-none overflow-hidden ' +
    'wf-md:text-[64px] wf-sm:mt-0 wf-sm:mb-[10px] wf-sm:text-[54px] wf-sm:leading-[120%] ' +
    'wf-xs:text-[38px] wf-xs:tracking-[-3px]',

  /* .heading.is-medium — stays 62px at 991 (specificity beats the media rule) */
  medium:
    'heading is-medium text-charcoal text-center font-heading text-[62px] leading-none overflow-hidden ' +
    'my-0 wf-sm:text-[42px] wf-sm:leading-[120%] wf-xs:text-[34px]',

  /* .heading.is-light — .heading in beige (footer newsletter) */
  light:
    'heading is-light text-beige text-center font-heading text-[82px] leading-none overflow-hidden ' +
    'wf-md:text-[64px] wf-sm:mt-0 wf-sm:mb-[10px] wf-sm:text-[54px] wf-sm:leading-[120%] wf-xs:text-[34px]',

  /* .heading.is-menu-item — the drawer links; body font, not Elmoder */
  menuItem:
    'heading is-menu-item text-beige text-left font-body text-[42px] font-normal tracking-[-2px] ' +
    'leading-none overflow-hidden wf-sm:text-[32px]',
} as const

/* --- Paragraphs -----------------------------------------------------------
   .paragraph { text-align:center; margin-bottom:10px; line-height:140% }
   .paragraph.is-intro { font-size:26px; font-weight:400 }
   @991 {24px}  @767 {22px}  @479 {16px}                                     */
export const paragraph = {
  intro:
    'paragraph is-intro text-charcoal font-body text-center mb-[10px] leading-[140%] text-[26px] ' +
    'font-normal wf-md:text-[24px] wf-sm:text-[22px] wf-xs:text-[16px]',

  /* .paragraph.is-intro.is-left */
  introLeft:
    'paragraph is-intro is-left text-charcoal font-body text-left max-w-[850px] not-italic ' +
    'mb-[10px] leading-[140%] text-[26px] font-normal wf-md:text-[24px] wf-sm:text-[22px] wf-xs:text-[16px]',
} as const

/* --- Containers -----------------------------------------------------------
   .container { width:100%; max-width:1440px; margin-inline:auto;
                padding:80px 25px 60px; text-decoration:none;
                transition:background-color .5s, color .35s }
   @991 { padding-block: 60px }  @767 { padding-block: 60px }
   @479 { padding-block: 40px }                                              */
const CONTAINER_SHARED =
  'w-full mx-auto px-[25px] no-underline transition-[background-color,color] duration-500'

export const container = `container ${CONTAINER_SHARED} max-w-[1440px] pt-20 pb-[60px] wf-md:pt-[60px] wf-md:pb-[60px] wf-xs:pt-10 wf-xs:pb-10`

/** .container.no-top-padding */
export const containerNoTop = `container no-top-padding ${CONTAINER_SHARED} max-w-[1440px] pt-0 pb-[60px] wf-md:pb-[60px] wf-xs:pb-10`

/** .container.half-top-padding — 40px, and 0 at ≤479 */
export const containerHalfTop = `container half-top-padding ${CONTAINER_SHARED} max-w-[1440px] pt-10 pb-[60px] wf-md:pb-[60px] wf-xs:pt-0 wf-xs:pb-10`

/** .container.is-footer — wider; ≤767 flips to 80px top / 0 bottom.
    No ≤479 override: Webflow's `.container { padding: 40px }` at that width is
    a weaker selector than `.container.is-footer`, so 80px/0 carries through. */
export const containerFooter = `container is-footer ${CONTAINER_SHARED} max-w-[1920px] pt-20 pb-5 wf-md:pt-[60px] wf-sm:pt-20 wf-sm:pb-0`

/* --- Menu cards -----------------------------------------------------------
   .menu-btn { color:charcoal; text-transform:uppercase; flex-flow:row;
               font-family:Sweet Sans Pro; font-size:14px; font-weight:500;
               line-height:130%; text-decoration:none;
               transition:opacity .35s; display:inline-flex; position:relative }
   :hover { opacity:.75 }                                                     */
export const menuBtn =
  'menu-btn text-charcoal uppercase flex-row font-body text-[14px] font-medium leading-[130%] ' +
  'no-underline transition-opacity duration-[350ms] inline-flex relative hover:opacity-75'

/* .page-sub-heading { color:charcoal; margin:0 0 40px; font-family:Elmoder;
                       font-size:41px; line-height:100%; overflow:hidden }
   @767 {38px}  @479 { margin-bottom:20px; font-size:24px }                  */
export const pageSubHeading =
  'page-sub-heading text-charcoal mt-0 mb-10 font-heading text-[41px] leading-none overflow-hidden ' +
  'wf-sm:text-[38px] wf-xs:mb-5 wf-xs:text-[24px]'

/** .page-sub-heading.small-margin */
export const pageSubHeadingSmall =
  'page-sub-heading small-margin text-charcoal mt-0 mb-5 font-heading text-[41px] leading-none ' +
  'overflow-hidden wf-sm:text-[38px] wf-xs:text-[24px]'

/* --- Forms ----------------------------------------------------------------
   .form-field { border:2px solid charcoal; background:transparent;
                 min-height:50px; color:charcoal; padding-bottom:6px;
                 font-family:Sweet Sans Pro }
   over Webflow's .w-input { display:block; width:100%; height:38px;
   margin-bottom:10px; padding:8px 12px; font-size:14px; line-height:1.42857;
   vertical-align:middle }                                                    */
const FORM_FIELD_SHARED =
  'block w-full min-h-[50px] mb-[10px] px-3 pt-2 pb-1.5 align-middle text-[14px] ' +
  'leading-[1.42857143] border-2 border-charcoal bg-brand-transparent text-charcoal font-body wf-field'

export const formField = `form-field ${FORM_FIELD_SHARED}`

/** .form-field.textarea — height:150px */
export const formFieldTextarea = `form-field textarea ${FORM_FIELD_SHARED} h-[150px]`
