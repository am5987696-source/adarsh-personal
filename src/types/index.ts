export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  token?: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  projectType: string;
  location: string;
  budget: number;
  spent: number;
  startDate: string;
  targetCompletionDate: string;
  status: 'Active' | 'In Planning' | 'Completed' | 'On Hold';
  progressPercentage: number;
  manager: string;
  description: string;
  workersOnSite: number;
  safetyRating: string;
  lastInspectionDate: string;
}

export interface SafetyHazard {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: string;
  recommendedAction: string;
  priority: 'Immediate' | 'High' | 'Medium' | 'Low';
}

export interface SafetyInspection {
  id: string;
  projectId: string;
  projectName: string;
  inspectorName: string;
  location: string;
  conditions: string;
  notes?: string;
  timestamp: string;
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  hazards: SafetyHazard[];
  recommendations: string[];
  limitations: string[];
  isDemoMode?: boolean;
  hasImage?: boolean;
  imageUrl?: string;
}

export interface CrackAnalysis {
  id: string;
  projectId: string;
  projectName: string;
  structureType: string;
  buildingAge: string;
  approximateWidth: string;
  crackLocation: string;
  observedChanges: string;
  timestamp: string;
  crackType: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  urgencyLevel: string;
  visualFindings: string;
  possibleCauses: string[];
  recommendedActions: string[];
  limitations: string[];
  annotationCoordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isDemoMode?: boolean;
  hasImage?: boolean;
  imageUrl?: string;
}

export interface ValuationEstimate {
  id: string;
  propertyType: string;
  location: string;
  totalArea: number;
  builtUpArea: number;
  bedrooms: number;
  bathrooms: number;
  age: number;
  constructionQuality: string;
  condition: string;
  amenities: string;
  estimatedValue: number;
  estimatedValueRange: {
    low: number;
    expected: number;
    high: number;
  };
  pricePerUnit: number;
  currency: string;
  keyFactors: string[];
  strengths: string[];
  limitations: string[];
  methodology: string;
  timestamp: string;
}

export interface PlanTask {
  id: string;
  name: string;
  durationDays: number;
  status: 'Completed' | 'In Progress' | 'Pending';
  assignee: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface PlanPhase {
  id: string;
  name: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  budget: number;
  dependencies: string;
  tasks: PlanTask[];
}

export interface ProjectPlan {
  id: string;
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
  phases: PlanPhase[];
  milestones: Array<{ title: string; date: string; criteria: string }>;
  risks: Array<{ risk: string; mitigation: string; severity: string }>;
  materialConsiderations: string[];
  createdAt: string;
  usedAi?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  projectId?: string;
  usedAi?: boolean;
}

export interface WeatherAdvisory {
  weather: {
    location: string;
    scheduledDate: string;
    temperatureC: number;
    temperatureF: number;
    condition: string;
    precipitationProbability: number;
    windSpeedKmh: number;
    humidityPercent: number;
    uvIndex: number;
    airQualityIndex: string;
  };
  advisory: {
    suitability: 'optimal' | 'caution' | 'restricted' | 'hazardous';
    summary: string;
    keyRisks: string[];
    recommendedPrecautions: string[];
    bestTimeWindow: string;
  };
  usedAi?: boolean;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  readingTime: string;
  standards: string;
  summary: string;
  content: string;
  faqs: Array<{ question: string; answer: string }>;
}
