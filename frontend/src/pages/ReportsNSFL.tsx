"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, FlaskConical, Download, Eye, Calendar, FileText, Copy } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type ReportsProps = {}

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("")
  const [reports, setReports] = useState([
    {
      id: "RPT-001",
      caseId: "CASE-001",
      testType: "Fingerprint Analysis",
      analyst: "Dr. A. Sharma",
      datePerformed: "2025-07-11",
      status: "Approved",
      fileName: "Fingerprint_Analysis_CASE-001.pdf",
      fileSize: "2.1 MB",
    },
    {
      id: "RPT-002",
      caseId: "CASE-002",
      testType: "Digital Forensics",
      analyst: "R. Kumar",
      datePerformed: "2025-07-12",
      status: "Awaiting Approval",
      fileName: "Digital_Forensics_CASE-002.pdf",
      fileSize: "5.3 MB",
    },
    {
      id: "RPT-003",
      caseId: "CASE-003",
      testType: "DNA Analysis",
      analyst: "S. Patel",
      datePerformed: "2025-07-09",
      status: "Approved",
      fileName: "DNA_Analysis_CASE-003.pdf",
      fileSize: "1.8 MB",
    },
    {
      id: "RPT-004",
      caseId: "CASE-004",
      testType: "Ballistics",
      analyst: "M. Singh",
      datePerformed: "2025-07-13",
      status: "In Progress",
      fileName: "Ballistics_CASE-004.pdf",
      fileSize: "3.2 MB",
    },
    {
      id: "RPT-005",
      caseId: "CASE-001",
      testType: "Toxicology Report",
      analyst: "Dr. A. Sharma",
      datePerformed: "2025-07-14",
      status: "Approved",
      fileName: "Toxicology_Report_CASE-001.pdf",
      fileSize: "1.5 MB",
    },
    {
      id: "RPT-006",
      caseId: "CASE-002",
      testType: "Cybersecurity Audit",
      analyst: "R. Kumar",
      datePerformed: "2025-07-15",
      status: "Awaiting Approval",
      fileName: "Cybersecurity_Audit_CASE-002.pdf",
      fileSize: "7.0 MB",
    },
    {
      id: "RPT-007",
      caseId: "CASE-003",
      testType: "Trace Evidence Analysis",
      analyst: "S. Patel",
      datePerformed: "2025-07-16",
      status: "In Progress",
      fileName: "Trace_Evidence_CASE-003.pdf",
      fileSize: "0.9 MB",
    },
  ])

  const [selectedReport, setSelectedReport] = useState<(typeof reports)[0] | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newReport, setNewReport] = useState({
    caseId: "",
    testType: "",
    analyst: "",
    datePerformed: "",
    status: "Awaiting Approval",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  // Available analysts list
  const analysts = [
    { id: "dr-a-sharma", name: "Dr. A. Sharma", specialization: "Fingerprint & Toxicology" },
    { id: "r-kumar", name: "R. Kumar", specialization: "Digital Forensics & Cybersecurity" },
    { id: "s-patel", name: "S. Patel", specialization: "DNA & Trace Evidence" },
    { id: "m-singh", name: "M. Singh", specialization: "Ballistics & Firearms" },
    { id: "dr-p-gupta", name: "Dr. P. Gupta", specialization: "Chemical Analysis" },
    { id: "k-verma", name: "K. Verma", specialization: "Document Examination" },
    { id: "dr-s-rao", name: "Dr. S. Rao", specialization: "Pathology & Autopsy" },
    { id: "a-joshi", name: "A. Joshi", specialization: "Voice & Audio Analysis" },
  ]

  // Available test types
  const testTypes = [
    "Fingerprint Analysis",
    "DNA Analysis",
    "Digital Forensics",
    "Ballistics",
    "Toxicology Report",
    "Trace Evidence Analysis",
    "Document Examination",
    "Cybersecurity Audit",
    "Voice Analysis",
    "Chemical Analysis",
    "Pathology Report",
    "Handwriting Analysis",
    "Blood Pattern Analysis",
    "Fire Investigation",
    "Explosive Analysis",
  ]

  const getStatusBadge = (status: string) => {
    let className = "bg-gray-200 text-gray-800" // Default
    switch (status) {
      case "Approved":
        className = "bg-blue-600 text-white"
        break
      case "Awaiting Approval":
        className = "bg-gray-100 text-gray-800 border border-gray-200"
        break
      case "In Progress":
        className = "bg-gray-100 text-gray-800 border border-gray-200"
        break
      default:
        break
    }
    return <Badge className={className}>{status}</Badge>
  }

  const filteredReports = reports.filter(
    (report) =>
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.testType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentFilteredAndPaginatedReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const statsData = [
    {
      title: "Total Reports",
      value: reports.length.toString(),
      icon: FileText,
      color: "bg-white border border-gray-200",
      textColor: "text-gray-900",
    },
    {
      title: "Approved",
      value: reports.filter((r) => r.status === "Approved").length.toString(),
      icon: FlaskConical,
      color: "bg-white border border-gray-200",
      textColor: "text-gray-900",
    },
    {
      title: "Pending Approval",
      value: reports.filter((r) => r.status === "Awaiting Approval").length.toString(),
      icon: Calendar,
      color: "bg-white border border-gray-200",
      textColor: "text-gray-900",
    },
  ]

  const handleView = (report: (typeof reports)[0]) => {
    setSelectedReport(report)
    setShowViewModal(true)
  }

  const handleDownload = (report: (typeof reports)[0]) => {
    console.log("Downloading:", report.fileName)
    // Add actual download logic here
  }

  const handleCreateReport = () => {
    const newId = `RPT-${String(reports.length + 1).padStart(3, "0")}`
    const fileName = `${newReport.testType.replace(/ /g, "_")}_${newReport.caseId}.pdf`
    const newEntry = {
      id: newId,
      caseId: newReport.caseId,
      testType: newReport.testType,
      analyst: newReport.analyst,
      datePerformed: newReport.datePerformed,
      status: newReport.status,
      fileName,
      fileSize: "1.0 MB",
    }
    setReports([newEntry, ...reports])
    setNewReport({ caseId: "", testType: "", analyst: "", datePerformed: "", status: "Awaiting Approval" })
    setShowCreateModal(false)
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

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lab Reports</h1>
            <p className="text-muted-foreground">Manage and review laboratory test reports</p>
          </div>
        </div>
        <Button className="bg-blue-100 text-blue-700 hover:bg-blue-200" onClick={() => setShowCreateModal(true)}>
          <FlaskConical className="mr-2 h-4 w-4" />
          <span>Add Report</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className={cn("p-6 bg-white")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className={cn("text-3xl font-bold", stat.textColor)}>{stat.value}</p>
                </div>
                <div className={cn("p-3 rounded-full", stat.color)}>
                  <Icon className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Report ID, Case ID, or Test Type..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Top Pagination */}
      {totalPages > 1 && <div className="flex justify-center">{renderPagination()}</div>}

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report ID</TableHead>
              <TableHead>Case ID</TableHead>
              <TableHead>Test Type</TableHead>
              <TableHead>Analyst</TableHead>
              <TableHead>Date Performed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentFilteredAndPaginatedReports.length > 0 ? (
              currentFilteredAndPaginatedReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.caseId}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <FlaskConical className="h-4 w-4 text-gray-700" />
                      <span>{report.testType}</span>
                    </div>
                  </TableCell>
                  <TableCell>{report.analyst}</TableCell>
                  <TableCell>{report.datePerformed}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="font-mono text-sm text-blue-600">{report.fileName}</TableCell>
                  <TableCell>{report.fileSize}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(report)}
                        aria-label={`View details for ${report.fileName}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(report)}
                        aria-label={`Download ${report.fileName}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No reports found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Bottom Pagination */}
      {totalPages > 1 && <div className="flex justify-center">{renderPagination()}</div>}

      {/* View Modal */}
      <Dialog open={showViewModal} onOpenChange={() => setShowViewModal(false)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Report ID:</p>
                <p className="col-span-3 font-semibold">{selectedReport.id}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Case ID:</p>
                <p className="col-span-3">{selectedReport.caseId}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Test Type:</p>
                <p className="col-span-3 flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-blue-600" />
                  {selectedReport.testType}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Analyst:</p>
                <p className="col-span-3">{selectedReport.analyst}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Date Performed:</p>
                <p className="col-span-3">{selectedReport.datePerformed}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Status:</p>
                <p className="col-span-3">{getStatusBadge(selectedReport.status)}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">File Name:</p>
                <div className="col-span-3 flex items-center gap-2">
                  <code className="text-sm font-mono">{selectedReport.fileName}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedReport.fileName)
                    }}
                    aria-label="Copy file name to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">File Size:</p>
                <p className="col-span-3">{selectedReport.fileSize}</p>
              </div>
              <div className="mt-4 border-t pt-4">
                <h4 className="text-md font-semibold mb-2">Report Content Preview</h4>
                <div className="flex justify-center items-center bg-muted rounded-md p-4 h-32 text-muted-foreground">
                  <FileText className="h-12 w-12" />
                  <span className="ml-2">PDF Preview Placeholder</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={() => handleDownload(selectedReport)}>
                  <Download className="h-4 w-4 mr-2" /> Download Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="caseId" className="text-right">
                Case ID
              </Label>
              <Input
                id="caseId"
                value={newReport.caseId}
                onChange={(e) => setNewReport({ ...newReport, caseId: e.target.value })}
                className="col-span-3"
                placeholder="e.g., CASE-001"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="testType" className="text-right">
                Test Type
              </Label>
              <Select
                value={newReport.testType}
                onValueChange={(value) => setNewReport({ ...newReport, testType: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  {testTypes.map((testType) => (
                    <SelectItem key={testType} value={testType}>
                      {testType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="analyst" className="text-right">
                Analyst
              </Label>
              <Select
                value={newReport.analyst}
                onValueChange={(value) => setNewReport({ ...newReport, analyst: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select analyst" />
                </SelectTrigger>
                <SelectContent>
                  {analysts.map((analyst) => (
                    <SelectItem key={analyst.id} value={analyst.name}>
                      <div className="flex flex-col">
                        <span className="font-medium">{analyst.name}</span>
                        <span className="text-xs text-muted-foreground">{analyst.specialization}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="datePerformed" className="text-right">
                Date Performed
              </Label>
              <Input
                id="datePerformed"
                type="date"
                value={newReport.datePerformed}
                onChange={(e) => setNewReport({ ...newReport, datePerformed: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateReport}>Create Report</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
