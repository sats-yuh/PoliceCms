import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { FlaskConical, Upload, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string | null;
}

export function AddReportModal({ isOpen, onClose, caseId }: AddReportModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    testType: "",
    testDescription: "",
    datePerformed: "",
    evidenceIds: [] as string[],
    reportFile: null as File | null
  });

  const testTypes = [
    "DNA Analysis",
    "Fingerprint Analysis", 
    "Digital Forensics",
    "Ballistics",
    "Toxicology",
    "Chemical Analysis",
    "Document Examination",
    "Voice Analysis"
  ];

  const evidenceItems = [
    { id: "EVD-001", description: "Fingerprints from entry point" },
    { id: "EVD-002", description: "Mobile phone (Samsung Galaxy)" },
    { id: "EVD-003", description: "USB Drive" },
    { id: "EVD-004", description: "Blood sample" },
    { id: "EVD-005", description: "Clothing fibers" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Lab Report Added Successfully",
        description: `Report for ${caseId} has been submitted and will be recorded on blockchain.`,
        variant: "default"
      });
      
      onClose();
      
      // Reset form
      setFormData({
        testType: "",
        testDescription: "",
        datePerformed: "",
        evidenceIds: [],
        reportFile: null
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit lab report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, reportFile: file }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FlaskConical className="h-5 w-5" />
            <span>Add Lab Test Report - {caseId}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Case Info */}
          <Card className="p-4 bg-accent/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Case ID: {caseId}</p>
                <p className="text-sm text-muted-foreground">Crime Type: Theft</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-sm font-medium">In Review</p>
              </div>
            </div>
          </Card>

          {/* Test Type */}
          <div className="space-y-2">
            <Label htmlFor="testType">Test Type *</Label>
            <Select 
              value={formData.testType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, testType: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent>
                {testTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Evidence Selection */}
          <div className="space-y-2">
            <Label>Evidence Items *</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-3">
              {evidenceItems.map((evidence) => (
                <label key={evidence.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-border"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({ 
                          ...prev, 
                          evidenceIds: [...prev.evidenceIds, evidence.id] 
                        }));
                      } else {
                        setFormData(prev => ({ 
                          ...prev, 
                          evidenceIds: prev.evidenceIds.filter(id => id !== evidence.id) 
                        }));
                      }
                    }}
                  />
                  <span className="text-sm">
                    <strong>{evidence.id}</strong> - {evidence.description}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Performed */}
          <div className="space-y-2">
            <Label htmlFor="datePerformed">Date Performed *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                id="datePerformed"
                className="pl-10"
                value={formData.datePerformed}
                onChange={(e) => setFormData(prev => ({ ...prev, datePerformed: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Test Description */}
          <div className="space-y-2">
            <Label htmlFor="testDescription">Test Description *</Label>
            <Textarea
              id="testDescription"
              placeholder="Describe the analysis process, methodology, and findings..."
              className="min-h-[100px]"
              value={formData.testDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, testDescription: e.target.value }))}
              required
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="reportFile">Upload Report *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <div className="space-y-2">
                <Input
                  type="file"
                  id="reportFile"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileChange}
                  className="max-w-sm mx-auto"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (Max: 10MB)
                </p>
                {formData.reportFile && (
                  <p className="text-sm text-success">
                    Selected: {formData.reportFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Blockchain Info */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="font-medium mb-2">Blockchain Recording</h4>
            <p className="text-sm text-muted-foreground">
              This report will be automatically recorded on the blockchain with a unique hash 
              for tamper-proof evidence management. The transaction will be visible in the case history.
            </p>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? "Submitting..." : "Save Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}