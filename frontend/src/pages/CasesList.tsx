"use client"
import type React from "react"
import { useState } from "react"
import {
  Plus,
  Search,
  Eye,
  Edit,
  Package,
  Send,
  MoreHorizontal,
  Calendar,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Download,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import { AuditTrail } from "@/components/AuditTrail" // Import the new AuditTrailComponent

// Define interfaces
interface ForensicDept {
  id: string
  name: string
  location: string
}

interface EvidenceItem {
  id: string
  type: string
  description: string
  dateCollected: string
  status: string
  storageLocation?: string
  fileSize?: string
  collectedBy?: string
  lastUpdated?: string
  hash?: string
  condition?: string
  linkedCaseId?: string
}

interface CaseItem {
  id: string
  firNumber: string
  title: string
  description: string
  crimeType: string
  dateOfIncident: string
  location: string
  officers: string[]
  status: string
  priority: string
  txnHash: string
  timestamp: string
  evidence?: EvidenceItem[]
}

interface CaseManagementProps {
  userRole: "Admin" | "Officer-in-Charge" | "Investigator"
  // onNavigate is now handled internally by CaseManagement
}

type SemanticColor = "success" | "primary" | "warning" | "danger" | "secondary"

// Helper function to get badge class names based on semantic color
const getBadgeClassNames = (color: SemanticColor): string => {
  switch (color) {
    case "success":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
    case "primary":
      return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
    case "warning":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
    case "danger":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
    case "secondary":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
  }
}

// Transfer Case Modal Component
const TransferCaseModal: React.FC<{
  open: boolean
  onClose: () => void
  onTransfer: (data: { departmentId: string; remarks: string }) => void
  forensicDepts: ForensicDept[]
}> = ({ open, onClose, onTransfer, forensicDepts }) => {
  const [selectedDept, setSelectedDept] = useState("")
  const [remarks, setRemarks] = useState("")

  const handleTransfer = () => {
    if (selectedDept) {
      onTransfer({ departmentId: selectedDept, remarks })
      setSelectedDept("")
      setRemarks("")
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Case</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Department</Label>
            <Select value={selectedDept} onValueChange={setSelectedDept}>
              <SelectTrigger>
                <SelectValue placeholder="Select forensic department" />
              </SelectTrigger>
              <SelectContent>
                {forensicDepts.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name} - {dept.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter transfer remarks..."
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleTransfer} disabled={!selectedDept}>
              Transfer Case
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const CaseManagement: React.FC<CaseManagementProps> = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [crimeTypeFilter, setCrimeTypeFilter] = useState("all")
  const [showAddCase, setShowAddCase] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [casesPerPage, setCasesPerPage] = useState(5)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCaseForView, setSelectedCaseForView] = useState<CaseItem | null>(null)
  const [selectedCaseForEdit, setSelectedCaseForEdit] = useState<CaseItem | null>(null)
  const [showEvidenceModal, setShowEvidenceModal] = useState(false)
  const [selectedCaseForEvidence, setSelectedCaseForEvidence] = useState<EvidenceItem | null>(null)
  const [showAddEvidenceModal, setShowAddEvidenceModal] = useState(false)
  const [selectedCaseForAddEvidence, setSelectedCaseForAddEvidence] = useState<CaseItem | null>(null)
  const [currentView, setCurrentView] = useState<"cases" | "audit-trail">("cases") // New state for view management

  // Sample Forensic Departments data
  const forensicDepts: ForensicDept[] = [
    { id: "dept-001", name: "NFSL", location: "Kathmandu" },
    { id: "dept-002", name: "NFSL", location: "Pokhara" },
    { id: "dept-003", name: "NFSL", location: "Chitwan" },
    { id: "dept-004", name: "Regional Forensic Lab", location: "Biratnagar" },
    { id: "dept-005", name: "Cyber Forensic Unit", location: "Lalitpur" },
  ]

  // Enhanced cases array with more sample data for better pagination demonstration
  const cases: CaseItem[] = [
    {
      id: "CASE-001",
      firNumber: "FIR-2024-001",
      title: "Cybercrime Investigation - Online Fraud",
      crimeType: "Cybercrime",
      dateOfIncident: "2025-01-05",
      officers: ["SI Ram Kumar", "Constable Singh"],
      status: "Active",
      priority: "High",
      txnHash: "0x8ac9b...ef234",
      timestamp: "2025-01-10 14:32",
      location: "Online Platform",
      description: "Investigation into online fraud affecting multiple victims through fake investment schemes.",
      evidence: [
        {
          id: "EVD-001",
          type: "Document",
          description: "Bank statements showing fraudulent transactions",
          dateCollected: "2025-01-06",
          status: "Active",
          condition: "Good",
          storageLocation: "Digital Evidence Vault - Server A",
          fileSize: "2.4 MB",
          collectedBy: "SI Ram Kumar",
          lastUpdated: "2025-01-06 10:30",
          hash: "0xabcd1234ef567890abcdef1234567890abcdef",
          linkedCaseId: "CASE-001",
        },
        {
          id: "EVID-001-B",
          type: "Digital",
          description: "Transaction logs from payment gateway",
          dateCollected: "2025-01-07",
          status: "Pending Analysis",
          condition: "Good",
          storageLocation: "Cloud Storage - AWS S3",
          fileSize: "1.2 GB",
          collectedBy: "Constable Singh",
          lastUpdated: "2025-01-08 09:00",
          hash: "0x1234567890abcdef1234567890abcdef1234",
          linkedCaseId: "CASE-001",
        },
      ],
    },
    {
      id: "CASE-002",
      firNumber: "FIR-2024-002",
      title: "Theft - Electronics Store Burglary",
      crimeType: "Theft",
      dateOfIncident: "2025-01-03",
      officers: ["Inspector Sharma", "SI Patel"],
      status: "Under Review",
      priority: "Medium",
      txnHash: "0x7bd8a...cd123",
      timestamp: "2025-01-09 10:15",
      location: "Main Market, Electronics Store",
      description: "Burglary at electronics store with multiple high-value items stolen.",
      evidence: [
        {
          id: "EVID-002-A",
          type: "Physical",
          description: "CCTV footage from store",
          dateCollected: "2025-01-04",
          status: "Reviewed",
          condition: "Good",
          storageLocation: "Physical Evidence Locker 1A",
          fileSize: "500 MB",
          collectedBy: "Inspector Sharma",
          lastUpdated: "2025-01-05 11:00",
          hash: "0xabc123def456ghi7890jkl123mno456pqr789",
          linkedCaseId: "CASE-002",
        },
      ],
    },
    {
      id: "CASE-003",
      firNumber: "FIR-2024-003",
      title: "Assault Case - Public Altercation",
      crimeType: "Assault",
      dateOfIncident: "2025-01-02",
      officers: ["SI Gupta"],
      status: "Transferred",
      priority: "High",
      txnHash: "0x9ef7c...ab456",
      timestamp: "2025-01-08 16:45",
      location: "City Center Park",
      description: "Physical assault case involving multiple individuals in public space.",
      evidence: [], // No evidence for this case
    },
    {
      id: "CASE-004",
      firNumber: "FIR-2024-004",
      title: "Drug Possession Case",
      crimeType: "Drug Offense",
      dateOfIncident: "2025-01-01",
      officers: ["Inspector Kumar"],
      status: "Active",
      priority: "High",
      txnHash: "0x1a2b3...c4d5e",
      timestamp: "2025-01-07 11:20",
      location: "Railway Station",
      description: "Drug possession case with substantial quantity of illegal substances.",
      evidence: [
        {
          id: "EVID-004-A",
          type: "Physical",
          description: "Seized narcotics (sample)",
          dateCollected: "2025-01-01",
          status: "Sent to Lab",
          condition: "Good",
          storageLocation: "Forensic Lab - Chemical Analysis",
          fileSize: "100g",
          collectedBy: "Inspector Kumar",
          lastUpdated: "2025-01-02 10:00",
          hash: "0x1234567890abcdef1234567890abcdef1234",
          linkedCaseId: "CASE-004",
        },
      ],
    },
    {
      id: "CASE-005",
      firNumber: "FIR-2024-005",
      title: "Vehicle Theft Investigation",
      crimeType: "Theft",
      dateOfIncident: "2024-12-30",
      officers: ["SI Verma", "Constable Rao"],
      status: "Closed",
      priority: "Medium",
      txnHash: "0x5f6g7...h8i9j",
      timestamp: "2025-01-06 09:30",
      location: "Parking Lot, Mall",
      description: "High-end vehicle theft case resolved successfully.",
      evidence: [
        {
          id: "EVID-005-A",
          type: "Digital",
          description: "Parking lot CCTV footage",
          dateCollected: "2024-12-31",
          status: "Reviewed",
          condition: "Good",
          storageLocation: "Digital Evidence Vault - Server B",
          fileSize: "3.5 GB",
          collectedBy: "SI Verma",
          lastUpdated: "2025-01-01 16:00",
          hash: "0xabcdef1234567890abcdef1234567890abcdef",
          linkedCaseId: "CASE-005",
        },
      ],
    },
    {
      id: "CASE-006",
      firNumber: "FIR-2024-006",
      title: "Domestic Violence Case",
      crimeType: "Domestic Violence",
      dateOfIncident: "2024-12-28",
      officers: ["SI Priya", "WPC Sharma"],
      status: "Under Review",
      priority: "High",
      txnHash: "0x9k8l7...m6n5o",
      timestamp: "2025-01-05 15:45",
      location: "Residential Area",
      description: "Domestic violence case requiring sensitive handling and counseling.",
      evidence: [],
    },
    {
      id: "CASE-007",
      firNumber: "FIR-2024-007",
      title: "Financial Fraud Investigation",
      crimeType: "Fraud",
      dateOfIncident: "2024-12-25",
      officers: ["Inspector Joshi", "SI Thapa"],
      status: "Active",
      priority: "High",
      txnHash: "0x2c3d4...e5f6g",
      timestamp: "2025-01-04 13:20",
      location: "Bank Branch Office",
      description: "Large-scale financial fraud involving multiple bank accounts and fake documents.",
      evidence: [
        {
          id: "EVID-007-A",
          type: "Document",
          description: "Bank statements and transaction records",
          dateCollected: "2024-12-26",
          status: "Analyzed",
          condition: "Good",
          storageLocation: "Digital Evidence Vault - Server C",
          fileSize: "5.1 MB",
          collectedBy: "Inspector Joshi",
          lastUpdated: "2024-12-27 09:00",
          hash: "0x1a2b3c4d5e6f78901a2b3c4d5e6f78901a2b",
          linkedCaseId: "CASE-007",
        },
      ],
    },
    {
      id: "CASE-008",
      firNumber: "FIR-2024-008",
      title: "Burglary - Residential Complex",
      crimeType: "Burglary",
      dateOfIncident: "2024-12-22",
      officers: ["SI Mishra"],
      status: "Under Review",
      priority: "Medium",
      txnHash: "0x7h8i9...j0k1l",
      timestamp: "2025-01-03 09:45",
      location: "Green Valley Apartments",
      description: "Multiple apartment burglaries in residential complex during night hours.",
      evidence: [],
    },
    {
      id: "CASE-009",
      firNumber: "FIR-2024-009",
      title: "Identity Theft Case",
      crimeType: "Cybercrime",
      dateOfIncident: "2024-12-20",
      officers: ["SI Ram Kumar", "Cyber Crime Unit"],
      status: "Active",
      priority: "Medium",
      txnHash: "0x4m5n6...o7p8q",
      timestamp: "2025-01-02 16:30",
      location: "Online/Digital",
      description: "Identity theft case involving stolen personal documents and fraudulent transactions.",
      evidence: [
        {
          id: "EVID-009-A",
          type: "Digital",
          description: "Compromised account data",
          dateCollected: "2024-12-21",
          status: "Analyzed",
          condition: "Good",
          storageLocation: "Cyber Forensic Lab - Server A",
          fileSize: "800 KB",
          collectedBy: "Cyber Crime Unit",
          lastUpdated: "2024-12-22 11:00",
          hash: "0xabcdef1234567890abcdef1234567890abcdef",
          linkedCaseId: "CASE-009",
        },
      ],
    },
    {
      id: "CASE-010",
      firNumber: "FIR-2024-010",
      title: "Public Disturbance Case",
      crimeType: "Public Order",
      dateOfIncident: "2024-12-18",
      officers: ["Inspector Sharma", "Constable Yadav"],
      status: "Closed",
      priority: "Low",
      txnHash: "0x9r0s1...t2u3v",
      timestamp: "2025-01-01 11:15",
      location: "Market Square",
      description: "Public disturbance case resolved through community mediation.",
      evidence: [],
    },
    {
      id: "CASE-011",
      firNumber: "FIR-2024-011",
      title: "Vandalism - Public Property",
      crimeType: "Vandalism",
      dateOfIncident: "2024-12-15",
      officers: ["SI Patel", "Constable Kumar"],
      status: "Under Review",
      priority: "Low",
      txnHash: "0x6w7x8...y9z0a",
      timestamp: "2024-12-31 14:20",
      location: "City Park",
      description: "Vandalism of public property including park benches and signage.",
      evidence: [],
    },
    {
      id: "CASE-012",
      firNumber: "FIR-2024-012",
      title: "Harassment Case - Workplace",
      crimeType: "Harassment",
      dateOfIncident: "2024-12-12",
      officers: ["WPC Sharma", "SI Priya"],
      status: "Active",
      priority: "Medium",
      txnHash: "0x3b4c5...d6e7f",
      timestamp: "2024-12-30 10:45",
      location: "Corporate Office",
      description: "Workplace harassment case requiring detailed investigation and witness statements.",
      evidence: [
        {
          id: "EVID-012-A",
          type: "Digital",
          description: "Email communications",
          dateCollected: "2024-12-13",
          status: "Reviewed",
          condition: "Good",
          storageLocation: "Digital Evidence Vault - Server D",
          fileSize: "2.1 MB",
          collectedBy: "WPC Sharma",
          lastUpdated: "2024-12-14 10:00",
          hash: "0xabcdef1234567890abcdef1234567890abcdef",
          linkedCaseId: "CASE-012",
        },
        {
          id: "EVID-012-B",
          type: "Physical",
          description: "Witness statements",
          dateCollected: "2024-12-14",
          status: "Collected",
          condition: "Good",
          storageLocation: "Physical Evidence Locker 2B",
          fileSize: "N/A",
          collectedBy: "SI Priya",
          lastUpdated: "2024-12-15 11:00",
          hash: "0x1234567890abcdef1234567890abcdef1234",
          linkedCaseId: "CASE-012",
        },
      ],
    },
  ]

  const getStatusSemanticColor = (status: string): SemanticColor => {
    switch (status) {
      case "Active":
        return "success"
      case "Under Review":
        return "warning"
      case "Transferred":
        return "primary"
      case "Closed":
        return "secondary"
      case "Disabled":
        return "danger"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return CheckCircle
      case "Under Review":
        return Clock
      case "Transferred":
        return Send
      case "Closed":
        return CheckCircle
      case "Disabled":
        return X
      default:
        return AlertTriangle
    }
  }

  const getPrioritySemanticColor = (priority: string): SemanticColor => {
    switch (priority) {
      case "High":
        return "danger"
      case "Medium":
        return "warning"
      case "Low":
        return "success"
      default:
        return "secondary"
    }
  }

  const filteredCases = cases.filter((case_) => {
    const matchesSearch =
      case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.firNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || case_.status === statusFilter
    const matchesCrimeType = crimeTypeFilter === "all" || case_.crimeType === crimeTypeFilter

    return matchesSearch && matchesStatus && matchesCrimeType
  })

  // Enhanced pagination logic
  const totalPages = Math.ceil(filteredCases.length / casesPerPage)
  const startIndex = (currentPage - 1) * casesPerPage
  const endIndex = startIndex + casesPerPage
  const currentCases = filteredCases.slice(startIndex, endIndex)

  const handlePageChange = (page: number | string) => {
    if (typeof page === "number" && page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleCasesPerPageChange = (value: string) => {
    setCasesPerPage(Number.parseInt(value))
    setCurrentPage(1)
  }

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleCrimeTypeFilterChange = (value: string) => {
    setCrimeTypeFilter(value)
    setCurrentPage(1)
  }

  const handleTransferCase = (case_: CaseItem) => {
    setSelectedCase(case_)
    setShowTransferModal(true)
  }

  const handleViewCase = (case_: CaseItem) => {
    setSelectedCaseForView(case_)
    setShowViewModal(true)
  }

  const handleEditCase = (case_: CaseItem) => {
    setSelectedCaseForEdit(case_)
    setShowEditModal(true)
  }

  const handleViewEvidence = (evidenceItem: EvidenceItem) => {
    setSelectedCaseForEvidence(evidenceItem)
    setShowEvidenceModal(true)
  }

  const handleAddEvidence = (case_: CaseItem) => {
    setSelectedCaseForAddEvidence(case_)
    setShowAddEvidenceModal(true)
  }

  const handleConfirmTransfer = ({ departmentId, remarks }: { departmentId: string; remarks: string }) => {
    if (selectedCase) {
      console.log(`Transferring Case ${selectedCase.id} to Department ${departmentId} with remarks: ${remarks}`)
      setShowTransferModal(false)
      setSelectedCase(null)
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  const AddCaseForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="caseTitle">Case Title *</Label>
          <Input id="caseTitle" placeholder="Enter case title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="firNumber">FIR Number *</Label>
          <Input id="firNumber" placeholder="FIR-YYYY-XXX" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="crimeType">Crime Type *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select crime type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="theft">Theft</SelectItem>
              <SelectItem value="assault">Assault</SelectItem>
              <SelectItem value="cybercrime">Cybercrime</SelectItem>
              <SelectItem value="fraud">Fraud</SelectItem>
              <SelectItem value="burglary">Burglary</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="incidentDate">Date of Incident *</Label>
          <Input id="incidentDate" type="date" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" placeholder="Enter incident location" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignedOfficers">Assigned Officers</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select officers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="si-ram">SI Ram Kumar</SelectItem>
            <SelectItem value="inspector-sharma">Inspector Sharma</SelectItem>
            <SelectItem value="si-patel">SI Patel</SelectItem>
            <SelectItem value="si-gupta">SI Gupta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Case Description</Label>
        <Textarea id="description" placeholder="Enter detailed case description..." rows={4} />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setShowAddCase(false)}>
          Cancel
        </Button>
        <Button>Save Case</Button>
      </div>
    </div>
  )

  const ViewCaseModal = () => (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Case Details</DialogTitle>
      </DialogHeader>
      {selectedCaseForView && (
        <div className="space-y-6">
          {/* Case Header */}
          <div className="border-b pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{selectedCaseForView.title}</h2>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{selectedCaseForView.id}</Badge>
                  <Badge variant="outline">{selectedCaseForView.firNumber}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className={getBadgeClassNames(getStatusSemanticColor(selectedCaseForView.status))}
                >
                  {selectedCaseForView.status}
                </Badge>
                <Badge
                  variant="outline"
                  className={getBadgeClassNames(getPrioritySemanticColor(selectedCaseForView.priority))}
                >
                  {selectedCaseForView.priority} Priority
                </Badge>
              </div>
            </div>
          </div>

          {/* Case Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Crime Type</Label>
                <p className="mt-0.5 font-semibold text-base text-foreground">{selectedCaseForView.crimeType}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Date of Incident</Label>
                <p className="mt-0.5 font-semibold text-base text-foreground">{selectedCaseForView.dateOfIncident}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Location</Label>
                <p className="mt-0.5 font-semibold text-base text-foreground">{selectedCaseForView.location}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Assigned Officers</Label>
                <p className="mt-0.5 font-semibold text-base text-foreground">
                  {selectedCaseForView.officers.join(", ")}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Transaction Hash</Label>
                <p className="mt-0.5 font-semibold text-base font-mono text-sm text-foreground">
                  {selectedCaseForView.txnHash}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Last Updated</Label>
                <p className="mt-0.5 font-semibold text-base text-foreground">{selectedCaseForView.timestamp}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm text-muted-foreground">Case Description</Label>
            <p className="mt-2 text-base leading-relaxed text-foreground">{selectedCaseForView.description}</p>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  )

  const EditCaseModal = () => (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Case</DialogTitle>
      </DialogHeader>
      {selectedCaseForEdit && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editCaseTitle">Case Title *</Label>
              <Input id="editCaseTitle" defaultValue={selectedCaseForEdit.title} placeholder="Enter case title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editFirNumber">FIR Number *</Label>
              <Input id="editFirNumber" defaultValue={selectedCaseForEdit.firNumber} placeholder="FIR-YYYY-XXX" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editCrimeType">Crime Type *</Label>
              <Select defaultValue={selectedCaseForEdit.crimeType.toLowerCase()}>
                <SelectTrigger>
                  <SelectValue placeholder="Select crime type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="theft">Theft</SelectItem>
                  <SelectItem value="assault">Assault</SelectItem>
                  <SelectItem value="cybercrime">Cybercrime</SelectItem>
                  <SelectItem value="fraud">Fraud</SelectItem>
                  <SelectItem value="burglary">Burglary</SelectItem>
                  <SelectItem value="drug offense">Drug Offense</SelectItem>
                  <SelectItem value="domestic violence">Domestic Violence</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editIncidentDate">Date of Incident *</Label>
              <Input id="editIncidentDate" type="date" defaultValue={selectedCaseForEdit.dateOfIncident} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="editLocation">Location</Label>
            <Input
              id="editLocation"
              defaultValue={selectedCaseForEdit.location}
              placeholder="Enter incident location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="editStatus">Status</Label>
            <Select defaultValue={selectedCaseForEdit.status}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Transferred">Transferred</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="editPriority">Priority</Label>
            <Select defaultValue={selectedCaseForEdit.priority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="editDescription">Case Description</Label>
            <Textarea
              id="editDescription"
              defaultValue={selectedCaseForEdit.description}
              placeholder="Enter detailed case description..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button>Update Case</Button>
          </div>
        </div>
      )}
    </DialogContent>
  )

  const EvidenceModal = () => (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Evidence Details</DialogTitle>
      </DialogHeader>
      {selectedCaseForEvidence && (
        <div className="space-y-6">
          {/* Evidence Header */}
          <div className="border-b pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{selectedCaseForEvidence.id}</h2>
                <div className="flex gap-2 mt-2">
                  {selectedCaseForEvidence.linkedCaseId && (
                    <Badge variant="outline">Linked to {selectedCaseForEvidence.linkedCaseId}</Badge>
                  )}
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {selectedCaseForEvidence.type}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedCaseForEvidence.status && (
                  <Badge
                    variant="outline"
                    className={getBadgeClassNames(getStatusSemanticColor(selectedCaseForEvidence.status))}
                  >
                    {selectedCaseForEvidence.status}
                  </Badge>
                )}
                {selectedCaseForEvidence.condition && (
                  <Badge
                    variant="outline"
                    className={getBadgeClassNames(selectedCaseForEvidence.condition === "Good" ? "success" : "warning")}
                  >
                    {selectedCaseForEvidence.condition}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Evidence Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="mt-1 text-base">{selectedCaseForEvidence.description}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Collected By</Label>
                <p className="mt-1 text-base">{selectedCaseForEvidence.collectedBy}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Date Collected</Label>
                <p className="mt-1 text-base">{selectedCaseForEvidence.dateCollected}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Storage Location</Label>
                <p className="mt-1 text-base">{selectedCaseForEvidence.storageLocation}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">File Size</Label>
                <p className="mt-1 text-base">{selectedCaseForEvidence.fileSize}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                <p className="mt-1 text-base">{selectedCaseForEvidence.lastUpdated}</p>
              </div>
            </div>
          </div>

          {/* Blockchain Security */}
          {selectedCaseForEvidence.hash && (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Blockchain Security</h3>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Hash</Label>
                <p className="mt-1 font-mono text-sm break-all">{selectedCaseForEvidence.hash}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                This evidence has been cryptographically secured and verified on the blockchain.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEvidenceModal(false)}>
              Close
            </Button>
            <Button variant="default">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  )

  const AddEvidenceModal = () => (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add Evidence to Case</DialogTitle>
      </DialogHeader>
      {selectedCaseForAddEvidence && (
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-semibold">{selectedCaseForAddEvidence.title}</h3>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">{selectedCaseForAddEvidence.id}</Badge>
              <Badge variant="outline">{selectedCaseForAddEvidence.firNumber}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="evidenceType">Evidence Type *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select evidence type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="photograph">Photograph</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="evidenceCondition">Condition *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="evidenceDescription">Evidence Description *</Label>
            <Textarea id="evidenceDescription" placeholder="Provide detailed description of the evidence..." rows={3} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="collectedBy">Collected By *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select officer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si-ram">SI Ram Kumar</SelectItem>
                  <SelectItem value="inspector-sharma">Inspector Sharma</SelectItem>
                  <SelectItem value="si-patel">SI Patel</SelectItem>
                  <SelectItem value="si-gupta">SI Gupta</SelectItem>
                  <SelectItem value="inspector-kumar">Inspector Kumar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateCollected">Date Collected *</Label>
              <Input id="dateCollected" type="datetime-local" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storageLocation">Storage Location</Label>
              <Input id="storageLocation" placeholder="e.g., Evidence Locker 1A, Digital Vault Server B" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fileSize">File Size / Weight</Label>
              <Input id="fileSize" placeholder="e.g., 2.4 MB, 500g, N/A" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="evidenceFile">Upload Evidence File (Optional)</Label>
            <Input id="evidenceFile" type="file" accept="*/*" />
            <p className="text-xs text-muted-foreground">Supported formats: Images, Documents, Audio, Video files</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chainOfCustody">Chain of Custody Notes</Label>
            <Textarea
              id="chainOfCustody"
              placeholder="Document the chain of custody and any relevant handling notes..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddEvidenceModal(false)}>
              Cancel
            </Button>
            <Button>
              <Package className="h-4 w-4 mr-2" />
              Add Evidence
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  )

  // Function to handle navigation within the component
  const handleInternalNavigate = (section: string) => {
    if (section === "audit-trail") {
      setCurrentView("audit-trail")
    } else {
      setCurrentView("cases")
    }
  }

  if (currentView === "audit-trail") {
    return <AuditTrail onBack={() => setCurrentView("cases")} />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Case Management</h1>
          <p className="text-muted-foreground">Manage and track all police cases</p>
        </div>
        <Dialog open={showAddCase} onOpenChange={setShowAddCase}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Case
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Case</DialogTitle>
            </DialogHeader>
            <AddCaseForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Case ID, FIR Number, or Title..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Transferred">Transferred</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={crimeTypeFilter} onValueChange={handleCrimeTypeFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Crime Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crime Types</SelectItem>
                <SelectItem value="Theft">Theft</SelectItem>
                <SelectItem value="Assault">Assault</SelectItem>
                <SelectItem value="Cybercrime">Cybercrime</SelectItem>
                <SelectItem value="Fraud">Fraud</SelectItem>
                <SelectItem value="Drug Offense">Drug Offense</SelectItem>
                <SelectItem value="Domestic Violence">Domestic Violence</SelectItem>
                <SelectItem value="Burglary">Burglary</SelectItem>
                <SelectItem value="Vandalism">Vandalism</SelectItem>
                <SelectItem value="Harassment">Harassment</SelectItem>
                <SelectItem value="Public Order">Public Order</SelectItem>
              </SelectContent>
            </Select>
            <Select value={casesPerPage.toString()} onValueChange={handleCasesPerPageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Cases per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Top Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredCases.length)} of {filteredCases.length} results
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <span className="px-3 py-2 text-muted-foreground">...</span>
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Cases List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
        </div>
        {currentCases.map((case_) => {
          const StatusIcon = getStatusIcon(case_.status)
          return (
            <Card key={case_.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  {/* Case Info */}
                  <div className="lg:col-span-6 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="font-semibold text-lg">{case_.title}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {case_.id}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {case_.firNumber}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{case_.crimeType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Incident: {case_.dateOfIncident}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Officers: {case_.officers.join(", ")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Priority */}
                  <div className="lg:col-span-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-4 w-4" />
                      <Badge
                        variant="outline"
                        className={cn(getBadgeClassNames(getStatusSemanticColor(case_.status)), "text-xs")}
                      >
                        {case_.status}
                      </Badge>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(getBadgeClassNames(getPrioritySemanticColor(case_.priority)), "text-xs")}
                    >
                      {case_.priority} Priority
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      <p>Hash: {case_.txnHash}</p>
                      <p>{case_.timestamp}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-3 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewCase(case_)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {case_.status !== "Transferred" && (
                      <Button variant="outline" size="sm" onClick={() => handleEditCase(case_)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleAddEvidence(case_)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Evidence
                    </Button>
                    {case_.evidence && case_.evidence.length > 0 ? (
                      <Button variant="outline" size="sm" onClick={() => handleViewEvidence(case_.evidence[0])}>
                        <Package className="h-4 w-4 mr-1" />
                        View Evidence
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        <Package className="h-4 w-4 mr-1" />
                        No Evidence
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {(userRole === "Admin" || userRole === "Officer-in-Charge") && case_.status === "Active" && (
                          <DropdownMenuItem onClick={() => handleTransferCase(case_)}>
                            <Send className="h-4 w-4 mr-2" />
                            Transfer Case
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleInternalNavigate("audit-trail")}>
                          <FileText className="h-4 w-4 mr-2" />
                          Audit Trail
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <X className="h-4 w-4 mr-2" />
                          {case_.status === "Disabled" ? "Enable" : "Disable"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredCases.length)} of {filteredCases.length} results
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <span className="px-3 py-2 text-muted-foreground">...</span>
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <ViewCaseModal />
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <EditCaseModal />
      </Dialog>

      {/* Evidence Modal */}
      <Dialog open={showEvidenceModal} onOpenChange={setShowEvidenceModal}>
        <EvidenceModal />
      </Dialog>

      {/* Add Evidence Modal */}
      <Dialog open={showAddEvidenceModal} onOpenChange={setShowAddEvidenceModal}>
        <AddEvidenceModal />
      </Dialog>

      {/* Transfer Modal */}
      <TransferCaseModal
        open={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onTransfer={handleConfirmTransfer}
        forensicDepts={forensicDepts}
      />

      {/* Empty State */}
      {currentCases.length === 0 && filteredCases.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No cases found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" || crimeTypeFilter !== "all"
                ? "Try adjusting your search criteria"
                : "Get started by creating your first case"}
            </p>
            {!searchTerm && statusFilter === "all" && crimeTypeFilter === "all" && (
              <Button onClick={() => setShowAddCase(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Case
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <CaseManagement userRole="Admin" />
    </div>
  )
}
