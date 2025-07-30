"use client"

import { useState, useEffect } from "react"
import {
  Eye,
  FileText,
  ExternalLink,
  Calendar,
  MapPin,
  Users,
  Hash,
  CheckCircle,
  Clock,
  AlertCircle,
  Scale,
  Search,
  ArrowRight,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

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
  severity?: "low" | "medium" | "high"
}

interface Evidence {
  id: string
  name: string
  type: string
  hash: string
  condition: string
  storage: string
  dateCollected: string
}

interface LabReport {
  id: string
  title: string
  type: string
  dateCreated: string
  status: string
  hash: string
  createdBy: string
  approvedBy: string
  approvalDate: string
  labTechnician: string
  methodology: string
  sampleType: string
  conclusionSummary: string
}

interface CaseReviewModalProps {
  case?: Case | null
  isOpen: boolean
  onClose: () => void
  onFinalize?: (
    caseId: string,
    verdictData: { summary: string; remarks: string; dateOfJudgment: string },
  ) => Promise<string>
  initialTab?: string
  allPendingCases?: Case[]
}

const mockEvidence: Evidence[] = [
  {
    id: "1",
    name: "Fingerprint Sample A",
    type: "Biological",
    hash: "0xabc123...",
    condition: "Good",
    storage: "Lab Freezer A1",
    dateCollected: "2025-07-12",
  },
  {
    id: "2",
    name: "CCTV Footage",
    type: "Digital",
    hash: "0xdef456...",
    condition: "Excellent",
    storage: "Digital Archive",
    dateCollected: "2025-07-12",
  },
]

const mockLabReports: LabReport[] = [
  {
    id: "1",
    title: "DNA Analysis Report",
    type: "PDF",
    dateCreated: "2025-07-13",
    status: "Approved",
    hash: "0x789abc...",
    createdBy: "Dr. Sarah Johnson",
    approvedBy: "Dr. Michael Chen",
    approvalDate: "2025-07-14",
    labTechnician: "Lab Tech A. Kumar",
    methodology: "STR Analysis using ABI 3500 Genetic Analyzer",
    sampleType: "Blood sample",
    conclusionSummary: "DNA profile matches suspect with 99.99% probability",
  },
  {
    id: "2",
    title: "Toxicology Report",
    type: "PDF",
    dateCreated: "2025-07-13",
    status: "Approved",
    hash: "0x456def...",
    createdBy: "Dr. Priya Sharma",
    approvedBy: "Dr. Michael Chen",
    approvalDate: "2025-07-14",
    labTechnician: "Lab Tech R. Patel",
    methodology: "GC-MS Analysis",
    sampleType: "Blood and urine samples",
    conclusionSummary: "Presence of alcohol (0.12% BAC) and traces of cocaine detected",
  },
]

const blockchainEvents = [
  {
    event: "Case Transferred",
    performedBy: "Lab Admin",
    timestamp: "2025-07-12 08:45",
    txnHash: "0xabc123def456789...",
  },
  {
    event: "Report Approved",
    performedBy: "NFSL Supervisor",
    timestamp: "2025-07-12 09:30",
    txnHash: "0xdef456abc123789...",
  },
  {
    event: "Verdict Finalized",
    performedBy: "Judge Sharma",
    timestamp: "2025-07-13 14:00",
    txnHash: "0x999888777666555...",
  },
]

export function CaseReviewModal({
  case: propCaseData,
  isOpen,
  onClose,
  onFinalize,
  initialTab,
  allPendingCases,
}: CaseReviewModalProps) {
  const [verdictForm, setVerdictForm] = useState({
    summary: "",
    remarks: "",
    dateOfJudgment: new Date().toISOString().split("T")[0],
    signature: "",
  })
  const [activeTab, setActiveTab] = useState(initialTab || "overview")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCaseForVerdict, setSelectedCaseForVerdict] = useState<Case | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [newTxnHash, setNewTxnHash] = useState<string>("")
  const { toast } = useToast()

  const currentCaseData = propCaseData || selectedCaseForVerdict

  // Filter cases for search in verdict tab
  const filteredCases =
    allPendingCases?.filter(
      (case_) =>
        case_.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.firNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.crimeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.location.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  useEffect(() => {
    if (isOpen) {
      setVerdictForm({
        summary: "",
        remarks: "",
        dateOfJudgment: new Date().toISOString().split("T")[0],
        signature: "",
      })
      setActiveTab(initialTab || "overview")
      setSelectedCaseForVerdict(propCaseData || null)
      setSearchTerm("")
      setNewTxnHash("")
    }
  }, [isOpen, propCaseData, initialTab])

  const handleVerdictSubmit = async () => {
    if (!currentCaseData) {
      toast({
        title: "Error",
        description: "No case selected for verdict.",
        variant: "destructive",
      })
      return
    }
    if (!verdictForm.summary.trim()) {
      toast({
        title: "Error",
        description: "Verdict summary is required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      if (onFinalize) {
        const txnHash = await onFinalize(currentCaseData.caseId, verdictForm)
        setNewTxnHash(txnHash)
        toast({
          title: "Verdict Finalized",
          description: `Case ${currentCaseData.caseId} verdict has been finalized and recorded on blockchain.`,
        })
      }
    } catch (error) {
      console.error("Error finalizing verdict:", error)
      toast({
        title: "Error",
        description: "Failed to finalize verdict. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCaseSelect = (case_: Case) => {
    setSelectedCaseForVerdict(case_)
  }

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`
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

  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case "high":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            High Priority
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Medium Priority
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Low Priority
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
            Standard
          </Badge>
        )
    }
  }

  const showVerdictForm = onFinalize && currentCaseData?.verdictStatus === "pending"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Case Review: {currentCaseData?.caseId || "Select a Case"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" disabled={!currentCaseData}>
              Case Overview
            </TabsTrigger>
            <TabsTrigger value="verdict">Verdict Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {currentCaseData ? (
              <>
                {/* Case Metadata */}
                <Card>
                  <CardHeader>
                    <CardTitle>Case Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Case ID</label>
                      <p className="font-medium">{currentCaseData.caseId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">FIR Number</label>
                      <p className="font-medium">{currentCaseData.firNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Crime Type</label>
                      <p className="font-medium">{currentCaseData.crimeType}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Date Received</label>
                        <p className="font-medium">{currentCaseData.dateReceived}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Location</label>
                        <p className="font-medium">{currentCaseData.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Officers</label>
                        <p className="font-medium">{currentCaseData.officers.join(", ")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Chain of Custody Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Chain of Custody Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium">Police → Lab</p>
                          <p className="text-sm text-muted-foreground">
                            Evidence collected and transferred to forensic lab
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Complete
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium">Lab → Judiciary</p>
                          <p className="text-sm text-muted-foreground">Analysis completed and reports submitted</p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Complete
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium">Judiciary Review</p>
                          <p className="text-sm text-muted-foreground">
                            {currentCaseData.verdictStatus === "finalized"
                              ? "Verdict finalized"
                              : "Awaiting verdict finalization"}
                          </p>
                        </div>
                        {getStatusBadge(currentCaseData.verdictStatus, "verdict")}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Evidence List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Linked Evidence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockEvidence.map((evidence) => (
                        <div key={evidence.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="space-y-1">
                            <p className="font-medium">{evidence.name}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Type: {evidence.type}</span>
                              <span>Condition: {evidence.condition}</span>
                              <span>Storage: {evidence.storage}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-mono">
                              <Hash className="h-3 w-3" />
                              {evidence.hash}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Hash
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Lab Reports */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Lab Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockLabReports.map((report) => (
                        <Card key={report.id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-base font-semibold">{report.title}</CardTitle>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                  <span>Type: {report.type}</span>
                                  <span>Created: {report.dateCreated}</span>
                                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                    {report.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline">
                                  <FileText className="h-3 w-3 mr-1" />
                                  View PDF
                                </Button>
                                <Button size="sm" variant="outline">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Verify Hash
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="space-y-2">
                                <div>
                                  <span className="font-medium text-muted-foreground">Created By:</span>
                                  <p className="font-semibold text-blue-700">{report.createdBy}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-muted-foreground">Lab Technician:</span>
                                  <p className="font-medium">{report.labTechnician}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <span className="font-medium text-muted-foreground">Approved By:</span>
                                  <p className="font-semibold text-green-700">{report.approvedBy}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-muted-foreground">Approval Date:</span>
                                  <p className="font-medium">{report.approvalDate}</p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 pt-2 border-t">
                              <div>
                                <span className="font-medium text-muted-foreground text-sm">Conclusion:</span>
                                <p className="mt-1 text-sm bg-gray-50 p-2 rounded">{report.conclusionSummary}</p>
                              </div>
                            </div>

                            <div className="mt-2 pt-2 border-t">
                              <div className="flex items-center gap-1 text-xs font-mono">
                                <Hash className="h-3 w-3" />
                                <span className="font-medium">Hash:</span>
                                <span>{report.hash}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Blockchain Anchors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      Blockchain Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {blockchainEvents.map((event, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="space-y-1">
                            <p className="font-medium">{event.event}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>By: {event.performedBy}</span>
                              <span>{event.timestamp}</span>
                            </div>
                          </div>
                          <div className="text-xs font-mono flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            {truncateHash(event.txnHash)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-8">
                <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-semibold">No case selected for review.</p>
                <p className="text-muted-foreground mt-2">Please select a case from the table or the verdict tab.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="verdict" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verdict Entry Form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Detailed Case Selection - only if no case is pre-selected */}
                {!propCaseData && allPendingCases && allPendingCases.length > 0 && !selectedCaseForVerdict && (
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Select Case to Finalize *</Label>

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search cases by ID, FIR No, Crime Type, or Location..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Cases List */}
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-3">
                        {filteredCases.map((case_) => (
                          <Card
                            key={case_.id}
                            className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
                            onClick={() => handleCaseSelect(case_)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <CardTitle className="text-lg font-semibold text-blue-700">{case_.caseId}</CardTitle>
                                  <p className="text-sm text-muted-foreground">FIR: {case_.firNumber}</p>
                                </div>
                                {getSeverityBadge(case_.severity)}
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                    <span className="font-medium">Crime Type:</span>
                                    <span>{case_.crimeType}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-500" />
                                    <span className="font-medium">Date Received:</span>
                                    <span>{case_.dateReceived}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-green-500" />
                                    <span className="font-medium">Location:</span>
                                    <span>{case_.location}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-purple-500" />
                                    <span className="font-medium">Officers:</span>
                                    <span>{case_.officers.join(", ")}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-orange-500" />
                                    <span className="font-medium">Evidence:</span>
                                    <span>{case_.evidence?.length || 0} items</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-teal-500" />
                                    <span className="font-medium">Current Txn:</span>
                                    <code className="text-xs font-mono">{truncateHash(case_.txnHash)}</code>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 pt-3 border-t">
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="bg-gray-100 text-gray-800">
                                    Lab Report: {case_.labReportStatus}
                                  </Badge>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1 bg-transparent"
                                  >
                                    Select Case
                                    <ArrowRight className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        {filteredCases.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            No pending cases found matching your search criteria.
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {/* Selected Case Summary */}
                {selectedCaseForVerdict && !propCaseData && (
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Selected Case: {selectedCaseForVerdict.caseId}</span>
                        <Button variant="outline" size="sm" onClick={() => setSelectedCaseForVerdict(null)}>
                          Change Case
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Crime Type:</span>
                          <p>{selectedCaseForVerdict.crimeType}</p>
                        </div>
                        <div>
                          <span className="font-medium">Location:</span>
                          <p>{selectedCaseForVerdict.location}</p>
                        </div>
                        <div>
                          <span className="font-medium">FIR Number:</span>
                          <p>{selectedCaseForVerdict.firNumber}</p>
                        </div>
                        <div>
                          <span className="font-medium">Current Transaction:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                              {selectedCaseForVerdict.txnHash}
                            </code>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(`https://etherscan.io/tx/${selectedCaseForVerdict.txnHash}`, "_blank")
                              }
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Verdict Form - only if a case is selected and pending */}
                {currentCaseData && currentCaseData.verdictStatus === "pending" && showVerdictForm ? (
                  <>
                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="summary">Verdict Summary *</Label>
                      <Textarea
                        id="summary"
                        placeholder="Enter your final decision and judgment..."
                        value={verdictForm.summary}
                        onChange={(e) => setVerdictForm((prev) => ({ ...prev, summary: e.target.value }))}
                        rows={4}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="remarks">Remarks</Label>
                      <Textarea
                        id="remarks"
                        placeholder="Optional reasoning and additional comments..."
                        value={verdictForm.remarks}
                        onChange={(e) => setVerdictForm((prev) => ({ ...prev, remarks: e.target.value }))}
                        rows={3}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfJudgment">Date of Judgment</Label>
                      <Input
                        id="dateOfJudgment"
                        type="date"
                        value={verdictForm.dateOfJudgment}
                        onChange={(e) => setVerdictForm((prev) => ({ ...prev, dateOfJudgment: e.target.value }))}
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Transaction Hash Display */}
                    {newTxnHash && (
                      <Card className="border-green-200 bg-green-50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="h-5 w-5" />
                            Verdict Finalized Successfully
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">New Transaction Hash:</Label>
                            <div className="flex items-center gap-2">
                              <code className="bg-white px-2 py-1 rounded text-sm font-mono border">{newTxnHash}</code>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`https://etherscan.io/tx/${newTxnHash}`, "_blank")}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View on Etherscan
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AlertCircle className="h-4 w-4" />
                        Digital signature will be captured via MetaMask upon finalization
                      </div>

                      <div className="flex items-center gap-4">
                        <Button
                          onClick={handleVerdictSubmit}
                          className="bg-primary hover:bg-primary/90"
                          disabled={isSubmitting || !verdictForm.summary.trim() || !currentCaseData || !!newTxnHash}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {isSubmitting ? "Finalizing..." : "Finalize & Close Case"}
                        </Button>
                        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                          {newTxnHash ? "Close" : "Cancel"}
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>• This action will trigger a blockchain transaction</p>
                        <p>• Verdict summary and signature hash will be stored permanently</p>
                        <p>• Case will be locked for future edits</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    {currentCaseData?.verdictStatus === "finalized" ? (
                      <>
                        <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                        <p className="text-lg font-semibold">Verdict for this case has been finalized.</p>
                        <p className="text-muted-foreground mt-2">
                          Summary: {currentCaseData.verdictSummary || "No summary available."}
                        </p>
                      </>
                    ) : (
                      <>
                        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-semibold">
                          {propCaseData ? "This case is not pending a verdict." : "Please select a case to finalize."}
                        </p>
                        <p className="text-muted-foreground mt-2">
                          {propCaseData
                            ? "Only cases with 'pending' verdict status can be finalized."
                            : "Choose a case from the detailed list above to proceed with finalization."}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
