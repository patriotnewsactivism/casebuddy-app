// Case Management Types
export interface Case {
  id: string;
  title: string;
  description: string;
  caseNumber?: string;
  jurisdiction: string;
  clientName: string;
  status: 'active' | 'pending' | 'closed' | 'appealed';
  dateOpened: string;
  lastUpdated: string;
  tags?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedAttorney?: string;
  courtName?: string;
  judge?: string;
  nextHearing?: string;
  statute?: string;
  damages?: string;
  summary?: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  date: string;
  title: string;
  description: string;
  type: 'filing' | 'hearing' | 'motion' | 'discovery' | 'settlement' | 'ruling' | 'appeal' | 'other';
  significance: 'low' | 'medium' | 'high' | 'critical';
  documents?: string[];
  notes?: string;
  outcome?: string;
}

export type DocType = "pdf" | "letter" | "transcript" | "image" | "audio" | "video" | "evidence";

export interface Doc {
  id: string;
  caseId: string;
  title: string;
  description?: string;
  type: DocType;
  filePath?: string;
  url?: string;
  size?: number;
  uploadDate: string;
  date?: string;
  tags?: string[];
  category?: string;
  confidential?: boolean;
  summary?: string;
}

export interface Evidence {
  id: string;
  caseId: string;
  title: string;
  type: 'photo' | 'video' | 'audio' | 'document' | 'physical' | 'digital';
  description: string;
  location?: string;
  dateCollected: string;
  collectedBy: string;
  filePath?: string;
  url?: string;
  tags?: string[];
  significance: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  chain_of_custody?: Array<{
    date: string;
    handler: string;
    action: string;
  }>;
}

export interface CaseNote {
  id: string;
  caseId: string;
  title: string;
  content: string;
  date: string;
  author: string;
  category: 'general' | 'strategy' | 'research' | 'client' | 'court' | 'discovery';
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
  confidential?: boolean;
}

export interface FOIARequest {
  id: string;
  caseId: string;
  agency: string;
  requestDate: string;
  description: string;
  status: 'submitted' | 'acknowledged' | 'processing' | 'partial' | 'completed' | 'denied' | 'appealed';
  responseDate?: string;
  documentsReceived?: number;
  estimatedCost?: number;
  actualCost?: number;
  notes?: string;
  trackingNumber?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  type: 'case' | 'document' | 'timeline' | 'evidence' | 'note' | 'foia';
  relevance: number;
  snippet: string;
  caseId?: string;
  date?: string;
  category?: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  subscriptionStatus?: 'free' | 'trial' | 'active' | 'cancelled' | 'expired';
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaseAnalytics {
  id: string;
  caseId: string;
  outcomeConfidence: number;
  riskFactors: string[];
  strengths: string[];
  recommendations: string[];
  similarCases: Array<{
    name: string;
    outcome: string;
    similarity: number;
    keyFactors: string[];
  }>;
  precedents: Array<{
    caseName: string;
    citation: string;
    relevance: number;
    keyHolding: string;
  }>;
  strategicInsights: string[];
  timeline: Array<{
    phase: string;
    estimatedDuration: string;
    keyActions: string[];
  }>;
}

export interface GeneratedBrief {
  title: string;
  sections: Array<{
    heading: string;
    content: string;
    citations?: string[];
  }>;
  tableOfContents: Array<{
    section: string;
    page: number;
  }>;
  wordCount: number;
  generatedAt: Date;
}

export interface BriefTemplate {
  id: string;
  name: string;
  type: 'motion' | 'complaint' | 'response' | 'appeal' | 'summary_judgment' | 'injunction';
  description: string;
  defaultSections: string[];
}