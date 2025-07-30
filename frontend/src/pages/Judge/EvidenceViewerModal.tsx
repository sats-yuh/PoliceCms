"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  ImageIcon,
  Video,
  Download,
  Eye,
  Hash,
  Calendar,
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  Search,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react"

interface EvidenceViewerModalProps {
  case_: any
  isOpen: boolean
  onClose: () => void
}

const mockEvidence = [
  {
    id: "EV-001",
    name: "Security Camera Footage - Main Entrance",
    type: "Video",
    format: "MP4",
    hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
    status: "verified",
    uploadDate: "2025-07-12 10:30",
    uploadedBy: "Inspector Kumar",
    size: "45.2 MB",
    duration: "00:03:45",
    location: "Mumbai Central Store",
    description: "CCTV footage showing suspect entering the electronics store",
    chainOfCustody: [
      { officer: "Constable Patel", timestamp: "2025-07-12 10:30", action: "Evidence collected" },
      { officer: "Inspector Kumar", timestamp: "2025-07-12 11:15", action: "Evidence verified" },
      { officer: "Lab Technician", timestamp: "2025-07-12 14:20", action: "Digital analysis" },
    ],
    metadata: {
      resolution: "1920x1080",
      fps: "30",
      codec: "H.264",
      camera: "Camera-03-Main-Entrance",
    },
  },
  {
    id: "EV-002",
    name: "Fingerprint Analysis Report",
    type: "Document",
    format: "PDF",
    hash: "0x9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f",
    status: "verified",
    uploadDate: "2025-07-12 15:45",
    uploadedBy: "Dr. Forensic Analyst",
    size: "2.1 MB",
    pages: 8,
    location: "NFSL Lab",
    description: "Detailed fingerprint analysis from crime scene",
    chainOfCustody: [
      { officer: "Crime Scene Team", timestamp: "2025-07-12 09:00", action: "Prints collected" },
      { officer: "Lab Analyst", timestamp: "2025-07-12 12:00", action: "Analysis started" },
      { officer: "Senior Analyst", timestamp: "2025-07-12 15:45", action: "Report finalized" },
    ],
    metadata: {
      analysisMethod: "ACE-V Protocol",
      matchPoints: "12 points",
      confidence: "99.8%",
      database: "AFIS National Database",
    },
  },
  {
    id: "EV-003",
    name: "Crime Scene Photographs",
    type: "Image",
    format: "JPEG",
    hash: "0x5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c",
    status: "verified",
    uploadDate: "2025-07-12 11:00",
    uploadedBy: "Crime Scene Photographer",
    size: "15.8 MB",
    count: 24,
    location: "Electronics Store Crime Scene",
    description: "Comprehensive crime scene documentation",
    chainOfCustody: [
      { officer: "Crime Scene Team", timestamp: "2025-07-12 08:30", action: "Scene secured" },
      { officer: "Photographer", timestamp: "2025-07-12 09:00", action: "Photography started" },
      { officer: "Evidence Officer", timestamp: "2025-07-12 11:00", action: "Images catalogued" },
    ],
    metadata: {
      camera: "Canon EOS 5D Mark IV",
      resolution: "6720x4480",
      timestamp: "GPS Enabled",
      lighting: "Natural + Flash",
    },
  },
]

export function EvidenceViewerModal({ case_, isOpen, onClose }: EvidenceViewerModalProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const filteredEvidence = mockEvidence.filter((evidence) => {
    const matchesSearch =
      evidence.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evidence.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || evidence.type.toLowerCase() === filterType.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const getEvidenceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
        return <Video className="h-5 w-5 text-purple-600" />
      case "image":
        return <ImageIcon className="h-5 w-5 text-green-600" />
      case "document":
        return <FileText className="h-5 w-5 text-blue-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      verified: {
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

  const renderEvidencePreview = (evidence: any) => {
    switch (evidence.type.toLowerCase()) {
      case "video":
        return (
          <div className="relative bg-black rounded-lg overflow-hidden">
            <div className="aspect-video flex items-center justify-center">
              <div className="text-white text-center">
                <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm opacity-75">Video Preview</p>
                <p className="text-xs opacity-50">
                  {evidence.metadata?.resolution} • {evidence.duration}
                </p>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <div className="flex-1 bg-white/20 rounded-full h-1">
                <div className="bg-white rounded-full h-1 w-1/3"></div>
              </div>
              <Button size="sm" variant="secondary" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )
      case "image":
        return (
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-600">Image Preview</p>
                <p className="text-xs text-gray-500">
                  {evidence.count} images • {evidence.metadata?.resolution}
                </p>
              </div>
            </div>
          </div>
        )
      case "document":
        return (
          <div className="bg-red-50 rounded-lg overflow-hidden">
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-red-600" />
                <p className="text-sm text-gray-600">Document Preview</p>
                <p className="text-xs text-gray-500">
                  {evidence.pages} pages • {evidence.format}
                </p>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
            <FileText className="h-16 w-16 text-gray-400" />
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Evidence Viewer - {case_.id}
          </DialogTitle>
          <DialogDescription>
            View and analyze all evidence linked to this case with blockchain verification
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evidence Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search evidence by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="w-48">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="video">Video</option>
                    <option value="image">Images</option>
                    <option value="document">Documents</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evidence Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evidence List */}
            <Card>
              <CardHeader>
                <CardTitle>Evidence List ({filteredEvidence.length})</CardTitle>
                <CardDescription>Click on any evidence to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredEvidence.map((evidence) => (
                    <div
                      key={evidence.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedEvidence?.id === evidence.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedEvidence(evidence)}
                    >
                      <div className="flex items-start gap-3">
                        {getEvidenceIcon(evidence.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm truncate">{evidence.name}</p>
                            {getStatusBadge(evidence.status)}
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{evidence.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{evidence.type}</span>
                            <span>{evidence.size}</span>
                            <span>{evidence.uploadDate}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                            <Hash className="h-3 w-3" />
                            <code className="truncate">{evidence.hash}</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Evidence Details */}
            <Card>
              <CardHeader>
                <CardTitle>Evidence Details</CardTitle>
                <CardDescription>
                  {selectedEvidence ? `Viewing: ${selectedEvidence.name}` : "Select evidence to view details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedEvidence ? (
                  <Tabs defaultValue="preview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      <TabsTrigger value="metadata">Metadata</TabsTrigger>
                      <TabsTrigger value="custody">Chain</TabsTrigger>
                      <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
                    </TabsList>

                    <TabsContent value="preview" className="space-y-4">
                      {renderEvidencePreview(selectedEvidence)}
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Full View
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="metadata" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-gray-600">Evidence ID</Label>
                          <p className="font-medium">{selectedEvidence.id}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Type</Label>
                          <p className="font-medium">{selectedEvidence.type}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Format</Label>
                          <p className="font-medium">{selectedEvidence.format}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Size</Label>
                          <p className="font-medium">{selectedEvidence.size}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Uploaded By</Label>
                          <p className="font-medium">{selectedEvidence.uploadedBy}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Location</Label>
                          <p className="font-medium">{selectedEvidence.location}</p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-gray-600">Technical Metadata</Label>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          {Object.entries(selectedEvidence.metadata || {}).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm py-1">
                              <span className="text-gray-600">{key}:</span>
                              <span className="font-medium">{value as string}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="custody" className="space-y-4">
                      <div className="space-y-3">
                        {selectedEvidence.chainOfCustody.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{entry.action}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {entry.officer}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {entry.timestamp}
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
                            <span className="text-gray-600">Hash:</span>
                            <code className="text-xs bg-white px-2 py-1 rounded">{selectedEvidence.hash}</code>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            {getStatusBadge(selectedEvidence.status)}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Block Height:</span>
                            <span className="font-medium">2,847,392</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Confirmations:</span>
                            <span className="font-medium">1,247</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full mt-3 bg-transparent">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on Blockchain Explorer
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select evidence from the list to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
