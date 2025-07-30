"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import type { ForensicDept } from "@/components/ui/types" // Import the defined interface

interface Props {
  open: boolean
  onClose: () => void
  onTransfer: (data: { departmentId: string; remarks: string }) => void
  forensicDepts: ForensicDept[]
}

export default function TransferCaseModal({ open, onClose, onTransfer, forensicDepts }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDept, setSelectedDept] = useState<ForensicDept | null>(null)
  const [remarks, setRemarks] = useState("")

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("")
      setSelectedDept(null)
      setRemarks("")
    }
  }, [open])

  const filteredDepts = forensicDepts.filter((dept) =>
    `${dept.name} - ${dept.location}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleTransfer = () => {
    if (!selectedDept) return
    onTransfer({ departmentId: selectedDept.id, remarks })
    onClose() // Close modal after transfer
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Transfer Case to Forensic Department</DialogTitle>
        </DialogHeader>
        {/* Department Dropdown */}
        <div className="space-y-2">
          <Label>Select Forensic Department</Label>
          <div className="border rounded-md px-3 py-2">
            <div className="relative mb-2">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search forensic departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <ScrollArea className="max-h-48">
              {filteredDepts.length > 0 ? (
                filteredDepts.map((dept) => (
                  <div
                    key={dept.id}
onClick={() => {
  setSelectedDept(dept)
  setSearchTerm(`${dept.name} - ${dept.location}`)
}}
                    className={`cursor-pointer px-2 py-1 rounded hover:bg-muted ${
                      selectedDept?.id === dept.id ? "bg-accent" : ""
                    }`}
                  >
                    {dept.name} - {dept.location}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No departments found.</p>
              )}
            </ScrollArea>
            {selectedDept && (
              <div className="text-sm text-muted-foreground mt-2">
                Selected:{" "}
                <span className="font-medium">
                  {selectedDept.name} - {selectedDept.location}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Remarks */}
        <div className="space-y-2 mt-4">
          <Label>Remarks (Optional)</Label>
          <Textarea
            placeholder="Add any notes or reason for transfer"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        {/* Buttons */}
        <DialogFooter className="mt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleTransfer} disabled={!selectedDept}>
            Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
