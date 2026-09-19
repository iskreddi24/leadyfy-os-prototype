# Leadyfy OS — Agency Operations Platform

**Leadyfy OS** is a frontend-only Agency Management & Operations platform engineered specifically for UGC (User-Generated Content) and Digital Marketing Agencies. It unifies the entire agency delivery lifecycle—from client onboarding and scriptwriting to shoot logistics, creator coordination, multi-stage video post-production, client revision review, and financial margin tracking.

---

## 🚀 Key Features & Workflow Modules

1. **Dashboard & Executive Command Center**
   - Real-time KPIs: Active Retainers, Contracted Production Queue, Net Revenue, Operating Margin.
   - Quick role switcher simulating 6 organizational personas (Owner, Operations Head, Creative Strategist, Production Manager, Video Editor, Client).
   - Live activity ticker and alerts for pending revisions and upcoming shoots.

2. **Client Management & Onboarding**
   - Complete CRM tracking client brand identity, primary contacts, monthly retainer value, contract dates, and Google Drive master folders.
   - 1-click order initialization and direct client portal preview.

3. **Order & Production Counter Pipeline**
   - Tracking delivered vs. contracted video counts.
   - Integrated breakdown of linked scripts, scheduled shoots, video render cards, and financial invoice status.

4. **Scriptwriting & Creative Hooks**
   - Script reader with multi-section hook formatting (Hook, Problem, Solution, Call to Action).
   - Direct creator assignment and client sign-off status transitions.

5. **Creator Roster & Matching**
   - Creator profiles featuring niche tags, rates per deliverable, availability status, portfolio showreels, and contact credentials.
   - 1-click availability toggles and shoot scheduling links.

6. **Shoot Coordination & Call Sheets**
   - Studio calendar and list views.
   - Pre-shoot & post-shoot operational checklist (Script Approved, Product Delivered, Creator Confirmed, Studio Booked, Raw Footage Received).
   - Detailed call sheets with director notes, cameraman assignments, and raw footage cloud drive links.

7. **Video Production Kanban (9 Stages)**
   - Visual Kanban pipeline: *Script Approved → Shoot Pending → Raw Footage Received → Video Editing → Internal QA → Client Review → Revision → Final Approved → Delivered*.
   - Detail modal with full status pipeline step tracker, assigned creator card, linked script preview, timestamped feedback log, and raw drive folder.

8. **Client Review Portal (Self-Service)**
   - Distinct, secure client-facing interface.
   - Interactive 9:16 vertical video player preview.
   - Timestamped revision request tool with instant editor queue re-assignment.
   - 1-click approval and 4K master download links.

9. **Agency Finance & P&L Tracking**
   - Client invoicing and payment tracking (Received, Outstanding, Part-paid).
   - Operating expense log (Studio rentals, equipment gear, props, software licenses).
   - Creator payout ledger with pending and cleared disbursement logs.

---

## 🛠 Tech Stack

- **Framework**: React 18+ (Vite)
- **Styling**: Tailwind CSS with custom amber/charcoal design tokens
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Data Persistence**: `localStorage` (100% Client-Side, Zero External Backend Dependencies)
- **Deployment**: Static Site Hosting (Vercel, Netlify, Cloudflare Pages, GitHub Pages)

---

## 💻 Local Development Setup

### 1. Prerequisites
Ensure you have Node.js 18+ installed on your machine.

### 2. Clone & Install Dependencies
```bash
git clone <repository-url>
cd leadyfy-os
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` (or the port shown in your terminal).

### 4. Build for Production
```bash
npm run build
```
This produces an optimized static build in the `dist/` directory.

---

## 🌐 Deploying to Vercel

Leadyfy OS is a pure static React single-page application (SPA). Deploying to Vercel takes less than 2 minutes:

### Option A: Deploy via Vercel CLI
1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Run the deployment command from the project root:
   ```bash
   vercel
   ```
3. Follow the CLI prompts:
   - **Set up and deploy?**: `y`
   - **Which scope?**: Select your personal or team account
   - **Link to existing project?**: `N`
   - **What's your project's name?**: `leadyfy-os`
   - **In which directory is your code located?**: `./`
   - **Want to modify these settings?**: `N` (Vite is detected automatically)
4. For production release:
   ```bash
   vercel --prod
   ```

### Option B: Deploy via Vercel Web Dashboard (Git Integration)
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Select and import the `leadyfy-os` repository.
4. Verify the Build and Output Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

### SPA Routing on Vercel
To ensure deep links (e.g. `/orders/ord-101`, `/portal`, `/videos`) route seamlessly to `index.html` on hard refreshes, a `vercel.json` file can be configured:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
