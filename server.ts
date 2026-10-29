/**
 * BuildMind AI - Full Stack Server
 * Node.js / Express backend with Vite middleware and Gemini multimodal AI
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// High payload limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Gemini Client initialization
const geminiApiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Database helper functions
interface DbSchema {
  users: Array<{ id: string; name: string; email: string; company: string; role: string; token: string }>;
  projects: Array<any>;
  safetyInspections: Array<any>;
  crackAnalyses: Array<any>;
  valuations: Array<any>;
  projectPlans: Array<any>;
  chatHistory: Array<any>;
  knowledgeBookmarks: string[];
}

function getInitialDb(): DbSchema {
  return {
    users: [
      {
        id: 'usr_default',
        name: 'David Reynolds, PE',
        email: 'am5987696@gmail.com',
        company: 'Vanguard Civil Construction Corp.',
        role: 'Senior Project Director',
        token: 'auth_token_buildmind_demo',
      },
    ],
    projects: [
      {
        id: 'proj_01',
        name: 'Skyline Commercial Tower Phase II',
        code: 'SCT-2026-B',
        projectType: 'Commercial High-Rise',
        location: 'Downtown Financial District, Metro Central',
        budget: 45000000,
        spent: 18200000,
        startDate: '2025-06-15',
        targetCompletionDate: '2027-04-30',
        status: 'Active',
        progressPercentage: 42,
        manager: 'David Reynolds, PE',
        description: '38-story reinforced concrete and steel frame mixed-use commercial center with 3-level underground parking.',
        workersOnSite: 145,
        safetyRating: 'A-',
        lastInspectionDate: '2026-10-24',
      },
      {
        id: 'proj_02',
        name: 'Meridian Logistics & Distribution Hub',
        code: 'MLH-2026-08',
        projectType: 'Industrial Warehouse',
        location: 'Eastern Industrial Corridor, Sector 4',
        budget: 28500000,
        spent: 23400000,
        startDate: '2025-02-01',
        targetCompletionDate: '2026-12-15',
        status: 'Active',
        progressPercentage: 82,
        manager: 'Elena Rostova',
        description: '500,000 sq ft automated cold-storage distribution facility with heavy post-tensioned slab flooring.',
        workersOnSite: 68,
        safetyRating: 'A',
        lastInspectionDate: '2026-10-27',
      },
      {
        id: 'proj_03',
        name: 'Riverside Luxury Residences & Marina',
        code: 'RLR-2026-03',
        projectType: 'Residential Multi-Family',
        location: 'Riverside Waterfront Quay',
        budget: 62000000,
        spent: 12400000,
        startDate: '2026-01-10',
        targetCompletionDate: '2028-08-30',
        status: 'Active',
        progressPercentage: 20,
        manager: 'Marcus Chen',
        description: 'Twin 24-story residential towers with subterranean deep pile foundations and marine retaining walls.',
        workersOnSite: 92,
        safetyRating: 'B+',
        lastInspectionDate: '2026-10-28',
      },
      {
        id: 'proj_04',
        name: 'Westside Transit Overpass Rehabilitation',
        code: 'WTO-2025-R',
        projectType: 'Civil Infrastructure',
        location: 'Expressway Interchange Km 14',
        budget: 14200000,
        spent: 13900000,
        startDate: '2024-11-01',
        targetCompletionDate: '2026-11-30',
        status: 'Active',
        progressPercentage: 96,
        manager: 'Sarah Jenkins',
        description: 'Structural retrofitting of post-tensioned bridge girders, seismic dampers, and cathodic protection installation.',
        workersOnSite: 34,
        safetyRating: 'A',
        lastInspectionDate: '2026-10-26',
      },
    ],
    safetyInspections: [
      {
        id: 'insp_101',
        projectId: 'proj_01',
        projectName: 'Skyline Commercial Tower Phase II',
        inspectorName: 'David Reynolds, PE',
        location: 'Level 14 Perimeter Formwork Edge',
        conditions: 'Overcast, windy (28 km/h), active rebar installation',
        timestamp: '2026-10-24T14:30:00Z',
        overallRisk: 'high',
        summary: 'Inspection identified missing visible edge perimeter cables along the southern cantilevered slab and unsecured materials on scaffolding.',
        hazards: [
          {
            id: 'h_1',
            title: 'Inadequate Perimeter Edge Protection',
            severity: 'high',
            description: 'A 6-meter span of the level 14 outer perimeter slab lacks guardrail top rail and mid-rail systems.',
            evidence: 'Visible open drop exceeding 45 meters with no secondary static line or toe board present.',
            recommendedAction: 'Immediately halt perimeter works. Install OSHA-compliant 42-inch top rail with midrail and toe board before continuing deck activities.',
            priority: 'Immediate',
          },
          {
            id: 'h_2',
            title: 'Unsecured Rebar Bundles Near Leading Edge',
            severity: 'medium',
            description: 'Loose reinforcement steel bars stacked within 1 meter of slab edge without chocking or strapping.',
            evidence: 'Loose bundle of #6 deformed bars resting on unlevel plywood sheeting exposed to wind gusts.',
            recommendedAction: 'Relocate bundles at least 2 meters back from perimeter; bundle securely with certified steel strapping.',
            priority: 'High',
          },
        ],
        recommendations: [
          'Enforce 100% tie-off using self-retracting lifelines (SRLs) when working within 2 meters of the unshielded perimeter.',
          'Conduct immediate toolbox talk on fall protection before the morning shift on Level 14.',
        ],
        limitations: [
          'Visual analysis is limited to the uploaded vantage point. Sub-slab shoring was not evaluated in this frame.',
        ],
        isDemoMode: false,
      },
      {
        id: 'insp_102',
        projectId: 'proj_02',
        projectName: 'Meridian Logistics & Distribution Hub',
        inspectorName: 'Elena Rostova',
        location: 'Bay 4 Post-Tensioning Slab & Ducting',
        conditions: 'Indoor bay, artificial high-bay lighting, clear',
        timestamp: '2026-10-27T09:15:00Z',
        overallRisk: 'low',
        summary: 'Good safety compliance observed. Personnel equipped with class 2 high-vis vests, hard hats, and steel-toe boots.',
        hazards: [
          {
            id: 'h_3',
            title: 'Minor Cable Routing Over Walkway',
            severity: 'low',
            description: 'Temporary 110V power extension cord laid across primary foot traffic aisle without rubber cable ramp.',
            evidence: 'Yellow electrical cord crossing concrete corridor.',
            recommendedAction: 'Install heavy-duty rubber cable crossover protector or elevate cables above 2.4 meters.',
            priority: 'Medium',
          },
        ],
        recommendations: [
          'Maintain orderly housekeeping across post-tensioning anchor zones.',
        ],
        limitations: [
          'Electrical load capacity was not verified via visual inspection.',
        ],
        isDemoMode: false,
      },
    ],
    crackAnalyses: [
      {
        id: 'crack_01',
        projectId: 'proj_04',
        projectName: 'Westside Transit Overpass Rehabilitation',
        structureType: 'Reinforced Concrete Beam',
        buildingAge: '18 Years',
        crackLocation: 'Pier 3 Girder Web (45-degree angle from bearing)',
        approximateWidth: '0.8 mm - 1.2 mm',
        observedChanges: 'Width widened approximately 0.2 mm over previous winter cycle',
        crackType: 'Diagonal Shear Crack',
        severity: 'high',
        urgencyLevel: 'Urgent — Inspect within 48-72 Hours',
        visualFindings: 'Diagonal cracking initiating at bearing zone inclined at roughly 42 degrees traversing the beam web, typical of principal tensile stresses exceeding concrete tensile capacity.',
        possibleCauses: [
          'Shear stress concentration near support under increased live vehicular axle loading.',
          'Possible loss of prestress in internal parabolic tendons or localized anchor slip.',
          'Thermal cyclic deformation combined with stiff bearing pad degradation.',
        ],
        recommendedActions: [
          'Install vibrating wire crack displacement transducers (crackmeters) for continuous telemetry.',
          'Perform non-destructive Ultrasonic Pulse Velocity (UPV) to gauge internal depth and extent.',
          'Consult bridge structural engineer of record for carbon fiber reinforced polymer (CFRP) shear strengthening jacket design.',
        ],
        limitations: [
          'Assessment based purely on photograph. Structural capacity and rebar yield status cannot be determined without core sampling or detailed load rating.',
        ],
        isDemoMode: false,
      },
    ],
    valuations: [
      {
        id: 'val_01',
        propertyType: 'Commercial Office Space',
        location: 'Central Plaza, Tower 2, Floor 18',
        totalArea: 12500,
        builtUpArea: 10800,
        bedrooms: 0,
        bathrooms: 6,
        age: 3,
        constructionQuality: 'Grade A+ Corporate',
        condition: 'Excellent',
        amenities: 'LEED Gold Certified, 12 Dedicated Underground Parking, Fiber Dual-redundant, 24/7 Security, High-speed Elevators',
        estimatedValue: 6850000,
        estimatedValueRange: { low: 6400000, expected: 6850000, high: 7200000 },
        pricePerUnit: 548,
        currency: 'USD',
        keyFactors: [
          'High demand for prime Class A commercial space with ESG credentials.',
          'Proximity to rapid multimodal transit hub (under 200m).',
          'Modern MEP systems reducing operating expenditure by estimated 18%.',
        ],
        strengths: [
          'Superior structural acoustics and column-free floor plate.',
          'High parking ratio for downtown urban core.',
        ],
        limitations: [
          'Macro office leasing cycle and hybrid work patterns may affect tenant cap rates.',
        ],
        methodology: 'Direct comparative sales adjusted for Grade A corporate amenities + discounted cash flow capitalized yield model.',
        timestamp: '2026-10-25T11:00:00Z',
      },
    ],
    projectPlans: [
      {
        id: 'plan_01',
        projectId: 'proj_01',
        projectName: 'Skyline Commercial Tower Superstructure & Facade',
        projectType: 'Commercial High-Rise',
        plotArea: 35000,
        plannedBuiltUpArea: 480000,
        floors: 38,
        startDate: '2026-11-01',
        targetCompletionDate: '2027-10-30',
        totalBudget: 24000000,
        workers: 180,
        phases: [
          {
            id: 'ph_1',
            name: 'Substructure & Foundation Signoff',
            durationDays: 45,
            startDate: '2026-11-01',
            endDate: '2026-12-15',
            status: 'Completed',
            budget: 3500000,
            dependencies: 'Initial geotechnical excavation',
            tasks: [
              { id: 't_1', name: 'Pile integrity testing (PIT) on all 120 bored piles', durationDays: 14, status: 'Completed', assignee: 'GeoTech Labs', priority: 'High' },
              { id: 't_2', name: 'Raft slab monolithic pour (4,200 m³ C40 concrete)', durationDays: 20, status: 'Completed', assignee: 'Concrete Prime', priority: 'Critical' },
              { id: 't_3', name: 'Waterproofing membrane & French drainage backfill', durationDays: 11, status: 'Completed', assignee: 'HydroSeal Pro', priority: 'Medium' },
            ],
          },
          {
            id: 'ph_2',
            name: 'Tower Core & Superstructure Casting (L1-L24)',
            durationDays: 160,
            startDate: '2026-12-16',
            endDate: '2027-05-25',
            status: 'In Progress',
            budget: 9800000,
            dependencies: 'Substructure completion',
            tasks: [
              { id: 't_4', name: 'Self-climbing hydraulic core formwork system commissioning', durationDays: 15, status: 'In Progress', assignee: 'Doka Formwork', priority: 'High' },
              { id: 't_5', name: 'Post-tensioned suspended deck slab cycle (6-day target per floor)', durationDays: 120, status: 'Pending', assignee: 'Vanguard Civil', priority: 'Critical' },
              { id: 't_6', name: 'Structural steel outrigger truss fabrication & erection', durationDays: 25, status: 'Pending', assignee: 'Apex Steelworks', priority: 'High' },
            ],
          },
          {
            id: 'ph_3',
            name: 'Unitized Curtain Wall Facade & Glazing',
            durationDays: 110,
            startDate: '2027-04-10',
            endDate: '2027-07-29',
            status: 'Pending',
            budget: 6200000,
            dependencies: 'Level 12 superstructure clearance',
            tasks: [
              { id: 't_7', name: 'Anchor bracket survey & embedded channel alignment', durationDays: 20, status: 'Pending', assignee: 'GlassTech Facades', priority: 'High' },
              { id: 't_8', name: 'Low-E double insulated glass unit installation via monorail hoist', durationDays: 75, status: 'Pending', assignee: 'GlassTech Facades', priority: 'High' },
              { id: 't_9', name: 'Air-water infiltration field mock-up testing (ASTM E1105)', durationDays: 15, status: 'Pending', assignee: 'Intertek QC', priority: 'Critical' },
            ],
          },
          {
            id: 'ph_4',
            name: 'MEP Rough-in & Vertical Transportation',
            durationDays: 95,
            startDate: '2027-06-01',
            endDate: '2027-09-04',
            status: 'Pending',
            budget: 4500000,
            dependencies: 'Facade enclosure dried-in floors',
            tasks: [
              { id: 't_10', name: 'High-speed gearless passenger elevator guide rails installation', durationDays: 45, status: 'Pending', assignee: 'Otis Elevators', priority: 'High' },
              { id: 't_11', name: 'Primary HVAC risers, VAV distribution & BMS sensors', durationDays: 50, status: 'Pending', assignee: 'ThermalAir Systems', priority: 'Medium' },
            ],
          },
        ],
        milestones: [
          { title: 'Ground Floor Transfer Slab Complete', date: '2026-12-15', criteria: 'Full 28-day concrete cube compression strength verified > 45 MPa' },
          { title: 'Superstructure Mid-Height Milestone (L20)', date: '2027-03-30', criteria: 'Vertical plumbness laser survey within ±12mm tolerance' },
          { title: 'Tower Structural Topping Out (L38)', date: '2027-07-15', criteria: 'Crown parapet cast and final outrigger connection torqued' },
          { title: 'Envelope Weather-Tight Dried-In Certification', date: '2027-08-30', criteria: 'Zero water penetration under dynamic test pressure' },
        ],
        risks: [
          { risk: 'High wind velocity causing tower crane downtime on floors 25+', mitigation: 'Incorporate 12-day weather buffer; implement night-shift modular hoisting when wind slows', severity: 'High' },
          { risk: 'Post-tensioning cable strand supply supply-chain disruption', mitigation: 'Pre-order 100% tendon inventory with certified domestic mill test certificates', severity: 'Medium' },
          { risk: 'Concrete thermal gradient cracking in massive 1.8m transfer beams', mitigation: 'Low-heat pozzolanic cement blend with liquid nitrogen cooling and embedded thermocouple logging', severity: 'Critical' },
        ],
        materialConsiderations: [
          'High-performance C50/60 concrete mix with silica fume for columns to minimize cross-sectional footprint.',
          'Grade 60 (420 MPa) epoxy-coated rebar for all exposed perimeter cantilever balconies.',
          'Solar heat gain coefficient (SHGC) ≤ 0.25 for western and southern glazed facade units.',
        ],
      },
    ],
    chatHistory: [
      {
        id: 'msg_01',
        role: 'user',
        content: 'What are the critical pre-pour inspection checkpoints for a post-tensioned transfer slab in high-rise construction?',
        timestamp: '2026-10-28T08:00:00Z',
      },
      {
        id: 'msg_02',
        role: 'model',
        content: `### Pre-Pour Inspection Protocol: Post-Tensioned Transfer Slab

Before authorizing concrete placement for a critical transfer slab, verify these mandatory checkpoints (aligned with ACI 318 and PTI standards):

1. **Post-Tensioning Tendon Profile & Clearance**
   - High points, low points, and inflection points must match shop drawings within **±6 mm (1/4")** tolerance.
   - Tendon chairs must be rigid, non-corrosive, and tied securely to prevent flotation or displacement during heavy vibration.
   - Inspect ducting for kinks, tears, or concrete slurry intrusion points; tape all splices watertight.

2. **Bursting and Anchorage Reinforcement**
   - Confirm hairpin bursting spirals and supplementary anti-burst orthogonal rebar behind all live and dead anchorages.
   - Ensure minimum edge clearance and pocket former alignment per PTI anchor specification.

3. **Conduit and Penetration Zones**
   - Verify electrical conduit banks or sanitary sleeves do not pass within **300 mm** of high-stress anchorage zones.
   - Coordinate sleeve clearances so post-tensioning strands retain unobstructed parabolic profiles.

4. **Formwork Shore & Re-Shoring Verification**
   - Review multi-tier backshoring load calculations stamped by a licensed professional engineer (PE).
   - Ensure formwork camber matches deflection pre-camber values.

5. **Concrete Mix Submittal & Batching Plan**
   - Slump flow, water-cementitious ratio (w/cm ≤ 0.38), and retarder dosage adjusted for ambient site temperature.
   - Plan backup concrete pump truck and coordinate transit delivery tickets with maximum batch-to-pour window of 90 minutes.`,
        timestamp: '2026-10-28T08:00:15Z',
      },
    ],
    knowledgeBookmarks: ['kb_concrete_curing', 'kb_fall_protection', 'kb_pt_slabs'],
  };
}

function readDb(): DbSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDb();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, using initial:', err);
    return getInitialDb();
  }
}

function writeDb(data: DbSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// 1. Authentication
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const db = readDb();
  let user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user) {
    user = {
      id: `usr_${Date.now()}`,
      name: email ? email.split('@')[0] : 'Project Lead',
      email: email || 'contractor@buildmind.ai',
      company: 'General Contracting & Engineering',
      role: 'Project Manager',
      token: `token_${Date.now()}`,
    };
    db.users.push(user);
    writeDb(db);
  }
  return res.json({
    success: true,
    user,
    token: user.token,
    message: 'Authentication successful',
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, company, role } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const db = readDb();
  const newUser = {
    id: `usr_${Date.now()}`,
    name,
    email,
    company: company || 'Construction Services Ltd.',
    role: role || 'Site Inspector',
    token: `token_${Date.now()}`,
  };
  db.users.push(newUser);
  writeDb(db);
  return res.json({ success: true, user: newUser, token: newUser.token });
});

app.get('/api/auth/me', (_req: Request, res: Response) => {
  const db = readDb();
  const user = db.users[0] || {
    id: 'usr_guest',
    name: 'Guest Engineer',
    email: 'guest@buildmind.ai',
    company: 'BuildMind Engineering',
    role: 'Lead Estimator',
  };
  return res.json({ user });
});

// 2. Projects CRUD
app.get('/api/projects', (_req: Request, res: Response) => {
  const db = readDb();
  return res.json({ projects: db.projects });
});

app.get('/api/projects/:id', (req: Request, res: Response) => {
  const db = readDb();
  const project = db.projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  return res.json({ project });
});

app.post('/api/projects', (req: Request, res: Response) => {
  const db = readDb();
  const { name, code, projectType, location, budget, startDate, targetCompletionDate, description, manager } = req.body;

  if (!name || !projectType) {
    return res.status(400).json({ error: 'Project name and type are required' });
  }

  const newProj = {
    id: `proj_${Date.now()}`,
    name,
    code: code || `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
    projectType,
    location: location || 'Site TBD',
    budget: Number(budget) || 10000000,
    spent: 0,
    startDate: startDate || new Date().toISOString().split('T')[0],
    targetCompletionDate: targetCompletionDate || '2027-12-31',
    status: 'In Planning',
    progressPercentage: 0,
    manager: manager || 'David Reynolds, PE',
    description: description || 'New civil construction undertaking managed via BuildMind AI.',
    workersOnSite: 0,
    safetyRating: 'A',
    lastInspectionDate: new Date().toISOString().split('T')[0],
  };

  db.projects.unshift(newProj);
  writeDb(db);
  return res.status(201).json({ success: true, project: newProj });
});

app.put('/api/projects/:id', (req: Request, res: Response) => {
  const db = readDb();
  const index = db.projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  db.projects[index] = { ...db.projects[index], ...req.body, updatedAt: new Date().toISOString() };
  writeDb(db);
  return res.json({ success: true, project: db.projects[index] });
});

app.delete('/api/projects/:id', (req: Request, res: Response) => {
  const db = readDb();
  db.projects = db.projects.filter((p) => p.id !== req.params.id);
  writeDb(db);
  return res.json({ success: true, message: 'Project removed' });
});

// 3. Construction Site Safety Monitoring with Multimodal AI
app.get('/api/safety/history', (_req: Request, res: Response) => {
  const db = readDb();
  return res.json({ inspections: db.safetyInspections });
});

app.get('/api/safety/:id', (req: Request, res: Response) => {
  const db = readDb();
  const inspection = db.safetyInspections.find((i) => i.id === req.params.id);
  if (!inspection) return res.status(404).json({ error: 'Inspection report not found' });
  return res.json({ inspection });
});

app.post('/api/safety/analyze', async (req: Request, res: Response) => {
  try {
    const { projectId, projectName, location, conditions, notes, imageBase64, imageMimeType } = req.body;
    const db = readDb();
    const proj = db.projects.find((p) => p.id === projectId) || { name: projectName || 'General Site' };

    let analysisResult: any = null;
    let usedAi = false;

    if (aiClient && imageBase64) {
      try {
        // Strip data:image/...;base64, prefix if present
        let cleanBase64 = imageBase64;
        let mime = imageMimeType || 'image/jpeg';
        if (imageBase64.includes(';base64,')) {
          const parts = imageBase64.split(';base64,');
          mime = parts[0].replace('data:', '') || mime;
          cleanBase64 = parts[1];
        }

        const prompt = `You are a certified senior civil construction safety officer (CSP / OSHA Compliance Specialist).
Analyze this construction site photograph and the provided metadata:
- Project Name: ${proj.name}
- Location on Site: ${location || 'Unspecified'}
- Environmental Conditions: ${conditions || 'Normal'}
- Field Inspector Notes: ${notes || 'None provided'}

Inspect for visible potential hazards:
1. PPE compliance (hard hats, high-vis vests, eye protection, harness tie-offs, steel-toe boots).
2. Working at heights (scaffolding condition, guardrails, toe boards, open slab edges, ladder safety).
3. Housekeeping and slip/trip/fall hazards (loose rebar, timber with protruding nails, uneven decking).
4. Electrical safety (exposed live wiring, unprotected panel boxes, trailing cords across vehicular routes).
5. Material storage and crane/rigging proximity (unstable stacking, suspended load exclusion zones).
6. Excavation shoring or trench collapse hazards if earthworks visible.

CRITICAL INSTRUCTIONS:
- Clearly distinguish AI observations from confirmed hazards.
- Note visual uncertainty or occluded angles. Never claim a site is 100% safe solely because no hazards were detected in one photo.
- Return ONLY valid JSON conforming to the requested schema.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: mime,
                  data: cleanBase64,
                },
              },
              {
                text: prompt,
              },
            ],
          },
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                overallRisk: {
                  type: Type.STRING,
                  description: 'Overall risk category: low, medium, high, or critical',
                },
                summary: {
                  type: Type.STRING,
                  description: 'Concise executive summary of visible safety observations',
                },
                hazards: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      severity: { type: Type.STRING, description: 'low, medium, high, or critical' },
                      description: { type: Type.STRING },
                      evidence: { type: Type.STRING },
                      recommendedAction: { type: Type.STRING },
                      priority: { type: Type.STRING, description: 'Immediate, High, Medium, or Low' },
                    },
                    required: ['title', 'severity', 'description', 'evidence', 'recommendedAction'],
                  },
                },
                recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                limitations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['overallRisk', 'summary', 'hazards', 'recommendations', 'limitations'],
            },
          },
        });

        const textOutput = response.text;
        if (textOutput) {
          analysisResult = JSON.parse(textOutput);
          usedAi = true;
        }
      } catch (aiErr) {
        console.warn('Gemini multimodal safety analysis error:', aiErr);
      }
    }

    // High quality deterministic fallback / demo-labeled mode if API unavailable or key missing
    if (!analysisResult) {
      analysisResult = {
        overallRisk: 'medium',
        summary: 'Demo/Synthetic Mode Analysis: Potential perimeter housekeeping and temporary guardrail clearance issues identified based on typical floor deck conditions.',
        hazards: [
          {
            title: 'Leading Edge Clearance & Perimeter Barrier Continuity',
            severity: 'medium',
            description: 'Perimeter barrier requires physical pull-testing to confirm 200 lb lateral force resistance per OSHA standard.',
            evidence: 'Visual boundary near slab edge displays intermittent warning tape rather than continuous rigid steel top-rail.',
            recommendedAction: 'Erect standard 42-inch high dual-cable or rigid tubular guardrails prior to next deck phase.',
            priority: 'High',
          },
          {
            title: 'Housekeeping & Tripping Hazards in Gangway',
            severity: 'low',
            description: 'Scattered tie-wire coils, timber formwork offcuts, and PVC conduits encroaching upon pedestrian pathway.',
            evidence: 'Multiple unorganized material stacks within active walking surface.',
            recommendedAction: 'Institute mandatory end-of-shift 30-minute clean sweep; position designated scrap disposal bins at stairwell exits.',
            priority: 'Medium',
          },
        ],
        recommendations: [
          'Verify daily pre-task hazard safety assessment (JHA) is signed by all subcontractors working on this elevation.',
          'Ensure all personnel at heights above 1.8m (6 ft) wear inspected full-body harnesses with self-retracting lifelines.',
        ],
        limitations: [
          'Generated in Demonstration Mode (Live Gemini Key not configured or image format was not sent). Visual certainty is simulated.',
        ],
      };
    }

    const newRecord = {
      id: `insp_${Date.now()}`,
      projectId: projectId || 'proj_01',
      projectName: proj.name,
      inspectorName: req.body.inspectorName || 'David Reynolds, PE',
      location: location || 'Active Deck Section',
      conditions: conditions || 'Clear weather, dry slab',
      notes: notes || '',
      timestamp: new Date().toISOString(),
      overallRisk: (analysisResult.overallRisk || 'medium').toLowerCase(),
      summary: analysisResult.summary,
      hazards: (analysisResult.hazards || []).map((h: any, idx: number) => ({
        id: `h_${Date.now()}_${idx}`,
        title: h.title || 'Observed Site Hazard',
        severity: (h.severity || 'medium').toLowerCase(),
        description: h.description || '',
        evidence: h.evidence || '',
        recommendedAction: h.recommendedAction || '',
        priority: h.priority || 'Medium',
      })),
      recommendations: analysisResult.recommendations || [],
      limitations: analysisResult.limitations || [],
      isDemoMode: !usedAi,
      imageUrl: imageBase64 ? imageBase64.slice(0, 100) + '...' : undefined,
      hasImage: !!imageBase64,
    };

    db.safetyInspections.unshift(newRecord);
    writeDb(db);

    return res.json({
      success: true,
      analysis: newRecord,
      usedAi,
      message: usedAi ? 'Multimodal AI safety analysis complete' : 'Analysis complete (Demonstration Mode)',
    });
  } catch (error: any) {
    console.error('Safety analyze route error:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze safety conditions' });
  }
});

// 4. Crack Detection and Analysis with Multimodal AI
app.get('/api/cracks/history', (_req: Request, res: Response) => {
  const db = readDb();
  return res.json({ records: db.crackAnalyses });
});

app.get('/api/cracks/:id', (req: Request, res: Response) => {
  const db = readDb();
  const record = db.crackAnalyses.find((c) => c.id === req.params.id);
  if (!record) return res.status(404).json({ error: 'Crack analysis record not found' });
  return res.json({ record });
});

app.post('/api/cracks/analyze', async (req: Request, res: Response) => {
  try {
    const {
      projectId,
      structureType,
      buildingAge,
      approximateWidth,
      crackLocation,
      observedChanges,
      notes,
      imageBase64,
      imageMimeType,
    } = req.body;

    const db = readDb();
    const proj = db.projects.find((p) => p.id === projectId) || { name: 'General Structural Asset' };

    let analysisResult: any = null;
    let usedAi = false;

    if (aiClient && imageBase64) {
      try {
        let cleanBase64 = imageBase64;
        let mime = imageMimeType || 'image/jpeg';
        if (imageBase64.includes(';base64,')) {
          const parts = imageBase64.split(';base64,');
          mime = parts[0].replace('data:', '') || mime;
          cleanBase64 = parts[1];
        }

        const prompt = `You are a licensed forensic structural engineer specializing in reinforced concrete diagnostics and building pathology (ACI 224.1R guidelines).
Analyze this uploaded photograph of a structural element and the metadata:
- Structure Type: ${structureType || 'Concrete Element'}
- Building / Structure Age: ${buildingAge || 'Unknown'}
- Field-estimated Crack Width: ${approximateWidth || 'Uncalibrated'}
- Location: ${crackLocation || 'Visible Face'}
- History / Changes over time: ${observedChanges || 'None noted'}
- Inspector notes: ${notes || 'None'}

Your evaluation must cover:
1. Crack pattern identification (e.g. diagonal shear, vertical flexural, plastic shrinkage, map/crazing, settlement, corrosion-induced spalling).
2. Location & orientation within the structural geometry.
3. Severity classification (low, moderate, high, or critical).
4. Potential root causes / contributing factors (tensile stresses, rebar corrosion, foundation differential settlement, freeze-thaw cycles, overload).
5. Recommended engineering next steps (NDT testing, crack monitoring gauges, structural shoring, epoxy injection, carbon fiber reinforcement).
6. Urgency level for formal on-site structural engineer stamp inspection.

IMPORTANT CONSTRAINTS:
- Do NOT invent millimeter-precise measurements from an uncalibrated 2D photo.
- Do NOT claim the photo alone proves overall structural safety or definitive root cause.
- Return ONLY valid JSON adhering to the schema.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: mime,
                  data: cleanBase64,
                },
              },
              {
                text: prompt,
              },
            ],
          },
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                crackType: { type: Type.STRING },
                severity: { type: Type.STRING, description: 'low, moderate, high, or critical' },
                urgencyLevel: { type: Type.STRING },
                visualFindings: { type: Type.STRING },
                possibleCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                limitations: { type: Type.ARRAY, items: { type: Type.STRING } },
                annotationCoordinates: {
                  type: Type.OBJECT,
                  description: 'Estimated normalized bounding box of main crack in percent (0-100)',
                  properties: {
                    x: { type: Type.NUMBER },
                    y: { type: Type.NUMBER },
                    width: { type: Type.NUMBER },
                    height: { type: Type.NUMBER },
                  },
                },
              },
              required: ['crackType', 'severity', 'urgencyLevel', 'visualFindings', 'possibleCauses', 'recommendedActions', 'limitations'],
            },
          },
        });

        const textOutput = response.text;
        if (textOutput) {
          analysisResult = JSON.parse(textOutput);
          usedAi = true;
        }
      } catch (aiErr) {
        console.warn('Gemini crack analysis error:', aiErr);
      }
    }

    if (!analysisResult) {
      analysisResult = {
        crackType: 'Structural Flexural / Drying Shrinkage Combination Crack',
        severity: 'moderate',
        urgencyLevel: 'Inspection Recommended within 7-14 Days',
        visualFindings: 'Linear discontinuity oriented along the lower third of the concrete member. Crack edges appear sharp with minimal carbonation discoloration, suggesting relatively recent active stress relief or thermal micro-movement.',
        possibleCauses: [
          'Restrained drying shrinkage exacerbated by rapid curing moisture loss.',
          'Tensile strain exceeding concrete tensile modulus under cyclic service live loads.',
          'Inadequate secondary distribution reinforcement or high temperature gradient differential.',
        ],
        recommendedActions: [
          'Install Avongard acrylic tell-tale crack width monitor to log 30-day thermal displacement cycle.',
          'Execute non-destructive covermeter scan to check concrete rebar depth and potential cover spalling.',
          'If crack width stabilizes < 0.3 mm, seal with low-viscosity structural epoxy injection (ASTM C881 Type I/II).',
        ],
        limitations: [
          'Generated in Demonstration Mode. Visual assessment cannot replace cores, petrographic examination, or PE-stamped structural analysis.',
        ],
        annotationCoordinates: {
          x: 25,
          y: 35,
          width: 50,
          height: 30,
        },
      };
    }

    const newRecord = {
      id: `crack_${Date.now()}`,
      projectId: projectId || 'proj_01',
      projectName: proj.name,
      structureType: structureType || 'Concrete Wall',
      buildingAge: buildingAge || '10 Years',
      approximateWidth: approximateWidth || '0.5 mm',
      crackLocation: crackLocation || 'Main Elevation',
      observedChanges: observedChanges || 'Stable',
      timestamp: new Date().toISOString(),
      crackType: analysisResult.crackType,
      severity: (analysisResult.severity || 'moderate').toLowerCase(),
      urgencyLevel: analysisResult.urgencyLevel,
      visualFindings: analysisResult.visualFindings,
      possibleCauses: analysisResult.possibleCauses || [],
      recommendedActions: analysisResult.recommendedActions || [],
      limitations: analysisResult.limitations || [],
      annotationCoordinates: analysisResult.annotationCoordinates || { x: 30, y: 30, width: 40, height: 40 },
      isDemoMode: !usedAi,
      hasImage: !!imageBase64,
    };

    db.crackAnalyses.unshift(newRecord);
    writeDb(db);

    return res.json({
      success: true,
      analysis: newRecord,
      usedAi,
      message: usedAi ? 'Multimodal AI crack diagnostics complete' : 'Crack assessment complete (Demo Mode)',
    });
  } catch (error: any) {
    console.error('Crack analyze route error:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze crack structure' });
  }
});

// 5. Real Estate Valuation
app.get('/api/valuation/history', (_req: Request, res: Response) => {
  const db = readDb();
  return res.json({ valuations: db.valuations });
});

app.post('/api/valuation/estimate', async (req: Request, res: Response) => {
  try {
    const {
      propertyType,
      location,
      totalArea,
      builtUpArea,
      bedrooms,
      bathrooms,
      age,
      constructionQuality,
      condition,
      floorNumber,
      amenities,
      parkingAvailability,
      nearbyFacilities,
    } = req.body;

    const area = Number(totalArea) || 2000;
    const builtArea = Number(builtUpArea) || area * 0.85;

    // Base rates per sq ft depending on quality and type
    let baseRate = 320;
    if (constructionQuality === 'Grade A+ Corporate' || constructionQuality === 'Ultra Luxury') baseRate = 580;
    else if (constructionQuality === 'Premium Architectural') baseRate = 450;
    else if (constructionQuality === 'Standard Commercial / Residential') baseRate = 290;
    else if (constructionQuality === 'Economy / Basic') baseRate = 210;

    // Adjust for condition and age
    const ageNum = Number(age) || 5;
    const depreciationMultiplier = Math.max(0.7, 1 - ageNum * 0.012);
    let conditionMultiplier = 1.0;
    if (condition === 'Brand New / Pristine') conditionMultiplier = 1.15;
    else if (condition === 'Excellent') conditionMultiplier = 1.08;
    else if (condition === 'Good') conditionMultiplier = 1.0;
    else if (condition === 'Fair / Needs Modernization') conditionMultiplier = 0.88;
    else if (condition === 'Poor') conditionMultiplier = 0.75;

    const calculatedRate = Math.round(baseRate * depreciationMultiplier * conditionMultiplier);
    const expectedValue = Math.round(builtArea * calculatedRate);
    const lowValue = Math.round(expectedValue * 0.92);
    const highValue = Math.round(expectedValue * 1.08);

    let aiReasoning: any = null;
    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are an expert certified commercial and residential real estate appraiser (MAI / RICS).
Evaluate this property and provide institutional-grade qualitative appraisal commentary:
- Property Type: ${propertyType}
- Location: ${location}
- Total Area: ${area} sq ft, Built-up: ${builtArea} sq ft
- Construction Quality: ${constructionQuality}
- Age: ${ageNum} years
- Condition: ${condition}
- Floor: ${floorNumber || 'Mid-rise'}
- Amenities: ${amenities || 'Standard fixtures'}
- Parking: ${parkingAvailability || 'Standard parking'}
- Nearby Facilities: ${nearbyFacilities || 'Transit and commercial nodes'}
- Benchmark Expected Valuation: $${expectedValue.toLocaleString()} ($${calculatedRate}/sq ft)

Provide structured analysis in JSON:
{
  "keyFactors": ["factor 1", "factor 2", "factor 3"],
  "strengths": ["strength 1", "strength 2"],
  "limitations": ["limitation 1", "limitation 2"],
  "methodology": "Brief appraisal methodology explanation"
}`,
          config: {
            responseMimeType: 'application/json',
          },
        });
        if (response.text) {
          aiReasoning = JSON.parse(response.text);
        }
      } catch (err) {
        console.warn('Valuation AI commentary error:', err);
      }
    }

    const valuationRecord = {
      id: `val_${Date.now()}`,
      propertyType: propertyType || 'Residential Apartment',
      location: location || 'Metropolitan Core',
      totalArea: area,
      builtUpArea: builtArea,
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      age: ageNum,
      constructionQuality: constructionQuality || 'Standard Commercial',
      condition: condition || 'Good',
      amenities: amenities || 'Standard',
      estimatedValue: expectedValue,
      estimatedValueRange: { low: lowValue, expected: expectedValue, high: highValue },
      pricePerUnit: calculatedRate,
      currency: 'USD',
      keyFactors: aiReasoning?.keyFactors || [
        `Base replacement cost indexed at $${calculatedRate}/sq ft for ${constructionQuality}.`,
        `Location index reflecting transit accessibility and commercial vibrancy in ${location}.`,
        `Age depreciation model calibrated for ${ageNum} years with ${condition} maintenance factor.`,
      ],
      strengths: aiReasoning?.strengths || [
        'Efficient net-to-gross built-up area efficiency ratio (> 85%).',
        'Competitive capital value positioning relative to newer metropolitan submarkets.',
      ],
      limitations: aiReasoning?.limitations || [
        'Indicative automated valuation model (AVM) estimate only. Does not replace a formal RICS/MAI on-site appraisal.',
        'Market liquidity and interest rate fluctuations can shift actual transaction cap rates.',
      ],
      methodology:
        aiReasoning?.methodology ||
        'Hybrid Hedonic Sales Comparison Approach combined with Depreciated Replacement Cost (DRC) framework.',
      timestamp: new Date().toISOString(),
    };

    const db = readDb();
    db.valuations.unshift(valuationRecord);
    writeDb(db);

    return res.json({ success: true, valuation: valuationRecord });
  } catch (err: any) {
    console.error('Valuation error:', err);
    return res.status(500).json({ error: err.message || 'Failed to calculate property valuation' });
  }
});

// 6. Construction Project Planner with AI
app.get('/api/planner/:id', (req: Request, res: Response) => {
  const db = readDb();
  const plan = db.projectPlans.find((p) => p.id === req.params.id);
  if (!plan) return res.status(404).json({ error: 'Project plan not found' });
  return res.json({ plan });
});

app.post('/api/planner/generate', async (req: Request, res: Response) => {
  try {
    const {
      projectName,
      projectType,
      projectLocation,
      plotArea,
      plannedBuiltUpArea,
      floors,
      startDate,
      targetCompletionDate,
      totalBudget,
      workers,
      materialPreferences,
      requirements,
    } = req.body;

    const budgetNum = Number(totalBudget) || 15000000;
    const workerNum = Number(workers) || 75;
    const floorNum = Number(floors) || 8;

    let aiPlan: any = null;
    let usedAi = false;

    if (aiClient) {
      try {
        const prompt = `You are a certified Principal Construction Project Director and Master Scheduler (PMP / PSP).
Develop a professional, structured preliminary construction execution plan:
- Project Name: ${projectName}
- Type: ${projectType}
- Location: ${projectLocation}
- Plot Area: ${plotArea} sq ft
- Planned Built-up: ${plannedBuiltUpArea} sq ft
- Total Floors: ${floorNum}
- Project Start: ${startDate || '2026-12-01'}
- Target Completion: ${targetCompletionDate || '2028-02-28'}
- Total Budget: $${budgetNum.toLocaleString()}
- Workforce Peak: ${workerNum} personnel
- Material Preferences: ${materialPreferences || 'Standard reinforced concrete and steel'}
- Specific Constraints: ${requirements || 'High urban density constraints'}

Generate a structured plan in JSON with:
1. "phases": array of 4 to 5 major phases (e.g. Substructure & Earthworks, Superstructure & Structural Framing, Building Envelope & Facade, MEP & Internal Fit-out, Commissioning & Handover).
   Each phase must have: id, name, durationDays, startDate, endDate, status ("Pending" or "In Progress"), budget (number), dependencies, and 3 specific realistic "tasks" (each with id, name, durationDays, status, assignee, priority).
2. "milestones": array of 4 key milestones with title, date, and verifiable acceptance criteria.
3. "risks": array of 3 critical risks with title/risk, mitigation, and severity.
4. "materialConsiderations": array of 3 engineering material recommendations.

Ensure realistic phase budgeting adding up approximately to $${budgetNum}. Return ONLY JSON.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          aiPlan = JSON.parse(response.text);
          usedAi = true;
        }
      } catch (err) {
        console.warn('Planner AI generation error:', err);
      }
    }

    if (!aiPlan || !aiPlan.phases) {
      // Deterministic engineering fallback
      aiPlan = {
        phases: [
          {
            id: `ph_${Date.now()}_1`,
            name: 'Phase 1: Civil Earthworks & Foundation Mat',
            durationDays: 75,
            startDate: startDate || '2026-11-01',
            endDate: '2027-01-15',
            status: 'Pending',
            budget: Math.round(budgetNum * 0.18),
            dependencies: 'Site mobilization and permit issuance',
            tasks: [
              { id: 't_1', name: 'Bulk excavation and secant pile shoring wall installation', durationDays: 30, status: 'Pending', assignee: 'EarthTech Solutions', priority: 'High' },
              { id: 't_2', name: 'Deep foundation piling and sonic integrity testing', durationDays: 25, status: 'Pending', assignee: 'Apex Geotech', priority: 'Critical' },
              { id: 't_3', name: 'Monolithic reinforced concrete raft slab casting', durationDays: 20, status: 'Pending', assignee: 'Vanguard Civil', priority: 'Critical' },
            ],
          },
          {
            id: `ph_${Date.now()}_2`,
            name: 'Phase 2: Superstructure Framing & Shear Walls',
            durationDays: 140,
            startDate: '2027-01-16',
            endDate: '2027-06-05',
            status: 'Pending',
            budget: Math.round(budgetNum * 0.42),
            dependencies: 'Foundation curing certificate',
            tasks: [
              { id: 't_4', name: 'Vertical columns and elevator shear core climbing formwork', durationDays: 45, status: 'Pending', assignee: 'Vanguard Civil', priority: 'High' },
              { id: 't_5', name: 'Post-tensioned elevated deck floor cycles', durationDays: 70, status: 'Pending', assignee: 'DeckPrime Systems', priority: 'Critical' },
              { id: 't_6', name: 'Structural steel crown framing & parapet anchorages', durationDays: 25, status: 'Pending', assignee: 'Titan Steelworks', priority: 'Medium' },
            ],
          },
          {
            id: `ph_${Date.now()}_3`,
            name: 'Phase 3: Building Enclosure & Weatherproofing',
            durationDays: 90,
            startDate: '2027-05-01',
            endDate: '2027-07-30',
            status: 'Pending',
            budget: Math.round(budgetNum * 0.22),
            dependencies: 'Superstructure floor 4 clearance',
            tasks: [
              { id: 't_7', name: 'Exterior insulated curtain wall unit erection', durationDays: 60, status: 'Pending', assignee: 'FacadeCraft', priority: 'High' },
              { id: 't_8', name: 'Roof elastomer waterproofing and insulation drainage membrane', durationDays: 30, status: 'Pending', assignee: 'HydroSeal Pro', priority: 'Critical' },
            ],
          },
          {
            id: `ph_${Date.now()}_4`,
            name: 'Phase 4: MEP Rough-in, Finishes & Commissioning',
            durationDays: 110,
            startDate: '2027-07-01',
            endDate: '2027-10-19',
            status: 'Pending',
            budget: Math.round(budgetNum * 0.18),
            dependencies: 'Building dried-in envelope signoff',
            tasks: [
              { id: 't_9', name: 'HVAC chilled water ductwork & BMS sensor commissioning', durationDays: 50, status: 'Pending', assignee: 'AeroMech Engineers', priority: 'High' },
              { id: 't_10', name: 'Life safety, fire sprinklers and emergency generator load testing', durationDays: 35, status: 'Pending', assignee: 'FireShield Technologies', priority: 'Critical' },
              { id: 't_11', name: 'Architectural finishes, flooring and final occupancy inspection', durationDays: 25, status: 'Pending', assignee: 'BuildCraft Interior', priority: 'Medium' },
            ],
          },
        ],
        milestones: [
          { title: 'Substructure Mat Signoff', date: '2027-01-15', criteria: '28-day cylinder compressive test verified > 40 MPa' },
          { title: 'Structural Topping Out', date: '2027-06-05', criteria: 'Highest structural beam anchored and inspected' },
          { title: 'Water-tight Dried-In Envelope', date: '2027-07-30', criteria: 'Zero water ingress under ASTM E1105 spray test' },
          { title: 'Certificate of Occupancy (CO)', date: '2027-10-19', criteria: 'All jurisdictional life-safety clearances approved' },
        ],
        risks: [
          { risk: 'Supply chain lead-time on specialized MEP switchgear', mitigation: 'Issue early-procurement PO with factory witness testing', severity: 'High' },
          { risk: 'Monsoon / heavy precipitation delaying earthworks', mitigation: 'Deploy dual redundant dewatering sump pumps with backup diesel generators', severity: 'Medium' },
          { risk: 'Congested urban delivery corridors', mitigation: 'Implement automated just-in-time delivery delivery slotting system', severity: 'Medium' },
        ],
        materialConsiderations: [
          'Specify low-carbon slag-blended concrete to meet corporate embodied carbon benchmarks.',
          'Double-glazed argon-filled insulated glass units for facade acoustic dampening.',
          'Zero-VOC primers and sealants for interior LEED environmental compliance.',
        ],
      };
    }

    const newPlan = {
      id: `plan_${Date.now()}`,
      projectName,
      projectType,
      projectLocation,
      plotArea: Number(plotArea) || 0,
      plannedBuiltUpArea: Number(plannedBuiltUpArea) || 0,
      floors: floorNum,
      startDate: startDate || new Date().toISOString().split('T')[0],
      targetCompletionDate: targetCompletionDate || '2028-06-30',
      totalBudget: budgetNum,
      workers: workerNum,
      phases: aiPlan.phases || [],
      milestones: aiPlan.milestones || [],
      risks: aiPlan.risks || [],
      materialConsiderations: aiPlan.materialConsiderations || [],
      createdAt: new Date().toISOString(),
      usedAi,
    };

    const db = readDb();
    db.projectPlans.unshift(newPlan);
    writeDb(db);

    return res.json({ success: true, plan: newPlan, usedAi });
  } catch (err: any) {
    console.error('Planner error:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate project plan' });
  }
});

// Update plan (tasks, budgets)
app.put('/api/planner/:id', (req: Request, res: Response) => {
  const db = readDb();
  const index = db.projectPlans.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Plan not found' });
  db.projectPlans[index] = { ...db.projectPlans[index], ...req.body, updatedAt: new Date().toISOString() };
  writeDb(db);
  return res.json({ success: true, plan: db.projectPlans[index] });
});

// 7. Daily Site Assistant Chat with Multimodal Project Context
app.get('/api/assistant/history', (_req: Request, res: Response) => {
  const db = readDb();
  return res.json({ messages: db.chatHistory });
});

app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  try {
    const { message, projectId, contextType } = req.body;
    if (!message) return res.status(400).json({ error: 'Message cannot be empty' });

    const db = readDb();
    const proj = db.projects.find((p) => p.id === projectId);
    const projectContext = proj
      ? `Active Project: ${proj.name} (${proj.projectType}), Location: ${proj.location}, Budget: $${proj.budget.toLocaleString()}, Status: ${proj.status}`
      : 'No specific project linked; answering as a general master civil engineer and construction advisor.';

    let reply = '';
    let usedAi = false;

    if (aiClient) {
      try {
        const systemPrompt = `You are the BuildMind AI Daily Site Assistant, a world-class professional civil engineer, structural diagnostics specialist, and construction superintendent advisor.
Current Project Context: ${projectContext}
Context Filter: ${contextType || 'General Site Guidance'}

Guidelines:
- Deliver precise, actionable, technically rigorous construction answers.
- Cite relevant standards where applicable (e.g. ACI, AISC, ASTM, OSHA 1926, Eurocode 2, IBC).
- Format using clean Markdown with clear headings, bullet points, checklists, or tabular breakdowns.
- Highlight safety and quality control precautions prominently.
- Clearly communicate uncertainty when site variables are unknown. Do not present unverified local regulatory requirements as authoritative.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction: systemPrompt,
          },
        });

        if (response.text) {
          reply = response.text;
          usedAi = true;
        }
      } catch (aiErr) {
        console.warn('AI Assistant error:', aiErr);
      }
    }

    if (!reply) {
      reply = `### Daily Site Guidance (Standard Engineering Protocol)

Regarding your inquiry: **"${message}"**

1. **Pre-requisite Verification**
   - Confirm all working drawings bear the "Issued for Construction" (IFC) stamp with the latest revision date.
   - Inspect environmental parameters: verify ambient temperature is within 5°C to 35°C (40°F to 95°F) for standard concrete placement and curing.

2. **Quality Control Checkpoints**
   - Retain laboratory test cylinders (1 set of 4 cylinders per 100 m³ of poured volume) for 7-day and 28-day ASTM C39 compression testing.
   - Maintain continuous wet hessian or curing membrane application for a minimum of 7 consecutive days.

3. **Safety Directive**
   - Review 100% PPE compliance for all trade contractors entering the work envelope.
   - Ensure clear 2-meter demarcation around all active crane swinging and staging perimeters.

*(Note: AI assistant is operating in resilient fallback mode. Connect a verified Gemini API key to activate live reasoning.)*`;
    }

    const userMsg = {
      id: `msg_${Date.now()}_u`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      projectId,
    };
    const modelMsg = {
      id: `msg_${Date.now()}_m`,
      role: 'model',
      content: reply,
      timestamp: new Date().toISOString(),
      projectId,
      usedAi,
    };

    db.chatHistory.push(userMsg, modelMsg);
    // Keep last 40 messages to avoid runaway file size
    if (db.chatHistory.length > 40) {
      db.chatHistory = db.chatHistory.slice(-40);
    }
    writeDb(db);

    return res.json({ success: true, reply: modelMsg, usedAi });
  } catch (err: any) {
    console.error('Assistant error:', err);
    return res.status(500).json({ error: err.message || 'Chat assistant encountered an error' });
  }
});

// 8. Weather-Aware Construction Advisory
app.post('/api/weather/advisory', async (req: Request, res: Response) => {
  const { location, plannedActivity, scheduledDate } = req.body;
  const loc = location || 'Metro Central Project Site';
  const activity = plannedActivity || 'Mass Concrete Pouring';

  // Realistic weather dataset based on season/location
  const weatherSnapshot = {
    location: loc,
    scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
    temperatureC: 22,
    temperatureF: 72,
    condition: 'Partly Cloudy',
    precipitationProbability: 18,
    windSpeedKmh: 19,
    humidityPercent: 54,
    uvIndex: 5,
    airQualityIndex: 'Good (AQI 38)',
  };

  let aiAdvisory: any = null;
  let usedAi = false;

  if (aiClient) {
    try {
      const prompt = `You are a Senior Construction Operations Meteorologist.
Evaluate the weather impact for:
- Planned Activity: ${activity}
- Location: ${loc}
- Forecast: ${weatherSnapshot.temperatureC}°C (${weatherSnapshot.temperatureF}°F), ${weatherSnapshot.condition}, Wind ${weatherSnapshot.windSpeedKmh} km/h, Rain probability ${weatherSnapshot.precipitationProbability}%, Humidity ${weatherSnapshot.humidityPercent}%.

Analyze suitability and return JSON:
{
  "suitability": "optimal" | "caution" | "restricted" | "hazardous",
  "summary": "1-2 sentence executive operational verdict",
  "keyRisks": ["Risk 1", "Risk 2"],
  "recommendedPrecautions": ["Precaution 1", "Precaution 2", "Precaution 3"],
  "bestTimeWindow": "e.g. 06:00 AM - 11:30 AM"
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        aiAdvisory = JSON.parse(response.text);
        usedAi = true;
      }
    } catch (err) {
      console.warn('Weather advisory AI error:', err);
    }
  }

  if (!aiAdvisory) {
    // Default engineering matrix for construction activities
    aiAdvisory = {
      suitability: 'optimal',
      summary: `Current atmospheric parameters for ${activity} in ${loc} are favorable with low precipitation risk (18%) and moderate wind velocity (19 km/h).`,
      keyRisks: [
        'Moderate wind speeds could slightly increase moisture evaporation on exposed fresh concrete slabs.',
        'Midday UV index 5 requires heat hydration monitoring for exterior surface placement.',
      ],
      recommendedPrecautions: [
        'Apply aliphatic curing compound immediately following final troweling to prevent plastic shrinkage cracks.',
        'Keep tarpaulins or curing blankets on standby at the batching station.',
        'Ensure worker hydration stations are stocked across all active deck zones.',
      ],
      bestTimeWindow: '06:30 AM to 01:00 PM (Prior to peak solar thermal index)',
    };
  }

  return res.json({
    success: true,
    weather: weatherSnapshot,
    advisory: aiAdvisory,
    usedAi,
  });
});

// 9. Construction Knowledge Base
const KNOWLEDGE_ARTICLES = [
  {
    id: 'kb_concrete_curing',
    title: 'High-Performance Concrete Curing Protocols & Thermal Cracking Mitigation',
    category: 'Concrete Technology',
    readingTime: '6 min',
    standards: 'ACI 308R / ASTM C309',
    summary: 'Best practices for temperature differentials (ΔT < 20°C) in mass foundations and continuous water-retaining curing regimes.',
    content: `### Curing High-Performance Concrete: Critical Parameters
Curing is the maintaining of a satisfactory moisture content and temperature in concrete during its early stages so that desired properties may develop.

#### 1. The Critical 7-Day Window
Hydration of Portland cement requires moisture and temperature. If relative humidity within the capillary pore network drops below 80%, cement hydration practically halts, permanently reducing compressive strength by up to 40% and drastically increasing permeability to chloride ion ingress.

#### 2. Mass Concrete Thermal Differential Control
When element dimensions exceed 1 meter, hydration heat cannot dissipate rapidly:
- **Maximum internal core temperature**: ≤ 70°C (158°F) to avoid Delayed Ettringite Formation (DEF).
- **Maximum differential**: The gradient between the core and the outer surface must not exceed **20°C (36°F)** to prevent severe tensile strain and thermal cracking.
- **Cooling strategies**: Substitute 25-40% ordinary Portland cement with fly ash (Class F) or blast furnace slag (GGBS); utilize chilled mix water or shaved ice batching.`,
    faqs: [
      {
        question: 'When can forms be safely stripped on suspended slabs?',
        answer: 'Formwork should only be stripped once companion field-cured cylinders confirm at least 70% of specified 28-day design strength (f\'c) and back-shoring is immediately installed.',
      },
      {
        question: 'What is plastic shrinkage cracking?',
        answer: 'Cracks formed when the surface rate of water evaporation exceeds the rate at which bleed water reaches the surface (typically > 1.0 kg/m²/h).',
      },
    ],
  },
  {
    id: 'kb_fall_protection',
    title: 'Leading-Edge Fall Arrest Systems & Scaffolding Anchorages',
    category: 'Construction Safety',
    readingTime: '5 min',
    standards: 'OSHA 1926.502 / EN 795',
    summary: 'Comprehensive analysis of static horizontal lifelines, personal fall arrest systems (PFAS), and daily scaffold tag protocols.',
    content: `### Leading-Edge Protection Standards
Falls remain the leading cause of fatalities in the construction industry ("Fatal Four").

#### 1. Hierarchy of Fall Protection
1. **Hazard Elimination**: Assemble parapets, edge protection, or mechanical ducting on ground grade before crane hoisting.
2. **Passive Fall Protection**: 42-inch (±3 in) top rail, 21-inch midrail, and 3.5-inch toe boards capable of withstanding a 200-pound downward or outward load.
3. **Fall Restraint**: Tethering workers so their center of gravity cannot physically cross the fall hazard boundary.
4. **Personal Fall Arrest System (PFAS)**: Anchorage points must support at least 5,000 lbs (22.2 kN) per attached employee or be designed by a qualified person as part of a complete engineered system with a safety factor of 2.

#### 2. Self-Retracting Lifelines (SRL-LE)
When working near an abrasive concrete edge, standard webbing lanyards are prohibited. Leading Edge certified units (Class 2 / SRL-LE) utilize steel aircraft cable and integrated energy dissipators at the harness attachment.`,
    faqs: [
      {
        question: 'What is the maximum allowable free-fall distance in OSHA fall arrest?',
        answer: 'A PFAS must limit maximum arresting force to 1,800 lbs and prevent free fall of more than 6 feet (1.8 m) before deceleration engagement.',
      },
    ],
  },
  {
    id: 'kb_pt_slabs',
    title: 'Post-Tensioned (PT) Concrete Slabs: Jacking Safety & Grouting Quality',
    category: 'Structural Engineering Basics',
    readingTime: '7 min',
    standards: 'PTI DC10.5 / ACI 318-19',
    summary: 'Tendon elongation tolerance calculations, hydraulic jack calibration, and vacuum grouting protocols to prevent strand corrosion.',
    content: `### Post-Tensioned Slabs: Key Principles
Post-tensioning introduces active compressive stresses to counteract tensile forces from dead and live loads, allowing thinner slab depths, longer column spans, and reduced deflection.

#### 1. Elongation Measurement Verification
During multi-strand or unbonded monostrand jacking:
- Compare measured jack piston elongation against theoretical computer design calculations.
- **Permissible deviation**: Measured elongation must match theoretical within **±7%** for individual tendons or ±5% for the tendon group average.
- If elongation is out of tolerance: **Do not cut tendon tails**. Investigate tendon profile friction, jack gauge calibration, or wedge seating losses.

#### 2. Grouting Protocol for Bonded Systems
Grouting protects high-strength seven-wire steel strands from moisture and chemical attack:
- Utilize thixotropic non-shrink grout conforming to ASTM C1107.
- Bleed water must be zero percent after 24 hours under Wick-Induced Bleed tests.`,
    faqs: [
      {
        question: 'Why must tendon tails remain uncut until engineer signoff?',
        answer: 'If elongation verification shows under-stressing or wedge slip, re-gripping and remedial tensioning can only occur if the tendon strand tail remains intact.',
      },
    ],
  },
  {
    id: 'kb_soil_bearing',
    title: 'Geotechnical Soil Bearing Capacity & Deep Foundation Inspection',
    category: 'Civil Engineering Fundamentals',
    readingTime: '8 min',
    standards: 'ASTM D1143 / D1586 / IBC Chapter 18',
    summary: 'Standard Penetration Testing (SPT), rock socket verification in drilled shafts, and dewatering groundwater impact.',
    content: `### Subsurface Geotechnical Diagnostics
Foundations transfer the total structural load safely into the underlying soil or bedrock strata without exceeding allowable bearing capacity or inducing differential settlement.

#### 1. Standard Penetration Test (SPT) N-Value
The N-value (blow counts per 300 mm penetration of split-barrel sampler under 63.5 kg hammer dropped 760 mm) provides empirical correlation to:
- Relative density of cohesionless sands and gravels.
- Undrained shear strength (Su) of cohesive clays.

#### 2. Drilled Shaft Rock Socket Verification
When founding heavy high-rise towers on bedrock:
- Inspect drill tailings and obtain continuous rock core samples (RQD > 75%) to confirm sound limestone, granite, or competent shale strata before concrete tremie pouring.`,
    faqs: [
      {
        question: 'What is differential settlement?',
        answer: 'Unequal downward settlement between different foundation points of a single structure, creating angular distortion that induces severe secondary cracking and beam shear.',
      },
    ],
  },
];

app.get('/api/knowledge', (_req: Request, res: Response) => {
  return res.json({ articles: KNOWLEDGE_ARTICLES });
});

app.post('/api/knowledge/ask', async (req: Request, res: Response) => {
  const { question, category } = req.body;
  if (!question) return res.status(400).json({ error: 'Question required' });

  let answer = '';
  let usedAi = false;

  if (aiClient) {
    try {
      const prompt = `You are a licensed Master Civil & Structural Engineering Knowledge Specialist.
Category: ${category || 'Civil Engineering'}
Question: ${question}

Provide an authoritative, clear engineering answer referencing standard codes (ACI, ASTM, AISC, OSHA, IBC, or Eurocodes where relevant). Include practical on-site recommendations and any safety caveats.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      if (response.text) {
        answer = response.text;
        usedAi = true;
      }
    } catch (err) {
      console.warn('Knowledge ask AI error:', err);
    }
  }

  if (!answer) {
    answer = `### Engineering Knowledge Response: ${question}

**Standard Engineering Assessment:**
1. **Applicable Codes & Precedents**: Consult the primary jurisdiction building code (IBC 2024 / ACI 318-19 / AISC 360).
2. **Quality & Structural Implications**: Verify material compliance via mill test certificates and third-party laboratory verification.
3. **Field Recommendation**: Before executing on-site modifications, submit an official Request for Information (RFI) to the Structural Engineer of Record (SEOR).`;
  }

  return res.json({ success: true, answer, usedAi });
});

// 10. Dashboard Summary & Activity
app.get('/api/dashboard/summary', (_req: Request, res: Response) => {
  const db = readDb();
  const totalProjects = db.projects.length;
  const activeProjects = db.projects.filter((p) => p.status === 'Active').length;
  const safetyInspections = db.safetyInspections.length;
  const crackAnalyses = db.crackAnalyses.length;
  const projectPlans = db.projectPlans.length;

  const totalBudget = db.projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalSpent = db.projects.reduce((acc, p) => acc + (p.spent || 0), 0);

  return res.json({
    totalProjects,
    activeProjects,
    safetyInspections,
    crackAnalyses,
    projectPlans,
    pendingTasks: 18,
    totalBudget,
    totalSpent,
    overallSafetyScore: '98.2%',
    activeWorkersTotal: db.projects.reduce((acc, p) => acc + (p.workersOnSite || 0), 0),
  });
});

app.get('/api/dashboard/activity', (_req: Request, res: Response) => {
  const db = readDb();
  const recentActivities: any[] = [];

  db.safetyInspections.slice(0, 3).forEach((i) => {
    recentActivities.push({
      id: i.id,
      type: 'Safety Inspection',
      title: `${i.projectName} - ${i.location}`,
      subtitle: `Overall Risk: ${i.overallRisk.toUpperCase()} (${i.hazards?.length || 0} hazards identified)`,
      timestamp: i.timestamp,
      badgeColor: i.overallRisk === 'high' || i.overallRisk === 'critical' ? 'danger' : i.overallRisk === 'medium' ? 'warning' : 'success',
    });
  });

  db.crackAnalyses.slice(0, 2).forEach((c) => {
    recentActivities.push({
      id: c.id,
      type: 'Crack Detection',
      title: `${c.structureType} - ${c.crackType}`,
      subtitle: `Severity: ${c.severity.toUpperCase()} · ${c.urgencyLevel}`,
      timestamp: c.timestamp,
      badgeColor: c.severity === 'high' || c.severity === 'critical' ? 'danger' : 'warning',
    });
  });

  db.projectPlans.slice(0, 2).forEach((p) => {
    recentActivities.push({
      id: p.id,
      type: 'Project Plan',
      title: p.projectName,
      subtitle: `${p.phases?.length || 0} Phases · $${(p.totalBudget || 0).toLocaleString()}`,
      timestamp: p.createdAt || new Date().toISOString(),
      badgeColor: 'primary',
    });
  });

  return res.json({ activities: recentActivities });
});

// -------------------------------------------------------------
// VITE SPA MIDDLEWARE / STATIC ASSETS
// -------------------------------------------------------------
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BuildMind AI Construction Platform server running at http://0.0.0.0:${PORT}`);
    console.log(`Multimodal Gemini AI: ${aiClient ? 'ACTIVE with key' : 'FALLBACK DEMO MODE (Add GEMINI_API_KEY in Secrets for live inference)'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
