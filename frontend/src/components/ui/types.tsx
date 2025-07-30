export interface ForensicDept {
  id: string
  name: string
  location: string
}

export interface EvidenceItem {
  id: string
  type: string
  description: string
  dateCollected: string
  status: string
}

export interface CaseItem {
  id: string
  firNumber: string
  title: string
  crimeType: string
  dateOfIncident: string
  officers: string[]
  status: "Active" | "Under Review" | "Transferred" | "Closed" | "Disabled"
  priority: "High" | "Medium" | "Low"
  txnHash: string
  timestamp: string
  location: string
  description: string
  evidence?: EvidenceItem[] // Added evidence array
}
