"use client"

import type React from "react"
import { useState } from "react"
import {
  Calendar,
  FileText,
  BarChart2,
  Search,
  MoreHorizontal,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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

interface Report {
  id: string
  title: string
  type: string
  date: string
  createdBy: string
  description: string
  numberOfCases: number
  status: string
  summary: string
}

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [reportType, setReportType] = useState("all")
  const [viewReport, setViewReport] = useState<Report | null>(null)
  const [editReport, setEditReport] = useState<Report | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const reportsPerPage = 5 // Set reports per page

  const [reports, setReports] = useState<Report[]>([
    {
      id: "r001",
      title: "Monthly Crime Report - June 2025",
      type: "Monthly",
      date: "2025-07-01",
      createdBy: "Admin",
      description: "A detailed overview of crime incidents reported in June 2025 within the jurisdiction.",
      numberOfCases: 128,
      status: "Published",
      summary: "Crime rates decreased by 5% compared to May 2025, with most cases related to theft and burglary.",
    },
    {
      id: "r002",
      title: "Cybercrime Summary Q2",
      type: "Quarterly",
      date: "2025-07-05",
      createdBy: "Officer-in-Charge",
      description: "Summary of cybercrime activities during the second quarter of 2025.",
      numberOfCases: 45,
      status: "Draft",
      summary:
        "Phishing attacks and online fraud incidents have increased slightly, necessitating stronger cybersecurity measures.",
    },
    {
      id: "r003",
      title: "Annual Crime Statistics 2024",
      type: "Annual",
      date: "2025-01-15",
      createdBy: "Admin",
      description: "Comprehensive report on the crime statistics and trends observed in the year 2024.",
      numberOfCases: 1540,
      status: "Published",
      summary: "Overall crime rates remained stable with a slight increase in cybercrime cases compared to 2023.",
    },
    {
      id: "r004",
      title: "Traffic Violations Analysis - July 2025",
      type: "Monthly",
      date: "2025-08-01",
      createdBy: "Investigator",
      description: "Analysis of traffic violations and accidents recorded in July 2025.",
      numberOfCases: 210,
      status: "Draft",
      summary: "Speeding and improper parking remain the most common violations.",
    },
    {
      id: "r005",
      title: "Drug Seizure Report Q1 2025",
      type: "Quarterly",
      date: "2025-04-10",
      createdBy: "Officer-in-Charge",
      description: "Report detailing drug seizures and related arrests in Q1 2025.",
      numberOfCases: 30,
      status: "Published",
      summary: "Significant increase in cannabis and synthetic drug seizures.",
    },
    {
      id: "r006",
      title: "Public Order Incidents - August 2025",
      type: "Monthly",
      date: "2025-09-01",
      createdBy: "Admin",
      description: "Overview of public order disturbances and resolutions in August 2025.",
      numberOfCases: 75,
      status: "Draft",
      summary: "Minor disturbances mostly related to public gatherings and noise complaints.",
    },
    {
      id: "r007",
      title: "Homicide Cases Review 2024",
      type: "Annual",
      date: "2025-02-20",
      createdBy: "Investigator",
      description: "In-depth review of all homicide cases from 2024, including resolution rates.",
      numberOfCases: 12,
      status: "Published",
      summary: "80% resolution rate for homicide cases in 2024, with focus on cold cases.",
    },
    {
      id: "r008",
      title: "Property Crime Trends Q3 2025",
      type: "Quarterly",
      date: "2025-10-05",
      createdBy: "Officer-in-Charge",
      description: "Analysis of property crime trends, including theft and vandalism, in Q3 2025.",
      numberOfCases: 90,
      status: "Draft",
      summary: "Increase in residential burglaries, prompting community awareness campaigns.",
    },
  ])

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = reportType === "all" || report.type === reportType
    return matchesSearch && matchesType
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage)
  const startIndex = (currentPage - 1) * reportsPerPage
  const endIndex = startIndex + reportsPerPage
  const currentReports = filteredReports.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Save edited report
  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editReport) {
      setReports((prevReports) => prevReports.map((r) => (r.id === editReport.id ? editReport : r)))
      setEditReport(null)
    }
  }

  // Generate page numbers for pagination (same logic as case management)
  const getPageNumbers = () => {
    const pages = []
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
          <p className="text-muted-foreground">View and manage reports generated by the system</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
              />
            </div>
            <Select
              value={reportType}
              onValueChange={(value) => {
                setReportType(value)
                setCurrentPage(1) // Reset to first page on filter change
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      {/* Top Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredReports.length)} of {filteredReports.length} results
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
      <div className="space-y-4">
        {currentReports.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No reports found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          currentReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">Created by: {report.createdBy}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> {report.date}
                  </p>
                  <p className="text-sm mt-2 line-clamp-2 text-muted-foreground">{report.summary}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Button variant="outline" size="sm" onClick={() => setViewReport(report)}>
                    <BarChart2 className="h-4 w-4 mr-1" /> View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" /> Download
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditReport(report)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      {/* Pagination Controls */}
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
      {/* View Report Dialog */}
      <Dialog open={!!viewReport} onOpenChange={(open) => !open && setViewReport(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>
          {viewReport && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{viewReport.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Type:</strong> {viewReport.type}
                  </p>
                  <p>
                    <strong>Date:</strong> {viewReport.date}
                  </p>
                  <p>
                    <strong>Created By:</strong> {viewReport.createdBy}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Number of Cases:</strong> {viewReport.numberOfCases}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`font-semibold ${
                        viewReport.status === "Published" ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {viewReport.status}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold">Description:</p>
                <p className="text-sm leading-relaxed">{viewReport.description}</p>
              </div>
              <div>
                <p className="font-semibold">Summary:</p>
                <p className="italic text-muted-foreground">{viewReport.summary}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Edit Report Dialog */}
      <Dialog open={!!editReport} onOpenChange={(open) => !open && setEditReport(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Report: {editReport?.title}</DialogTitle>
          </DialogHeader>
          {editReport && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <Label htmlFor="editTitle">Title *</Label>
                <Input
                  id="editTitle"
                  type="text"
                  value={editReport.title}
                  onChange={(e) => setEditReport({ ...editReport, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editType">Type *</Label>
                <Select
                  value={editReport.type}
                  onValueChange={(value) => setEditReport({ ...editReport, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editDate">Date *</Label>
                <Input
                  id="editDate"
                  type="date"
                  value={editReport.date}
                  onChange={(e) => setEditReport({ ...editReport, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editCreatedBy">Created By *</Label>
                <Input
                  id="editCreatedBy"
                  type="text"
                  value={editReport.createdBy}
                  onChange={(e) => setEditReport({ ...editReport, createdBy: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editDescription">Description:</Label>
                <Textarea
                  id="editDescription"
                  value={editReport.description}
                  onChange={(e) => setEditReport({ ...editReport, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="editNumberOfCases">Number of Cases:</Label>
                <Input
                  id="editNumberOfCases"
                  type="number"
                  value={editReport.numberOfCases}
                  onChange={(e) => setEditReport({ ...editReport, numberOfCases: Number(e.target.value) })}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="editStatus">Status:</Label>
                <Select
                  value={editReport.status}
                  onValueChange={(value) => setEditReport({ ...editReport, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editSummary">Summary:</Label>
                <Textarea
                  id="editSummary"
                  value={editReport.summary}
                  onChange={(e) => setEditReport({ ...editReport, summary: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="submit">Save</Button>
                <Button variant="outline" type="button" onClick={() => setEditReport(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Reports
