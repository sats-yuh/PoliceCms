export type CaseStatus = 'active' | 'transferred' | 'lab-tested' | 'closed' | 'disabled';
export type CrimeType = 'theft' | 'assault' | 'cybercrime' | 'fraud' | 'murder' | 'robbery' | 'domestic-violence' | 'other';
export type EvidenceType = 'document' | 'image' | 'video' | 'object' | 'digital';
export type EvidenceCondition = 'good' | 'damaged' | 'tampered';
export type Priority = 'high' | 'medium' | 'low';

export interface PersonInfo {
  id: string;
  name: string;
  contact: string;
  role: 'victim' | 'suspect';
  address?: string;
}

export interface Case {
  id: string;
  caseId: string;
  title: string;
  firNumber: string;
  crimeType: CrimeType;
  dateOfIncident: string;
  location: string;
  assignedOfficers: string[];
  personsInfo: PersonInfo[];
  description: string;
  status: CaseStatus;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  blockchainHash?: string;
  transferredTo?: string;
  transferredAt?: string;
}

export interface Evidence {
  id: string;
  evidenceId: string;
  caseId: string;
  type: EvidenceType;
  description: string;
  fileUrl?: string;
  fileHash?: string;
  collectedBy: string;
  dateCollected: string;
  storageLocation: string;
  condition: EvidenceCondition;
  blockchainHash?: string;
  createdAt: string;
}

export interface LabReport {
  id: string;
  caseId: string;
  evidenceIds: string[];
  testType: string;
  description: string;
  reportUrl: string;
  reportHash: string;
  performedBy: string;
  datePerformed: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'pending' | 'approved' | 'revision-requested';
  blockchainHash?: string;
}

export interface Verdict {
  id: string;
  caseId: string;
  summary: string;
  remarks?: string;
  dateOfJudgment: string;
  digitalSignature: string;
  judgeName: string;
  blockchainHash?: string;
}

export interface AuditLog {
  id: string;
  caseId?: string;
  evidenceId?: string;
  event: string;
  performedBy: string;
  role: string;
  timestamp: string;
  blockchainTxId: string;
  details?: string;
}