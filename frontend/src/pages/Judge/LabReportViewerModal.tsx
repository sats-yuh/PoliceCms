"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Download,
  Eye,
  Hash,
  Calendar,
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Microscope,
  Dna,
  Fingerprint,
  Camera,
} from "lucide-react"

interface LabReportViewerModalProps {
  case_: any
  isOpen: boolean
  onClose: () => void
}

const mockLabReports = [
  {
    id: "LAB-001",
    title: "Forensic DNA Analysis Report",
    type: "DNA Analysis",
    format: "PDF",
    hash: "0x5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c",
    status: "approved",
    approvedBy: "Dr. Priya Sharma",
    approvedDate: "2025-07-12 16:30",
    labName: "National Forensic Sciences Laboratory",
    labCode: "NFSL-MUM-001",
    size: "8.5 MB",
    pages: 15,
    priority: "high",
    description: "Complete DNA profiling and comparison analysis from crime scene samples",
    findings: {
      summary: "DNA profile obtained from evidence matches suspect sample with 99.99% probability",
      conclusion: "Strong evidence linking suspect to crime scene",
      recommendations: "DNA evidence supports prosecution case",
    },
    technicalDetails: {
      method: "STR Analysis using AmpFlSTR Identifiler Plus Kit",
      equipment: "Applied Biosystems 3500 Genetic Analyzer",
      standards: "ISO/IEC 17025:2017 compliant",
      qualityControl: "Positive and negative controls passed",
    },
    samples: [
      { id: "S001", type: "Blood stain", location: "Crime scene floor", result: "Full profile obtained" },
      { id: "S002", type: "Reference sample", location: "Suspect buccal swab", result: "Full profile obtained" },
      { id: "S003", type: "Control sample", location: "Victim reference", result: "Full profile obtained" },
    ],
    timeline: [
      { date: "2025-07-12 09:00", event: "Samples received", officer: "Lab Technician A" },
      { date: "2025-07-12 10:30", event: "DNA extraction started", officer: "Senior Analyst" },
      { date: "2025-07-12 14:00", event: "PCR amplification completed", officer: "Lab Technician B" },
      { date: "2025-07-12 15:30", event: "Analysis completed", officer: "Senior Analyst" },
      { date: "2025-07-12 16:30", event: "Report approved", officer: "Dr. Priya Sharma" },
    ],
  },
  {
    id: "LAB-002",
    title: "Fingerprint Analysis Report",
    type: "Fingerprint Analysis",
    format: "PDF",
    hash: "0x9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f",
    status: "approved",
    approvedBy: "Inspector Rajesh Kumar",
    approvedDate: "2025-07-12 14:15",
    labName: "State Forensic Laboratory",
    labCode: "SFL-DEL-002",
    size: "4.2 MB",
    pages: 8,
    priority: "medium",
    description: "Latent fingerprint analysis and AFIS database comparison",
    findings: {
      summary: "12 minutiae points matched between crime scene print and suspect",
      conclusion: "Positive identification established",
      recommendations: "Fingerprint evidence admissible in court",
    },
    technicalDetails: {
      method: "ACE-V (Analysis, Comparison, Evaluation, Verification)",
      equipment: "Morpho AFIS System",
      standards: "IAI Standards for fingerprint examination",
      qualityControl: "Blind verification completed",
    },
    samples: [
      { id: "FP001", type: "Latent print", location: "Door handle", result: "12 minutiae identified" },
      { id: "FP002", type: "Reference print", location: "Suspect card", result: "Clear impressions" },
    ],
    timeline: [
      { date: "2025-07-12 08:30", event: "Prints received", officer: "Evidence Officer" },
      { date: "2025-07-12 09:15", event: "Enhancement started", officer: "Fingerprint Analyst" },
      { date: "2025-07-12 11:00", event: "AFIS search completed", officer: "Senior Analyst" },
      { date: "2025-07-12 13:30", event: "Verification completed", officer: "Independent Examiner" },
      { date: "2025-07-12 14:15", event: "Report approved", officer: "Inspector Rajesh Kumar" },
    ],
  },
  {
    id: "LAB-003",
    title: "Digital Evidence Analysis Report",
    type: "Digital Forensics",
    format: "PDF",
    hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
    status: "approved",
    approvedBy: "Cyber Crime Expert",
    approvedDate: "2025-07-12 18:45",
    labName: "Cyber Forensics Laboratory",
    labCode: "CFL-BLR-003",
    size: "12.8 MB",
    pages: 22,
    priority: "high",
    description: "Mobile phone and computer forensic analysis",
    findings: {
      summary: "Deleted messages and browsing history recovered showing criminal intent",
      conclusion: "Digital evidence supports criminal charges",
      recommendations: "Evidence chain of custody maintained throughout analysis",
    },
    technicalDetails: {
      method: "Physical and logical acquisition using Cellebrite UFED",
      equipment: "Cellebrite UFED Touch 2, EnCase Forensic v21",
      standards: "NIST SP 800-86 guidelines followed",
      qualityControl: "Hash verification and write-blocking used",
    },
    samples: [
      { id: "MOB001", type: "Samsung Galaxy", location: "Suspect possession", result: "Full extraction completed" },
      {
        id: "LAP001",
        type: "Dell Laptop",
        location: "Suspect residence",
        result: "Partial recovery due to encryption",
      },
    ],
    timeline: [
      { date: "2025-07-12 10:00", event: "Devices received", officer: "Digital Evidence Officer" },
      { date: "2025-07-12 11:30", event: "Acquisition started", officer: "Forensic Analyst" },
      { date: "2025-07-12 15:00", event: "Data extraction completed", officer: "Senior Analyst" },
      { date: "2025-07-12 17:30", event: "Analysis completed", officer: "Forensic Analyst" },
      { date: "2025-07-12 18:45", event: "Report approved", officer: "Cyber Crime Expert" },
    ],
  },
]

export function LabReportViewerModal({ case_, isOpen, onClose }: LabReportViewerModalProps) {
  const [selectedReport, setSelectedReport] = useState<any>(mockLabReports[0])

  const getReportIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "dna analysis":
        return <Dna className="h-5 w-5 text-purple-600" />
      case "fingerprint analysis":
        return <Fingerprint className="h-5 w-5 text-blue-600" />
      case "digital forensics":
        return <Camera className="h-5 w-5 text-green-600" />
      default:
        return <Microscope className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: {
        variant: "default" as const,
        icon: <CheckCircle className="h-3 w-3 mr-1" />,
        color: "text-green-600",
      },
      pending: {
        variant: "secondary" as const,
        icon: <AlertCircle className="h-3 w-3 mr-1" />,
        color: "text-yellow-600",
      },
      rejected: {
        variant: "destructive" as const,
        icon: <AlertCircle className="h-3 w-3 mr-1" />,
        color: "text-red-600",
      },
    }

    const config = variants[status as keyof typeof variants] || variants.pending

    return (
      <Badge variant={config.variant} className="text-xs">
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "destructive" as const,
      medium: "secondary" as const,
      low: "outline" as const,
    }

    return (
      <Badge variant={variants[priority as keyof typeof variants] || "secondary"} className="text-xs">
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lab Reports - {case_.id}
          </DialogTitle>
          <DialogDescription>View detailed laboratory analysis reports with blockchain verification</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lab Reports ({mockLabReports.length})</CardTitle>
              <CardDescription>Click to view report details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockLabReports.map((report) => (
                  <div
                    key={report.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedReport?.id === report.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-start gap-3">
                      {getReportIcon(report.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm truncate">{report.title}</p>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(report.status)}
                          {getPriorityBadge(report.priority)}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{report.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{report.pages} pages</span>
                          <span>{report.size}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <Hash className="h-3 w-3" />
                          <code className="truncate">{report.hash}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getReportIcon(selectedReport.type)}
                      {selectedReport.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {selectedReport.labName} • {selectedReport.labCode}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="findings">Findings</TabsTrigger>
                    <TabsTrigger value="samples">Samples</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-600">Report ID</Label>
                        <p className="font-medium">{selectedReport.id}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Type</Label>
                        <p className="font-medium">{selectedReport.type}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Status</Label>
                        {getStatusBadge(selectedReport.status)}
                      </div>
                      <div>
                        <Label className="text-gray-600">Priority</Label>
                        {getPriorityBadge(selectedReport.priority)}
                      </div>
                      <div>
                        <Label className="text-gray-600">Approved By</Label>
                        <p className="font-medium">{selectedReport.approvedBy}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Approved Date</Label>
                        <p className="font-medium">{selectedReport.approvedDate}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-gray-600">Description</Label>
                      <p className="mt-1 text-sm">{selectedReport.description}</p>
                    </div>

                    <div>
                      <Label className="text-gray-600">Technical Details</Label>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg space-y-2">
                        {Object.entries(selectedReport.technicalDetails).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                            <span className="font-medium text-right max-w-xs">{value as string}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="findings" className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <Label className="text-green-800 font-medium">Summary</Label>
                        <p className="text-sm text-green-700 mt-1">{selectedReport.findings.summary}</p>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg">
                        <Label className="text-blue-800 font-medium">Conclusion</Label>
                        <p className="text-sm text-blue-700 mt-1">{selectedReport.findings.conclusion}</p>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg">
                        <Label className="text-purple-800 font-medium">Recommendations</Label>
                        <p className="text-sm text-purple-700 mt-1">{selectedReport.findings.recommendations}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="samples" className="space-y-4">
                    <div className="space-y-3">
                      {selectedReport.samples.map((sample: any, index: number) => (
                        <div key={sample.id} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{sample.id}</p>
                              <p className="text-xs text-gray-600">{sample.type}</p>
                            </div>
                          </div>
                          <div className="ml-11 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Location:</span>
                              <span className="font-medium">{sample.location}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Result:</span>
                              <span className="font-medium">{sample.result}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-4">
                    <div className="space-y-3">
                      {selectedReport.timeline.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{entry.event}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {entry.officer}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {entry.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="blockchain" className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">Blockchain Verification</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Report Hash:</span>
                          <code className="text-xs bg-white px-2 py-1 rounded">{selectedReport.hash}</code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          {getStatusBadge(selectedReport.status)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Block Height:</span>
                          <span className="font-medium">2,847,456</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Confirmations:</span>
                          <span className="font-medium">1,183</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lab Signature:</span>
                          <span className="font-medium text-green-600">Verified ✓</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full mt-3 bg-transparent">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Blockchain Explorer
                      </Button>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">Integrity Verified</span>
                      </div>
                      <p className="text-sm text-green-700">
                        This report has been cryptographically signed and its integrity verified on the blockchain. Any
                        tampering would be immediately detectable.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
