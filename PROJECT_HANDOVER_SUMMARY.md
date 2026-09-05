# The Bling Haven — Project Handover & Agent Context Guide

> **Target Audience**: AI Agents & Developers working on this codebase.  
> **Last Updated**: September 2026  
> **Repository Root**: `c:\Users\monsx\OneDrive\Documents\theblinghaven`

---

## 1. Platform Identity & Business Model

**The Bling Haven** is an e-commerce platform dedicated exclusively to **Premium Handcrafted Artificial, Kundan, Polki & CZ Fashion Jewellery**.

### Key Rules & Domain Boundaries
- ❌ **NO Real Bullion or Precious Metals Tickers**: Never show 22K/18K spot gold prices, bullion trading, or karat assay rates.
- ❌ **NO Armored Logistics**: Never mention armored truck freight (Ferrari Group, Brink's, etc.). All logistics are standard and express **Tracked Courier Delivery** (Canada Post, FedEx, DHL).
- ❌ **NO Physical Vault Networks or Hallmarking**: Never re-introduce physical vaults or GIA gemology lab certificates. Products carry **100% Anti-Tarnish & Hypoallergenic Assurances** with triple-plated 18K/22K micro-finish on brass/alloy bases.
- ❌ **NO Showroom Appointments or VIP Lounges**: The platform is direct-to-consumer (D2C) e-commerce.
- 🏷️ **Naming**: The showcase page is strictly **"Gallery"** (NOT "3D Gallery").

---

## 2. Monorepo Architecture & Port Allocations

This repository is managed as an npm workspace monorepo:

| Component | Path | Technology | Port | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Storefront** | `apps/web` | Next.js 14, TailwindCSS, Framer Motion, Lucide | `http://localhost:3000` | Customer-facing e-commerce shop, Virtual Try-On, Gallery, Custom Requests |
| **Admin Portal** | `apps/admin` | Next.js 14, TailwindCSS, Chart.js, Lucide | `http://localhost:3001` | Merchant dashboard, orders, inventory, custom requests, e-commerce reports |
| **Commerce API** | `apps/api` | NestJS, Prisma ORM, JWT, Swagger | `http://localhost:4000` | REST API (Swagger at `/docs`) |
| **Shared Types** | `packages/shared` | TypeScript (`dist/` build) | N/A | DTOs, Enums, and Shared Contracts |
| **Database Studio** | `apps/api` | Prisma Studio | `http://localhost:5555` | Local DB visualizer |

> ⚠️ **Note on Shared Types**: `apps/web/src/shared/` and `apps/admin/src/shared/` contain mirror copies of `packages/shared/src/`. If modifying shared DTOs or unions, update `packages/shared/src/`, build it (`npm run build` in `packages/shared`), and ensure local mirrors stay in sync.

---

## 3. Database & Admin Credentials

- **Engine**: SQLite via Prisma ORM
- **Database File**: `apps/api/prisma/dev.db` (38 tables, seeded with products, categories, orders, audit logs)
- **Admin Portal Login**:
  - **URL**: `http://localhost:3001/login`
  - **Email**: `admin@theblinghaven.shop`
  - **Password**: `Admin@BlingHaven2026!`

---

## 4. Key Restructured Modules & Implementations

### A. Custom Jewellery Request Page (`/bespoke`)
- **File**: `apps/web/src/app/bespoke/page.tsx`
- **Flow**: Simplified 2-step inquiry form:
  1. **Item Details**: Choose category (*Ring, Bangles / Kada, Necklace / Choker, Earrings, Complete Bridal Set, Other*), enter design description, optional size and photo upload.
  2. **Client Information**: Name, Email / WhatsApp phone, City / Country, target budget.
  3. **Confirmation Screen**: Displays *"Thank you! We will contact you soon."* with reference ID.

### B. Virtual Try-On Studio (`/try-on`)
- **File**: `apps/web/src/app/try-on/page.tsx`
- **Category-Tailored Models**:
  - `RING`: Hand models across diverse skin tones.
  - `NECKLACE`: Decolletage & neckline models.
  - `EARRINGS`: Side profile & ear models.
  - `BANGLE`: Wrist & forearm models.
- **Assets**: Uses transparent PNG overlays located at `apps/web/public/gallery/processed/`:
  - `01_ring_transparent.png`
  - `02_necklace_transparent.png`
  - `03_earrings_transparent.png`
  - `04_bangles_transparent.png`
- **Pricing**: Realistic artificial jewellery pricing ($39 - $119 CAD).
- **Actions**: Directly adds to cart with slide-out drawer or saves look for styling consultation.

### C. Floating Customer Chatbot Widget
- **File**: `apps/web/src/components/CustomerChatWidget.tsx`
- Mounted globally in `apps/web/src/app/layout.tsx`.
- Anchored at bottom-right corner with notification badge.
- Provides interactive quick chips:
  - *Track My Order*
  - *Custom Jewellery*
  - *Size & Styling Help*
  - *Support & Returns*

### D. Admin Portal Pages (`apps/admin`)
- **Layout & Navigation (`apps/admin/src/components/AdminLayout.tsx`)**:
  - Removed deprecated real-bullion pages: Vault Network (`/vaults`), Certificates (`/certificates`), Showrooms (`/concierge`), VIP Club (`/vip`), Metal Rates (`/metals`), and Voice Concierge (`/ai-concierge`).
  - Renamed custom CAD studio to **Custom Jewellery Requests** (`/bespoke`).
- **Custom Jewellery Requests (`apps/admin/src/app/bespoke/page.tsx`)**:
  - Displays client custom inquiries with contact details, item type, design notes, and workflow stage (*New Requests, Design Review, In Crafting, Dispatched/Contacted*).
- **Sales & Audit Reports (`apps/admin/src/app/reports/page.tsx`)**:
  - 4 e-commerce report ledgers with CSV export:
    1. **Sales & Revenue Performance Ledger**
    2. **Courier Shipping & Delivery Ledger**
    3. **Product Inventory & Stock Movement Audit**
    4. **GST, HST & Sales Tax Compliance Ledger**

---

## 5. Helpful Commands for the Agent

### Start Dev Servers
```bash
# Storefront (Port 3000)
cd apps/web && npm run dev

# Admin Portal (Port 3001)
cd apps/admin && npm run dev

# API Server (Port 4000)
cd apps/api && npm run dev

# Prisma Studio (Port 5555)
cd apps/api && npx prisma studio
```

### Typechecking & Compiling
```bash
# Rebuild shared package after DTO changes:
cd packages/shared && npm run build

# Typecheck API:
cd apps/api && npx tsc --noEmit

# Typecheck Admin:
cd apps/admin && npx tsc --noEmit

# Typecheck Storefront:
cd apps/web && npx tsc --noEmit
```

---

## 6. Summary Checklist for Any New Task
- [ ] Keep branding focused on **Artificial, Kundan, and CZ Fashion Jewellery**.
- [ ] Maintain the anti-tarnish and courier shipping guarantees.
- [ ] Keep custom jewellery inquiries simple and client-focused.
- [ ] Always verify that all workspaces pass `npx tsc --noEmit` before concluding.
