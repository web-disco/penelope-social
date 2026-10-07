# Agent-readiness audit: penelopesocial.com (checked 2026-10-06)

Agent-readiness score: 74/100 (judgement blend; not the Lighthouse fraction). Agent-UX heuristic (separate): home 92/100 complete, /catering-events 77/100 complete.

## Lighthouse Agentic Browsing (v13.5.0, PSI)
- Homepage: 2/3 mobile, 2/3 desktop. Pass: agent-accessibility-tree, cumulative-layout-shift. Fail: llms-txt ("File does not appear to contain any links"). N/A: webmcp-form-coverage, webmcp-registered-tools, webmcp-schema-validity, ard-schema.
- /catering-events: 1/3 mobile, 1/3 desktop. Fail: agent-accessibility-tree (select#Reason-For-Inquiry has no accessible name), llms-txt. Pass: CLS.
- Paths: llms-txt fail->pass (add Markdown links); fixing the select makes the tree pass; a valid /.well-known/ai-catalog.json would add one counted audit (only if there are agent resources to list).

## Findings
### P1 (fix)
1. Catering form select has no accessible name. Evidence: Lighthouse axe rule "Select element must have an accessible name" on select#Reason-For-Inquiry; Agent-UX flags 9 inputs without label[for] and 1 unnamed interactive node. Text inputs only have aria-label, the select and textarea have none (textarea has only a placeholder; checkboxes are wrapped in a label, fine). This is the key "book catering" task. Fix: web/src/components/sections/ContactFormSection.astro lines ~50-70: add aria-label={field.placeholder} to the select and textarea (better: visible <label for={field.id}>).
2. llms.txt fails Lighthouse. Evidence: /llms.txt 200 text/plain, 2786 bytes, has H1 and rich NAP/hours, but URLs are plain "- Label: URL" lines, no Markdown links, no "> summary" blockquote; /llms-full.txt 404. Fix: web/public/llms.txt: write links as [Lunch](https://penelopesocial.com/menus/lunch), [Reserve](https://tables.toasttab.com/...), [Order online](https://order.toasttab.com/...), and add a "> " summary line. Also remove internal SEO notes (Search Console sitemap submission, "do not rename catering-events", redirect notes); they are operator notes, not agent content. Google ignores llms.txt; this only affects the Lighthouse count and some third-party agents.

### P2
3. Hours/menus/prices via Markdown: no Markdown delivery. Accept: text/markdown returns text/html, no Vary: Accept, no rel=alternate, /index.md 404. Opportunity only; no consumer agent confirmed to request it (facts checked 2026-09-23).
4. Booking/ordering are third-party Toast links (reservations, online order). Agents can follow them but the handoff is off-site; ensure /reservations has a plain, labelled link to the Toast URL in server HTML (llms.txt already lists it).

### P3 / opportunities
5. WebMCP: none (0 registerTool, 0 annotated forms; draft W3C CG proposal, Chrome only, checked 2026-09-23). Optional: events-form (/api/events) could take toolname/tooldescription. Newsletter form is unannotated. Not a defect.
6. ai-catalog.json (draft) and /.well-known/{api-catalog, oauth-*, mcp.json}: all 404, correctly; the site operates no matching service. Do not add.
7. Content-Signal (Cloudflare policy, preference only, Google does not act on it, checked 2026-09-23): none declared. Optional line in web/public/robots.txt, e.g. Content-Signal: search=yes, ai-input=yes, ai-train=no, if the owner wants to state a policy.

## Passes
- Server-rendered: 744 words without JS on home; real 404s (no soft-404).
- Accessibility tree home: 429 nodes, 0 unnamed interactive, axe rules all pass. 73 anchors, 9 real buttons, 0 div-onclick widgets, 5 landmarks.
- Menus dropdown: button with aria-label "Show menus and specialties", aria-expanded + aria-controls, Escape/outside-click closes (Navbar.astro ~1028-1043).
- Slide-in drawer: button aria-label "Open menu"/"Close menu", role=dialog aria-modal, sub-screen uses inert, Escape closes (Navbar.astro ~224, 1086, 1153).
- Popups: marketing popup is a native <dialog> with aria-labelledby and a labelled "Close" button; announcement bar has "Dismiss announcement" button; dismissible by agents. Not verified at runtime whether popup is displayed on first visit (check dismissal Escape handling is native dialog behaviour).
- Minor: home has 2 inputs without label[for] (newsletter email has aria-label; heuristic is conservative).

## Access policy (robots.txt: `User-agent: *  Allow: /`, `Disallow: /api/`, sitemap listed; no named groups, no Content-Signal)
- Training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot): allowed by * fallthrough.
- Search/index crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot, Bingbot): allowed.
- User-triggered agents (ChatGPT-User, Claude-User, Perplexity-User, Google-Agent): not blocked; Claude-User honours robots, Perplexity-User/Google-Agent generally ignore, ChatGPT-User may not apply (vendor docs). No UA-matrix test run (not authorized).
- Disallow: /api/ is appropriate (POST form endpoints, subscriber CSV behind Basic Auth).

## Standards status (facts checked 2026-09-23)
WebMCP: W3C CG draft, WebKit opposes. Content-Signal: Cloudflare CC0 policy + IETF draft, preference not enforcement. ai-catalog.json: draft. llms.txt: community spec. No ranking, citation or traffic effects are promised.

## Structured findings (audit-data.json, AI Search Readiness)
[{"title":"Catering form select lacks accessible name","severity":"high","description":"select#Reason-For-Inquiry and textarea have no label/aria-label; Lighthouse accessibility-tree audit fails on /catering-events (1/3).","recommendation":"Add aria-label/label in web/src/components/sections/ContactFormSection.astro"},
{"title":"llms.txt has no Markdown links","severity":"medium","description":"Lighthouse llms-txt audit fails on all pages; file lists plain URLs and internal SEO notes.","recommendation":"Convert to [label](url) links, add > summary, drop operator notes in web/public/llms.txt"},
{"title":"No Markdown delivery / WebMCP / Content-Signal","severity":"low","description":"Optional drafts/proposals; absence is an opportunity.","recommendation":"Consider only if wanted"}]
