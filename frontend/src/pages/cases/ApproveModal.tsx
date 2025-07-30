import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, FileText, Hash, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string | null;
}

export function ApproveModal({ isOpen, onClose, caseId }: ApproveModalProps) {
  const { toast } = useToast();
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [action, setAction] = useState<"approve" | "revise" | null>(null);

  // Mock data - in real app this would be fetched based on caseId
  const caseData = {
    id: "CASE-002",
    firNo: "FIR-235",
    crimeType: "Digital Forensics",
    status: "Awaiting Approval",
    analyst: "R. Kumar",
    testType: "Digital Forensics",
    datePerformed: "2025-07-12",
    evidenceItems: ["EVD-002", "EVD-003"],
    reportFile: "Digital_Forensics_Report_CASE-002.pdf",
    testDescription: "Comprehensive digital forensics analysis of mobile device and USB drive. Extracted data includes deleted files, communication logs, and metadata analysis.",
    txnHash: "0x9bd7f3c8e5d4c2a6f7e9b3d0c5a8e4f2b6d9c3e7f0a5b8d2c6e9f3a7b0d4c8e6ae"
  };

  const handleSubmit = async (selectedAction: "approve" | "revise") => {
    setAction(selectedAction);
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (selectedAction === "approve") {
        toast({
          title: "Case Approved Successfully",
          description: `${caseId} has been approved and finalized. The case is now ready for judiciary transfer.`,
          variant: "default"
        });
      } else {
        toast({
          title: "Revision Requested",
          description: `${caseId} has been sent back for revision with your remarks.`,
          variant: "default"
        });
      }
      
      onClose();
      setRemarks("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setAction(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Approve Lab Report & Finalize - {caseId}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Case Overview */}
          <Card className="p-4 bg-accent/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Case ID</p>
                <p className="font-medium">{caseData.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">FIR No.</p>
                <p className="font-medium">{caseData.firNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Crime Type</p>
                <p className="font-medium">{caseData.crimeType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Status</p>
                <Badge variant="pending">{caseData.status}</Badge>
              </div>
            </div>
          </Card>

          {/* Test Report Preview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Test Report Preview</span>
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Test Type</p>
                  <p className="font-medium">{caseData.testType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date Performed</p>
                  <p className="font-medium">{caseData.datePerformed}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Analyst</p>
                  <p className="font-medium">{caseData.analyst}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Evidence Items</p>
                  <p className="font-medium">{caseData.evidenceItems.join(", ")}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Test Description</p>
                <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-md">
                  {caseData.testDescription}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Report File</p>
                <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{caseData.reportFile}</span>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Blockchain Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Hash className="h-5 w-5" />
              <span>Blockchain Summary</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Transaction Hash</p>
                  <code className="text-xs text-muted-foreground font-mono">{caseData.txnHash}</code>
                </div>
                <Badge variant="approved">Verified</Badge>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Report file hash has been verified on blockchain</p>
                <p>• All evidence items are properly logged</p>
                <p>• Chain of custody is maintained</p>
                <p>• Report is ready for final approval</p>
              </div>
            </div>
          </Card>

          {/* Approval Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Add your remarks for approval or revision request..."
              className="min-h-[100px]"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your remarks will be recorded in the case history and blockchain.
            </p>
          </div>

          {/* Warning */}
          <Card className="p-4 bg-warning/5 border-warning/20">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-warning mb-1">Important Notice</h4>
                <p className="text-sm text-muted-foreground">
                  Once approved, this report will be finalized and locked. The case will be eligible 
                  for transfer to judiciary. This action cannot be undone.
                </p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => handleSubmit("revise")}
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting && action === "revise" ? "Processing..." : "Request Revision"}
            </Button>
            <Button 
              type="button" 
              variant="success"
              onClick={() => handleSubmit("approve")}
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting && action === "approve" ? "Processing..." : "Approve & Finalize"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}