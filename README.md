# ElectricalsNG

A product-led electrical commerce and procurement website for ElectricalsNG, built with Next.js App Router, React, TypeScript, Framer Motion and Tailwind CSS. The custom visual system pairs deep navy, warm ivory and restrained amber with self-hosted Manrope and DM Sans variable fonts.

The project was empty at the start of implementation. A Next.js project was created directly because the available starter templates used a different framework and included unnecessary commerce/payment functionality.

## Local development

Use Node.js 22 or newer.

```bash
npm install
netlify dev --port 8889
```

Link to the correct Netlify project if working outside the provided environment. The application can render its curated catalogue without database access. Real Netlify Forms submissions require a deployed site with form detection enabled; a local static form response is not proof of a stored submission.

Builds, framework validation and deploy-preview checks are handled by the Netlify pipeline. No local build, dev server or test command was executed during implementation.

## Pages and features

- `/`: animated authentic-product slideshow, collections, featured products, product guidance, procurement, supplied organization names, services and FAQs.
- `/products`: the full catalogue, search, category and brand filters, price filtering/sorting, counts, mobile filters and load-more pagination.
- `/products/[slug]`: 99 generated product routes, product galleries, visible specifications, research status and sources, related items and product-specific WhatsApp enquiries.
- `/order`: multi-product order requests, quantities, contact and conditional delivery details, a submission reference and a WhatsApp handover requesting the business owner’s bank details.
- `/about`, `/services`, `/procurement`, `/contact`, `/faq`: confirmed business information and enquiry routes.
- `/policies`, `/privacy`: practical pricing, ordering and enquiry-information notices without invented commercial guarantees.
- `/api/prices`: read-only managed-database selling prices. No public write route exists.

All WhatsApp URLs use `2348028828834`. Product-enquiry messages contain the actual product name, ID, current displayed price context and canonical internal product URL. Order handovers include the request reference and selected products instead of treating reference prices as payable amounts. The customer reviews and sends the message; no automatic sending is claimed.

## Order requests & manual bank transfers

Product cards and detail pages link to `/order?product=ENG-…`, preselecting the relevant product. Customers can add up to 20 different products, set whole-number quantities from 1 to 999, and submit contact details and delivery or collection preferences. Reference-priced and unpriced products can be included, but no payable total is fabricated. The draft stays in the current page only; the form clearly warns that leaving or reloading before submission discards it.

The `order-request` Netlify Form stores the submitted request, including its unique reference, item and displayed-price context, customer information, fulfilment details and notes. Its matching detection skeleton is in `public/__forms.html`. Client-provided price snapshots and status labels are advisory enquiry data, not trusted invoices, stock records or payment confirmations. Business-maintained selling prices remain in Netlify Database; no price-write endpoint was added.

After an acknowledged submission, the page displays the reference and a WhatsApp button with a prepared bank-details request. It also provides a copyable message, a selectable text fallback and phone/email alternatives. The handover shares the reference, name, product names, codes, quantities and delivery city, but excludes the full address, email and private notes. Customers review and send the message themselves. The website neither publishes account details nor collects, verifies or acknowledges bank transfers.

In the Netlify project dashboard, review **Forms → order-request** after the next successful deployment. Configure form notification recipients there if the business wants email notifications; the site does not claim that notifications are configured. Confirm the exact variant, stock, final prices, delivery costs and payment terms with each customer before providing verified bank details. Use the request reference to reconcile submissions and any retries. A timeout can occur after a submission was received, so the reference is preserved on retry.

Launch verification still requires a deployed-site submission of each form, confirmation that it appears in Netlify Forms, a mobile WhatsApp handover check and review of the automatic build result. A local static response is not proof that Netlify stored a request. No online payment provider, banking credential or payment account is required for this manual-transfer workflow.

## Product images and research

The standard Google Drive view initially exposed only 50 items. The public embedded index exposed the full accessible collection of **107 JPEG photographs**. All were imported, not merely linked.

- Original files: `public/images/products/originals/`.
- Optimized WebP images: `public/images/products/`, auto-oriented and limited to 1200 pixels without enlargement.
- Curated, immutable editorial catalogue and research evidence: `lib/products.ts`.
- Complete filename-to-product mapping, original IDs and file sizes: `docs/asset-manifest.csv`.
- Product-by-product outstanding review: `docs/catalogue-audit.md`.
- Saved price source evidence: `docs/price-research.md`.

Eight corresponding alternate photographs were added to galleries, resulting in **99 product records from 107 images**. Exact variant identity still needs business review. No generated imagery, stock photos, fabricated packaging or synthetic substitutes were added. No real video asset was supplied; the hero is explicitly an animated product-image showcase, not live video.

**28 products have sourced indicative comparable prices. 71 remain Price on request.** Research was performed on 14 October 2026 using a Nigerian retailer’s first-party listings. References are visually comparable designs, not independently verified exact manufacturer models or confirmed ElectricalsNG selling prices. Variant-dependent ranges were preserved. All 99 require supplier/model and electrical specification confirmation. Unconfirmed ratings, dimensions, stock counts, shipping promises and warranty terms were deliberately not invented.

Priority reviews include the Jinko panel rating, solar street-light specification, the contents of the three-figure fitting, the glass-globe wall-light collection and the installation format of `ENG-51`. Every item is listed in the audit, including all unpriced products.

## Confirmed selling prices without source-code edits

Confirmed business prices and availability are stored in **Netlify Database**, using `@netlify/database` and Drizzle ORM. The schema is in `db/schema.ts`, and the generated migration is in `netlify/database/migrations/`. The platform applies migrations at deploy time; do not apply them manually.

The catalogue remains usable if the price service is unavailable: third-party references stay clearly labelled and unverified products stay Price on request. No guessed selling prices were seeded.

A trusted project operator can update a price without editing the catalogue:

1. Obtain authorized write access to the correct site database through the project’s secure administration process.
2. Provide its managed connection through `NETLIFY_DB_URL` in the trusted process environment. Never commit, print, paste into chat or expose that value through a `NEXT_PUBLIC_` variable.
3. Run the maintenance command with the product ID and the actual confirmed whole-NGN price:

```text
npm run price:update -- ENG-17 <confirmed-price-in-ngn> "<confirmed-availability-text>"
```

To remove a confirmed selling price and return to research/reference pricing:

```bash
npm run price:update -- ENG-17 --remove
```

`scripts/set-price.mjs` validates the ID and price and uses parameterized queries. It never logs connection details. A preview database is separate from production; choose the correct authorized environment. Allow up to three minutes for CDN price caching to refresh. No redeployment is needed for price changes. This is a trusted operator workflow, not a customer-facing admin panel.

## Enquiry forms

The contact and procurement forms use Netlify Forms with native field validation, consent, a honeypot, pending/success/error states and a timeout. Both static registration skeletons are in `public/__forms.html`. Client submissions target that exact file so they do not get swallowed by the Next.js SSR route.

The Netlify Forms activation script was run and the feature marker was added. After deploy, submit one genuine test enquiry and confirm receipt in the Netlify Forms dashboard before opening the form to customers. Configure business email notifications in the dashboard; no notification delivery is assumed or claimed.

## Business configuration

Business email, phone, WhatsApp and canonical domain are in `lib/site.ts`. The business address was not supplied and is not displayed. Social accounts are described only by the supplied identity, Marriot Electrics. Set only confirmed HTTPS profile URLs using the optional variables in `.env.example`; unset accounts produce no invented links.

Trusted organization names are plain-text business-supplied names, with a disclosure that no endorsement or formal partnership is implied. No testimonials or performance statistics were invented.

The site has page metadata, canonical product URLs, sitemap, robots rules, an original interface-mark favicon and no custom `og:image`. Variable fonts are self-hosted; their redistribution licenses are preserved in `public/fonts/`.

## Deployment and review

Netlify configuration explicitly enables `@netlify/plugin-nextjs`, with `.next` as the publish output. The adapter is pinned in the development dependencies and lockfile so the pipeline packages Next.js pages, API routes, image handling and public assets for Netlify instead of publishing raw `.next` files as a static site. Publishing raw `.next` output without the adapter produces Netlify's default Page not found response even when the Next.js build succeeds. Do not replace this setup with an SPA catch-all redirect or a static export, as the site uses server-side API routes and image optimization.

After the automatic deployment completes, verify `/`, `/products`, a product detail URL, `/api/prices`, a `/_next/static/` asset referenced by the page and `/__forms.html` on the preview URL. An unknown path should show the site's own not-found page rather than Netlify's default error page.

No paid add-on, payment gateway, AI inference, image-generation service or production deployment was initiated. The supplied site context identified a Free account; live credit usage was not queried because no manual production deployment was attempted. Check current plan and credit usage before any manual release.

Final review during this run was limited to source and asset inspection, as local build/start/test commands were prohibited. The automatic pipeline must complete successfully, followed by browser checks for mobile navigation, filters, galleries, WhatsApp links, real form receipt and database price overrides. Business specification, variant, policy and pricing review remains necessary before treating the collection as a fully verified selling catalogue.
