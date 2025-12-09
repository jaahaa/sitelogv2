export interface ManpowerEntry {
  id: string;
  trade: string;
  count: number;
  hours: number;
}

export interface MaterialEntry {
  id: string;
  item: string;
  quantity: string;
  unit: string;
}

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
}

export interface WeatherInfo {
  condition: string;
  temp: string;
}

export interface Report {
  id: string;
  projectName: string;
  projectNumber: string;
  clientName: string;
  foreman: string;
  propertyAddress: string;
  location?: string;
  date: string;
  status: 'draft' | 'completed';
  weather: WeatherInfo;
  manpower: ManpowerEntry[];
  checklist: ChecklistItem[];
  notes: string;
  incidents: string;
  summary: string;
  photos: File[]; 
  signature: string | null;
  lastModified?: number;
}

// Alias for compatibility if needed
export type ReportData = Report;

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  EDITOR = 'EDITOR',
  PREVIEW = 'PREVIEW'
}