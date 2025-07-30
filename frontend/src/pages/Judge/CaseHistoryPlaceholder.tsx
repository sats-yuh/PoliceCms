"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  History,
  FileText,
  Calendar,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"
import { useState } from "react"
import { CaseReviewModal } from "@/pages/Judge/CaseReviewModal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AuditTrail } from "@/components/AuditTrail"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Expanded mock historical cases for pagination
const historicalCases = Array.from({ length: 30 }, (_, i) => ({
  id: `CASE-H${(i + 1).toString().padStart(3, "0")}`,
  title: [
    "Bank Robbery Case",
    "Insurance Fraud Investigation",
    "Domestic Violence Case",
    "Cybercrime Incident",
    "Drug Trafficking Case",
  ][i % 5],
  crimeType: ["Robbery", "Fraud", "Assault", "Cybercrime", "Narcotics"][i % 5],
  dateFinalized: `2025-06-${(i % 25) + 1}`,
  verdict: [
    "<strong>Guilty</strong> - 5 years imprisonment",
    "<strong>Not Guilty</strong> - Insufficient evidence",
    "<strong>Guilty</strong> - 2 years imprisonment + counseling",
    "<strong>Case Dismissed</strong>",
    "<strong>Guilty</strong> - Life Imprisonment",
  ][i % 5],
  txnHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 8)}`,
}))

export function CaseHistory() {
  const [selectedCase, setSelectedCase] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10) // Default items per page
  const [showAuditTrail, setShowAuditTrail] = useState(false)
  const [selectedCaseForAudit, setSelectedCaseForAudit] = useState<any | null>(null)

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  // Pagination calculations
  const totalPages = Math.ceil(historicalCases.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCases = historicalCases.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when items per page changes
  }

  const openAuditTrail = (caseItem: any) => {
    setSelectedCaseForAudit(caseItem)
    setShowAuditTrail(true)
  }

  const closeAuditTrail = () => {
    setSelectedCaseForAudit(null)
    setShowAuditTrail(false)
  }

  // Reusable Pagination Component
  const PaginationControls = () => (
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
  )

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Case History</h1>
        <p className="text-muted-foreground mt-1">Review your previously finalized cases</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Total Cases Finalized</p>
              <p className="text-2xl font-bold text-foreground">127</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {"+3 this month"}
              </p>
            </div>
            <div className="absolute top-4 right-4 p-2 rounded-lg bg-gray-50 text-muted-foreground">
              <CheckCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Average Case Duration</p>
              <p className="text-2xl font-bold text-foreground">18 days</p>
              <p className="text-xs text-red-500 flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                {"-2 days from last month"}
              </p>
            </div>
            <div className="absolute top-4 right-4 p-2 rounded-lg bg-gray-50 text-muted-foreground">
              <Calendar className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Conviction Rate</p>
              <p className="text-2xl font-bold text-foreground">78%</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <History className="h-3 w-3" />
                {"+5% from last quarter"}
              </p>
            </div>
            <div className="absolute top-4 right-4 p-2 rounded-lg bg-gray-50 text-muted-foreground">
              <FileText className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pagination */}
      <PaginationControls />

      {/* Historical Cases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Finalized Cases</CardTitle>
          <CardDescription>Cases you have completed in the past 3 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Crime Type</TableHead>
                  <TableHead>Date Finalized</TableHead>
                  <TableHead>Verdict</TableHead>
                  <TableHead>Blockchain Hash</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCases.map((case_, index) => (
                  <TableRow key={case_.id}>
                    <TableCell className="font-medium">{case_.id}</TableCell>
                    <TableCell>{case_.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{case_.crimeType}</Badge>
                    </TableCell>
                    <TableCell>{case_.dateFinalized}</TableCell>
                    <TableCell className="max-w-xs">
                      <div
                        className="truncate"
                        title={case_.verdict.replace(/<[^>]*>/g, "")}
                        dangerouslySetInnerHTML={{ __html: case_.verdict }}
                      />
                    </TableCell>
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
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedCase({
                              id: case_.id,
                              caseId: case_.id,
                              crimeType: case_.crimeType,
                              dateReceived: case_.dateFinalized,
                              labReportStatus: "approved",
                              verdictStatus: "finalized",
                              txnHash: case_.txnHash,
                              timestamp: case_.dateFinalized,
                              firNumber: "N/A",
                              officers: ["N/A"],
                              location: "N/A",
                              verdictSummary: case_.verdict.replace(/<[^>]*>/g, ""),
                            })
                            setIsModalOpen(true)
                          }}
                          className="h-8 px-2"
                        >
                          <FileText className="h-3 w-3 mr-1" />
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
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No historical cases found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Pagination */}
      <PaginationControls />

      {selectedCase && (
        <CaseReviewModal
          case={selectedCase}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedCase(null)
          }}
        />
      )}

      {/* Audit Trail Modal */}
      {showAuditTrail && selectedCaseForAudit && (
        <Dialog open={showAuditTrail} onOpenChange={closeAuditTrail}>
          <DialogContent className="max-w-7xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <AuditTrail userRole="Judge" onNavigate={() => closeAuditTrail()} caseId={selectedCaseForAudit.id} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default CaseHistory
