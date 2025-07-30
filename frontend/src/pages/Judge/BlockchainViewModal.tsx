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
  Hash,
  Calendar,
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  Search,
  Copy,
  Clock,
  Database,
  Activity,
  Zap,
} from "lucide-react"

interface BlockchainViewModalProps {
  case_: any
  isOpen: boolean
  onClose: () => void
}

const mockBlockchainEvents = [
  {
    id: "1",
    event: "Case Created",
    performedBy: "System",
    timestamp: "2025-07-12 08:00:00",
    txnHash: "0xabc123def456789abcdef123456789abcdef123456789abcdef123456789abcdef",
    blockNumber: 2847234,
    gasUsed: "21000",
    gasPrice: "20 Gwei",
    status: "confirmed",
    confirmations: 1456,
    details: {
      caseId: "CASE-001",
      crimeType: "Theft",
      assignedJudge: "Judge Sharma",
      priority: "High",
    },
  },
  {
    id: "2",
    event: "Evidence Added",
    performedBy: "Inspector Kumar",
    timestamp: "2025-07-12 10:30:00",
    txnHash: "0xdef456abc123789defabc123456789defabc123456789defabc123456789defabc",
    blockNumber: 2847245,
    gasUsed: "45000",
    gasPrice: "22 Gwei",
    status: "confirmed",
    confirmations: 1445,
    details: {
      evidenceId: "EV-001",
      evidenceType: "Video",
      evidenceHash: "0x1a2b3c4d5e6f7a8b",
      fileSize: "45.2 MB",
    },
  },
  {
    id: "3",
    event: "Lab Report Submitted",
    performedBy: "Dr. Priya Sharma",
    timestamp: "2025-07-12 16:30:00",
    txnHash: "0x789abcdef123456789abcdef123456789abcdef123456789abcdef123456789abc",
    blockNumber: 2847298,
    gasUsed: "67000",
    gasPrice: "25 Gwei",
    status: "confirmed",
    confirmations: 1392,
    details: {
      reportId: "LAB-001",
      reportType: "DNA Analysis",
      reportHash: "0x5f4e3d2c1b0a9f8e",
      conclusion: "Match Found",
    },
  },
  {
    id: "4",
    event: "Case Transferred to Judiciary",
    performedBy: "Lab Admin",
    timestamp: "2025-07-12 17:00:00",
    txnHash: "0x456789abcdef123456789abcdef123456789abcdef123456789abcdef123456789",
    blockNumber: 2847312,
    gasUsed: "32000",
    gasPrice: "23 Gwei",
    status: "confirmed",
    confirmations: 1378,
    details: {
      fromDepartment: "Forensic Lab",
      toDepartment: "Judiciary",
      transferReason: "Analysis Complete",
      urgency: "High",
    },
  },
  {
    id: "5",
    event: "Verdict Submitted",
    performedBy: "Judge Sharma",
    timestamp: "2025-07-13 14:00:00",
    txnHash: "0x999888777666555444333222111000aaabbbcccdddeeefffaaabbbcccdddeee",
    blockNumber: 2847456,
    gasUsed: "89000",
    gasPrice: "28 Gwei",
    status: "pending",
    confirmations: 0,
    details: {
      verdictType: "Guilty",
      sentence: "5 years imprisonment",
      digitalSignature: "0x1234567890abcdef",
      finalizedAt: "2025-07-13 14:00:00",
    },
  },
]

const networkStats = {
  networkName: "Ethereum Mainnet",
  currentBlock: 2847456,
  blockTime: "12.5s",
  gasPrice: "28 Gwei",
  networkStatus: "Healthy",
  totalTransactions: 5,
  totalGasUsed: "254000",
  averageConfirmationTime: "3.2 minutes",
}

export function BlockchainViewModal({ case_, isOpen, onClose }: BlockchainViewModalProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(mockBlockchainEvents[0])
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEvents = mockBlockchainEvents.filter((event) =>
    event.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.txnHash.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: { variant: "default" as const, icon: <CheckCircle className="h-3 w-3 mr-1" />, color: "text-green-600" },
      pending: { variant: "secondary" as const, icon: <Clock className="h-3 w-3 mr-1" />, color: "text-yellow-600" },
      failed: { variant: "destructive" as const, icon: <AlertCircle className="h-3 w-3 mr-1" />, color: "text-red-600" },
    }

    const config = variants[status as keyof typeof variants] || variants.pending

    return (
      <Badge variant={config.variant} className="text-xs">
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const formatHash = (hash: string, length = 10) => {
    return `${hash.slice(0, length)}...${hash.slice(-6)}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Blockchain View - {case_.id}
          </DialogTitle>
          <DialogDescription>
            View complete blockchain transaction history and verification details for this case
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Network Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Network Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Network</span>
                  </div>
                  <p className="text-xs text-green-600">{networkStats.networkStatus}</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Database className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Block Height</span>
                  </div>
                  <p className="text-xs text-blue-600">{networkStats.currentBlock.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Gas Price</span>
                  </div>
                  <p className="text-xs text-purple-600">{networkStats.gasPrice}</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Avg. Confirmation</span>
                  </div>
                  <p className="text-xs text-orange-600">{networkStats.averageConfirmationTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction List */}
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Events ({filteredEvents.length})</CardTitle>
                <CardDescription>Complete transaction history for this case</CardDescription>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedTransaction?.id === event.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedTransaction(event)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{event.event}</p>
                          {getStatusBadge(event.status)}
                        </div>
                        <span className="text-xs text-gray-500">Block #{event.blockNumber}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {event.performedBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {event.timestamp}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Hash className="h-3 w-3" />
                          <code className="truncate">{formatHash(event.txnHash)}</code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(event.txnHash)
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        {event.confirmations > 0 && (
                          <div className="text-xs text-green-600">
                            {event.confirmations} confirmations
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transaction Details */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
                <CardDescription>
                  {selectedTransaction ? `Viewing: ${selectedTransaction.event}` : "Select a transaction to view details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedTransaction ? (
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="verification">Verification</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-600">Event</Label>
                          <p className="font-medium">{selectedTransaction.event}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-600">Status</Label>
                          {getStatusBadge(selectedTransaction.status)}
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-600">Performed By</Label>
                          <p className="font-medium">{selectedTransaction.performedBy}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-600">Timestamp</Label>
                          <p className="font-medium">{selectedTransaction.timestamp}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-600">Block Number</Label>
                          <p className="font-medium">#{selectedTransaction.blockNumber}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-600">Confirmations</Label>
                          <p className="font-medium text-green-600">{selectedTransaction.confirmations}</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label className="text-gray-600">Transaction Hash</Label>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <code className="text-xs flex-1 break-all">{selectedTransaction.txnHash}</code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(selectedTransaction.txnHash)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-600">Gas Used</Label>
                          <p className="font-medium">{selectedTransaction.gasUsed}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Gas Price</Label>
                          <p className="font-medium">{selectedTransaction.gasPrice}</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="space-y-4">
                      <div className="space-y-3">
                        <Label className="text-gray-600">Event Details</Label>
                        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                          {Object.entries(selectedTransaction.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                              <span className="font-medium">{value as string}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="verification" className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-900">Verification Status</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Transaction Verified:</span>
                            <span className="text-green-600 font-medium">✓ Yes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Block Confirmed:</span>
                            <span className="text-green-600 font-medium">✓ Yes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Digital Signature:</span>
                            <span className="text-green-600 font-medium">✓ Valid</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Chain Integrity:</span>
                            <span className="text-green-600 font-medium">✓ Intact</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
