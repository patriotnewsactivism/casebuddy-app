// Case Intelligence Portal Data
// This file contains the case data structure and initial dataset

export type DocType = "pdf" | "image" | "audio" | "transcript" | "letter" | "other";

export type Doc = {
  id: string;
  title: string;
  type: DocType;
  date?: string | null;
  path?: string | null;
  summary?: string | null;
  tags?: string[] | null;
  sourceNote?: string | null;
};

export type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  summary?: string | null;
  docRefs?: string[] | null;
  tags?: string[] | null;
};

export type FoiaRequest = {
  id: string;
  agency: string;
  requestNumber?: string;
  status: "submitted" | "pending" | "completed" | "denied";
  submittedDate: string;
  responseDate?: string;
  description: string;
  responseSummary?: string;
  documentsReceived?: string[];
};

export type LegalIssue = {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  category: "constitutional" | "civil-rights" | "procedural" | "evidence";
};

// Case Documents Data
export const CASE_DOCUMENTS: Doc[] = [
  {
    id: "bill-image",
    title: "Bill of Information (Image)",
    type: "image",
    date: "2025-08-25",
    path: "/images/bill-of-information.jpg",
    summary: "Charging doc image referencing 41 C.F.R. § 102-74.390 (conduct on federal property).",
    tags: ["charging", "41 CFR 102-74.390", "magistrate"],
    sourceNote: "Uploaded JPEG of the front page of the Bill of Information.",
  },
  {
    id: "june-transcripts",
    title: "June 23 & 26, 2025 – Courthouse interactions (transcript)",
    type: "transcript",
    date: "2025-06-23",
    path: "/docs/6-23 and 26.pdf",
    summary: "Cleaned dialogue from lobby exchanges; discussion of First Amendment, identification, and supervision.",
    tags: ["transcript", "courthouse", "First Amendment"],
    sourceNote: "From file: 6-23 and 26.pdf",
  },
  {
    id: "public-address",
    title: "Public address on Marshal incident",
    type: "letter",
    date: "2025-08-26",
    path: "/docs/my public address of the marshall attack.pdf",
    summary: "Narrative statement describing alleged assault, detention, medical response, and equipment damage.",
    tags: ["public statement", "use of force", "detention"],
    sourceNote: "From file: my public address of the marshall attack.pdf",
  },
  {
    id: "responsive-records",
    title: "Responsive Records (packet)",
    type: "pdf",
    path: "/docs/responsive records.pdf",
    summary: "Misc. responsive materials (forms/other).",
    tags: ["records", "packet"],
    sourceNote: "From file: responsive records.pdf",
  },
  {
    id: "podcast",
    title: "Podcast – TalksGow preface & discussion",
    type: "audio",
    path: "/docs/podcast talksgow.pdf",
    summary: "Preface transcript-style content tied to broader case background and parallels.",
    tags: ["media", "podcast", "speech"],
    sourceNote: "From file: podcast talksgow.pdf (textual export)",
  },
  {
    id: "foia-response",
    title: "USMS FOIA/PA Final Response Letter (10 pages released in part)",
    type: "letter",
    date: "2025-08-22",
    path: "/docs/Final Response Letter for PA Redacted Documents.pdf",
    summary: "USMS cites (b)(6), (b)(7)(C), (b)(7)(E). Offices: JSD, W/LA, N/MS, S/TX, D/UT.",
    tags: ["FOIA", "USMS", "exemptions"],
    sourceNote: "From file: Final Response Letter for PA Redacted Documents.pdf",
  },
  {
    id: "aug25-stream",
    title: "Aug 25, 2025 – Livestream & courthouse approach",
    type: "transcript",
    date: "2025-08-25",
    path: "/docs/Aug 25.pdf",
    summary: "Stream excerpts; signage; invitation inside; immediate arrest threat; remarks on BOLOs.",
    tags: ["livestream", "courthouse", "BOLO"],
    sourceNote: "From file: Aug 25.pdf",
  },
  {
    id: "foia-request",
    title: "FOIA request to USMS (expedited & fee waiver)",
    type: "letter",
    date: "2025-06-27",
    path: "/docs/foia-us marshalls.pdf",
    summary: "Seeks comms, BOLOs, and inter-agency records; references public-interest basis.",
    tags: ["FOIA", "request", "USMS"],
    sourceNote: "From file: foia-us marshalls.pdf",
  },
];

// Timeline Events Data
export const CASE_TIMELINE: TimelineEvent[] = [
  {
    id: "t1",
    date: "2025-06-23",
    title: "Lobby interaction recorded; First Amendment discussion",
    summary: "Transcript includes exchanges with officers, supervisor arrival, and recording purpose.",
    docRefs: ["june-transcripts"],
    tags: ["recording", "lobby"],
  },
  {
    id: "t2",
    date: "2025-06-27",
    title: "FOIA filed with USMS",
    summary: "Seeks comms/BOLOs and interstate dissemination of info.",
    docRefs: ["foia-request"],
    tags: ["FOIA"],
  },
  {
    id: "t3",
    date: "2025-08-22",
    title: "USMS FOIA response (partial release & exemptions)",
    summary: "Cites privacy and law-enforcement exemptions; multiple districts identified.",
    docRefs: ["foia-response"],
    tags: ["FOIA", "exemptions"],
  },
  {
    id: "t4",
    date: "2025-08-25",
    title: "Livestream at courthouse and doorway exchange",
    summary: "Alleges being waved in then threatened with arrest; signage and BOLO remarks.",
    docRefs: ["aug25-stream", "bill-image"],
    tags: ["livestream", "courthouse"],
  },
  {
    id: "t5",
    date: "2025-08-26",
    title: "Public address on Marshal incident",
    summary: "Detailed narrative of force, detention, medical care, transport, and conditions.",
    docRefs: ["public-address"],
    tags: ["statement"],
  },
];

// FOIA Requests Data
export const FOIA_REQUESTS: FoiaRequest[] = [
  {
    id: "foia-1",
    agency: "US Marshals Service",
    requestNumber: "2025-FOIA-08901",
    status: "completed",
    submittedDate: "2025-06-27",
    responseDate: "2025-08-22",
    description: "Request for communications, BOLOs, and inter-agency records",
    responseSummary: "14 pages released with exemptions (b)(6), (b)(7)(C), (b)(7)(E)",
    documentsReceived: ["foia-response"],
  },
  {
    id: "foia-2",
    agency: "FBI Field Office",
    status: "pending",
    submittedDate: "2025-08-15",
    description: "Request for field office communications and surveillance records",
  },
  {
    id: "foia-3",
    agency: "Mississippi Lafayette County Court",
    status: "submitted",
    submittedDate: "2025-08-28",
    description: "Request for state court records and proceedings",
  },
];

// Legal Issues Analysis
export const LEGAL_ISSUES: LegalIssue[] = [
  {
    id: "issue-1",
    title: "First Amendment Violation",
    description: "Prior restraint on protected speech in public forum",
    priority: "high",
    category: "constitutional",
  },
  {
    id: "issue-2",
    title: "Excessive Force",
    description: "Physical assault without legal justification",
    priority: "critical",
    category: "civil-rights",
  },
  {
    id: "issue-3",
    title: "Due Process Violation",
    description: "Procedural irregularities in detention process",
    priority: "medium",
    category: "procedural",
  },
  {
    id: "issue-4",
    title: "Retaliation",
    description: "Pattern of escalating response to protected activity",
    priority: "high",
    category: "civil-rights",
  },
];

// Case Statistics
export const CASE_STATS = {
  totalDocuments: CASE_DOCUMENTS.length,
  timelineEvents: CASE_TIMELINE.length,
  evidenceItems: CASE_DOCUMENTS.filter(d => d.type === "image" || d.type === "audio").length,
  foiaRequests: FOIA_REQUESTS.length,
  potentialViolations: LEGAL_ISSUES.length,
};

// Utility Functions
export function formatDate(d?: string) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString(undefined, { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  } catch {
    return d;
  }
}

export function getDocumentsByType(type: DocType) {
  return CASE_DOCUMENTS.filter(doc => doc.type === type);
}

export function getTimelineEventsByDateRange(startDate: string, endDate: string) {
  return CASE_TIMELINE.filter(event => 
    event.date >= startDate && event.date <= endDate
  );
}

export function getDocumentById(id: string) {
  return CASE_DOCUMENTS.find(doc => doc.id === id);
}
