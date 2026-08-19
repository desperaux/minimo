# minimo — Product Design System and UX Specification

> Version 1.0 · Responsive web application  
> Read with [`PRD.md`](./PRD.md) and [`ARCHITECTURE.md`](./ARCHITECTURE.md)

## 1. Design direction

minimo should feel as easy and direct as a polished consumer money app, with the encouragement and clarity of a great learning product. It must not copy Cash App, Duolingo, or any competitor's artwork, characters, icons, layouts, or trade dress.

The emotional target is:

- **Simple:** the next action is obvious.
- **Fast:** minimal fields and immediate feedback.
- **Friendly:** plain language, warm color, no accounting intimidation.
- **Credible:** invoices and payments still feel professional and secure.
- **Calm:** overdue money is handled without alarmist or shame-based design.

### Brand statement

**minimo makes getting paid feel straightforward.**

### Working tagline

**Send invoices. Get paid. Move on.**

## 2. Design principles

### One job per moment

Each step should ask for one conceptual decision. Avoid giant forms when a short guided flow is clearer.

### Show, then explain

The live invoice preview should update as the user enters information. Tooltips and help text appear only when a field needs explanation.

### Progressive disclosure

The initial editor shows client, items, dates, total, and payment. Tax, discount, notes, reminders, and customization live behind compact optional controls.

### Momentum without manipulation

Use progress, checkmarks, helpful empty states, and completion feedback. Do not use fake streaks, guilt, confetti for overdue balances, countdown pressure, or dark patterns.

### Trust is visible

Display seller identity, invoice status, amount, due date, secure-payment context, support access, and error recovery clearly.

### Money states are never color-only

Every status combines label, icon, and color. Amounts use tabular numerals and consistent alignment.

## 3. Visual identity

### Personality

minimo is optimistic, efficient, sharp, and human. It is not corporate-gray, childish, luxury-fintech, or aggressively playful.

### Color palette

Core palette:

| Token | Hex | Use |
|---|---:|---|
| `ink-950` | `#172033` | Primary text, dark surfaces |
| `ink-700` | `#39445A` | Secondary text |
| `ink-500` | `#68738A` | Muted text and icons |
| `cobalt-600` | `#3957FF` | Primary action, links, focus accents |
| `cobalt-700` | `#2944E8` | Hover/pressed primary |
| `cobalt-100` | `#E9EDFF` | Selected and informational backgrounds |
| `lime-400` | `#B7F34A` | Brand accent and positive highlight |
| `lime-100` | `#F0FFD4` | Soft success/accent background |
| `canvas` | `#F7F8FC` | Application background |
| `surface` | `#FFFFFF` | Cards, panels, forms |
| `border` | `#E3E7EF` | Default border/divider |
| `success-600` | `#18864B` | Paid/success text and icon |
| `success-100` | `#E7F7EE` | Paid/success background |
| `warning-600` | `#A55A00` | Due soon/warning |
| `warning-100` | `#FFF3DE` | Warning background |
| `danger-600` | `#C7353C` | Errors, overdue, destructive actions |
| `danger-100` | `#FDEBEC` | Error background |

### Color rules

- Primary cobalt is reserved for actions, focus, links, and selected navigation.
- Lime is an accent, not the main button color and never long-form text.
- Red indicates failure, destructive action, or overdue state—not general attention.
- Ensure WCAG AA contrast for text and interactive states.
- Dark mode is post-MVP unless implemented without delaying core behavior.

### Typography

Recommended family: **Inter** or **Geist Sans**, with system fallbacks.

```css
font-family: Inter, Geist, ui-sans-serif, system-ui, -apple-system,
  BlinkMacSystemFont, "Segoe UI", sans-serif;
font-variant-numeric: tabular-nums;
```

| Style | Desktop | Mobile | Weight | Line height |
|---|---:|---:|---:|---:|
| Display | 48 px | 36 px | 700 | 1.08 |
| H1 | 36 px | 30 px | 700 | 1.15 |
| H2 | 28 px | 24 px | 700 | 1.2 |
| H3 | 20 px | 18 px | 650 | 1.3 |
| Body large | 18 px | 17 px | 400 | 1.55 |
| Body | 16 px | 16 px | 400 | 1.5 |
| Body small | 14 px | 14 px | 400 | 1.45 |
| Label | 14 px | 14 px | 600 | 1.35 |
| Caption | 12 px | 12 px | 500 | 1.4 |
| Money large | 32 px | 28 px | 700 | 1.15 |

Do not use ultra-light body text or all-caps headings. Invoice documents may use a conservative subset of the same type system.

### Radius, borders, and shadows

| Token | Value |
|---|---:|
| Small radius | 8 px |
| Control radius | 12 px |
| Card radius | 16 px |
| Feature-panel radius | 20 px |
| Pill radius | 999 px |
| Default border | 1 px `border` |
| Focus ring | 3 px translucent cobalt outside control |
| Card shadow | `0 8px 30px rgba(23,32,51,.07)` |
| Floating shadow | `0 16px 48px rgba(23,32,51,.14)` |

Prefer borders and surface contrast over many shadows.

### Spacing

Use a 4 px base grid:

```text
1: 4px   2: 8px   3: 12px   4: 16px
5: 20px  6: 24px  8: 32px  10: 40px
12: 48px 16: 64px 20: 80px
```

Minimum comfortable touch target: 44 × 44 px.

### Iconography

- Use one outline icon set such as Lucide.
- Default size 20 px; navigation 22–24 px; small indicators 16 px.
- Keep stroke width consistent.
- Pair unfamiliar icons with labels.
- Do not use decorative emoji as functional icons.

## 4. Layout system

### Breakpoints

```text
mobile:   360–639
tablet:   640–1023
desktop:  1024–1439
wide:     1440+
```

### Desktop application shell

- Left sidebar: 240 px expanded; optional 72 px collapsed later.
- Main content: flexible, max width 1440 px.
- Page gutter: 32 px desktop, 24 px tablet, 16 px mobile.
- Top region: page title, supporting description, one primary action.
- Do not place more than two competing actions in a page header.

### Mobile shell

- Compact top app bar with wordmark/context and profile menu.
- Bottom navigation with Home, Invoices, Clients, and Settings.
- Floating/anchored **Create invoice** action where it does not obscure content.
- Editor actions use a sticky bottom action bar.
- Drawers become full-screen sheets when content is complex.

### Content width

- Text/settings forms: max 680 px.
- Data lists/dashboard: max 1200 px.
- Invoice editor: split layout on desktop; single column with preview sheet on mobile.

## 5. Navigation

### Primary navigation

1. Home
2. Invoices
3. Clients
4. Payments
5. Settings

Keep the navigation intentionally small. Billing and help belong within settings/profile, not as equal primary destinations.

### Desktop sidebar

- minimo wordmark at top.
- Main links in the middle.
- Help and user/workspace switcher at bottom.
- Active item uses cobalt-tinted background, icon, label, and left/inner accent.

### Mobile bottom navigation

- Maximum four persistent items.
- Use icon plus short label.
- Avoid badge noise; only show actionable counts such as overdue invoices when meaningful.

## 6. Component specifications

### Button

Variants:

- Primary: cobalt fill, white text
- Secondary: white surface, ink text, border
- Tertiary: transparent, cobalt/ink text
- Destructive: danger fill or danger-outline depending on severity
- Link: inline text action

Sizes:

- Large: 52 px height for key onboarding/client-payment actions
- Medium: 44 px default
- Small: 36 px compact table/list actions

States: default, hover, pressed, focus-visible, loading, disabled. Loading keeps width stable and includes readable text when action duration may be unclear.

### Input

- Label always visible above field.
- Optional status appears as “Optional,” not an asterisk convention.
- Height 48 px; textarea minimum 112 px.
- Help text below only when needed.
- Error text appears under field with icon and `aria-describedby`.
- Preserve entered value after validation errors.
- Amount inputs align numerals right and display currency context.

### Select/combobox

- Native select for short stable lists when possible.
- Searchable combobox for clients.
- Full keyboard behavior and announced selected value.

### Card

- Default surface with subtle border.
- Internal padding 20 px mobile / 24 px desktop.
- Clickable cards have visible hover/focus and a single clear destination.
- Avoid nested cards.

### Status badge

| Status | Treatment |
|---|---|
| Draft | Neutral gray + pencil/document icon |
| Queued | Cobalt-soft + clock icon |
| Sent | Cobalt-soft + send icon |
| Viewed | Violet/cobalt-soft + eye icon |
| Due soon | Warning-soft + clock icon |
| Overdue | Danger-soft + alert icon |
| Paid | Success-soft + check icon |
| Void | Neutral dark + slash icon |

Always include the written status.

### Toasts and banners

- Toast: lightweight confirmation that requires no follow-up.
- Inline banner: actionable failure or account condition.
- Never rely on a disappearing toast for payment or invoice-send uncertainty.
- Success toast example: “Invoice queued for delivery.”
- Failure banner example: “We couldn't deliver this invoice. Check the client's email or copy the secure link.”

### Dialog

Use only for short confirmation. For editing, onboarding, or multi-step actions, use a page/sheet.

Destructive confirmation states the object and outcome:

> Void invoice INV-1042? The client will no longer be able to pay it. The invoice will remain in your records.

### Skeletons

Match the final layout. Do not use global spinners for full pages. Preserve stable page structure during loading.

### Data table/list

- Desktop invoices use a table with invoice/client, amount, due date, and status.
- Mobile transforms each row into a compact list card, not a horizontally scrolling table.
- Row click opens details; secondary action menu remains separately reachable.
- Amount is right-aligned using tabular numerals.

## 7. Screen specifications

## 7.1 Marketing home

### Goal

Explain the outcome and drive account creation.

### Structure

1. Header: wordmark, Product, Pricing, Sign in, Get started
2. Hero:
   - Eyebrow: “Invoicing without the chasing”
   - H1: “Send invoices. Get paid. Move on.”
   - Supporting copy focused on delivery, reminders, and easy payment
   - Primary CTA: “Create your first invoice”
   - Secondary CTA: “See how it works”
3. Product preview showing the create-to-paid loop
4. Three benefits: create fast, know what happened, follow up automatically
5. Client payment preview
6. Trust strip: Stripe-powered payments, exportable invoices, privacy-first language
7. Pricing preview
8. FAQ
9. Footer with legal/support

Do not claim unearned customer counts, security certifications, or “guaranteed faster payment.”

## 7.2 Authentication

- Centered surface, max 440 px.
- Logo, direct title, minimal form, provider buttons only if truly supported.
- Explain verification and recovery plainly.
- Never reveal whether an unknown email has an account during recovery.

## 7.3 Onboarding

Use 3–4 short steps with a visible progress indicator:

1. About your business
2. Invoice defaults
3. Brand (optional)
4. Ready state

Allow users to skip optional steps and edit later. Do not force Stripe connection before value is clear.

## 7.4 Dashboard/home

### Desktop hierarchy

1. Greeting and **Create invoice**
2. Priority card: overdue amount/count with “Review overdue”
3. Summary cards: Outstanding, Paid this month, Average time to pay (when enough data)
4. Recent invoices
5. Contextual setup checklist until completed

### Empty state

Title: **Let's send your first invoice**  
Body: “Create a professional invoice, share it with your client, and track what happens next.”  
CTA: **Create invoice**

Do not show meaningless zero-filled analytics before the user has data.

## 7.5 Invoice list

### Header

- Title: Invoices
- Primary CTA: Create invoice

### Controls

- Search by client or invoice number
- Status segmented filter: All, Outstanding, Overdue, Paid, Drafts
- More filters sheet: date and amount later

### Row

- Invoice number and client
- Sent/issue date
- Due date
- Amount
- Status badge
- Overflow actions: duplicate, copy link, download, void where permitted

Mobile list cards prioritize client, amount, status, and due date.

## 7.6 Invoice editor

This is the most important seller screen.

### Desktop

- Left: form/editor, approximately 55%
- Right: sticky invoice preview, approximately 45%
- Top: Back, Draft status, autosave state, Preview/Send
- Bottom or header primary action: **Review and send**

### Mobile

- Single guided editor.
- Sections presented as compact cards: Client, Items, Dates, Payment, More options.
- Sticky bottom bar: total plus **Review**.
- Preview opens a full-screen sheet/page.

### Editor order

1. Client
2. Line items
3. Issue/due date
4. Payment method
5. Optional: discount, tax, notes, reminders

### Line-item behavior

- First item exists by default.
- Description field gets most width.
- Quantity defaults to 1.
- Rate uses USD formatting.
- Line total updates immediately.
- Add-item action is obvious.
- Deletion supports undo before server persistence or clear confirmation.
- On mobile, quantity/rate fields stack without tiny tap targets.

### Autosave

Use subtle text in the top area:

- “Saving…”
- “Saved”
- “Couldn't save — retrying”

Never block typing with autosave spinners.

## 7.7 Review and send

Full page or large sheet, not a tiny dialog.

Show:

- Recipient name/email
- Invoice number, amount, and due date
- Email subject and optional personal message
- Payment option status
- Reminder schedule summary
- Final invoice preview

Primary CTA: **Send invoice**  
Secondary: **Back to edit**

If Stripe is not connected, explain that the invoice can still be sent without online payment or offer to connect, depending on product decision.

## 7.8 Invoice sent state

Use a restrained success treatment:

- Check icon, not large confetti
- “Invoice sent to client@example.com”
- Actions: View invoice, Copy link, Create another
- Explain: “We'll update the timeline when delivery and payment events arrive.”

## 7.9 Invoice detail

### Header

- Invoice number, client, status badge
- Amount due or paid
- Primary contextual action:
  - Draft: Continue editing
  - Outstanding: Send reminder
  - Paid: Download receipt/PDF

### Content

- Invoice preview/document
- Timeline
- Payment summary
- Reminder schedule
- Overflow: duplicate, correct, void, download

### Timeline language

- “Invoice queued for delivery”
- “Email provider accepted the message”
- “Client opened the invoice page”
- “Reminder sent”
- “Payment processing”
- “Payment confirmed”

Avoid overstating “email read.”

## 7.10 Clients

List/search with client name, email, outstanding amount, last invoice, and status. Client detail shows contact data, invoice history, and create-invoice action.

Client creation should work inline from the invoice editor and on a dedicated page. Required fields: name and email only.

## 7.11 Payments

Show payment records, status, invoice, client, amount, date, and source. When Stripe is disconnected or needs action, use an actionable banner.

Do not present minimo as holding funds. Link to the seller's Stripe dashboard for payout/account management when appropriate.

## 7.12 Settings

Group settings into clear pages:

- Business profile
- Invoice defaults
- Payments
- Notifications/reminders
- Subscription and billing
- Data and privacy

Danger zone is visually separated at the bottom of Data and privacy.

## 7.13 Public invoice page

This screen must maximize clarity and payment completion while respecting trust.

### Layout

- minimo mark small and secondary
- Seller logo/name prominent
- Status and amount at the top
- Invoice document below
- Sticky payment summary/action on desktop right rail
- Sticky bottom **Pay invoice** bar on mobile when balance is open

### Required content

- Seller identity/contact
- Invoice number
- Issue and due date
- Billed-to identity
- Item descriptions, quantity, rate, line totals
- Subtotal, discount, tax, paid, and amount due
- Notes/payment instructions
- Download PDF
- Secure payment disclosure

### Payment CTA states

- Open: “Pay $1,250.00”
- Processing: “Payment processing” with explanation
- Paid: “Paid” and receipt/download action
- Void: “This invoice was voided”
- Overdue: “Pay $1,250.00” with overdue badge, not hostile copy

Client does not need an account.

## 7.14 Payment result

Success:

- “Payment received”
- Amount, invoice number, seller name
- Receipt delivery explanation
- Return to invoice

Pending:

- “Your payment is processing”
- Explain no need to retry immediately

Failure/cancelled:

- “Payment wasn't completed”
- Safe retry action
- No blame and no raw processor error

## 8. Invoice document design

The invoice itself should be more conservative than the application UI.

### Format

- US Letter PDF
- 0.55–0.7 inch safe margins
- White background
- Seller logo/name top left
- “INVOICE” and invoice number top right
- Client and invoice metadata in two-column region
- Item table with strong alignment and subtle borders
- Totals aligned right
- Notes/payment instruction at bottom

### Document tokens

- Ink text `#172033`
- Muted text `#68738A`
- Border `#E3E7EF`
- Seller's selected accent color with contrast validation; default cobalt
- Body 9.5–10.5 pt, labels 8–9 pt, total 16–20 pt

### Long-content rules

- Wrap descriptions; never shrink the whole document excessively.
- Repeat table header on subsequent pages.
- Keep totals together when possible.
- Show “Page X of Y” on multi-page documents.
- Truncate only non-financial decorative text with a visible safe limit in editor.
- Test long business/client names and 50+ items.

## 9. Content design

### Voice

- Short, direct, calm
- Use everyday verbs: create, send, view, remind, pay
- Avoid accounting jargon unless required
- Explain consequences before irreversible actions
- Never shame the seller or client

### Preferred language

| Avoid | Use |
|---|---|
| Debtor | Client |
| Delinquent | Overdue |
| Dispatch invoice | Send invoice |
| Payment remittance successful | Payment received |
| Invalid input | Tell the user exactly what needs fixing |
| Something went wrong | Specific safe problem and next action |
| Click here | Action-specific link text |

### Reminder tone

Default overdue reminder:

> Hi {{client_name}}, this is a quick reminder that invoice {{invoice_number}} for {{amount}} was due on {{due_date}}. You can review and pay it securely using the link below. If you've already paid, please disregard this message.

Allow seller personalization, but preserve sender identity and abuse controls.

### Empty-state formula

1. State what is empty.
2. Explain why adding it helps.
3. Offer one action.

### Error formula

1. What could not happen.
2. What is known about the current state.
3. What the user can do next.

Example:

> We couldn't confirm delivery yet. Your invoice is saved and hasn't been sent twice. Check again in a moment or copy the secure link.

## 10. Motion and feedback

- Default transition: 150–220 ms.
- Use ease-out for entrances and ease-in for exits.
- Animate opacity/transform, not layout-heavy properties.
- Respect `prefers-reduced-motion`.
- Use subtle check animations for completed setup steps.
- Avoid bouncing controls, infinite decorative motion, excessive confetti, and animations that delay tasks.

## 11. Accessibility

Target WCAG 2.2 AA.

- Semantic landmarks and heading hierarchy
- Visible skip link
- Full keyboard support
- Focus-visible ring never removed
- Modal/sheet focus management and escape behavior
- Every input has a programmatic label
- Errors summarized and linked to fields
- Status communicated in text, not color alone
- Live regions for autosave and async confirmations without excessive announcements
- Minimum 44 px touch targets
- 200% zoom without loss of core functionality
- Reflow at 320 CSS px where practical
- Reduced-motion mode
- High-contrast tested color combinations
- Tables have headers/captions; mobile transformations preserve meaning
- PDF should be tagged/structured when the chosen renderer supports it

## 12. Responsive behavior

### Global

- No horizontal page scrolling at 360 px.
- Long emails/IDs wrap safely.
- Sticky actions never cover the final fields or browser controls.
- Desktop hover behavior always has touch and keyboard equivalents.

### Invoice editor

- Split view becomes one column below 1024 px.
- Preview becomes a dedicated view/sheet.
- Item rows stack description above quantity/rate.
- Total remains visible in sticky bottom action region.

### Invoice detail

- Header actions collapse into primary action plus overflow.
- Timeline stays vertical.
- Document preview fits width and offers PDF download.

### Public invoice

- Payment rail becomes sticky bottom action.
- Table may turn into labeled item blocks while preserving all values.
- Seller/client details stack.

## 13. Loading, empty, and edge states

Every screen implementation must include:

- Initial loading
- Refresh/revalidation loading
- Empty state
- Filtered no-results state
- Validation error
- Authorization/not-found state
- Offline or network failure
- External provider unavailable
- Optimistic action rollback if used
- Success confirmation

### Important edge cases

- Very long business/client names
- Long email address
- One item and 50+ items
- Zero tax/discount and combined tax/discount
- Large totals
- Due today and past-due dates
- Stripe action required
- Payment processing for an extended period
- Hard-bounced recipient
- Sent invoice correction
- Workspace with no Stripe connection

## 14. Design tokens starter

```css
:root {
  --color-ink-950: #172033;
  --color-ink-700: #39445a;
  --color-ink-500: #68738a;
  --color-primary: #3957ff;
  --color-primary-hover: #2944e8;
  --color-primary-soft: #e9edff;
  --color-accent: #b7f34a;
  --color-accent-soft: #f0ffd4;
  --color-canvas: #f7f8fc;
  --color-surface: #ffffff;
  --color-border: #e3e7ef;
  --color-success: #18864b;
  --color-success-soft: #e7f7ee;
  --color-warning: #a55a00;
  --color-warning-soft: #fff3de;
  --color-danger: #c7353c;
  --color-danger-soft: #fdebec;

  --radius-sm: 8px;
  --radius-control: 12px;
  --radius-card: 16px;
  --radius-panel: 20px;

  --shadow-card: 0 8px 30px rgba(23, 32, 51, 0.07);
  --shadow-floating: 0 16px 48px rgba(23, 32, 51, 0.14);

  --content-form: 680px;
  --content-app: 1200px;
  --sidebar-width: 240px;
}
```

Map these into Tailwind's theme rather than scattering raw hex values through components.

## 15. Screen inventory

### P0 seller screens

- Marketing home
- Pricing
- Sign up/sign in/recovery/verification
- Onboarding
- Dashboard
- Invoice list
- Create/edit invoice
- Review and send
- Send result
- Invoice detail/timeline
- Client list
- Create/edit client
- Client detail
- Payments list
- Stripe connection status/onboarding return
- Business settings
- Invoice defaults
- Notification/reminder settings
- Billing/settings
- Data/export/delete settings
- Generic loading/error/not-found

### P0 client screens

- Public invoice
- Stripe handoff/loading
- Payment success
- Payment pending
- Payment failure/cancelled
- Invalid/expired/void invoice

### P1

- CSV import
- Workspace members
- Recurring schedule
- Partial-payment controls
- Deeper reporting

## 16. Design QA checklist

Before accepting a screen:

- The primary action is obvious within five seconds.
- Copy uses plain language and real states.
- Mobile at 360 × 800 works without horizontal scrolling.
- Desktop at 1440 px does not become needlessly stretched.
- Keyboard order is logical and focus is visible.
- Empty, loading, error, retry, and success states exist.
- Status is not color-only.
- Text and controls meet contrast requirements.
- Long data wraps safely.
- Destructive actions explain consequences.
- Money values use correct currency formatting and tabular numerals.
- The UI does not imply minimo holds seller funds.
- No unearned trust claim or fake social proof appears.

## 17. Coding-agent design guardrails

Paste these into implementation prompts:

1. Follow the tokens and patterns in `DESIGN.md`; do not invent a new style.
2. Reuse accessible primitives before creating custom interactions.
3. Keep one primary CTA per screen/section.
4. Build responsive behavior at the same time as desktop, not afterward.
5. Include all states: loading, empty, validation, error, retry, success, disabled.
6. Preserve keyboard navigation, focus, labels, and semantic HTML.
7. Do not copy Cash App, Duolingo, or competitor assets/trade dress.
8. Do not use gradients, glassmorphism, huge shadows, or excessive animation unless this document is intentionally revised.
9. Do not use placeholder metrics or fake testimonials in production UI.
10. Verify at 360 px, 768 px, 1024 px, and 1440 px before completion.

## 18. Recommended first prototype

Design and build this path before the rest of the application:

1. Empty dashboard
2. Create invoice editor
3. Review and send
4. Sent invoice detail/timeline
5. Public client invoice
6. Payment success

This single vertical slice validates the product's visual language, core navigation, responsive behavior, and central value proposition.

