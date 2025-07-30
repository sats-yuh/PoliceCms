import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaseForm } from "@/components/CaseForm";
import { useToast } from "@/hooks/use-toast";

export default function NewCase() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    
    try {
      // Mock API call - in real app this would be blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate case ID
      const caseId = `CASE-${Date.now().toString().slice(-3).padStart(3, '0')}`;
      
      toast({
        title: "Success",
        description: `Case ${caseId} created successfully`,
      });
      
      // Navigate back to cases list
      navigate("/cases");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create case. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Case</h1>
        <p className="text-muted-foreground">Create a new investigation case</p>
      </div>
      
      <CaseForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}