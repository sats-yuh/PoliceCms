import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Calendar, User, Hash, Clock } from "lucide-react";

interface CaseViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string | null;
}

export function CaseViewModal({ isOpen, onClose, caseId }: CaseViewModalProps) {
  // Mock data - in real app this would be fetched based on caseId
  const caseData = {
    id: "CASE-001",
    firNo: "FIR-234",
    crimeType: "Theft",
    description: "Theft of electronic devices from residential premises. Evidence includes fingerprints on entry point and digital traces.",
    dateReceived: "2025-07-10",
    dateCreated: "2025-07-09",
    priority: "High",
    status: "In Review",
    assignedAnalyst: "Dr. Anita Sharma",
    policeStation: "Central Police Station",
    investigatingOfficer: "Inspector Rajesh Kumar",
    evidenceCount: 5,
    txnHash: "0x8ac7f2b9e4d3c1a5f6e8b2d9c4a7e3f1b5d8c2e6f9a4b7d1c5e8f2a6b9d3c7e5ff",
    blockchainEntries: [
      {
        action: "Case Received",
        timestamp: "2025-07-10 09:15:00",
        hash: "0x8ac7f2b9e4d3c1a5",
        user: "System"
      },
      {
        action: "Evidence Logged",
        timestamp: "2025-07-10 10:30:00",
        hash: "0xf6e8b2d9c4a7e3f1",
        user: "Evidence Officer"
      },
      {
        action: "Assigned to Analyst",
        timestamp: "2025-07-10 11:45:00",
        hash: "0xb5d8c2e6f9a4b7d1",
        user: "Lab Supervisor"
      }
    ]
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Review":
        return <Badge variant="in-review">{status}</Badge>;
      case "Awaiting Approval":
        return <Badge variant="pending">{status}</Badge>;
      case "Transferred":
        return <Badge variant="transferred">{status}</Badge>;
      case "Approved":
        return <Badge variant="approved">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">{priority}</Badge>;
      case "Medium":
        return <Badge variant="warning">{priority}</Badge>;
      case "Low":
        return <Badge variant="success">{priority}</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Case Details - {caseData.id}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Case Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Case Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Case ID</p>
                <p className="font-medium">{caseData.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">FIR Number</p>
                <p className="font-medium">{caseData.firNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Crime Type</p>
                <p className="font-medium">{caseData.crimeType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                {getStatusBadge(caseData.status)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Priority</p>
                {getPriorityBadge(caseData.priority)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Evidence Count</p>
                <p className="font-medium">{caseData.evidenceCount} items</p>
              </div>
            </div>
          </Card>

          {/* Case Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Case Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm leading-relaxed">{caseData.description}</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date Received</p>
                      <p className="text-sm font-medium">{caseData.dateReceived}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Assigned Analyst</p>
                      <p className="text-sm font-medium">{caseData.assignedAnalyst}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Police Station</p>
                    <p className="text-sm font-medium">{caseData.policeStation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Investigating Officer</p>
                    <p className="text-sm font-medium">{caseData.investigatingOfficer}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Blockchain Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Blockchain Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Transaction Hash:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{caseData.txnHash}</code>
              </div>
              
              <div className="space-y-3">
                {caseData.blockchainEntries.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-accent/50 rounded-lg">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{entry.action}</p>
                      <p className="text-xs text-muted-foreground">by {entry.user}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{entry.timestamp}</p>
                      <code className="text-xs text-muted-foreground">{entry.hash}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="forensic">
              View Evidence
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}