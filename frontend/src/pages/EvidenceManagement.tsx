"use client"

import type React from "react"
import { useState } from "react"
import {
  Plus,
  Search,
  Eye,
  Edit,
  Link,
  Calendar,
  User,
  Upload,
  Download,
  Shield,
  Package,
  FileText,
  Video,
  ImageIcon,
  Box,
  Mic,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { cn } from "@/lib/utils" // Assuming cn is available for conditional class names

// Define the EvidenceItem interface
interface EvidenceItem {
  id: string
  caseId: string
  type: string
  description: string
  collectedBy: string
  dateCollected: string
  storageLocation: string
  condition: "Good" | "Damaged" | "Tampered" | "Deteriorated"
  status: "Active" | "Transferred" | "Under Review" | "Damaged"
  blockchainHash: string
  fileSize: string
  timestamp: string
}

interface EvidenceManagementProps {
  userRole: "Admin" | "Officer-in-Charge" | "Investigator"
  onNavigate: (section: string) => void
  caseId?: string // Add this prop
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

// New helper function to get icon based on evidence condition
const getConditionIcon = (condition: EvidenceItem["condition"]) => {
  switch (condition) {
    case "Good":
      return CheckCircle
    case "Damaged":
      return AlertTriangle
    case "Tampered":
      return X
    case "Deteriorated":
      return Clock
    default:
      return AlertTriangle
  }
}

const EvidenceManagement: React.FC<EvidenceManagementProps> = ({ userRole, onNavigate, caseId }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddEvidence, setShowAddEvidence] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [evidencePerPage] = useState(6) // Fixed items per page for this component
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEvidenceForView, setSelectedEvidenceForView] = useState<EvidenceItem | null>(null)
  const [selectedEvidenceForEdit, setSelectedEvidenceForEdit] = useState<EvidenceItem | null>(null)
  const [showBlockchainModal, setShowBlockchainModal] = useState(false)
  const [selectedEvidenceForBlockchain, setSelectedEvidenceForBlockchain] = useState<EvidenceItem | null>(null)

  const evidence: EvidenceItem[] = [
    {
      id: "EVD-001",
      caseId: "CASE-001",
      type: "Document",
      description: "Bank statements showing fraudulent transactions",
      collectedBy: "SI Ram Kumar",
      dateCollected: "2025-01-06",
      storageLocation: "Digital Evidence Vault - Server A",
      condition: "Good",
      status: "Active",
      blockchainHash: "0xabcd1234ef567890abcdef1234567890abcdef",
      fileSize: "2.4 MB",
      timestamp: "2025-01-06 10:30",
    },
    {
      id: "EVD-002",
      caseId: "CASE-001",
      type: "Video",
      description: "CCTV footage from ATM during transaction",
      collectedBy: "Constable Singh",
      dateCollected: "2025-01-06",
      storageLocation: "Evidence Room B - Shelf 15",
      condition: "Good",
      status: "Active",
      blockchainHash: "0x9876abcdef1234567890abcdef1234567890",
      fileSize: "45.2 MB",
      timestamp: "2025-01-06 14:15",
    },
    {
      id: "EVD-003",
      caseId: "CASE-002",
      type: "Image",
      description: "Crime scene photographs",
      collectedBy: "Inspector Sharma",
      dateCollected: "2025-01-04",
      storageLocation: "Digital Evidence Vault - Server B",
      condition: "Good",
      status: "Active",
      blockchainHash: "0x5555aaaabbbbccccddddeeeeffff00001111",
      fileSize: "12.8 MB",
      timestamp: "2025-01-04 08:45",
    },
    {
      id: "EVD-004",
      caseId: "CASE-002",
      type: "Object",
      description: "Fingerprints lifted from door handle",
      collectedBy: "SI Patel",
      dateCollected: "2025-01-04",
      storageLocation: "Forensic Lab - Container 23",
      condition: "Good",
      status: "Transferred",
      blockchainHash: "0x7777cccc4444ddddeeeeffff000011112222",
      fileSize: "0.8 MB",
      timestamp: "2025-01-04 11:20",
    },
    {
      id: "EVD-005",
      caseId: "CASE-003",
      type: "Document",
      description: "Medical reports of assault victim",
      collectedBy: "SI Gupta",
      dateCollected: "2025-01-03",
      storageLocation: "Secure Cabinet - Medical Records",
      condition: "Good",
      status: "Active",
      blockchainHash: "0x3333eeee7777ffff00001111222233334444",
      fileSize: "1.2 MB",
      timestamp: "2025-01-03 16:30",
    },
    {
      id: "EVD-006",
      caseId: "CASE-004",
      type: "Object",
      description: "Drug samples from seizure",
      collectedBy: "Inspector Kumar",
      dateCollected: "2025-01-02",
      storageLocation: "Forensic Lab - Narcotics Section",
      condition: "Good",
      status: "Active",
      blockchainHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
      fileSize: "0.5 MB",
      timestamp: "2025-01-02 09:00",
    },
    {
      id: "EVD-007",
      caseId: "CASE-005",
      type: "Document",
      description: "Vehicle registration documents",
      collectedBy: "SI Verma",
      dateCollected: "2024-12-31",
      storageLocation: "Digital Evidence Vault - Server C",
      condition: "Good",
      status: "Active",
      blockchainHash: "0x5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w",
      fileSize: "1.8 MB",
      timestamp: "2024-12-31 11:45",
    },
    {
      id: "EVD-008",
      caseId: "CASE-006",
      type: "Audio",
      description: "Recorded statement from victim",
      collectedBy: "SI Priya",
      dateCollected: "2024-12-29",
      storageLocation: "Secure Audio Archive",
      condition: "Good",
      status: "Under Review",
      blockchainHash: "0x9k8l7m6n5o4p3q2r1s0t9u8v7w6x5y4z3a2b",
      fileSize: "10.1 MB",
      timestamp: "2024-12-29 15:00",
    },
    {
      id: "EVD-009",
      caseId: "CASE-007",
      type: "Document",
      description: "Financial transaction logs",
      collectedBy: "Inspector Joshi",
      dateCollected: "2024-12-26",
      storageLocation: "Digital Evidence Vault - Server D",
      condition: "Good",
      status: "Active",
      blockchainHash: "0x2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t",
      fileSize: "5.7 MB",
      timestamp: "2024-12-26 10:00",
    },
    {
      id: "EVD-010",
      caseId: "CASE-008",
      type: "Image",
      description: "CCTV stills of suspects",
      collectedBy: "SI Mishra",
      dateCollected: "2024-12-23",
      storageLocation: "Evidence Room A - Cabinet 5",
      condition: "Good",
      status: "Under Review",
      blockchainHash: "0x7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y",
      fileSize: "8.9 MB",
      timestamp: "2024-12-23 14:00",
    },
    {
      id: "EVD-011",
      caseId: "CASE-009",
      type: "Document",
      description: "Stolen identity documents",
      collectedBy: "SI Ram Kumar",
      dateCollected: "2024-12-21",
      storageLocation: "Digital Evidence Vault - Server E",
      condition: "Good",
      status: "Active",
      blockchainHash: "0x4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d",
      fileSize: "1.1 MB",
      timestamp: "2024-12-21 16:00",
    },
    {
      id: "EVD-012",
      caseId: "CASE-010",
      type: "Video",
      description: "Bodycam footage of public disturbance",
      collectedBy: "Inspector Sharma",
      dateCollected: "2024-12-19",
      storageLocation: "Evidence Room C - Digital Media",
      condition: "Good",
      status: "Active",
      blockchainHash: "0x9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i",
      fileSize: "30.5 MB",
      timestamp: "2024-12-19 11:00",
    },
    {
      id: "EVD-013",
      caseId: "CASE-011",
      type: "Image",
      description: "Photographs of vandalized property",
      collectedBy: "SI Patel",
      dateCollected: "2024-12-16",
      storageLocation: "Digital Evidence Vault - Server F",
      condition: "Good",
      status: "Active",
      blockchainHash: "0x6w7x8y9z0a1b2c3d4e5f6g7h8i9j0k1l2m3n",
      fileSize: "7.2 MB",
      timestamp: "2024-12-16 09:00",
    },
    {
      id: "EVD-014",
      caseId: "CASE-012",
      type: "Document",
      description: "Witness statements for harassment case",
      collectedBy: "WPC Sharma",
      dateCollected: "2024-12-13",
      storageLocation: "Secure Cabinet - Witness Statements",
      condition: "Good",
      status: "Active",
      blockchainHash: "0x3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a",
      fileSize: "0.9 MB",
      timestamp: "2024-12-13 14:00",
    },
  ]

  const getStatusSemanticColor = (status: EvidenceItem["status"]): SemanticColor => {
    switch (status) {
      case "Active":
        return "success"
      case "Transferred":
        return "primary"
      case "Under Review":
        return "warning"
      case "Damaged":
        return "danger"
      default:
        return "secondary"
    }
  }

  const getConditionSemanticColor = (condition: EvidenceItem["condition"]): SemanticColor => {
    switch (condition) {
      case "Good":
        return "success"
      case "Damaged":
      case "Tampered":
      case "Deteriorated":
        return "warning"
      default:
        return "secondary"
    }
  }

  // New helper function to get icon based on evidence type
  const getEvidenceTypeIcon = (type: EvidenceItem["type"]) => {
    switch (type) {
      case "Document":
        return <FileText className="h-4 w-4 text-gray-700" />
      case "Video":
        return <Video className="h-4 w-4 text-gray-700" />
      case "Image":
        return <ImageIcon className="h-4 w-4 text-gray-700" />
      case "Object":
        return <Box className="h-4 w-4 text-gray-700" />
      case "Audio":
        return <Mic className="h-4 w-4 text-gray-700" />
      default:
        return <Package className="h-4 w-4 text-gray-700" /> // Default icon
    }
  }

  const filteredEvidence = evidence.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.caseId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesCaseId = !caseId || item.caseId === caseId // Add this line
    return matchesSearch && matchesType && matchesStatus && matchesCaseId // Include matchesCaseId
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredEvidence.length / evidencePerPage)
  const startIndex = (currentPage - 1) * evidencePerPage
  const endIndex = startIndex + evidencePerPage
  const currentEvidence = filteredEvidence.slice(startIndex, endIndex)

  const handlePageChange = (page: number | string) => {
    if (typeof page === "number" && page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleViewEvidence = (item: EvidenceItem) => {
    setSelectedEvidenceForView(item)
    setShowViewModal(true)
  }

  const handleEditEvidence = (item: EvidenceItem) => {
    setSelectedEvidenceForEdit(item)
    setShowEditModal(true)
  }

  const handleLinkEvidence = (item: EvidenceItem) => {
    // Navigate to case management with the linked case
    onNavigate("cases")
    console.log(`Linking to case: ${item.caseId}`)
  }

  const handleBlockchainView = (item: EvidenceItem) => {
    setSelectedEvidenceForBlockchain(item)
    setShowBlockchainModal(true)
  }

  // Generate page numbers for pagination (same logic as case management)
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

  const ViewEvidenceModal = () => (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Evidence Details</DialogTitle>
      </DialogHeader>
      {selectedEvidenceForView && (
        <div className="space-y-6">
          {/* Evidence Header */}
          <div className="border-b pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{selectedEvidenceForView.id}</h2>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">Linked to {selectedEvidenceForView.caseId}</Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getEvidenceTypeIcon(selectedEvidenceForView.type)}
                    {selectedEvidenceForView.type}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className={cn(getBadgeClassNames(getStatusSemanticColor(selectedEvidenceForView.status)), "text-xs")}
                >
                  {selectedEvidenceForView.status}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    getBadgeClassNames(getConditionSemanticColor(selectedEvidenceForView.condition)),
                    "text-xs",
                  )}
                >
                  {selectedEvidenceForView.condition}
                </Badge>
              </div>
            </div>
          </div>
          {/* Evidence Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Description</Label>
                <p className="mt-1 text-base text-foreground">{selectedEvidenceForView.description}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Collected By</Label>
                <p className="mt-1 text-base text-foreground">{selectedEvidenceForView.collectedBy}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Date Collected</Label>
                <p className="mt-1 text-base text-foreground">{selectedEvidenceForView.dateCollected}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Storage Location</Label>
                <p className="mt-1 text-base text-foreground">{selectedEvidenceForView.storageLocation}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">File Size</Label>
                <p className="mt-1 text-base text-foreground">{selectedEvidenceForView.fileSize}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Last Updated</Label>
                <p className="mt-1 text-base text-foreground">{selectedEvidenceForView.timestamp}</p>
              </div>
            </div>
          </div>
          {/* Blockchain Information */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Blockchain Security</h3>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Hash</Label>
              <p className="mt-1 font-mono text-sm break-all text-foreground">
                {selectedEvidenceForView.blockchainHash}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              This evidence has been cryptographically secured and verified on the blockchain.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
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

  const EditEvidenceModal = () => (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Evidence</DialogTitle>
      </DialogHeader>
      {selectedEvidenceForEdit && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editLinkedCase">Linked Case *</Label>
              <Select defaultValue={selectedEvidenceForEdit.caseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select case" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASE-001">CASE-001 - Cybercrime Investigation</SelectItem>
                  <SelectItem value="CASE-002">CASE-002 - Electronics Store Burglemary</SelectItem>
                  <SelectItem value="CASE-003">CASE-003 - Public Altercation</SelectItem>
                  <SelectItem value="CASE-004">CASE-004 - Drug Possession</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEvidenceType">Evidence Type *</Label>
              <Select defaultValue={selectedEvidenceForEdit.type}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Document">Document</SelectItem>
                  <SelectItem value="Image">Image</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="Object">Physical Object</SelectItem>
                  <SelectItem value="Audio">Audio Recording</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="editEvidenceDescription">Evidence Description *</Label>
            <Textarea
              id="editEvidenceDescription"
              defaultValue={selectedEvidenceForEdit.description}
              placeholder="Detailed description of the evidence..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fileUpload">File Upload</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-700 mb-2">Drag & drop files here, or click to browse</p>
              <Input id="fileUpload" type="file" className="hidden" />
              <Button variant="outline" size="sm" onClick={() => document.getElementById("fileUpload")?.click()}>
                Choose Files
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editCollectedBy">Collected By *</Label>
              <Select defaultValue={selectedEvidenceForEdit.collectedBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select officer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SI Ram Kumar">SI Ram Kumar</SelectItem>
                  <SelectItem value="Inspector Sharma">Inspector Sharma</SelectItem>
                  <SelectItem value="SI Patel">SI Patel</SelectItem>
                  <SelectItem value="SI Gupta">SI Gupta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDateCollected">Date & Time Collected *</Label>
              <Input
                id="editDateCollected"
                type="datetime-local"
                defaultValue={selectedEvidenceForEdit.dateCollected}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editStorageLocation">Storage Location *</Label>
              <Input
                id="editStorageLocation"
                defaultValue={selectedEvidenceForEdit.storageLocation}
                placeholder="Physical storage location"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCondition">Condition *</Label>
              <Select defaultValue={selectedEvidenceForEdit.condition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Damaged">Damaged</SelectItem>
                  <SelectItem value="Tampered">Tampered</SelectItem>
                  <SelectItem value="Deteriorated">Deteriorated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="editStatus">Status</Label>
            <Select defaultValue={selectedEvidenceForEdit.status}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Transferred">Transferred</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Damaged">Damaged</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Blockchain Security</span>
            </div>
            <p className="text-xs text-muted-foreground">Current hash: {selectedEvidenceForEdit.blockchainHash}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Any changes will generate a new hash and create an audit trail entry.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="police">Update Evidence</Button>
          </div>
        </div>
      )}
    </DialogContent>
  )

  const BlockchainViewModal = () => (
    <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Blockchain Evidence Verification</DialogTitle>
      </DialogHeader>
      {selectedEvidenceForBlockchain && (
        <div className="space-y-6">
          {/* Evidence Header */}
          <div className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{selectedEvidenceForBlockchain.id}</h2>
                <p className="text-muted-foreground">Blockchain Verification & Chain of Custody</p>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                <Badge variant="outline" className={getBadgeClassNames("success")}>
                  Verified
                </Badge>
              </div>
            </div>
          </div>
          {/* Blockchain Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Cryptographic Hash
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Transaction Hash</Label>
                  <div className="mt-1 p-3 bg-muted/50 rounded-lg">
                    <p className="font-mono text-sm break-all text-foreground">
                      {selectedEvidenceForBlockchain.blockchainHash}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Block Number</Label>
                  <p className="mt-1 font-mono text-foreground">#{Math.floor(Math.random() * 1000000) + 500000}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Gas Used</Label>
                  <p className="mt-1 font-mono text-foreground">{Math.floor(Math.random() * 50000) + 21000} wei</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timestamp Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Block Timestamp</Label>
                  <p className="mt-1 text-foreground">{selectedEvidenceForBlockchain.timestamp}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Confirmation Time</Label>
                  <p className="mt-1 text-foreground">
                    {new Date(Date.now() - Math.random() * 3600000).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Network</Label>
                  <p className="mt-1 text-foreground">Ethereum Mainnet</p>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* On-Chain Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">On-Chain Evidence Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Evidence ID</Label>
                    <p className="mt-1 font-mono text-foreground">{selectedEvidenceForBlockchain.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Case ID</Label>
                    <p className="mt-1 font-mono text-foreground">{selectedEvidenceForBlockchain.caseId}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">File Hash (SHA-256)</Label>
                    <p className="mt-1 font-mono text-sm text-foreground">
                      sha256:{selectedEvidenceForBlockchain.blockchainHash.slice(2, 66)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">File Size</Label>
                    <p className="mt-1 text-foreground">{selectedEvidenceForBlockchain.fileSize}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Smart Contract Address</Label>
                  <div className="mt-1 p-3 bg-muted/50 rounded-lg">
                    <p className="font-mono text-sm text-foreground">0x742d35Cc6634C0532925a3b8D4C9db7C4E2d7a8B</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Chain of Custody */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chain of Custody</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Evidence Created</p>
                        <p className="text-sm text-muted-foreground">
                          Collected by {selectedEvidenceForBlockchain.collectedBy}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {selectedEvidenceForBlockchain.dateCollected}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Blockchain Registration</p>
                        <p className="text-sm text-muted-foreground">Hash recorded on blockchain</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{selectedEvidenceForBlockchain.timestamp}</span>
                    </div>
                  </div>
                </div>
                {selectedEvidenceForBlockchain.status === "Transferred" && (
                  <div className="flex items-start gap-4 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Evidence Transferred</p>
                          <p className="text-sm text-muted-foreground">Transferred to Forensic Department</p>
                        </div>
                        <span className="text-xs text-muted-foreground">2025-01-08 09:30</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Verification Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Integrity Verified</span>
            </div>
            <p className="text-sm text-green-700">
              This evidence has been cryptographically verified and its integrity is confirmed on the blockchain. No
              tampering or unauthorized modifications detected.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowBlockchainModal(false)}>
              Close
            </Button>
            <Button variant="police">
              <Download className="h-4 w-4 mr-2" />
              Export Verification Report
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  )

  const AddEvidenceForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linkedCase">Linked Case *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select case" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CASE-001">CASE-001 - Cybercrime Investigation</SelectItem>
              <SelectItem value="CASE-002">CASE-002 - Electronics Store Burglary</SelectItem>
              <SelectItem value="CASE-003">CASE-003 - Public Altercation</SelectItem>
              <SelectItem value="CASE-004">CASE-004 - Drug Possession</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="evidenceType">Evidence Type *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Document">Document</SelectItem>
              <SelectItem value="Image">Image</SelectItem>
              <SelectItem value="Video">Video</SelectItem>
              <SelectItem value="Object">Physical Object</SelectItem>
              <SelectItem value="Audio">Audio Recording</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="evidenceDescription">Evidence Description *</Label>
        <Textarea id="evidenceDescription" placeholder="Detailed description of the evidence..." rows={3} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fileUpload">File Upload</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-2">Drag & drop files here, or click to browse</p>
          <Input id="fileUpload" type="file" className="hidden" />
          <Button variant="outline" size="sm" onClick={() => document.getElementById("fileUpload")?.click()}>
            Choose Files
          </Button>
        </div>
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
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateCollected">Date & Time Collected *</Label>
          <Input id="dateCollected" type="datetime-local" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="storageLocation">Storage Location *</Label>
          <Input id="storageLocation" placeholder="Physical storage location" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="condition">Condition *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Damaged">Damaged</SelectItem>
              <SelectItem value="Tampered">Tampered</SelectItem>
              <SelectItem value="Deteriorated">Deteriorated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Blockchain Security</span>
        </div>
        <p className="text-xs text-muted-foreground">
          File hash will be automatically generated and stored on blockchain upon upload for integrity verification.
        </p>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setShowAddEvidence(false)}>
          Cancel
        </Button>
        <Button variant="police">Add Evidence</Button>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Evidence Management {caseId ? `for Case ${caseId}` : ""}
          </h1>
          <p className="text-muted-foreground">Manage and track all case evidence</p>
        </div>
        <Dialog open={showAddEvidence} onOpenChange={setShowAddEvidence}>
          <DialogTrigger asChild>
            <Button variant="police">
              <Plus className="h-4 w-4 mr-2" />
              Add Evidence
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Evidence</DialogTitle>
            </DialogHeader>
            <AddEvidenceForm />
          </DialogContent>
        </Dialog>
      </div>
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Evidence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Evidence ID, Case ID, or Description..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Document">Document</SelectItem>
                <SelectItem value="Image">Image</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
                <SelectItem value="Object">Object</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Transferred">Transferred</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      {/* Top Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredEvidence.length)} of {filteredEvidence.length}{" "}
            results
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
      {/* Evidence Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentEvidence.map((item) => {
            const ConditionIcon = getConditionIcon(item.condition)
            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.id}</CardTitle>
                      <CardDescription>Linked to {item.caseId}</CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(getBadgeClassNames(getStatusSemanticColor(item.status)), "text-xs")}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      {getEvidenceTypeIcon(item.type)}
                      <span className="font-medium">{item.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>Collected by: {item.collectedBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>Date: {item.dateCollected}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ConditionIcon className="h-3 w-3" />
                      <span>Condition: {item.condition}</span>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-2 rounded text-xs">
                    <div className="flex items-center gap-1 mb-1">
                      <Shield className="h-3 w-3" />
                      <span className="font-medium">Blockchain Hash:</span>
                    </div>
                    <span className="font-mono text-muted-foreground">{item.blockchainHash}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleViewEvidence(item)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {item.status !== "Transferred" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleEditEvidence(item)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleBlockchainView(item)}
                    >
                      <Link className="h-4 w-4 mr-1" />
                      Blockchain
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
      {/* Bottom Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
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
        </div>
      )}
      {/* View Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <ViewEvidenceModal />
      </Dialog>
      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <EditEvidenceModal />
      </Dialog>
      {/* Blockchain Modal */}
      <Dialog open={showBlockchainModal} onOpenChange={setShowBlockchainModal}>
        <BlockchainViewModal />
      </Dialog>
      {/* Empty State */}
      {currentEvidence.length === 0 && filteredEvidence.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No evidence found {caseId ? `for Case ${caseId}` : ""}</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || typeFilter !== "all" || statusFilter !== "all" || caseId
                ? "Try adjusting your search criteria or filters"
                : "Get started by adding your first evidence"}
            </p>
            {!searchTerm && typeFilter === "all" && statusFilter === "all" && !caseId && (
              <Button variant="police" onClick={() => setShowAddEvidence(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Evidence
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default EvidenceManagement
