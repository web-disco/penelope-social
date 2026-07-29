#!/usr/bin/env node
/**
 * Scrape penelopesocial.com into Sanity documents.
 *
 *   node migrate.js --dry   scrape + transform only, writing scripts/output/*.json
 *   node migrate.js         upload assets and import into the Sanity dataset
 *
 * Every document gets a deterministic `_id`, so a real import is a re-runnable
 * `createOrReplace` and references resolve by predictable id.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@sanity/client'
import {
  SITE,
  fetchDoc,
  text,
  textWithBreaks,
  textWithBreaksKeepingBlanks,
  image,
  toPortableText,
  seoFrom,
} from './lib/scrape.js'

const DRY = process.argv.includes('--dry')
const here = path.dirname(fileURLToPath(import.meta.url))
const outputDir = path.join(here, 'output')

/* --------------------------------------------------------------------------
   Site settings
   -------------------------------------------------------------------------- */

/**
 * The footer is a Webflow symbol, but the homepage's copy is stale relative to
 * the other 13 pages (it still says "Sun - 8-12 pm" and links the old Instagram
 * handle). The inner-page version is the current one, so settings are scraped
 * from /about and the difference is reported.
 */
async function buildSiteSettings() {
  const doc = await fetchDoc('/about')
  const home = await fetchDoc('/')

  const drawerLinks = [...doc.querySelectorAll('.menu-drawer-link')].map((link) => ({
    _type: 'link',
    _key: slugify(text(link)),
    label: text(link),
    url: link.getAttribute('href'),
    newTab: link.getAttribute('target') === '_blank',
  }))

  const navButtons = [...doc.querySelectorAll('.nav-btn-group .btn')]
  const orderBtn = navButtons.find((b) => b.classList.contains('is-outline')) ?? navButtons[0]
  const reservationBtn = navButtons.find((b) => !b.classList.contains('is-outline'))

  const footerMenuLinks = [...doc.querySelectorAll('.footer-menu-wrap .footer-menu-link')].map(
    (link) => ({
      _type: 'link',
      _key: slugify(text(link)),
      label: text(link),
      url: link.getAttribute('href'),
    }),
  )

  const menusBlurbLink = doc.querySelector('.footer-content .footer-text .footer-text-span')

  const hoursWrap = doc.querySelector('.hours-wrap')
  const locationP = hoursWrap.querySelector('.footer-text.is-location')
  const locationLink = locationP.querySelector('a')
  /* Keep the trailing zero-width-joiner "blank line" Webflow's editor left in
     these fields — it is a rendered line and the footer's height depends on it. */
  const hourBlocks = [...hoursWrap.querySelectorAll('.footer-text.is-hours')].map((p) => {
    const label = text(p.querySelector('strong'))
    const lines = textWithBreaksKeepingBlanks(p)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => line !== label)
    return { _type: 'hoursBlock', _key: slugify(label), label, lines }
  })

  const contactColumn = [...doc.querySelectorAll('.footer-content')].find((col) =>
    col.querySelector('.footer-socials'),
  )
  const phoneLink = contactColumn.querySelector('a[href^="tel:"]')
  const emailLink = contactColumn.querySelector('a[href^="mailto:"]')
  const googleReview = contactColumn.querySelector('.footer-google-review a')

  const socials = [...contactColumn.querySelectorAll('.footer-social-link')].map((link) => {
    const url = link.getAttribute('href')
    const platform = url.includes('instagram') ? 'instagram' : url.includes('tiktok') ? 'tiktok' : 'link'
    return { _type: 'social', _key: platform, platform, url, icon: `/icons/${platform}.svg` }
  })

  const newsletterForm = doc.querySelector('.footer-newsletter-form')
  const copyrightBlocks = [...doc.querySelectorAll('.footer-copyright .copyright-text')]
  const creditLink = doc.querySelector('.footer-copyright a')

  /* Report the homepage's stale footer copy rather than silently picking one. */
  const homeInstagram = home.querySelector('.footer-social-link')?.getAttribute('href')
  const aboutInstagram = socials[0]?.url
  if (homeInstagram && aboutInstagram && homeInstagram !== aboutInstagram) {
    console.warn(
      `[migrate] homepage footer has a different Instagram URL (${homeInstagram}) than every ` +
        `other page (${aboutInstagram}). Using the inner-page value; the homepage copy is stale.`,
    )
  }

  return {
    _id: 'siteSettings',
    _type: 'siteSettings',
    title: 'Site Settings',
    header: {
      _type: 'header',
      logo: image(doc.querySelector('.navbar-logo')),
      logoAlt: doc.querySelector('.navbar-logo')?.getAttribute('alt') ?? 'Penelope Logo',
      orderOnline: linkFrom(orderBtn),
      reservations: linkFrom(reservationBtn),
      drawerLinks,
    },
    footer: {
      _type: 'footer',
      logo: image(doc.querySelector('.footer-logo')),
      logoAlt: doc.querySelector('.footer-logo')?.getAttribute('alt') ?? 'Penelope Social Logo',
      newsletter: {
        _type: 'newsletter',
        heading: text(doc.querySelector('.footer-newsletter .heading')),
        text: text(doc.querySelector('.newsletter-text')),
        /* The live action attribute is double-escaped (`&amp;amp;`), which sends
           Mailchimp a param literally named `amp;id`. Normalised here. */
        formAction: normaliseAction(newsletterForm?.getAttribute('action')),
        placeholder:
          doc.querySelector('.footer-newsletter-text-field')?.getAttribute('placeholder') ?? '',
        buttonLabel: doc.querySelector('.newsletter-btn')?.getAttribute('value') ?? 'Subscribe',
        successMessage: text(doc.querySelector('.success-message')),
        errorMessage: text(doc.querySelector('.error-message')),
      },
      menus: {
        _type: 'footerMenus',
        heading: text([...doc.querySelectorAll('.footer-heading')][0]),
        blurb: textWithBreaksKeepingBlanks(menusBlurbLink),
        blurbUrl: menusBlurbLink?.getAttribute('href') ?? '/menus',
        links: footerMenuLinks,
      },
      hours: {
        _type: 'footerHours',
        heading: text([...doc.querySelectorAll('.footer-heading')][1]),
        locationLabel: text(locationP.querySelector('strong')),
        /* Everything after the LOCATION label, including the trailing blank
           line, so the rendered block is the same height as the original. */
        address: textWithBreaksKeepingBlanks(locationP)
          .split('\n')
          .slice(1)
          .join('\n'),
        mapUrl: locationLink?.getAttribute('href') ?? '',
        blocks: hourBlocks,
      },
      contact: {
        _type: 'footerContact',
        heading: text([...doc.querySelectorAll('.footer-heading')][2]),
        phone: text(phoneLink),
        phoneDigits: phoneLink?.getAttribute('href')?.replace('tel:', '') ?? '',
        /* The live markup splits the address as `E: i<a>nfo@…</a>`; the visible
           text is the same, but the link is rebuilt whole here. The trailing
           blank line the editor left is preserved. */
        email:
          (emailLink?.getAttribute('href')?.replace(/^mailto:/, '').split('?')[0] ?? '') +
          (textWithBreaksKeepingBlanks(emailLink).includes('\n') ? '\n‍' : ''),
        emailHref: emailLink?.getAttribute('href') ?? '',
        socialsLabel: text(contactColumn.querySelector('.footer-socials .footer-text')),
        socials,
        googleReview: linkFrom(googleReview),
      },
      copyright: {
        _type: 'copyright',
        text: text(copyrightBlocks[0]),
        creditPrefix: text(copyrightBlocks[1]).replace(text(creditLink), '').trim(),
        creditLabel: text(creditLink),
        creditUrl: creditLink?.getAttribute('href') ?? '',
      },
    },
    merchBanner: null, // filled in from the merch listing page below
    seo: seoFrom(home),
  }
}

function linkFrom(el) {
  if (!el) return undefined
  return {
    _type: 'link',
    label: text(el),
    url: el.getAttribute('href'),
    newTab: el.getAttribute('target') === '_blank',
  }
}

/** Same as linkFrom, plus the fill Webflow expressed as `.btn.is-outline`. */
function buttonFrom(el) {
  if (!el) return undefined
  return {
    _type: 'button',
    label: text(el),
    url: el.getAttribute('href'),
    newTab: el.getAttribute('target') === '_blank',
    style: el.classList.contains('is-outline') || el.classList.contains('outline')
      ? 'outline'
      : 'primary',
  }
}

function normaliseAction(action) {
  if (!action) return ''
  return action.replace(/&amp;/g, '&')
}

/* --------------------------------------------------------------------------
   Pages
   -------------------------------------------------------------------------- */

/**
 * The front page is the `homepage` singleton, not a `page` with slug "home" —
 * fixed id so there can only ever be one of it.
 */
async function buildHome() {
  const doc = await fetchDoc('/')
  const hero = doc.querySelector('.section-home-hero')
  const intro = doc.querySelector('.section-intro')
  const bread = doc.querySelector('.section-home-bread')
  const events = doc.querySelector('.home-events')

  return {
    _id: 'homepage',
    _type: 'homepage',
    title: 'Home',
    seo: seoFrom(doc),
    sections: [
      {
        _type: 'hero',
        _key: 'hero',
        image: image(hero.querySelector('.home-hero-image')),
        orderOnline: linkFrom(hero.querySelector('.home-hero-menu')),
        reservations: linkFrom(hero.querySelector('.home-hero-reservation')),
      },
      {
        _type: 'introSection',
        _key: 'intro',
        heading: textWithBreaks(intro.querySelector('.heading')),
        intro: textWithBreaks(intro.querySelector('.paragraph.is-intro')),
        ctas: [...intro.querySelectorAll('.intros-cta .btn')].map((btn, index) => ({
          _type: 'button',
          _key: `cta${index}`,
          label: text(btn),
          url: btn.getAttribute('href'),
          style: btn.classList.contains('outline') ? 'outline' : 'primary',
        })),
      },
      menuCardsFrom(doc, 'menus'),
      {
        _type: 'textWithMediaSection',
        _key: 'bread',
        layout: 'image-first',
        heading: text(bread.querySelector('.heading.is-medium')),
        body: text(bread.querySelector('.home-bread-content p')),
        cta: buttonFrom(bread.querySelector('.home-bread-cta a')),
        image: image(bread.querySelector('.home-bread-image')),
      },
      {
        _type: 'textWithMediaSection',
        _key: 'events',
        layout: 'copy-first',
        heading: text(events.querySelector('.heading.is-medium')),
        body: text(events.querySelector('.home-events-content p')),
        cta: buttonFrom(events.querySelector('.events-cta a')),
        image: image(events.querySelector('.home-events-image')),
      },
    ],
  }
}

/**
 * The card's `.menu-btn` is deliberately not scraped. `.menu-btn-wrap` is
 * `display:none` at every breakpoint, so its label and href render for nobody —
 * and on the live /menus page the Catering card's button points at
 * /menus/dinner. The template derives both from `url` instead, which drops that
 * inconsistency rather than importing it.
 */
function menuCardsFrom(doc, key) {
  const section = doc.querySelector('.section-menus')
  return {
    _type: 'menuCards',
    _key: key,
    heading: text(section.querySelector('.home-menu-heading .heading')) || undefined,
    cards: [...section.querySelectorAll('.menu')].map((card, index) => ({
      _type: 'menuCard',
      _key: `card${index}`,
      title: text(card.querySelector('.menu-title')),
      url: card.querySelector('.menu-link').getAttribute('href'),
      image: image(card.querySelector('.home-menu-image')),
    })),
  }
}

function pageHeroFrom(doc) {
  const banner = doc.querySelector('.page-banner')
  /* Target `.page-banner-image` specifically — the sibling
     `.page-banner-overlay` is a decorative div, and on other Webflow layouts
     the decorative node is itself an <img> that would win a bare
     querySelector('img'). */
  return {
    _type: 'pageHero',
    _key: 'banner',
    image: image(banner.querySelector('.page-banner-image')),
  }
}

function pageHeadingFrom(doc, { center = false, left = false } = {}) {
  const section = doc.querySelector('.page-heading')
  return {
    _type: 'pageHeading',
    _key: 'heading',
    variant: center ? 'center' : 'default',
    align: left ? 'left' : 'center',
    heading: textWithBreaks(section.querySelector('.heading')),
    intro: textWithBreaks(section.querySelector('.paragraph.is-intro')),
    quickLinks: [...section.querySelectorAll('.page-heading-quick-links a')].map((link) => ({
      _type: 'quickLink',
      _key: link.getAttribute('href').replace('#', ''),
      label: text(link),
      anchor: link.getAttribute('href').replace('#', ''),
    })),
  }
}

async function buildMenusIndex() {
  const doc = await fetchDoc('/menus')
  return {
    _id: 'page-menus',
    _type: 'page',
    title: 'Menus',
    slug: { _type: 'slug', current: 'menus' },
    seo: seoFrom(doc),
    sections: [pageHeroFrom(doc), pageHeadingFrom(doc), menuCardsFrom(doc, 'menus')],
  }
}

async function buildAbout() {
  const doc = await fetchDoc('/about')
  const intro = doc.querySelector('.section-intro')

  return {
    _id: 'page-about',
    _type: 'page',
    title: 'About',
    slug: { _type: 'slug', current: 'about' },
    seo: seoFrom(doc),
    sections: [
      pageHeroFrom(doc),
      {
        _type: 'introSection',
        _key: 'intro',
        heading: textWithBreaks(intro.querySelector('.heading')),
        intro: textWithBreaks(intro.querySelector('.paragraph.is-intro')),
        ctas: [],
      },
      {
        _type: 'teamGrid',
        _key: 'team',
        members: [...doc.querySelectorAll('.team-card')].map((card, index) => ({
          _type: 'teamMember',
          _key: `member${index}`,
          name: text(card.querySelector('.team-title')),
          role: text(card.querySelector('.team-text')),
          image: image(card.querySelector('.team-image')),
        })),
      },
    ],
  }
}

async function buildBakery() {
  const doc = await fetchDoc('/sourdough-bakery')

  const stories = [...doc.querySelectorAll('.about-content')].map((section, index) => {
    const paragraphs = [...section.querySelectorAll(':scope > .container > p')].map((p) => text(p))
    const video = section.querySelector('video')
    const gallery = [...section.querySelectorAll('.about-lightbox-image')].map((img) => image(img))

    return {
      _type: 'storySection',
      _key: `story${index}`,
      galleryId: 'bakery',
      body: paragraphs.length ? toPortableText(paragraphs) : undefined,
      video: video
        ? {
            _type: 'storyVideo',
            mp4Url: video.querySelector('source[src*=".mp4"]')?.getAttribute('src')?.replace(/%2F/g, '/'),
            webmUrl: video
              .querySelector('source[src*=".webm"]')
              ?.getAttribute('src')
              ?.replace(/%2F/g, '/'),
          }
        : undefined,
      gallery: gallery.length ? gallery : undefined,
    }
  })

  return {
    _id: 'page-sourdough-bakery',
    _type: 'page',
    title: 'Sourdough Bakery',
    slug: { _type: 'slug', current: 'sourdough-bakery' },
    seo: seoFrom(doc),
    sections: [pageHeroFrom(doc), pageHeadingFrom(doc, { center: true }), ...stories],
  }
}

function contactFormSectionFrom(doc, variant) {
  const block = doc.querySelector('.form-block')
  const form = block.querySelector('form')

  const fields = [...form.querySelectorAll('.form-field-wrap')].map((wrap, index) => {
    const control = wrap.querySelector('input, select, textarea')
    const note = wrap.querySelector('.form-field-text')
    const isSelect = control.tagName === 'SELECT'
    const isTextarea = control.tagName === 'TEXTAREA'

    return {
      _type: 'formField',
      _key: `field${index}`,
      name: control.getAttribute('name'),
      id: control.getAttribute('id'),
      placeholder: isSelect
        ? text(control.querySelector('option[value=""]'))
        : control.getAttribute('placeholder'),
      type: isSelect ? 'select' : isTextarea ? 'textarea' : control.getAttribute('type'),
      required: control.hasAttribute('required'),
      fullWidth: wrap.classList.contains('_2-col'),
      options: isSelect
        ? [...control.querySelectorAll('option')]
            .map((option) => option.getAttribute('value'))
            .filter(Boolean)
        : undefined,
      note: note ? text(note) : undefined,
    }
  })

  return {
    _type: 'contactFormSection',
    _key: 'form',
    variant,
    heading: text(block.querySelector('.page-sub-heading')),
    intro: text(block.querySelector(':scope > p')),
    submitLabel: form.querySelector('input[type=submit]')?.getAttribute('value') ?? 'Submit',
    successMessage: text(block.querySelector('.w-form-done')),
    errorMessage: text(block.querySelector('.w-form-fail')),
    fields,
  }
}

async function buildCateringEvents() {
  const doc = await fetchDoc('/catering-events')
  const intro = doc.querySelector('.section-intro')

  return {
    _id: 'page-catering-events',
    _type: 'page',
    title: 'Catering & Events',
    slug: { _type: 'slug', current: 'catering-events' },
    seo: seoFrom(doc),
    sections: [
      pageHeroFrom(doc),
      {
        _type: 'introSection',
        _key: 'intro',
        heading: textWithBreaks(intro.querySelector('.heading')),
        intro: textWithBreaks(intro.querySelector('.paragraph.is-intro')),
        ctas: [],
      },
      contactFormSectionFrom(doc, 'events'),
      { _type: 'imageGrid', _key: 'grid', images: [] },
    ],
  }
}

async function buildContact() {
  const doc = await fetchDoc('/contact')
  const intro = doc.querySelector('.section-intro')

  return {
    _id: 'page-contact',
    _type: 'page',
    title: 'Contact',
    slug: { _type: 'slug', current: 'contact' },
    seo: seoFrom(doc),
    sections: [
      pageHeroFrom(doc),
      {
        _type: 'introSection',
        _key: 'intro',
        heading: textWithBreaks(intro.querySelector('.heading')),
        intro: textWithBreaks(intro.querySelector('.paragraph.is-intro')),
        ctas: [],
      },
      contactFormSectionFrom(doc, 'contact'),
      { _type: 'imageGrid', _key: 'grid', images: [] },
    ],
  }
}

async function buildMerchandisePage() {
  const doc = await fetchDoc('/merchandise')
  return {
    _id: 'page-merchandise',
    _type: 'page',
    title: 'Merchandise',
    slug: { _type: 'slug', current: 'merchandise' },
    seo: seoFrom(doc),
    sections: [
      pageHeroFrom(doc),
      pageHeadingFrom(doc, { center: true }),
      { _type: 'merchListing', _key: 'listing' },
    ],
  }
}

/* --------------------------------------------------------------------------
   Menus
   -------------------------------------------------------------------------- */

const MENU_SLUGS = ['lunch', 'dinner', 'bar', 'catering']

async function buildMenu(slug) {
  const doc = await fetchDoc(`/menus/${slug}`)
  const headingSection = doc.querySelector('.page-heading')

  const categories = [...doc.querySelectorAll('.menu-category')].map((section, index) => {
    const items = [...section.querySelectorAll('.menu-category-item')].map((item, itemIndex) => ({
      _type: 'menuItem',
      _key: `item${itemIndex}`,
      title: text(item.querySelector('.menu-item-title')),
      price: text(item.querySelector('.heading-menu-price')),
      description: text(item.querySelector('.menu-item-description')),
    }))

    /* The anchor id sits on `.menu-category` on most menus but on the inner
       `.container` on /menus/catering. Both render at the same offset, so read
       whichever carries it — missing this leaves the quick links dead. */
    const anchorId =
      section.getAttribute('id') || section.querySelector(':scope > .container')?.id || ''

    return {
      _type: 'menuCategory',
      _key: `category${index}`,
      title: text(section.querySelector('.page-sub-heading')),
      anchorId,
      description: textWithBreaks(section.querySelector('.menu-description')) || undefined,
      items,
    }
  })

  const quickLinks = [...headingSection.querySelectorAll('.page-heading-quick-links a')].map(
    (link) => ({
      _type: 'quickLink',
      label: text(link),
      anchor: link.getAttribute('href').replace('#', ''),
    }),
  )

  /**
   * Rename each anchor after the button that points at it.
   *
   * On the live site the dinner menu still carries ids from an older version of
   * the menu — "Salads" sits at `#snacks` and "Handhelds" at `#desserts`. The
   * links do land on the right sections, but the ids read as mismatched and are
   * a trap for anyone editing the menu later. Every other menu already uses
   * label-matching slugs, so this is a no-op there.
   *
   * Quick links and categories are authored in the same order; if that ever
   * stops being true, keep the scraped ids rather than guessing.
   */
  if (quickLinks.length === categories.length) {
    quickLinks.forEach((link, index) => {
      const anchor = slugify(link.label)
      if (!anchor) return
      link.anchor = anchor
      categories[index].anchorId = anchor
    })
  } else {
    console.warn(
      `[migrate] /menus/${slug}: ${quickLinks.length} quick links vs ${categories.length} ` +
        'categories — keeping the original anchor ids.',
    )
  }

  for (const link of quickLinks) link._key = link.anchor
  for (const category of categories) category._key = `category-${category.anchorId}`

  return {
    _id: `menu-${slug}`,
    _type: 'menu',
    title: text(headingSection.querySelector('.heading')),
    slug: { _type: 'slug', current: slug },
    seo: seoFrom(doc),
    banner: image(doc.querySelector('.page-banner-image')),
    heading: textWithBreaks(headingSection.querySelector('.heading')),
    intro: textWithBreaks(headingSection.querySelector('.paragraph.is-intro')),
    quickLinks,
    categories,
  }
}

/* --------------------------------------------------------------------------
   Merch products
   -------------------------------------------------------------------------- */

async function buildMerchProducts() {
  const listing = await fetchDoc('/merchandise')
  const cards = [...listing.querySelectorAll('.merch-listing-item')]

  return Promise.all(
    cards.map(async (card, index) => {
      const href = card.querySelector('.merch-item-link-wrap').getAttribute('href')
      const slug = href.split('/').pop()
      const doc = await fetchDoc(href)
      const content = doc.querySelector('.merch-details-content-wrap')
      const prices = [...doc.querySelectorAll('.merch-details-price')]

      return {
        _id: `merchProduct-${slug}`,
        _type: 'merchProduct',
        title: text(content.querySelector('.heading')),
        slug: { _type: 'slug', current: slug },
        order: index,
        /* The price renders as two <h2>s ("$" then the amount) — take the second. */
        price: text(prices[1]),
        description: text(content.querySelector('p')),
        banner: image(doc.querySelector('.page-banner-image')),
        images: [...doc.querySelectorAll('.merch-image')].map((img) => image(img)),
        cta: buttonFrom(content.querySelector('.merch-details-link a')),
        seo: seoFrom(doc),
      }
    }),
  )
}

/* --------------------------------------------------------------------------
   Runner
   -------------------------------------------------------------------------- */

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  console.log(`[migrate] scraping ${SITE}${DRY ? ' (dry run)' : ''}`)

  const settings = await buildSiteSettings()
  /* The homepage is its own singleton type, so it is built alongside the pages
     but written to its own file rather than into the page list. */
  const homepage = await buildHome()
  const pages = [
    await buildMenusIndex(),
    await buildAbout(),
    await buildBakery(),
    await buildCateringEvents(),
    await buildContact(),
    await buildMerchandisePage(),
  ]
  const menus = await Promise.all(MENU_SLUGS.map(buildMenu))
  const merchProducts = await buildMerchProducts()

  /* The merch detail pages share a banner; hold it on settings so a product
     without its own banner still renders one. */
  settings.merchBanner = merchProducts[0]?.banner ?? null

  const byType = {
    siteSettings: [settings],
    homepage: [homepage],
    page: pages,
    menu: menus,
    merchProduct: merchProducts,
  }

  fs.mkdirSync(outputDir, { recursive: true })
  for (const [type, docs] of Object.entries(byType)) {
    fs.writeFileSync(path.join(outputDir, `${type}.json`), JSON.stringify(docs, null, 2))
    console.log(`[migrate] ${type}: ${docs.length}`)
  }

  const itemCount = menus.reduce(
    (total, menu) => total + menu.categories.reduce((n, c) => n + c.items.length, 0),
    0,
  )
  console.log(`[migrate] menu items: ${itemCount}`)

  if (DRY) {
    console.log(`[migrate] wrote ${outputDir}`)
    return
  }

  await importToSanity(byType)
}

async function importToSanity(byType) {
  const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
  const token = process.env.SANITY_WRITE_TOKEN

  if (!projectId || !token) {
    throw new Error(
      'Set SANITY_STUDIO_PROJECT_ID and SANITY_WRITE_TOKEN to import, or pass --dry to scrape only.',
    )
  }

  const client = createClient({ projectId, dataset, token, apiVersion: '2024-10-01', useCdn: false })

  const uploaded = new Map()

  /** Walk every object, upload anything carrying a `_migrationSrc` marker. */
  async function uploadAssets(node) {
    if (Array.isArray(node)) {
      for (const item of node) await uploadAssets(item)
      return
    }
    if (!node || typeof node !== 'object') return

    if (node._migrationSrc) {
      const src = node._migrationSrc
      if (!uploaded.has(src)) {
        const response = await fetch(src)
        if (!response.ok) {
          console.warn(`[migrate] could not fetch asset ${src} (${response.status})`)
          return
        }
        const buffer = Buffer.from(await response.arrayBuffer())
        const filename = decodeURIComponent(src.split('/').pop().split('?')[0])
        const asset = await client.assets.upload('image', buffer, { filename })
        uploaded.set(src, asset._id)
        console.log(`[migrate] uploaded ${filename}`)
      }
      node.asset = { _type: 'reference', _ref: uploaded.get(src) }
      delete node._migrationSrc
      delete node._migrationSrcset
      delete node._migrationSizes
      return
    }

    for (const value of Object.values(node)) await uploadAssets(value)
  }

  for (const docs of Object.values(byType)) await uploadAssets(docs)

  let transaction = client.transaction()
  for (const docs of Object.values(byType)) {
    for (const doc of docs) transaction = transaction.createOrReplace(doc)
  }
  await transaction.commit()
  console.log('[migrate] import complete')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
