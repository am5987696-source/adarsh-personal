import {
  User,
  Project,
  SafetyInspection,
  CrackAnalysis,
  ValuationEstimate,
  ProjectPlan,
  ChatMessage,
  WeatherAdvisory,
  KnowledgeArticle,
} from '../types';

const API_BASE = '/api';

export const api = {
  // Authentication
  async login(email?: string, password?: string): Promise<{ success: boolean; user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Failed to login');
    return res.json();
  },

  async register(name: string, email: string, company?: string, role?: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, company, role }),
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`);
    if (!res.ok) throw new Error('Failed to retrieve profile');
    return res.json();
  },

  // Projects
  async getProjects(): Promise<{ projects: Project[] }> {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async createProject(projectData: Partial<Project>): Promise<{ success: boolean; project: Project }> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async updateProject(id: string, projectData: Partial<Project>): Promise<{ success: boolean; project: Project }> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  },

  async deleteProject(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
  },

  // Safety Monitoring
  async getSafetyHistory(): Promise<{ inspections: SafetyInspection[] }> {
    const res = await fetch(`${API_BASE}/safety/history`);
    if (!res.ok) throw new Error('Failed to fetch inspection history');
    return res.json();
  },

  async analyzeSafety(payload: {
    projectId: string;
    location: string;
    conditions: string;
    notes?: string;
    imageBase64?: string;
    imageMimeType?: string;
    inspectorName?: string;
  }): Promise<{ success: boolean; analysis: SafetyInspection; usedAi: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/safety/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Safety analysis failed');
    return res.json();
  },

  // Crack Detection
  async getCrackHistory(): Promise<{ records: CrackAnalysis[] }> {
    const res = await fetch(`${API_BASE}/cracks/history`);
    if (!res.ok) throw new Error('Failed to fetch crack analyses');
    return res.json();
  },

  async analyzeCrack(payload: {
    projectId: string;
    structureType: string;
    buildingAge: string;
    approximateWidth: string;
    crackLocation: string;
    observedChanges: string;
    notes?: string;
    imageBase64?: string;
    imageMimeType?: string;
  }): Promise<{ success: boolean; analysis: CrackAnalysis; usedAi: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/cracks/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Crack analysis failed');
    return res.json();
  },

  // Real Estate Valuation
  async getValuationHistory(): Promise<{ valuations: ValuationEstimate[] }> {
    const res = await fetch(`${API_BASE}/valuation/history`);
    if (!res.ok) throw new Error('Failed to fetch valuation history');
    return res.json();
  },

  async estimateValuation(payload: {
    propertyType: string;
    location: string;
    totalArea: number;
    builtUpArea: number;
    bedrooms: number;
    bathrooms: number;
    age: number;
    constructionQuality: string;
    condition: string;
    floorNumber?: string;
    amenities?: string;
    parkingAvailability?: string;
    nearbyFacilities?: string;
  }): Promise<{ success: boolean; valuation: ValuationEstimate }> {
    const res = await fetch(`${API_BASE}/valuation/estimate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Valuation calculation failed');
    return res.json();
  },

  // Project Planner
  async generateProjectPlan(payload: {
    projectName: string;
    projectType: string;
    projectLocation: string;
    plotArea: number;
    plannedBuiltUpArea: number;
    floors: number;
    startDate: string;
    targetCompletionDate: string;
    totalBudget: number;
    workers: number;
    materialPreferences?: string;
    requirements?: string;
  }): Promise<{ success: boolean; plan: ProjectPlan; usedAi: boolean }> {
    const res = await fetch(`${API_BASE}/planner/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to generate project plan');
    return res.json();
  },

  async updatePlan(id: string, planData: Partial<ProjectPlan>): Promise<{ success: boolean; plan: ProjectPlan }> {
    const res = await fetch(`${API_BASE}/planner/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planData),
    });
    if (!res.ok) throw new Error('Failed to update project plan');
    return res.json();
  },

  // Assistant Chat
  async getAssistantHistory(): Promise<{ messages: ChatMessage[] }> {
    const res = await fetch(`${API_BASE}/assistant/history`);
    if (!res.ok) throw new Error('Failed to fetch chat history');
    return res.json();
  },

  async sendAssistantMessage(payload: {
    message: string;
    projectId?: string;
    contextType?: string;
  }): Promise<{ success: boolean; reply: ChatMessage; usedAi: boolean }> {
    const res = await fetch(`${API_BASE}/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Assistant message failed');
    return res.json();
  },

  // Weather Advisory
  async getWeatherAdvisory(payload: {
    location: string;
    plannedActivity: string;
    scheduledDate?: string;
  }): Promise<WeatherAdvisory> {
    const res = await fetch(`${API_BASE}/weather/advisory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to get weather advisory');
    return res.json();
  },

  // Knowledge Base
  async getKnowledgeArticles(): Promise<{ articles: KnowledgeArticle[] }> {
    const res = await fetch(`${API_BASE}/knowledge`);
    if (!res.ok) throw new Error('Failed to load knowledge articles');
    return res.json();
  },

  async askKnowledgeQuestion(question: string, category?: string): Promise<{ success: boolean; answer: string; usedAi: boolean }> {
    const res = await fetch(`${API_BASE}/knowledge/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, category }),
    });
    if (!res.ok) throw new Error('Failed to answer knowledge inquiry');
    return res.json();
  },

  // Dashboard Summary & Activity
  async getDashboardSummary(): Promise<{
    totalProjects: number;
    activeProjects: number;
    safetyInspections: number;
    crackAnalyses: number;
    projectPlans: number;
    pendingTasks: number;
    totalBudget: number;
    totalSpent: number;
    overallSafetyScore: string;
    activeWorkersTotal: number;
  }> {
    const res = await fetch(`${API_BASE}/dashboard/summary`);
    if (!res.ok) throw new Error('Failed to load summary');
    return res.json();
  },

  async getDashboardActivity(): Promise<{
    activities: Array<{
      id: string;
      type: string;
      title: string;
      subtitle: string;
      timestamp: string;
      badgeColor: 'primary' | 'warning' | 'danger' | 'success';
    }>;
  }> {
    const res = await fetch(`${API_BASE}/dashboard/activity`);
    if (!res.ok) throw new Error('Failed to load activity');
    return res.json();
  },
};

// Preset sample photos encoded as lightweight realistic SVG data URLs for instant 1-click inspection testing
export const SAMPLE_CONSTRUCTION_IMAGES = [
  {
    id: 'sample_safety_perimeter',
    title: 'High-Rise Floor Deck Edge (Level 18)',
    type: 'safety',
    description: 'Slab edge with temporary warning bunting and rebar stacks',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%232b394e"/><rect y="240" width="600" height="160" fill="%23717d8f"/><polygon points="0,240 600,190 600,400 0,400" fill="%234a5568"/><line x1="0" y1="190" x2="600" y2="190" stroke="%23f59e0b" stroke-width="4" stroke-dasharray="8,8"/><rect x="80" y="160" width="12" height="80" fill="%23cbd5e1"/><rect x="280" y="140" width="12" height="100" fill="%23cbd5e1"/><rect x="480" y="120" width="12" height="120" fill="%23cbd5e1"/><line x1="80" y1="170" x2="480" y2="130" stroke="%23ef4444" stroke-width="3"/><rect x="180" y="270" width="160" height="30" fill="%2394a3b8"/><circle cx="210" cy="285" r="4" fill="%23334155"/><circle cx="250" cy="285" r="4" fill="%23334155"/><circle cx="290" cy="285" r="4" fill="%23334155"/><text x="20" y="40" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="16">SITE SURVEY VANTAGE: SLAB PERIMETER</text><text x="20" y="65" fill="%23f59e0b" font-family="sans-serif" font-size="12">LOCATION: LEVEL 18 SOUTH CANTILEVER</text></svg>`,
  },
  {
    id: 'sample_crack_beam',
    title: 'Shear Crack on Reinforced Concrete Girder',
    type: 'crack',
    description: '45-degree diagonal web shear crack near column bearing',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%2394a3b8"/><rect x="40" y="60" width="520" height="280" fill="%23cbd5e1" stroke="%2364748b" stroke-width="3"/><rect x="40" y="60" width="100" height="280" fill="%2364748b"/><path d="M 140 280 Q 220 220 280 150 T 360 90" fill="none" stroke="%231e293b" stroke-width="4.5" stroke-linecap="round"/><path d="M 280 150 Q 320 180 340 210" fill="none" stroke="%23334155" stroke-width="2.5"/><text x="60" y="40" fill="%230f172a" font-family="sans-serif" font-weight="bold" font-size="16">STRUCTURAL ELEMENT: RC TRANSFER GIRDER</text><text x="60" y="375" fill="%23475569" font-family="sans-serif" font-size="13">DIAGONAL CRACK INITIATION NEAR BEARING POINT</text></svg>`,
  },
  {
    id: 'sample_crack_wall',
    title: 'Basement Shear Wall Settlement Crack',
    type: 'crack',
    description: 'Vertical stepped crack propagating along mortar / concrete interface',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%2364748b"/><rect x="30" y="30" width="540" height="340" fill="%2394a3b8"/><path d="M 280 30 L 290 90 L 275 140 L 295 210 L 270 270 L 285 370" fill="none" stroke="%230f172a" stroke-width="3.5" stroke-linecap="round"/><text x="40" y="60" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="15">BASEMENT RETAINING SHEAR WALL</text><text x="40" y="85" fill="%23e2e8f0" font-family="sans-serif" font-size="12">SUBTERRANEAN NORTH ELEVATION</text></svg>`,
  },
];

// Utility: Export HTML Report as printable or PDF
export function triggerPrintReport(title: string, htmlContent: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - BuildMind AI Official Report</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #142B4A; line-height: 1.6; }
          h1 { color: #142B4A; border-bottom: 2px solid #F59E0B; padding-bottom: 8px; margin-bottom: 20px; font-size: 24px; }
          h2 { color: #1E3E66; font-size: 18px; margin-top: 24px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; }
          .header-meta { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 13px; }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 12px; text-transform: uppercase; }
          .badge-high { background: #FEE2E2; color: #991B1B; }
          .badge-medium { background: #FEF3C7; color: #92400E; }
          .badge-low { background: #DCFCE7; color: #166534; }
          .hazard-item { border-left: 3px solid #F59E0B; padding-left: 12px; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #CBD5E1; padding: 10px; text-align: left; font-size: 13px; }
          th { background: #F1F5F9; }
          .disclaimer { margin-top: 40px; padding: 12px; background: #FFFBEB; border: 1px solid #FDE68A; font-size: 11px; color: #92400E; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <div>
            <strong style="font-size:20px; color:#142B4A;">BuildMind AI</strong>
            <div style="font-size:12px; color:#64748B;">Multimodal Construction Intelligence Platform</div>
          </div>
          <div style="text-align:right; font-size:12px; color:#64748B;">
            Report Date: ${new Date().toLocaleDateString()}<br/>
            Ref ID: BMD-${Math.floor(100000 + Math.random() * 900000)}
          </div>
        </div>
        ${htmlContent}
        <div class="disclaimer">
          <strong>LEGAL & ENGINEERING DISCLAIMER:</strong> This AI-generated report is provided for preliminary intelligence, screening, and diagnostic tracking only. It does not replace a stamped inspection or certified evaluation by a licensed Professional Engineer (PE), Certified Safety Professional (CSP), or authorized municipal authority having jurisdiction.
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

// Utility: Export data to CSV
export function exportToCsv(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          let cell = row[header] ?? '';
          if (typeof cell === 'object') cell = JSON.stringify(cell);
          cell = String(cell).replace(/"/g, '""');
          return `"${cell}"`;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
