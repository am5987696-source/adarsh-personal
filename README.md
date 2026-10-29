# BuildMind AI — Multimodal Construction Intelligence Platform

**BuildMind AI** is an enterprise-grade full-stack construction technology platform that combines multimodal artificial intelligence with civil engineering management. It analyzes jobsite photographs, detects structural cracks, monitors site safety against OSHA standards, evaluates property valuations, generates master construction execution schedules, and provides an on-demand daily site assistant.

---

## 🏗️ Core Platform Modules

1. **Construction Site Safety Monitoring**
   - Multimodal computer vision inspection of site photos.
   - Evaluates PPE compliance, leading-edge fall hazards, scaffolding guardrails, housekeeping, and crane clearances.
   - Outputs severity-classified hazards, visual evidence descriptions, corrective actions, and priority tags.
   - Printable official audit report generator & CSV export.

2. **Structural Crack Detection & Diagnostics**
   - Forensic analysis of reinforced concrete beams, columns, shear walls, facades, and slabs.
   - Classifies crack patterns (diagonal shear, flexural tension, drying shrinkage, differential settlement).
   - Interactive visual bounding box localization over structural imagery.
   - Prominent ACI 224.1R Professional Engineer (PE) disclaimer.

3. **AI Real Estate Valuation & Feasibility**
   - Automated Valuation Model (AVM) combining total and built-up areas, construction quality, condition, floor level, and transit proximity.
   - Recharts sensitivity distribution comparing Conservative Low, Expected Market, and Optimistic High valuations.
   - Breakdown of valuation determinants, strengths, and discounted replacement cost methodology.

4. **AI Construction Project Planner & Master Schedule**
   - Generates work breakdown structures (WBS), sequential phases, and milestones from project parameters.
   - Interactive Gantt-style timeline visualization.
   - Budget allocation pie charts and interactive task status toggle (Pending → In Progress → Completed).
   - Exportable WBS schedule in CSV and printable document format.

5. **Daily Site Assistant & Engineering Advisor**
   - Interactive chat assistant with context awareness of active projects.
   - Pre-loaded suggested prompt chips: pre-pour checklists, concrete hydration curing, progress report templates, and delay mitigation.
   - Copy-to-clipboard and clear conversation controls.

6. **Weather-Aware Construction Advisory**
   - Activity-specific risk evaluation for concrete pouring, tower crane hoisting, exterior caulking/painting, deep excavation, and heat shifts.
   - Real-time atmospheric metrics: temperature (°C/°F), wind velocity (km/h), rain probability, humidity, and UV solar index.
   - Identifies optimal operational time windows and safety mitigations.

7. **Civil Engineering Knowledge Center**
   - Searchable technical repository across 10 civil engineering categories.
   - Standard code references (ACI 318, ASTM C309, OSHA 1926, IBC 2024).
   - Interactive "Ask Civil Engineering Expert" AI follow-up Q&A.

8. **Portfolio & Projects Management**
   - Comprehensive asset registry with physical progress tracking, financial burn rate, crew counts, and safety ratings.
   - Create, edit, and filter active developments.

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts data visualization.
- **Backend:** Node.js, Express, Vite middleware integration, atomic JSON file persistence (`data/db.json`).
- **AI Engine:** Google Gemini 3.8 Flash multimodal model (`@google/genai` TypeScript SDK) running entirely server-side.
- **Safety Standard Alignments:** OSHA 1926 (Subpart M Fall Protection, Subpart E PPE), ACI 318 / 224.1R, ASTM testing standards.

---

## 🚀 Running the Application

### Development
```bash
npm run dev
```
Starts Express backend with mounted Vite middlewares on port 3000.

### Production Build
```bash
npm run build
npm start
```
