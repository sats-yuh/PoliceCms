"use client"
import type React from "react"
import { useState } from "react"
import {
  Plus,
  Search,
  User,
  Edit,
  MoreHorizontal,
  CheckCircle,
  X,
  Link,
  Download,
  Shield,
  Calendar,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { UserInterface } from "@/components/ui/types" // Import UserInterface

interface UserManagementProps {
  onNavigate: (section: string) => void
}

const UserManagement: React.FC<UserManagementProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 6
  const [users, setUsers] = useState<UserInterface[]>([
    {
      id: "u001",
      name: "Ram Kumar",
      email: "ram.kumar@example.com",
      role: "Admin",
      status: "Active",
      joinedDate: "2024-02-15",
      phone: "9841000001",
      blockchainHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      timestamp: "2024-02-15 10:00",
    },
    {
      id: "u002",
      name: "Sita Sharma",
      email: "sita.sharma@example.com",
      role: "Officer-in-Charge",
      status: "Active",
      joinedDate: "2024-05-20",
      phone: "9841000002",
      blockchainHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
      timestamp: "2024-05-20 11:30",
    },
    {
      id: "u003",
      name: "Mohan Thapa",
      email: "mohan.thapa@example.com",
      role: "Investigator",
      status: "Disabled",
      joinedDate: "2023-11-10",
      phone: "9841000003",
      blockchainHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
      timestamp: "2023-11-10 09:15",
    },
    {
      id: "u004",
      name: "Krishna Patel",
      email: "krishna.patel@example.com",
      role: "Investigator",
      status: "Active",
      joinedDate: "2024-01-08",
      phone: "9841000004",
      blockchainHash: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
      timestamp: "2024-01-08 14:45",
    },
    {
      id: "u005",
      name: "Gita Rai",
      email: "gita.rai@example.com",
      role: "Officer-in-Charge",
      status: "Active",
      joinedDate: "2024-03-12",
      phone: "9841000005",
      blockchainHash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
      timestamp: "2024-03-12 08:00",
    },
    {
      id: "u006",
      name: "Hari Bahadur",
      email: "hari.bahadur@example.com",
      role: "Investigator",
      status: "Disabled",
      joinedDate: "2023-09-22",
      phone: "9841000006",
      blockchainHash: "0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a",
      timestamp: "2023-09-22 16:20",
    },
    {
      id: "u007",
      name: "Laxmi Gurung",
      email: "laxmi.gurung@example.com",
      role: "Admin",
      status: "Active",
      joinedDate: "2024-04-18",
      phone: "9841000007",
      blockchainHash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
      timestamp: "2024-04-18 13:00",
    },
    {
      id: "u008",
      name: "Binod Shrestha",
      email: "binod.shrestha@example.com",
      role: "Investigator",
      status: "Active",
      joinedDate: "2024-06-05",
      phone: "9841000008",
      blockchainHash: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c",
      timestamp: "2024-06-05 09:50",
    },
    {
      id: "u009",
      name: "Sunita Magar",
      email: "sunita.magar@example.com",
      role: "Officer-in-Charge",
      status: "Active",
      joinedDate: "2024-07-14",
      phone: "9841000009",
      blockchainHash: "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d",
      timestamp: "2024-07-14 15:10",
    },
    {
      id: "u010",
      name: "Rajesh Tamang",
      email: "rajesh.tamang@example.com",
      role: "Investigator",
      status: "Disabled",
      joinedDate: "2023-12-03",
      phone: "9841000010",
      blockchainHash: "0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e",
      timestamp: "2023-12-03 12:00",
    },
  ])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserInterface | null>(null)
  const [showBlockchainModal, setShowBlockchainModal] = useState(false) // New state for blockchain modal
  const [selectedUserForBlockchain, setSelectedUserForBlockchain] = useState<UserInterface | null>(null) // New state for selected user
  const [showViewUserDetailsModal, setShowViewUserDetailsModal] = useState(false) // New state for view user details modal
  const [selectedUserForView, setSelectedUserForView] = useState<UserInterface | null>(null) // New state for selected user for view

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      (user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.includes(searchTerm)) &&
      (roleFilter === "all" || user.role === roleFilter) &&
      (statusFilter === "all" || user.status === statusFilter)
    )
  })

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  const handlePageChange = (page: number | string) => {
    if (typeof page === "number" && page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleDisableToggle = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: u.status === "Active" ? "Disabled" : "Active" } : u)),
    )
  }

  const handleEditClick = (user: UserInterface) => {
    setEditingUser(user)
    setDialogOpen(true)
  }

  const handleAddUserClick = () => {
    setEditingUser(null)
    setDialogOpen(true)
  }

  const handleBlockchainView = (user: UserInterface) => {
    setSelectedUserForBlockchain(user)
    setShowBlockchainModal(true)
  }

  const handleViewUser = (user: UserInterface) => {
    setSelectedUserForView(user)
    setShowViewUserDetailsModal(true)
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const newUser: UserInterface = {
      id: editingUser ? editingUser.id : `u${String(users.length + 1).padStart(3, "0")}`,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || "", // Ensure phone is a string, even if empty
      role: formData.get("role") as string,
      status: "Active", // New users are active by default
      joinedDate: editingUser ? editingUser.joinedDate : new Date().toISOString().split("T")[0],
      blockchainHash: editingUser
        ? editingUser.blockchainHash
        : `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`, // Generate new hash for new user
      timestamp: editingUser ? editingUser.timestamp : new Date().toLocaleString(), // Set current timestamp for new user
    }

    if (editingUser) {
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? newUser : u)))
    } else {
      setUsers((prev) => [...prev, newUser])
    }

    setDialogOpen(false)
    setEditingUser(null)
  }

  // Generate page numbers for pagination (same logic as case management)
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }
    return pages
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
          <p className="text-gray-700 text-sm">Manage users and their roles</p>
        </div>
        <Button variant="default" className="flex items-center gap-2" onClick={handleAddUserClick}>
          <Plus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" name="name" defaultValue={editingUser?.name} required />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" defaultValue={editingUser?.email} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" defaultValue={editingUser?.phone} />
            </div>
            <div>
              <Label htmlFor="role">Role *</Label>
              <Select name="role" defaultValue={editingUser?.role}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Officer-in-Charge">Officer-in-Charge</SelectItem>
                  <SelectItem value="Investigator">Investigator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" type="submit">
                {editingUser ? "Update" : "Add"} User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-700" />
              <Input
                className="pl-10"
                placeholder="Search by name, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Officer-in-Charge">Officer-in-Charge</SelectItem>
                <SelectItem value="Investigator">Investigator</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + usersPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} results
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <span className="px-3 py-2 text-gray-700">...</span>
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {currentUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">Phone: {user.phone || "-"}</p>
                <p className="text-xs text-muted-foreground">Joined: {user.joinedDate}</p>
                <div className="text-xs text-muted-foreground/80 mt-2">
                  <p className="text-blue-600">
                    Hash: {user.blockchainHash.substring(0, 10)}...
                    {user.blockchainHash.substring(user.blockchainHash.length - 10)}
                  </p>
                  <p className="text-sm text-muted-foreground/90">Timestamp: {user.timestamp}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-start sm:items-end">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {user.role}
                </Badge>
                <Badge
                  variant={user.status === "Active" ? "secondary" : "destructive"}
                  className="text-sm px-3 py-1 flex items-center gap-1"
                >
                  {user.status === "Active" ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  {user.status}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
                  <User className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditClick(user)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBlockchainView(user)}>
                      <Link className="h-4 w-4 mr-2" />
                      Blockchain
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDisableToggle(user.id)}>
                      {user.status === "Disabled" ? "Enable User" : "Disable User"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Pagination - Same as top */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + usersPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} results
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <span className="px-3 py-2 text-gray-700">...</span>
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No users found</h3>
            <p className="text-gray-700 text-sm mb-4">
              {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search criteria"
                : "Add new users to get started"}
            </p>
            {!searchTerm && roleFilter === "all" && statusFilter === "all" && (
              <Button variant="default" onClick={handleAddUserClick}>
                <Plus className="h-4 w-4 mr-2" />
                Add First User
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* View User Details Modal (Inline) */}
      <Dialog open={showViewUserDetailsModal} onOpenChange={setShowViewUserDetailsModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUserForView && (
            <div className="space-y-6">
              {/* User Header */}
              <div className="border-b pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedUserForView.name}</h2>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-sm">
                        {selectedUserForView.id}
                      </Badge>
                      <Badge variant="outline" className="text-sm">
                        {selectedUserForView.role}
                      </Badge>
                    </div>
                  </div>
                  <Badge
                    variant={selectedUserForView.status === "Active" ? "secondary" : "destructive"}
                    className="text-sm px-3 py-1 flex items-center gap-1"
                  >
                    {selectedUserForView.status === "Active" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    {selectedUserForView.status}
                  </Badge>
                </div>
              </div>
              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-700" />
                      <p className="text-sm">{selectedUserForView.email}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-gray-700" />
                      <p className="text-sm">{selectedUserForView.phone || "-"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Joined Date</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-700" />
                      <p className="text-sm">{selectedUserForView.joinedDate}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Blockchain Hash</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Shield className="h-4 w-4 text-gray-700" />
                      <p className="font-mono text-sm break-all">{selectedUserForView.blockchainHash}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Blockchain Timestamp</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-gray-700" />
                      <p className="text-sm">{selectedUserForView.timestamp}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowViewUserDetailsModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Blockchain User Details Modal (Inline) */}
      <Dialog open={showBlockchainModal} onOpenChange={setShowBlockchainModal}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Blockchain User Verification</DialogTitle>
          </DialogHeader>
          {selectedUserForBlockchain && (
            <div className="space-y-6">
              {/* User Header */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedUserForBlockchain.name} ({selectedUserForBlockchain.id})
                    </h2>
                    <p className="text-muted-foreground text-sm">Blockchain Verification & User History</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <Badge variant="success">Verified</Badge>
                  </div>
                </div>
              </div>
              {/* Blockchain Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Cryptographic Hash
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Transaction Hash</Label>
                      <div className="mt-1 p-3 bg-muted/50 rounded-lg">
                        <p className="font-mono text-sm break-all">{selectedUserForBlockchain.blockchainHash}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Block Number</Label>
                      <p className="mt-1 font-mono">#{Math.floor(Math.random() * 1000000) + 500000}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Gas Used</Label>
                      <p className="mt-1 font-mono">{Math.floor(Math.random() * 50000) + 21000} wei</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Timestamp Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Block Timestamp</Label>
                      <p className="mt-1 text-sm">{selectedUserForBlockchain.timestamp}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Confirmation Time</Label>
                      <p className="mt-1 text-sm">{new Date(Date.now() - Math.random() * 3600000).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Network</Label>
                      <p className="mt-1 text-sm">Ethereum Mainnet</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* On-Chain Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">On-Chain User Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
                        <p className="mt-1 font-mono text-sm">{selectedUserForBlockchain.id}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">User Role</Label>
                        <p className="mt-1 font-mono text-sm">{selectedUserForBlockchain.role}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Email Hash (SHA-256)</Label>
                        <p className="mt-1 font-mono text-sm">
                          sha256:{selectedUserForBlockchain.blockchainHash.slice(2, 66)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Joined Date</Label>
                        <p className="mt-1 text-sm">{selectedUserForBlockchain.joinedDate}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Smart Contract Address</Label>
                      <div className="mt-1 p-3 bg-muted/50 rounded-lg">
                        <p className="font-mono text-sm">0x742d35Cc6634C0532925a3b8D4C9db7C4E2d7a8B</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Chain of Custody */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">User Created</p>
                            <p className="text-sm text-muted-foreground">Account created and registered</p>
                          </div>
                          <span className="text-sm text-gray-700">{selectedUserForBlockchain.joinedDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Blockchain Registration</p>
                            <p className="text-sm text-muted-foreground">User hash recorded on blockchain</p>
                          </div>
                          <span className="text-sm text-gray-700">{selectedUserForBlockchain.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    {selectedUserForBlockchain.status === "Disabled" && (
                      <div className="flex items-start gap-4 p-3 border rounded-lg">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">User Disabled</p>
                              <p className="text-sm text-muted-foreground">Account status changed to disabled</p>
                            </div>
                            <span className="text-sm text-gray-700">{new Date().toISOString().split("T")[0]}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              {/* Verification Status */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Integrity Verified</span>
                </div>
                <p className="text-sm text-green-700">
                  This user's data has been cryptographically verified and its integrity is confirmed on the blockchain.
                  No unauthorized modifications detected.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowBlockchainModal(false)}>
                  Close
                </Button>
                <Button variant="default">
                  <Download className="h-4 w-4 mr-2" />
                  Export Verification Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserManagement
