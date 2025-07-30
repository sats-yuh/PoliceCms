"use client"
import { useState } from "react"
import { ArrowRightLeft, Building, Calendar, Copy, Eye, Send, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type TransfersProps = {}

export default function Transfers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTransfer, setSelectedTransfer] = useState<(typeof transfers)[0] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5) // Number of items to display per page
  const [showCreateModal, setShowCreateModal] = useState(false) // State for create modal
  const [newTransfer, setNewTransfer] = useState({
    // State for new transfer form
    caseId: "",
    transferredTo: "",
    transferDate: "",
    transferredBy: "",
    receivedBy: "Pending",
    remarks: "",
  })
  const [transfers, setTransfers] = useState([
    // Make transfers stateful
    {
      id: "TRF-001",
      caseId: "CASE-003",
      transferredTo: "Delhi High Court",
      transferDate: "2025-07-09",
      status: "Completed",
      transferredBy: "Dr. R. Verma",
      receivedBy: "Court Registry",
      remarks: "All evidence and reports transferred successfully",
    },
    {
      id: "TRF-002",
      caseId: "CASE-004",
      transferredTo: "District Court - Central",
      transferDate: "2025-07-13",
      status: "In Transit",
      transferredBy: "Dr. A. Sharma",
      receivedBy: "Pending",
      remarks: "Awaiting confirmation from court registry",
    },
    {
      id: "TRF-003",
      caseId: "CASE-001",
      transferredTo: "Sessions Court",
      transferDate: "2025-07-14",
      status: "Pending",
      transferredBy: "Dr. R. Verma",
      receivedBy: "Not Received",
      remarks: "Ready for transfer - awaiting court confirmation",
    },
    {
      id: "TRF-004",
      caseId: "CASE-005",
      transferredTo: "Supreme Court of India",
      transferDate: "2025-07-15",
      status: "Completed",
      transferredBy: "Dr. S. Kumar",
      receivedBy: "Supreme Court Registry",
      remarks: "Final appeal documents submitted",
    },
    {
      id: "TRF-005",
      caseId: "CASE-006",
      transferredTo: "High Court of Mumbai",
      transferDate: "2025-07-16",
      status: "In Transit",
      transferredBy: "Dr. M. Patel",
      receivedBy: "Pending",
      remarks: "Digital evidence package en route",
    },
    {
      id: "TRF-006",
      caseId: "CASE-007",
      transferredTo: "Local Magistrate Court",
      transferDate: "2025-07-17",
      status: "Pending",
      transferredBy: "Dr. A. Sharma",
      receivedBy: "Not Received",
      remarks: "Initial hearing documents prepared",
    },
    {
      id: "TRF-007",
      caseId: "CASE-008",
      transferredTo: "Family Court",
      transferDate: "2025-07-18",
      status: "Completed",
      transferredBy: "Dr. R. Verma",
      receivedBy: "Family Court Clerk",
      remarks: "Custody case documents delivered",
    },
  ])
  const getStatusBadge = (status: string) => {
    let className = "bg-gray-100 text-gray-800 border border-gray-200" // Default class

    switch (status) {
      case "Completed":
        className = "bg-blue-600 text-white"
        break
      case "In Transit":
      case "Pending":
        className = "bg-gray-100 text-gray-800 border border-gray-200"
        break
      default:
        break
    }
    return <Badge className={className}>{status}</Badge>
  }
  const filteredTransfers = transfers.filter(
    (transfer) =>
      transfer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.transferredTo.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentFilteredAndPaginatedTransfers = filteredTransfers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredTransfers.length / itemsPerPage)
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const statsData = [
    {
      title: "Total Transfers",
      value: transfers.length.toString(),
      icon: ArrowRightLeft,
      color: "bg-white border border-gray-200",
      textColor: "text-gray-900",
    },
    {
      title: "Completed",
      value: transfers.filter((t) => t.status === "Completed").length.toString(),
      icon: Building,
      color: "bg-white border border-gray-200",
      textColor: "text-gray-900",
    },
    {
      title: "Pending",
      value: transfers.filter((t) => t.status === "Pending").length.toString(),
      icon: Calendar,
      color: "bg-white border border-gray-200",
      textColor: "text-gray-900",
    },
  ]
  const handleView = (transfer: (typeof transfers)[0]) => {
    setSelectedTransfer(transfer)
  }
  const handleCreateTransfer = () => {
    const newId = `TRF-${String(transfers.length + 1).padStart(3, "0")}`
    const newEntry = {
      id: newId,
      caseId: newTransfer.caseId,
      transferredTo: newTransfer.transferredTo,
      transferDate: newTransfer.transferDate,
      status: "Pending", // New transfers start as pending
      transferredBy: newTransfer.transferredBy,
      receivedBy: newTransfer.receivedBy,
      remarks: newTransfer.remarks,
    }
    setTransfers([newEntry, ...transfers]) // Add new transfer to the beginning of the list
    setNewTransfer({
      // Reset form
      caseId: "",
      transferredTo: "",
      transferDate: "",
      transferredBy: "",
      receivedBy: "Pending",
      remarks: "",
    })
    setShowCreateModal(false) // Close modal
    setCurrentPage(1) // Go to first page to see new entry
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
        <div>
          <h1 className="text-3xl font-bold text-foreground">Case Transfers</h1>
          <p className="text-muted-foreground">Track case transfers to judiciary system</p>
        </div>
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setShowCreateModal(true)} // This button now opens the modal
        >
          <Send className="mr-2 h-4 w-4" />
          New Transfer
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
              placeholder="Search by Transfer ID, Case ID, or Destination..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
              className="pl-10"
            />
          </div>
        </div>
      </Card>
      {/* Top Pagination */}
      {totalPages > 1 && <div className="flex justify-center">{renderPagination()}</div>}
      {/* Transfers Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transfer ID</TableHead>
              <TableHead>Case ID</TableHead>
              <TableHead>Transferred To</TableHead>
              <TableHead>Transfer Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Transferred By</TableHead>
              <TableHead>Received By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentFilteredAndPaginatedTransfers.length > 0 ? (
              currentFilteredAndPaginatedTransfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell className="font-medium">{transfer.id}</TableCell>
                  <TableCell>{transfer.caseId}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-gray-700" />
                      <span>{transfer.transferredTo}</span>
                    </div>
                  </TableCell>
                  <TableCell>{transfer.transferDate}</TableCell>
                  <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                  <TableCell>{transfer.transferredBy}</TableCell>
                  <TableCell>{transfer.receivedBy}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(transfer)}
                        aria-label={`View details for transfer ${transfer.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No transfers found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      {/* Bottom Pagination */}
      {totalPages > 1 && <div className="flex justify-center">{renderPagination()}</div>}
      {/* Transfer Process */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Transfer Process</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
              1
            </div>
            <p className="text-sm font-medium">Case Approved</p>
            <p className="text-xs text-muted-foreground">Lab supervisor approves report</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
              2
            </div>
            <p className="text-sm font-medium">Transfer Initiated</p>
            <p className="text-xs text-muted-foreground">Transfer request sent to court</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
              3
            </div>
            <p className="text-sm font-medium">In Transit</p>
            <p className="text-xs text-muted-foreground">Case documents being transferred</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
              4
            </div>
            <p className="text-sm font-medium">Completed</p>
            <p className="text-xs text-muted-foreground">Received by court registry</p>
          </div>
        </div>
      </Card>
      {/* Transfer Details Modal */}
      <Dialog open={!!selectedTransfer} onOpenChange={() => setSelectedTransfer(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedTransfer && (
            <>
              <DialogHeader>
                <DialogTitle>Transfer Details</DialogTitle>
                <DialogDescription>
                  ID: {selectedTransfer.id}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedTransfer.id)
                      // Optional: Add a temporary "Copied!" message
                    }}
                    aria-label="Copy transfer ID to clipboard"
                    className="ml-2 h-6 w-6 p-0 inline-flex items-center justify-center"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 text-sm">
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium text-muted-foreground">Case ID:</p>
                  <div className="col-span-3 flex items-center gap-2">
                    <span>{selectedTransfer.caseId}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedTransfer.caseId)
                        // Optional: Add a temporary "Copied!" message
                      }}
                      aria-label="Copy case ID to clipboard"
                      className="h-6 w-6 p-0 inline-flex items-center justify-center"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium text-muted-foreground">Transferred To:</p>
                  <p className="col-span-3 flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-700" />
                    <span>{selectedTransfer.transferredTo}</span>
                  </p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium text-muted-foreground">Transfer Date:</p>
                  <p className="col-span-3">{selectedTransfer.transferDate}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium text-muted-foreground">Status:</p>
                  <p className="col-span-3">{getStatusBadge(selectedTransfer.status)}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium text-muted-foreground">Transferred By:</p>
                  <p className="col-span-3">{selectedTransfer.transferredBy}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium text-muted-foreground">Received By:</p>
                  <p className="col-span-3">{selectedTransfer.receivedBy}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <p className="text-sm font-medium text-muted-foreground">Remarks:</p>
                  <p className="col-span-3">{selectedTransfer.remarks}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* New Transfer Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Transfer</DialogTitle>
            <DialogDescription>Fill in the details for the new case transfer.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newCaseId" className="text-right">
                Case ID
              </Label>
              <Input
                id="newCaseId"
                value={newTransfer.caseId}
                onChange={(e) => setNewTransfer({ ...newTransfer, caseId: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transferredTo" className="text-right">
                Transferred To
              </Label>
              <Input
                id="transferredTo"
                value={newTransfer.transferredTo}
                onChange={(e) => setNewTransfer({ ...newTransfer, transferredTo: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transferDate" className="text-right">
                Transfer Date
              </Label>
              <Input
                id="transferDate"
                type="date"
                value={newTransfer.transferDate}
                onChange={(e) => setNewTransfer({ ...newTransfer, transferDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transferredBy" className="text-right">
                Transferred By
              </Label>
              <Input
                id="transferredBy"
                value={newTransfer.transferredBy}
                onChange={(e) => setNewTransfer({ ...newTransfer, transferredBy: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="receivedBy" className="text-right">
                Received By
              </Label>
              <Input
                id="receivedBy"
                value={newTransfer.receivedBy}
                onChange={(e) => setNewTransfer({ ...newTransfer, receivedBy: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="remarks" className="text-right">
                Remarks
              </Label>
              <Input
                id="remarks"
                value={newTransfer.remarks}
                onChange={(e) => setNewTransfer({ ...newTransfer, remarks: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleCreateTransfer}>Create Transfer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
