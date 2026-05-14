# Harness Demo Site

A locally-hostable demo portal for Harness SE presentations. Built for easy rebranding across all customer verticals.

## 🚀 Running Locally

**Option A — Python (no install needed):**
```bash
cd harness-demo
python3 -m http.server 8080
# Open http://localhost:8080
```

**Option B — Node.js:**
```bash
npx serve harness-demo
```

**Option C — VS Code Live Server extension:**
Right-click `index.html` → "Open with Live Server"

---

## 🎨 Rebranding for a Customer Demo

### Option 1 — In-browser rebrand panel (recommended)

Once the site is running locally, click the **⚙ Rebrand** button in the bottom-right corner of any page. A panel will prompt you for three inputs:

| Input | Example | Effect |
|---|---|---|
| **Company name** | `Barclays` | Updates the logo label and page titles across all pages |
| **Website domain** | `barclays.com` | Fetches the company logo automatically (Clearbit → Google → initials fallback) |
| **Industry** | `Finance / Banking` | Swaps the full colour palette to a matching preset |

**Available industry presets:**
| Industry | Primary colour | Accent |
|---|---|---|
| Technology / SaaS | Green `#1CC47E` | Indigo |
| Finance / Banking | Navy `#0057B8` | Gold |
| Healthcare | Teal `#10B981` | Purple |
| Retail / E-commerce | Orange `#FF6B35` | Indigo |
| Automotive | Red `#E53E3E` | Steel |

Branding is saved to `localStorage` and persists across page navigations. **Reset to default** reverts to whatever is set in `theme.css`.

---

### Option 2 — Edit theme.css directly (or tell Claude)

**Tell Claude:**
> "Rebrand the demo site for Barclays. Use their blue (#00AEEF), keep it professional/banking, company name Barclays."

Claude will edit only `theme.css` — every page reads from it automatically.

### What you can change in theme.css:
| Variable | What it controls |
|---|---|
| `--company-name` | Name shown in nav/login |
| `--company-domain` | Domain used to auto-fetch the logo |
| `--company-tagline` | Subtitle on login page |
| `--color-primary` | Buttons, links, active states, progress bars |
| `--color-accent` | Secondary highlights, avatar backgrounds |
| `--color-bg` | Page background colour |
| `--color-bg-surface` | Sidebar + card backgrounds |
| `--font-display` | Headings and logo font |
| `--font-body` | All body text |

---

## 📁 File Structure

```
harness-demo/
├── theme.css           ← ✏️  Edit this to set default branding
├── base.css            ← Shared components (buttons, forms, cards)
├── brand.js            ← Applies theme.css values on load (logo fetch + name)
├── rebrand-panel.js    ← In-browser ⚙ Rebrand button and panel
├── index.html          ← Login portal
├── dashboard.html      ← Main dashboard with metrics
├── pipelines.html      ← Interactive pipeline demo
└── README.md
```

---

## 💡 Demo Flow Tips

1. **Start at** `index.html` — show the branded login portal
2. **Click "Sign in"** — 1.2s animation then redirects to dashboard
3. **From dashboard** — point to metrics, recent activity, deployment coverage
4. **Go to Pipelines** — hit "Run Pipeline" to show live stage progression
5. **Show the logs panel** — simulates live build output

### SE Tips
- The "Demo Mode" banner in the top-right can be removed for cleaner screenshots
- Pre-fill the email/password fields with customer-relevant values
- Change `payments-service` to the customer's actual service name for resonance

---

## ➕ Adding More Pages

Copy the sidebar block from `dashboard.html` into any new `pagename.html`, update the `active` class on the matching nav item, and link it in the sidebar.

Suggested additions:
- `feature-flags.html` — toggle UI for FF demos
- `chaos.html` — chaos experiment runner
- `costs.html` — Cloud cost management dashboard
- `ai-insights.html` — AIDA / AI assistant panel
