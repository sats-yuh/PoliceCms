"use client"

import type React from "react"
import { useState } from "react"
import {
  Search,
  User,
  FileText,
  Shield,
  Clock,
  Eye,
  Edit,
  Send,
  Plus,
  AlertTriangle,
  Activity,
  Download,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface AuditTrailProps {
  userRole: "Admin" | "Officer-in-Charge" | "Investigator"
  onNavigate: (section: string) => void
}

interface AuditEntry {
  id: string
  event: string
  caseId: string | null
  evidenceId: string | null
  performedBy: string
  role: string
  timestamp: string
  blockchainTxId: string | null
  blockchainNode: string | null
  details: string
  ipAddress: string
  userAgent: string
  severity: "info" | "warning" | "error" | "success"
}

const AuditTrail: React.FC<AuditTrailProps> = ({ userRole, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage] = useState(10)

  const auditEntries: AuditEntry[] = [
    {
      id: "AUDIT-001",
      event: "Case Created",
      caseId: "CASE-001",
      evidenceId: null,
      performedBy: "SI Ram Kumar",
      role: "Investigator",
      timestamp: "2025-01-10 09:00:00",
      blockchainTxId: "0xabc123...def456",
      blockchainNode: "node-mumbai-01.police.gov",
      details: "Created cybercrime investigation case for online fraud",
      ipAddress: "192.168.1.45",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      severity: "info",
    },
    {
      id: "AUDIT-002",
      event: "Evidence Added",
      caseId: "CASE-001",
      evidenceId: "EVD-001",
      performedBy: "SI Ram Kumar",
      role: "Investigator",
      timestamp: "2025-01-10 09:15:30",
      blockchainTxId: "0xdef789...abc123",
      blockchainNode: "node-mumbai-01.police.gov",
      details: "Added bank statements as evidence",
      ipAddress: "192.168.1.45",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      severity: "info",
    },
    {
      id: "AUDIT-003",
      event: "Case Edited",
      caseId: "CASE-001",
      evidenceId: null,
      performedBy: "Inspector Sharma",
      role: "Officer-in-Charge",
      timestamp: "2025-01-11 12:30:15",
      blockchainTxId: "0x111222...333444",
      blockchainNode: "node-mumbai-02.police.gov",
      details: "Updated case description and priority level",
      ipAddress: "192.168.1.67",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      severity: "warning",
    },
    {
      id: "AUDIT-004",
      event: "Evidence Edited",
      caseId: "CASE-001",
      evidenceId: "EVD-001",
      performedBy: "SI Ram Kumar",
      role: "Investigator",
      timestamp: "2025-01-11 14:00:45",
      blockchainTxId: "0x333444...555666",
      blockchainNode: "node-mumbai-01.police.gov",
      details: "Updated evidence description and storage location",
      ipAddress: "192.168.1.45",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      severity: "info",
    },
    {
      id: "AUDIT-005",
      event: "Case Transferred",
      caseId: "CASE-002",
      evidenceId: null,
      performedBy: "Admin User",
      role: "Admin",
      timestamp: "2025-01-12 10:20:00",
      blockchainTxId: "0x777888...999aaa",
      blockchainNode: "node-delhi-01.police.gov",
      details:
        "Case CASE-002 transferred from Admin User (Admin) to NFSL - Kathmandu (Forensic Lab) for forensic analysis",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Ubuntu; Linux x86_64)",
      severity: "success",
    },
    {
      id: "AUDIT-006",
      event: "Evidence Viewed",
      caseId: "CASE-001",
      evidenceId: "EVD-002",
      performedBy: "Inspector Patel",
      role: "Officer-in-Charge",
      timestamp: "2025-01-12 15:45:30",
      blockchainTxId: "0xbbb111...ccc222",
      blockchainNode: "node-mumbai-02.police.gov",
      details: "Accessed CCTV footage for review",
      ipAddress: "192.168.1.78",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      severity: "info",
    },
    {
      id: "AUDIT-007",
      event: "User Login Failed",
      caseId: null,
      evidenceId: null,
      performedBy: "unknown_user",
      role: "Unknown",
      timestamp: "2025-01-12 20:15:00",
      blockchainTxId: null,
      blockchainNode: "node-mumbai-01.police.gov",
      details: "Failed login attempt from unauthorized IP",
      ipAddress: "45.67.89.123",
      userAgent: "Mozilla/5.0 (Android 11; Mobile)",
      severity: "error",
    },
    {
      id: "AUDIT-008",
      event: "Evidence Transferred",
      caseId: "CASE-002",
      evidenceId: "EVD-004",
      performedBy: "SI Patel",
      role: "Investigator",
      timestamp: "2025-01-13 08:30:15",
      blockchainTxId: "0xddd333...eee444",
      blockchainNode: "node-mumbai-01.police.gov",
      details: "Transferred fingerprint evidence to forensic lab",
      ipAddress: "192.168.1.56",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      severity: "success",
    },
    {
      id: "AUDIT-009",
      event: "System Backup",
      caseId: null,
      evidenceId: null,
      performedBy: "System Admin",
      role: "System",
      timestamp: "2025-01-13 02:00:00",
      blockchainTxId: "0xfff555...aaa666",
      blockchainNode: "node-backup-01.police.gov",
      details: "Automated system backup completed successfully",
      ipAddress: "127.0.0.1",
      userAgent: "System/Automated",
      severity: "info",
    },
    {
      id: "AUDIT-010",
      event: "Case Status Changed",
      caseId: "CASE-003",
      evidenceId: null,
      performedBy: "Admin User",
      role: "Admin",
      timestamp: "2025-01-13 11:15:45",
      blockchainTxId: "0x888999...bbb000",
      blockchainNode: "node-delhi-01.police.gov",
      details: "Changed case status from Active to Closed",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Ubuntu; Linux x86_64)",
      severity: "warning",
    },
    {
      id: "AUDIT-011",
      event: "Case Transferred",
      caseId: "CASE-004",
      evidenceId: null,
      performedBy: "SI Ram Kumar",
      role: "Investigator",
      timestamp: "2025-01-14 09:45:00",
      blockchainTxId: "0x123abc...def789",
      blockchainNode: "node-mumbai-01.police.gov",
      details:
        "Case CASE-004 transferred from SI Ram Kumar (Investigator) to Cyber Crime Unit (Specialized Unit) for advanced analysis",
      ipAddress: "192.168.1.45",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      severity: "success",
    },
  ]

  const getActionIcon = (event: string) => {
    switch (event) {
      case "Case Created":
        return Plus
      case "Case Edited":
        return Edit
      case "Case Transferred":
        return Send
      case "Evidence Added":
        return Plus
      case "Evidence Edited":
        return Edit
      case "Evidence Viewed":
        return Eye
      case "Evidence Transferred":
        return Send
      case "User Login Failed":
        return AlertTriangle
      case "System Backup":
        return Shield
      case "Case Status Changed":
        return Activity
      default:
        return FileText
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "success":
        return "default"
      case "warning":
        return "secondary"
      case "error":
        return "destructive"
      case "info":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredEntries = auditEntries.filter((entry) => {
    const matchesSearch =
      entry.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.caseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.evidenceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = actionFilter === "all" || entry.event === actionFilter
    const matchesUser = userFilter === "all" || entry.performedBy === userFilter
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && entry.timestamp.startsWith("2025-01-13")) ||
      (dateFilter === "yesterday" && entry.timestamp.startsWith("2025-01-12")) ||
      (dateFilter === "week" && new Date(entry.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    return matchesSearch && matchesAction && matchesUser && matchesDate
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const currentEntries = filteredEntries.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleExportReport = () => {
    console.log("Exporting audit trail report...")
    // In a real application, you would trigger a download or API call here
    alert("Audit trail report export initiated! (Check console for details)")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Trail</h1>
          <p className="text-muted-foreground">Complete history of all system activities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" onClick={() => onNavigate("cases")}>
            Back to Cases
          </Button>
        </div>
      </div>
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Audit Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by event, user, case, or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="Case Created">Case Created</SelectItem>
                <SelectItem value="Case Edited">Case Edited</SelectItem>
                <SelectItem value="Case Transferred">Case Transferred</SelectItem>
                <SelectItem value="Evidence Added">Evidence Added</SelectItem>
                <SelectItem value="Evidence Edited">Evidence Edited</SelectItem>
                <SelectItem value="Evidence Viewed">Evidence Viewed</SelectItem>
                <SelectItem value="Evidence Transferred">Evidence Transferred</SelectItem>
                <SelectItem value="User Login Failed">User Login Failed</SelectItem>
                <SelectItem value="System Backup">System Backup</SelectItem>
                <SelectItem value="Case Status Changed">Case Status Changed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="SI Ram Kumar">SI Ram Kumar</SelectItem>
                <SelectItem value="Inspector Sharma">Inspector Sharma</SelectItem>
                <SelectItem value="SI Patel">SI Patel</SelectItem>
                <SelectItem value="Admin User">Admin User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      {/* Top Pagination Controls */}
      {totalPages > 1 && (
        <div className="relative flex items-center w-full">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredEntries.length)} of {filteredEntries.length} audit
            entries
          </div>
          <div className="absolute left-1/2 -translate-x-1/2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
      {/* Audit Entries */}
      <div className="space-y-4">
        <div className="space-y-3">
          {currentEntries.map((entry) => {
            const ActionIcon = getActionIcon(entry.event)
            return (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    {/* Action and Time */}
                    <div className="lg:col-span-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <ActionIcon className="h-4 w-4 text-primary" />
                        <span className="font-medium">{entry.event}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{entry.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    {/* Details */}
                    <div className="lg:col-span-4 space-y-2">
                      <p className="text-sm p-2 rounded-md bg-blue-50">{entry.details}</p>
                      <div className="flex gap-2">
                        {entry.caseId && (
                          <Badge variant="outline" className="text-xs">
                            {entry.caseId}
                          </Badge>
                        )}
                        {entry.evidenceId && (
                          <Badge variant="outline" className="text-xs">
                            {entry.evidenceId}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {/* User Info */}
                    <div className="lg:col-span-2 space-y-1">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{entry.performedBy}</span>
                      </div>
                      <Badge
                        variant={getSeverityColor(entry.severity) as any}
                        className={`text-xs ${getSeverityBgColor(entry.severity)}`}
                      >
                        {entry.role}
                      </Badge>
                    </div>
                    {/* Blockchain Info */}
                    <div className="lg:col-span-3 space-y-2">
                      {entry.blockchainTxId ? (
                        <div className="bg-muted/50 p-2 rounded text-xs">
                          <div className="flex items-center gap-1 mb-1">
                            <Shield className="h-3 w-3 text-primary" />
                            <span className="font-medium">Blockchain Tx:</span>
                          </div>
                          <span className="font-mono text-muted-foreground break-all">{entry.blockchainTxId}</span>
                          <div className="mt-1 text-muted-foreground">
                            <span className="font-bold">Node: {entry.blockchainNode}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">No blockchain record</div>
                      )}
                      <div className="text-xs text-muted-foreground">IP: {entry.ipAddress}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      {/* Empty State */}
      {currentEntries.length === 0 && filteredEntries.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No audit entries found</h3>
            <p className="text-muted-foreground">
              {searchTerm || actionFilter !== "all" || userFilter !== "all" || dateFilter !== "all"
                ? "Try adjusting your search criteria"
                : "No audit trail data available"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export { AuditTrail } 
