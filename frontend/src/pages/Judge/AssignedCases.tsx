"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Search, Filter, Eye, Calendar, FileText, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CaseReviewModal } from "@/pages/Judge/CaseReviewModal"
import { toast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AuditTrail } from "@/components/AuditTrail"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface Case {
  id: string
  caseId: string
  crimeType: string
  dateReceived: string
  labReportStatus: "approved" | "pending" | "rejected"
  verdictStatus: "pending" | "finalized"
  txnHash: string
  timestamp: string
  firNumber: string
  officers: string[]
  location: string
  verdictSummary?: string
  evidence?: string[]
  witnesses?: string[]
  severity: "low" | "medium" | "high"
}

// Expanded mock cases for pagination
const mockCases: Case[] = Array.from({ length: 25 }, (_, i) => ({
  id: String(i + 1),
  caseId: `CASE-${(i + 1).toString().padStart(3, "0")}`,
  crimeType: ["Theft", "Fraud", "Assault", "Burglary", "Cybercrime"][i % 5],
  dateReceived: `2025-07-${(i % 20) + 1}`,
  labReportStatus: ["approved", "pending", "rejected"][i % 3] as "approved" | "pending" | "rejected",
  verdictStatus: i % 2 === 0 ? "pending" : "finalized",
  txnHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 8)}`,
  timestamp: `2025-07-${(i % 20) + 1} 10:00`,
  firNumber: `FIR-2025-${(i + 1).toString().padStart(3, "0")}`,
  officers: [`Officer ${String.fromCharCode(65 + (i % 5))}`],
  location: ["Downtown", "Business", "Residential", "Suburban", "Industrial"][i % 5] + " District",
  verdictSummary: i % 2 !== 0 ? "Defendant found guilty." : undefined,
  evidence: [`Evidence ${i + 1}A`, `Evidence ${i + 1}B`],
  witnesses: [`Witness ${i + 1}`, `Witness ${i + 2}`],
  severity: ["low", "medium", "high"][i % 3] as "low" | "medium" | "high",
}))

export function AssignedCases() {
  console.log("AssignedCases component is rendering")
  const location = useLocation()
  const [cases, setCases] = useState<Case[]>(mockCases)
  const [selectedCaseForModal, setSelectedCaseForModal] = useState<Case | null>(null)
  const [modalInitialTab, setModalInitialTab] = useState<string>("overview")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showAuditTrail, setShowAuditTrail] = useState(false)
  const [selectedCaseForAudit, setSelectedCaseForAudit] = useState<Case | null>(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filters, setFilters] = useState({
    searchTerm: "",
    verdictStatus: "",
  })

  const filteredCases = cases.filter((case_) => {
    const lowerCaseSearchTerm = filters.searchTerm.toLowerCase()
    return (
      (!filters.searchTerm ||
        case_.caseId.toLowerCase().includes(lowerCaseSearchTerm) ||
        case_.firNumber.toLowerCase().includes(lowerCaseSearchTerm) ||
        case_.crimeType.toLowerCase().includes(lowerCaseSearchTerm)) &&
      (!filters.verdictStatus || case_.verdictStatus === filters.verdictStatus)
    )
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCases = filteredCases.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  const getStatusBadge = (status: string, type: "lab" | "verdict") => {
    if (type === "lab") {
      switch (status) {
        case "approved":
          return (
            <Badge variant="secondary" className="bg-blue-700 text-white">
              Approved
            </Badge>
          )
        case "pending":
          return (
            <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
              Pending
            </Badge>
          )
        case "rejected":
          return <Badge variant="destructive">Rejected</Badge>
        default:
          return <Badge variant="outline">{status}</Badge>
      }
    } else {
      switch (status) {
        case "pending":
          return (
            <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
              Pending
            </Badge>
          )
        case "finalized":
          return (
            <Badge variant="secondary" className="bg-blue-700 text-white">
              Finalized
            </Badge>
          )
        default:
          return <Badge variant="outline">{status}</Badge>
      }
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  const handleFinalizeVerdict = async (
    caseId: string,
    verdictData: { summary: string; remarks: string; dateOfJudgment: string },
  ) => {
    console.log(`Submitting verdict for ${caseId}:`, verdictData)

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate new transaction hash
    const newTxnHash = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 8)}`

    setCases((prevCases) =>
      prevCases.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              verdictStatus: "finalized",
              verdictSummary: verdictData.summary,
              txnHash: newTxnHash,
            }
          : c,
      ),
    )

    toast({
      title: "Verdict Finalized",
      description: `Case ${caseId} verdict has been finalized and recorded on blockchain.`,
    })

    return newTxnHash
  }

  const openReviewModal = (caseItem: Case) => {
    setSelectedCaseForModal(caseItem)
    setModalInitialTab("overview")
    setIsModalOpen(true)
  }

  const openGeneralFinalizeModal = () => {
    setSelectedCaseForModal(null)
    setModalInitialTab("verdict")
    setIsModalOpen(true)
  }

  const closeCaseModal = () => {
    setSelectedCaseForModal(null)
    setModalInitialTab("overview")
    setIsModalOpen(false)
  }

  const pendingCases = cases.filter((c) => c.verdictStatus === "pending")

  // Effect to open the modal if the query parameter is present
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    if (queryParams.get("openVerdictForm") === "true") {
      openGeneralFinalizeModal()
    }
  }, [location.search])

  const openAuditTrail = (caseItem: Case) => {
    setSelectedCaseForAudit(caseItem)
    setShowAuditTrail(true)
  }

  const closeAuditTrail = () => {
    setSelectedCaseForAudit(null)
    setShowAuditTrail(false)
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Assigned Cases</h2>
          <p className="text-muted-foreground">Review and finalize verdicts for assigned cases</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredCases.length} cases
          </Badge>
          <Button
            onClick={openGeneralFinalizeModal}
            className="flex items-center gap-1"
            disabled={pendingCases.length === 0}
          >
            <FileText className="h-4 w-4" />
            Finalize Verdict
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <CardContent className="p-0 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Case ID, FIR No, or Crime Type..."
              className="pl-9 w-full"
              value={filters.searchTerm}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
            />
          </div>
          <Select
            value={filters.verdictStatus || "all"}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, verdictStatus: value === "all" ? "" : value }))}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="finalized">Finalized</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Top Pagination and Page Size Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Items per page:</span>
          <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-[80px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Cases Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Crime Type</TableHead>
                  <TableHead>Date Received</TableHead>
                  <TableHead>Lab Report Status</TableHead>
                  <TableHead>Verdict Status</TableHead>
                  <TableHead>Txn Hash</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="w-40">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCases.map((case_, index) => (
                  <TableRow key={case_.id} className="hover:bg-accent">
                    <TableCell className="font-medium">{indexOfFirstItem + index + 1}</TableCell>
                    <TableCell className="font-medium text-foreground">{case_.caseId}</TableCell>
                    <TableCell>{case_.crimeType}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {case_.dateReceived}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(case_.labReportStatus, "lab")}</TableCell>
                    <TableCell>{getStatusBadge(case_.verdictStatus, "verdict")}</TableCell>
                    <TableCell>
                      <a
                        href={`https://etherscan.io/tx/${case_.txnHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs font-mono"
                      >
                        {truncateHash(case_.txnHash)}
                      </a>
                    </TableCell>
                    <TableCell>{case_.timestamp}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="outline" onClick={() => openReviewModal(case_)} className="h-8 px-2">
                          <Eye className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openAuditTrail(case_)}>
                              <FileText className="h-4 w-4 mr-2" />
                              View Audit Trail
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {currentCases.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No cases found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Items per page:</span>
          <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-[80px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Case Review Modal */}
      {isModalOpen && selectedCaseForModal && (
        <CaseReviewModal
          case={selectedCaseForModal}
          isOpen={isModalOpen}
          onClose={closeCaseModal}
          onFinalize={handleFinalizeVerdict}
          initialTab={modalInitialTab}
          allPendingCases={pendingCases}
        />
      )}

      {/* Audit Trail Modal */}
      {showAuditTrail && selectedCaseForAudit && (
        <Dialog open={showAuditTrail} onOpenChange={closeAuditTrail}>
          <DialogContent className="max-w-7xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <AuditTrail userRole="Judge" onNavigate={() => closeAuditTrail()} caseId={selectedCaseForAudit.caseId} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default AssignedCases
