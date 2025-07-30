"use client"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Eye,
  FlaskConical,
  CheckCircle,
  Send,
  Plus,
  Clock,
  Blocks,
  User,
  MapPin,
  Calendar,
  MoreHorizontal,
  Activity,
} from "lucide-react"
import { AddReportModal } from "@/pages/cases/AddReportModal"
import { ApproveModal } from "@/pages/cases/ApproveModal"
import { AuditTrail } from "@/components/AuditTrail"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
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


interface Case {
  id: string
  title: string // Detailed property
  firNumber: string
  crimeType: string
  dateReceived: string
  analyst: string
  status: string
  txnHash: string
  timestamp: string
  priority: string
  officer: string // Detailed property
  date: string // Detailed property
  location: string // Detailed property
  description: string // Detailed property
  transferNote?: string // Added for transfer functionality
}

// Dummy list of analysts for demonstration (moved here as TransferModal is now inline)
const analysts = ["A. Sharma", "R. Kumar", "S. Patel", "M. Singh", "J. Doe", "K. Lee"]

export default function Cases() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false) // New state for transfer modal
  const [showNewCaseModal, setShowNewCaseModal] = useState(false)
  const [showAuditTrail, setShowAuditTrail] = useState(false) // New state for audit trail
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [cases, setCases] = useState<Case[]>([
    {
      id: "CASE-001",
      title: "Cybercrime Investigation",
      firNumber: "FIR-234",
      crimeType: "Theft",
      dateReceived: "2025-07-10",
      analyst: "A. Sharma",
      status: "Active",
      txnHash: "0x8ac9b...ef234",
      timestamp: "2025-07-11 10:20",
      priority: "High",
      officer: "Officer R. Singh",
      date: "2025-07-10",
      location: "Delhi",
      description: "Investigation of online fraud case involving multiple victims",
    },
    {
      id: "CASE-002",
      title: "Electronics Store Theft",
      firNumber: "FIR-235",
      crimeType: "Digital Forensics",
      dateReceived: "2025-07-09",
      analyst: "R. Kumar",
      status: "Awaiting Approval",
      txnHash: "0x7bd8a...cd123",
      timestamp: "2025-07-10 14:30",
      priority: "Medium",
      officer: "Officer M. Patel",
      date: "2025-07-09",
      location: "Mumbai",
      description: "Theft of electronic goods from retail store",
    },
    {
      id: "CASE-003",
      title: "Assault Investigation",
      firNumber: "FIR-236",
      crimeType: "DNA Analysis",
      dateReceived: "2025-07-08",
      analyst: "S. Patel",
      status: "Transferred",
      txnHash: "0xb5d8c...d1234",
      timestamp: "2025-07-09 09:15",
      priority: "Low",
      officer: "Officer S. Kumar",
      date: "2025-07-08",
      location: "Bangalore",
      description: "Physical assault case requiring forensic analysis",
    },
    {
      id: "CASE-004",
      title: "Fingerprint Case",
      firNumber: "FIR-237",
      crimeType: "Fingerprint",
      dateReceived: "2025-07-12",
      analyst: "M. Singh",
      status: "Approved",
      txnHash: "0xc5e8f...c7e56",
      timestamp: "2025-07-13 16:45",
      priority: "High",
      officer: "Officer M. Singh",
      date: "2025-07-12",
      location: "Chennai",
      description: "Case involving fingerprint analysis.",
    },
    {
      id: "CASE-005",
      title: "Cybercrime Case",
      firNumber: "FIR-238",
      crimeType: "Cybercrime",
      dateReceived: "2025-07-13",
      analyst: "A. Sharma",
      status: "Active",
      txnHash: "0x1b2c3...d4e5f",
      timestamp: "2025-07-14 09:00",
      priority: "High",
      officer: "Officer A. Sharma",
      date: "2025-07-13",
      location: "Kolkata",
      description: "Investigation into a cybercrime incident.",
    },
    {
      id: "CASE-006",
      title: "Homicide Investigation",
      firNumber: "FIR-239",
      crimeType: "Homicide",
      dateReceived: "2025-07-14",
      analyst: "R. Kumar",
      status: "Awaiting Approval",
      txnHash: "0x6f7a8...b9c0d",
      timestamp: "2025-07-15 11:30",
      priority: "High",
      officer: "Officer R. Kumar",
      date: "2025-07-14",
      location: "Pune",
      description: "Ongoing homicide investigation.",
    },
    {
      id: "CASE-007",
      title: "Fraud Case",
      firNumber: "FIR-240",
      crimeType: "Fraud",
      dateReceived: "2025-07-15",
      analyst: "S. Patel",
      status: "Transferred",
      txnHash: "0xe1f2g...h3i4j",
      timestamp: "2025-07-16 13:00",
      priority: "Medium",
      officer: "Officer S. Patel",
      date: "2025-07-15",
      location: "Hyderabad",
      description: "Investigation into a financial fraud.",
    },
    {
      id: "CASE-008",
      title: "Arson Investigation",
      firNumber: "FIR-241",
      crimeType: "Arson",
      dateReceived: "2025-07-16",
      analyst: "M. Singh",
      status: "Approved",
      txnHash: "0xa1b2c...d3e4f",
      timestamp: "2025-07-17 10:00",
      priority: "Low",
      officer: "Officer M. Singh",
      date: "2025-07-16",
      location: "Ahmedabad",
      description: "Case involving arson.",
    },
    {
      id: "CASE-009",
      title: "Drug Trafficking Case",
      firNumber: "FIR-242",
      crimeType: "Drug Trafficking",
      dateReceived: "2025-07-17",
      analyst: "A. Sharma",
      status: "Active",
      txnHash: "0xf5e6d...c7b8a",
      timestamp: "2025-07-18 14:00",
      priority: "High",
      officer: "Officer A. Sharma",
      date: "2025-07-17",
      location: "Delhi",
      description: "Investigation into drug trafficking.",
    },
    {
      id: "CASE-010",
      title: "Assault Case",
      firNumber: "FIR-243",
      crimeType: "Assault",
      dateReceived: "2025-07-18",
      analyst: "R. Kumar",
      status: "Awaiting Approval",
      txnHash: "0x9c8b7...a6f5e",
      timestamp: "2025-07-19 09:45",
      priority: "Medium",
      officer: "Officer R. Kumar",
      date: "2025-07-18",
      location: "Mumbai",
      description: "Case involving assault.",
    },
  ])
  const [newCase, setNewCase] = useState({
    firNo: "",
    crimeType: "",
    dateReceived: "",
    analyst: "",
    priority: "Medium",
  })

  const userRole = "Lab Supervisor" // This would typically come from authentication context

  // State for the inline Transfer Modal
  const [transferringAnalyst, setTransferringAnalyst] = useState("")
  const [transferringNote, setTransferringNote] = useState("")

  useEffect(() => {
    if (location.state && (location.state as { filterStatus?: string }).filterStatus === "Awaiting Approval") {
      setStatusFilter("Awaiting Approval")
    }
  }, [location.state])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="flex items-center gap-1 bg-gray-100 text-gray-800 border-gray-200">
            <CheckCircle className="h-3 w-3" /> {status}
          </Badge>
        )
      case "Awaiting Approval":
        return (
          <Badge className="flex items-center gap-1 bg-gray-100 text-gray-800 border-gray-200">
            <Clock className="h-3 w-3" /> {status}
          </Badge>
        )
      case "Transferred":
        return (
          <Badge className="flex items-center gap-1 bg-gray-100 text-gray-800 border-gray-200">
            <Send className="h-3 w-3" /> {status}
          </Badge>
        )
      case "Approved":
        return (
          <Badge className="flex items-center gap-1 bg-[#0047AB] text-white border-[#0047AB]">
            <CheckCircle className="h-3 w-3" /> {status}
          </Badge>
        )
      default:
        return <Badge className="flex items-center gap-1 bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">{priority} Priority</Badge>
      case "Medium":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            {priority} Priority
          </Badge>
        )
      case "Low":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {priority} Priority
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  // Helper functions for badges in modal (copied from Dashboard.tsx for consistency)
  const getPriorityBadgeForModal = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">{priority} Priority</Badge>
      case "Medium":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            {priority} Priority
          </Badge>
        )
      case "Low":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {priority} Priority
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getStatusBadgeForModal = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="flex items-center gap-1 bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>
      case "Awaiting Approval":
        return <Badge className="flex items-center gap-1 bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>
      case "Transferred":
        return <Badge className="flex items-center gap-1 bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>
      case "Approved":
        return <Badge className="flex items-center gap-1 bg-[#0047AB] text-white border-[#0047AB]">{status}</Badge>
      case "In Review":
        return <Badge className="flex items-center gap-1 bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>
      case "Closed":
        return <Badge className="flex items-center gap-1 bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>
      default:
        return <Badge className="flex items-center gap-1 bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>
    }
  }

  const canApprove = (status: string) => {
    return (userRole === "Lab Supervisor" || userRole === "Lab Admin") && status === "Awaiting Approval"
  }

  const canTransfer = (status: string) => {
    return (userRole === "Lab Supervisor" || userRole === "Lab Admin") && status === "Approved"
  }

  const canAddReport = (status: string) => {
    return status === "In Review" || status === "Active"
  }

  const filteredCases = cases.filter((case_) => {
    const matchesSearch =
      case_.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.firNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.crimeType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || statusFilter === "" || case_.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentFilteredAndPaginatedCases = filteredCases.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleNewCaseClick = () => {
    setShowNewCaseModal(true)
  }

  const handleCreateCase = () => {
    const newId = `CASE-${String(cases.length + 1).padStart(3, "0")}`
    const now = new Date()
    const newEntry: Case = {
      id: newId,
      title: newCase.crimeType || "New Case", // Default title
      firNumber: newCase.firNo,
      crimeType: newCase.crimeType,
      dateReceived: newCase.dateReceived,
      analyst: newCase.analyst,
      status: "Active",
      txnHash: `0x${Math.random().toString(16).substring(2, 10)}...`,
      timestamp: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      priority: newCase.priority,
      officer: newCase.analyst, // Assuming analyst is the officer for new cases
      date: newCase.dateReceived, // Assuming dateReceived is the case date
      location: "N/A", // Placeholder for new cases
      description: "New case added to the system.", // Placeholder description
    }
    setCases([newEntry, ...cases])
    setNewCase({
      firNo: "",
      crimeType: "",
      dateReceived: "",
      analyst: "",
      priority: "Medium",
    })
    setShowNewCaseModal(false)
    setCurrentPage(1)
  }

  const handleTransferCase = () => {
    if (selectedCase && transferringAnalyst) {
      setCases((prevCases) =>
        prevCases.map((case_) =>
          case_.id === selectedCase.id
            ? { ...case_, status: "Transferred", analyst: transferringAnalyst, transferNote: transferringNote }
            : case_,
        ),
      )
      setShowTransferModal(false)
      setTransferringAnalyst("")
      setTransferringNote("")
    }
  }

  const handleViewEvidenceFromCasesModal = () => {
    if (selectedCase) {
      navigate("/evidence", { state: { caseId: selectedCase.id } })
      setShowViewModal(false)
    }
  }

  const handleViewAuditTrail = (case_: Case) => {
    setSelectedCase(case_)
    setShowAuditTrail(true)
  }

  const renderPagination = () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1) paginate(currentPage - 1)
            }}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                paginate(pageNumber)
              }}
              isActive={pageNumber === currentPage}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < totalPages) paginate(currentPage + 1)
            }}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )

  // If showing audit trail, render the AuditTrail component
  if (showAuditTrail) {
    return (
      <AuditTrail
        userRole="Admin"
        onNavigate={(section) => {
          if (section === "cases") {
            setShowAuditTrail(false)
          }
        }}
      />
    )
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-100/40">
      <main className="flex-1 overflow-auto p-6 md:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Assigned Cases</h1>
              <p className="text-muted-foreground">Manage and track your forensic cases</p>
            </div>
            <Button className="flex items-center gap-2" onClick={handleNewCaseClick}>
              <Plus className="h-4 w-4" />
              <span>New Case</span>
            </Button>
          </div>

          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Case ID, FIR No., or Crime Type..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Awaiting Approval">Awaiting Approval</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Transferred">Transferred</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {totalPages > 1 && <div className="flex justify-center">{renderPagination()}</div>}

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Case ID</TableHead>
                  <TableHead>FIR No.</TableHead>
                  <TableHead>Crime Type</TableHead>
                  <TableHead>Date Received</TableHead>
                  <TableHead>Analyst</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Txn Hash</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentFilteredAndPaginatedCases.length > 0 ? (
                  currentFilteredAndPaginatedCases.map((case_, index) => (
                    <TableRow key={case_.id}>
                      <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                      <TableCell className="font-medium">{case_.id}</TableCell>
                      <TableCell>{case_.firNumber}</TableCell>
                      <TableCell>{case_.crimeType}</TableCell>
                      <TableCell>{case_.dateReceived}</TableCell>
                      <TableCell>{case_.analyst}</TableCell>
                      <TableCell>{getStatusBadge(case_.status)}</TableCell>
                      <TableCell className="font-mono text-sm">
                        <a
                          href={`https://etherscan.io/tx/${case_.txnHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {case_.txnHash}
                        </a>
                      </TableCell>
                      <TableCell>{case_.timestamp}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCase(case_) // Pass the full case object
                              setShowViewModal(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {canAddReport(case_.status) && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCase(case_)
                                    setShowReportModal(true)
                                  }}
                                >
                                  <FlaskConical className="h-4 w-4 mr-2" />
                                  Add Report
                                </DropdownMenuItem>
                              )}
                              {canApprove(case_.status) && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCase(case_)
                                    setShowApproveModal(true)
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve Case
                                </DropdownMenuItem>
                              )}
                              {canTransfer(case_.status) && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCase(case_)
                                    setTransferringAnalyst(case_.analyst || "")
                                    setTransferringNote("")
                                    setShowTransferModal(true)
                                  }}
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  Transfer Case
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleViewAuditTrail(case_)}>
                                <Activity className="h-4 w-4 mr-2" />
                                View Audit Trail
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No cases found matching your search or filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          {totalPages > 1 && <div className="flex justify-center">{renderPagination()}</div>}

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Blocks className="h-5 w-5" />
              <span>Blockchain Verification</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <p className="text-2xl font-bold text-success">{cases.length}</p>
                <p className="text-sm text-muted-foreground">Total Evidence Items</p>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-2xl font-bold text-primary">{cases.length}</p>
                <p className="text-sm text-muted-foreground">Blockchain Verified</p>
              </div>
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <p className="text-2xl font-bold text-warning">0</p>
                <p className="text-sm text-muted-foreground">Verification Pending</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Modals */}
        {/* Case View Modal - Integrated directly with detailed content */}
        {selectedCase && (
          <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Case Details: {selectedCase.title}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium text-muted-foreground">Case ID:</p>
                  <p className="col-span-3 font-semibold">{selectedCase.id}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium text-muted-foreground">FIR Number:</p>
                  <p className="col-span-3">{selectedCase.firNumber}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium text-muted-foreground">Crime Type:</p>
                  <p className="col-span-3">{selectedCase.crimeType}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium text-muted-foreground">Officer:</p>
                  <p className="col-span-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {selectedCase.officer}
                  </p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium text-muted-foreground">Location:</p>
                  <p className="col-span-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {selectedCase.location}
                  </p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium text-muted-foreground">Date:</p>
                  <p className="col-span-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {selectedCase.date}
                  </p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium text-muted-foreground">Status:</p>
                  <p className="col-span-3">{getStatusBadgeForModal(selectedCase.status)}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium text-muted-foreground">Priority:</p>
                  <p className="col-span-3">{getPriorityBadgeForModal(selectedCase.priority)}</p>
                </div>
                {selectedCase.transferNote && (
                  <div className="grid grid-cols-1 gap-2 mt-4">
                    <p className="text-sm font-medium text-muted-foreground">Transfer Note:</p>
                    <p className="text-base italic text-muted-foreground">{selectedCase.transferNote}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-2 mt-4">
                  <p className="text-sm font-medium text-muted-foreground">Description:</p>
                  <p className="text-base">{selectedCase.description}</p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={handleViewEvidenceFromCasesModal}>
                    <Eye className="h-4 w-4 mr-2" /> View Evidence
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <AddReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          caseId={selectedCase?.id || null}
        />

        <ApproveModal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          caseId={selectedCase?.id || null}
        />

        {/* Inline Transfer Modal */}
        {selectedCase && (
          <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
            <DialogContent className="sm:max-w-[475px]">
              <DialogHeader>
                <DialogTitle>Transfer Case {selectedCase.id}</DialogTitle>
                <DialogDescription>Select a new analyst and add a note for the case transfer.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="currentAnalyst" className="text-right">
                    Current Analyst
                  </Label>
                  <Input
                    id="currentAnalyst"
                    value={selectedCase.analyst || "N/A"}
                    className="col-span-3"
                    readOnly
                    disabled
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newAnalyst" className="text-right">
                    New Analyst
                  </Label>
                  <Select value={transferringAnalyst} onValueChange={setTransferringAnalyst}>
                    <SelectTrigger id="newAnalyst" className="col-span-3">
                      <SelectValue placeholder="Select new analyst" />
                    </SelectTrigger>
                    <SelectContent>
                      {analysts.map((analyst) => (
                        <SelectItem key={analyst} value={analyst}>
                          {analyst}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="transferNote" className="text-right pt-2">
                    Transfer Note
                  </Label>
                  <Textarea
                    id="transferNote"
                    value={transferringNote}
                    onChange={(e) => setTransferringNote(e.target.value)}
                    className="col-span-3 min-h-[80px]"
                    placeholder="Add any relevant notes for the transfer..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowTransferModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleTransferCase} disabled={!transferringAnalyst}>
                  <Send className="h-4 w-4 mr-2" /> Transfer Case
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={showNewCaseModal} onOpenChange={setShowNewCaseModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Case</DialogTitle>
              <DialogDescription>Enter the details for the new forensic case.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firNo" className="text-right">
                  FIR No.
                </Label>
                <Input
                  id="firNo"
                  value={newCase.firNo}
                  onChange={(e) => setNewCase({ ...newCase, firNo: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="crimeType" className="text-right">
                  Crime Type
                </Label>
                <Input
                  id="crimeType"
                  value={newCase.crimeType}
                  onChange={(e) => setNewCase({ ...newCase, crimeType: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dateReceived" className="text-right">
                  Date Received
                </Label>
                <Input
                  id="dateReceived"
                  type="date"
                  value={newCase.dateReceived}
                  onChange={(e) => setNewCase({ ...newCase, dateReceived: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="analyst" className="text-right">
                  Analyst
                </Label>
                <Input
                  id="analyst"
                  value={newCase.analyst}
                  onChange={(e) => setNewCase({ ...newCase, analyst: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select value={newCase.priority} onValueChange={(value) => setNewCase({ ...newCase, priority: value })}>
                  <SelectTrigger id="priority" className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCreateCase}>Create Case</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
