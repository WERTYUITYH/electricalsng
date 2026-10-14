# ElectricalsNG project guide

## Architecture

This project uses Next.js App Router, React, TypeScript, Framer Motion and Tailwind CSS. The custom design system lives in `app/globals.css`; Tailwind theme/utilities supplement it without introducing preflight resets. Use the navy/ivory/amber palette, Manrope display type and DM Sans body type. Avoid generic glass cards, excessive rounding and generated decorative imagery.

- `app/`: server-rendered pages, product routes, SEO files, loading/not-found states and the read-only price API.
- `components/`: responsive navigation, animation wrappers, slideshow, cards, catalogue filters, gallery, FAQs and enquiry forms.
- `lib/products.ts`: curated editorial source catalogue, image associations, original filenames, dated source research and price formatting. This is source content, not a runtime persistence mechanism.
- `lib/site.ts`: confirmed business contacts, canonical URL, optional confirmed social URLs and shared FAQs.
- `lib/enquiry.ts`: product-specific WhatsApp messages. Use the currently displayed selling/reference price context.
- `db/`: Drizzle schema and managed Netlify Database client for business-maintained selling prices.
- `netlify/database/migrations/`: generated migration files; the platform applies them. Never run migrations/push manually.
- `public/images/products/`: optimized supplied photographs; `originals/` preserves the unmodified downloads.
- `docs/`: the full asset manifest, catalogue review audit and saved pricing research.
- `scripts/set-price.mjs`: trusted price maintenance via parameterized managed-database queries.
- `public/__forms.html`: static skeletons required by Netlify Forms detection.

## Important decisions

The initially empty project was scaffolded directly as Next.js because supplied templates used TanStack Start, while the user explicitly required Next.js. Do not replace the framework or add checkout/payment services without approval.

The Drive folder had 107 files, although the standard view showed only the first 50. The complete public embedded listing was imported. Eight corresponding alternate views were grouped into galleries, yielding 99 records. Keep the manifest complete if regrouping products. Confirm exact variants with the business before merging additional items.

No images were generated. Only actual supplied photographs appear in the site. Do not use image-generation tools, random stock images or synthetic product mockups. A neutral, labelled placeholder is preferable to an invented image. The animated hero is a slideshow, not genuine footage.

Twenty-eight products have dated, visually comparable Nigerian retailer prices, not exact-model verified business prices. Seventy-one require research. Never turn a reference into an ElectricalsNG selling price without confirmation. Read `docs/catalogue-audit.md` and `docs/price-research.md` before researching the same item again. All model identifiers and electrical ratings still need business review. Do not invent wattage, dimensions, brands, availability, shipping or warranties.

Runtime price changes belong in Netlify Database, never local files or in-memory stores. The public API is read-only. Do not create an unauthenticated price-write endpoint or expose `NETLIFY_DB_URL`. Keep the database import inside the API handler’s try block so static page generation does not require a live connection. Keep curated catalogue pages available even if current selling prices cannot load.

## Conventions

Prefer server components. Use client components only for interactions, motion, forms, filters and current-price hydration. Pass small subsets from server pages into hero/featured components so the homepage does not ship the full research dataset unnecessarily. Use Next Image with accurate sizes, and never delete the original assets during optimization.

Use descriptive variables, strict TypeScript, accessible names, keyboard-operable controls and visible focus states. Honour reduced-motion preferences, and keep a pause control for the automatic slideshow. Do not add inline explanatory code comments unless requested. Use `apply_patch` for code edits. Never inspect `.git` or print credentials.

Forms must keep matching names and fields in the React components and static skeleton. Submit to `/__forms.html`, not `/`, and keep consent, honeypot, error and pending handling. If changing Netlify Forms setup, read the relevant skill and run its activation script.

Only configured, confirmed social URLs may be linked. No business address was supplied. The organization names are business-provided names, not verified endorsement statements. Do not add invented testimonials or statistics.

## Validation and deployment

During automated project-agent sessions, do not run local build, start, dev, lint, typecheck or test commands when the task rules prohibit them. Read the edited files and leave compilation to the automatic Netlify pipeline. Do not create commits or trigger production deploys. Check the live plan and credit usage before any approved manual deployment. Keep `.netlify/results.md` as a standalone, past-tense prose summary of actual changes and remaining limitations.
