import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PersonInfo {
  name: string;
  contact: string;
  role: 'victim' | 'suspect';
  address?: string;
}

interface CaseFormData {
  title: string;
  firNumber: string;
  crimeType: string;
  dateOfIncident: string;
  location: string;
  assignedOfficers: string[];
  personsInfo: PersonInfo[];
  description: string;
  priority: string;
}

interface CaseFormProps {
  initialData?: Partial<CaseFormData>;
  onSubmit: (data: CaseFormData) => void;
  isLoading?: boolean;
}

export function CaseForm({ initialData, onSubmit, isLoading = false }: CaseFormProps) {
  const [formData, setFormData] = useState<CaseFormData>({
    title: initialData?.title || "",
    firNumber: initialData?.firNumber || "",
    crimeType: initialData?.crimeType || "",
    dateOfIncident: initialData?.dateOfIncident || "",
    location: initialData?.location || "",
    assignedOfficers: initialData?.assignedOfficers || [],
    personsInfo: initialData?.personsInfo || [],
    description: initialData?.description || "",
    priority: initialData?.priority || "medium"
  });

  const [newOfficer, setNewOfficer] = useState("");
  const [newPerson, setNewPerson] = useState<PersonInfo>({
    name: "",
    contact: "",
    role: "victim",
    address: ""
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.firNumber || !formData.crimeType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
  };

  const addOfficer = () => {
    if (newOfficer.trim()) {
      setFormData({
        ...formData,
        assignedOfficers: [...formData.assignedOfficers, newOfficer.trim()]
      });
      setNewOfficer("");
    }
  };

  const removeOfficer = (index: number) => {
    setFormData({
      ...formData,
      assignedOfficers: formData.assignedOfficers.filter((_, i) => i !== index)
    });
  };

  const addPerson = () => {
    if (newPerson.name.trim() && newPerson.contact.trim()) {
      setFormData({
        ...formData,
        personsInfo: [...formData.personsInfo, { ...newPerson }]
      });
      setNewPerson({ name: "", contact: "", role: "victim", address: "" });
    }
  };

  const removePerson = (index: number) => {
    setFormData({
      ...formData,
      personsInfo: formData.personsInfo.filter((_, i) => i !== index)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Case" : "Add New Case"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Case Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Short descriptive title"
                required
              />
            </div>
            <div>
              <Label htmlFor="firNumber">FIR Number *</Label>
              <Input
                id="firNumber"
                value={formData.firNumber}
                onChange={(e) => setFormData({ ...formData, firNumber: e.target.value })}
                placeholder="First Information Report number"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="crimeType">Crime Type *</Label>
              <Select value={formData.crimeType} onValueChange={(value) => setFormData({ ...formData, crimeType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select crime type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="theft">Theft</SelectItem>
                  <SelectItem value="assault">Assault</SelectItem>
                  <SelectItem value="cybercrime">Cybercrime</SelectItem>
                  <SelectItem value="fraud">Fraud</SelectItem>
                  <SelectItem value="murder">Murder</SelectItem>
                  <SelectItem value="robbery">Robbery</SelectItem>
                  <SelectItem value="domestic-violence">Domestic Violence</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateOfIncident">Date of Incident *</Label>
              <Input
                id="dateOfIncident"
                type="date"
                value={formData.dateOfIncident}
                onChange={(e) => setFormData({ ...formData, dateOfIncident: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Place of incident"
            />
          </div>

          {/* Assigned Officers */}
          <div>
            <Label>Assigned Officers</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                value={newOfficer}
                onChange={(e) => setNewOfficer(e.target.value)}
                placeholder="Officer name"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOfficer())}
              />
              <Button type="button" onClick={addOfficer} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.assignedOfficers.map((officer, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{officer}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeOfficer(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Victims/Suspects */}
          <div>
            <Label>Victims/Suspects Information</Label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2">
              <Input
                value={newPerson.name}
                onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                placeholder="Name"
              />
              <Input
                value={newPerson.contact}
                onChange={(e) => setNewPerson({ ...newPerson, contact: e.target.value })}
                placeholder="Contact"
              />
              <Select value={newPerson.role} onValueChange={(value: 'victim' | 'suspect') => setNewPerson({ ...newPerson, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="victim">Victim</SelectItem>
                  <SelectItem value="suspect">Suspect</SelectItem>
                </SelectContent>
              </Select>
              <Button type="button" onClick={addPerson} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 space-y-2">
              {formData.personsInfo.map((person, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    <span>{person.name}</span>
                    <span className="text-sm text-muted-foreground">({person.contact})</span>
                    <Badge variant={person.role === 'victim' ? 'default' : 'destructive'}>
                      {person.role}
                    </Badge>
                  </div>
                  <X 
                    className="h-4 w-4 cursor-pointer" 
                    onClick={() => removePerson(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Case Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed case notes and information"
              rows={4}
            />
          </div>

          <div className="flex space-x-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : "Save Case"}
            </Button>
            <Button type="button" variant="outline" className="flex-1">
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}