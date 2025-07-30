"use client"
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom" // Import useLocation
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Download, FileText, ImageIcon, HardDrive, Shield, Copy, PlayCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Blocks } from "lucide-react" // Import Blocks

export default function Evidence() {
  const location = useLocation() // Get location object
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEvidence, setSelectedEvidence] = useState<null | (typeof evidenceItems)[0]>(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5) // Number of items to display per page
  const evidenceItems = [
    {
      id: "EVD-001",
      caseId: "CASE-001",
      description: "Fingerprints from entry point",
      type: "Biological",
      dateCollected: "2025-07-10",
      collectedBy: "Officer R. Singh",
      status: "Analyzed",
      fileHash: "0x8ac7f2b9e4d3c1a5",
      fileSize: "2.3 MB",
      fileType: "Image",
    },
    {
      id: "EVD-002",
      caseId: "CASE-001",
      description: "Mobile phone (Samsung Galaxy)",
      type: "Digital",
      dateCollected: "2025-07-10",
      collectedBy: "Officer R. Singh",
      status: "In Analysis",
      fileHash: "0xf6e8b2d9c4a7e3f1",
      fileSize: "128 GB",
      fileType: "Device",
    },
    {
      id: "EVD-003",
      caseId: "CASE-002",
      description: "USB Drive",
      type: "Digital",
      dateCollected: "2025-07-09",
      collectedBy: "Officer M. Patel",
      status: "Analyzed",
      fileHash: "0xb5d8c2e6f9a4b7d1",
      fileSize: "16 GB",
      fileType: "Storage",
    },
    {
      id: "EVD-004",
      caseId: "CASE-003",
      description: "Blood sample",
      type: "Biological",
      dateCollected: "2025-07-08",
      collectedBy: "Officer S. Kumar",
      status: "Stored",
      fileHash: "0xc5e8f2a6b9d3c7e5",
      fileSize: "1.1 MB",
      fileType: "Document",
    },
    {
      id: "EVD-005",
      caseId: "CASE-001",
      description: "CCTV Footage from main entrance",
      type: "Digital",
      dateCollected: "2025-07-10",
      collectedBy: "Officer R. Singh",
      status: "Analyzed",
      fileHash: "0x1a2b3c4d5e6f7a8b",
      fileSize: "500 MB",
      fileType: "Video",
    },
    {
      id: "EVD-006",
      caseId: "CASE-002",
      description: "Witness Statement A",
      type: "Document",
      dateCollected: "2025-07-09",
      collectedBy: "Officer M. Patel",
      status: "Reviewed",
      fileHash: "0x9f8e7d6c5b4a3f2e",
      fileSize: "50 KB",
      fileType: "Document",
    },
    {
      id: "EVD-007",
      caseId: "CASE-003",
      description: "Forensic Report - DNA Analysis",
      type: "Document",
      dateCollected: "2025-07-12",
      collectedBy: "Dr. J. Sharma",
      status: "Completed",
      fileHash: "0x2c3d4e5f6a7b8c9d",
      fileSize: "1.5 MB",
      fileType: "Document",
    },
    {
      id: "EVD-008",
      caseId: "CASE-001",
      description: "Laptop (Dell XPS)",
      type: "Digital",
      dateCollected: "2025-07-11",
      collectedBy: "Officer R. Singh",
      status: "Pending Analysis",
      fileHash: "0x3e4f5a6b7c8d9e0f",
      fileSize: "256 GB",
      fileType: "Device",
    },
    {
      id: "EVD-009",
      caseId: "CASE-004",
      description: "Audio Recording - Interrogation",
      type: "Digital",
      dateCollected: "2025-07-13",
      collectedBy: "Detective A. Khan",
      status: "Transcribed",
      fileHash: "0x4f5a6b7c8d9e0f1a",
      fileSize: "20 MB",
      fileType: "Audio",
    },
    {
      id: "EVD-010",
      caseId: "CASE-004",
      description: "Weapon - Knife",
      type: "Physical",
      dateCollected: "2025-07-13",
      collectedBy: "Detective A. Khan",
      status: "Stored",
      fileHash: "0x5a6b7c8d9e0f1a2b",
      fileSize: "N/A",
      fileType: "Physical",
    },
  ]

  // Use useEffect to check location state on mount and apply filter
  useEffect(() => {
    if (location.state && (location.state as { caseId?: string }).caseId) {
      const targetCaseId = (location.state as { caseId: string }).caseId
      const relevantEvidence = evidenceItems.find((item) => item.caseId === targetCaseId)
      if (relevantEvidence) {
        setSelectedEvidence(relevantEvidence)
        setShowModal(true)
      }
      // Optionally, clear the state so that refreshing the page doesn't re-open the modal
      // This would require `useNavigate` here too:
      // const navigate = useNavigate();
      // navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]) // Re-run if location.state changes

  const getStatusBadge = (status: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
    if (status === "Analyzed" || status === "Completed" || status === "Reviewed" || status === "Transcribed") {
      variant = "default" // Or a custom 'success' variant if defined
    } else if (status === "In Analysis" || status === "Pending Analysis") {
      variant = "secondary" // Or a custom 'warning' variant if defined
    } else if (status === "Stored") {
      variant = "outline"
    }
    return <Badge variant={variant}>{status}</Badge>
  }
  const getTypeIcon = (type: string, fileType: string) => {
    if (type === "Digital") {
      if (fileType === "Image") return <ImageIcon className="h-4 w-4" />
      if (fileType === "Device" || fileType === "Storage") return <HardDrive className="h-4 w-4" />
      if (fileType === "Document") return <FileText className="h-4 w-4" />
      // Add more specific icons for video, audio, etc. if needed
      return <HardDrive className="h-4 w-4" />
    } else if (type === "Biological" || type === "Physical") {
      return <FileText className="h-4 w-4" /> // Generic icon for non-digital
    }
    return <FileText className="h-4 w-4" />
  }
  const filteredEvidence = evidenceItems.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage // Corrected variable usage
  const currentFilteredAndPaginatedEvidence = filteredEvidence.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredEvidence.length / itemsPerPage)
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const handleView = (item: (typeof evidenceItems)[0]) => {
    setSelectedEvidence(item)
    setShowModal(true)
  }
  const handleDownload = (item: (typeof evidenceItems)[0]) => {
    console.log("Downloading evidence:", item.id)
    // Implement actual download logic here
  }
  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedEvidence(null)
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
          <h1 className="text-3xl font-bold text-foreground">Evidence Management</h1>
          <p className="text-muted-foreground">View and manage evidence items with blockchain verification</p>
        </div>
      </div>
      {/* Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Evidence ID, Case ID, or Description..."
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
      {/* Evidence Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Evidence ID</TableHead>
              <TableHead>Case ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date Collected</TableHead>
              <TableHead>Collected By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>File Hash</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentFilteredAndPaginatedEvidence.length > 0 ? (
              currentFilteredAndPaginatedEvidence.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.caseId}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(item.type, item.fileType)}
                      <span>{item.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.type}</Badge>
                  </TableCell>
                  <TableCell>{item.dateCollected}</TableCell>
                  <TableCell>{item.collectedBy}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-3 w-3 text-blue-600" />
                      <code className="text-xs text-blue-600">{item.fileHash}</code>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{item.fileSize}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(item)}
                        aria-label={`View details for ${item.description}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(item)}
                        aria-label={`Download ${item.description}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  No evidence found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      {/* Bottom Pagination */}
      {totalPages > 1 && <div className="flex justify-center">{renderPagination()}</div>}
      {/* Blockchain Verification Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Blocks className="h-5 w-5" />
          <span>Blockchain Verification</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-success/10 rounded-lg">
            <p className="text-2xl font-bold text-success">{evidenceItems.length}</p>
            <p className="text-sm text-muted-foreground">Total Evidence Items</p>
          </div>
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <p className="text-2xl font-bold text-primary">{evidenceItems.length}</p>
            <p className="text-sm text-muted-foreground">Blockchain Verified</p>
          </div>
          <div className="text-center p-4 bg-warning/10 rounded-lg">
            <p className="text-2xl font-bold text-warning">0</p>
            <p className="text-sm text-muted-foreground">Verification Pending</p>
          </div>
        </div>
      </Card>
      {/* View Evidence Modal */}
      <Dialog open={showModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Evidence Details</DialogTitle>
          </DialogHeader>
          {selectedEvidence && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Evidence ID:</p>
                <p className="col-span-3 font-semibold">{selectedEvidence.id}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Case ID:</p>
                <p className="col-span-3">{selectedEvidence.caseId}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Description:</p>
                <p className="col-span-3">{selectedEvidence.description}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Type:</p>
                <p className="col-span-3 flex items-center gap-2">
                  {getTypeIcon(selectedEvidence.type, selectedEvidence.fileType)}
                  <Badge variant="outline">{selectedEvidence.type}</Badge>
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Date Collected:</p>
                <p className="col-span-3">{selectedEvidence.dateCollected}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Collected By:</p>
                <p className="col-span-3">{selectedEvidence.collectedBy}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Status:</p>
                <p className="col-span-3">{getStatusBadge(selectedEvidence.status)}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">File Hash:</p>
                <div className="col-span-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <code className="text-sm font-mono text-blue-600">{selectedEvidence.fileHash}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedEvidence.fileHash)
                      // Optional: Add a temporary "Copied!" message
                    }}
                    aria-label="Copy file hash to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">File Size:</p>
                <p className="col-span-3">{selectedEvidence.fileSize}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">File Type:</p>
                <p className="col-span-3">{selectedEvidence.fileType}</p>
              </div>
              {/* File Content Preview Placeholder */}
              <div className="mt-4 border-t pt-4">
                <h4 className="text-md font-semibold mb-2">File Content Preview</h4>
                {selectedEvidence.fileType === "Image" ? (
                  <div className="flex justify-center items-center bg-muted rounded-md p-4 h-32">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Image Preview Placeholder</span>
                    {/* In a real app, you'd load the image here */}
                    {/* <Image src={`/api/evidence/${selectedEvidence.id}/image`} alt="Evidence Image" width={200} height={200} className="max-h-full max-w-full object-contain" /> */}
                  </div>
                ) : selectedEvidence.fileType === "Document" ? (
                  <div className="flex justify-center items-center bg-muted rounded-md p-4 h-32 text-muted-foreground">
                    <FileText className="h-12 w-12" />
                    <span className="ml-2">Document Content Placeholder</span>
                    {/* In a real app, you'd load document content or a viewer here */}
                  </div>
                ) : selectedEvidence.fileType === "Audio" || selectedEvidence.fileType === "Video" ? (
                  <div className="flex justify-center items-center bg-muted rounded-md p-4 h-32 text-muted-foreground">
                    <PlayCircle className="h-12 w-12" />
                    <span className="ml-2">Media Content Placeholder</span>
                    {/* In a real app, you'd embed an audio/video player here */}
                  </div>
                ) : (
                  <div className="flex justify-center items-center bg-muted rounded-md p-4 h-32 text-muted-foreground">
                    <HardDrive className="h-12 w-12" />
                    <span className="ml-2">No specific preview available for this type.</span>
                  </div>
                )}
              </div>
              {/* Actions within modal */}
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={() => handleDownload(selectedEvidence)}>
                  <Download className="h-4 w-4 mr-2" /> Download File
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
