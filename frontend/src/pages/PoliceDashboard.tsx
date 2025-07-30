"use client"
import type React from "react"
import { useState, useMemo } from "react"
import {
  FileText,
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
  Clock,
  Plus,
  Search,
  Filter,
  X,
  Shield,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"

interface DashboardProps {
  userRole: "Admin" | "Officer-in-Charge" | "Investigator"
}

interface FilterState {
  status: string[]
  priority: string[]
  officer: string[]
  searchTerm: string
}

const PoliceDashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    priority: [],
    officer: [],
    searchTerm: "",
  })
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [casesPerPage, setCasesPerPage] = useState(3)

  const stats = [
    {
      title: "Total Cases",
      value: "245",
      change: "+12%",
      trend: "up",
      icon: FileText,
      color: "primary",
    },
    {
      title: "Active Cases",
      value: "89",
      change: "+5%",
      trend: "up",
      icon: Clock,
      color: "warning",
    },
    {
      title: "Evidence Items",
      value: "1,234",
      change: "+8%",
      trend: "up",
      icon: Package,
      color: "primary",
    },
    {
      title: "Pending Reviews",
      value: "23",
      change: "-15%",
      trend: "down",
      icon: AlertTriangle,
      color: "danger",
    },
  ]

  // Enhanced cases array with TSN hash and timestamp
  const allCases = [
    {
      id: "CASE-001",
      title: "Cybercrime Investigation",
      firNumber: "FIR-2024-001",
      status: "Active",
      priority: "High",
      officer: "SI Ram Kumar",
      date: "2025-01-10",
      tsnHash: "0x8ac7f2b9e4d3c1a5",
      timestamp: "2025-01-10 14:30:25",
    },
    {
      id: "CASE-002",
      title: "Theft Case - Electronics Store",
      firNumber: "FIR-2024-002",
      status: "Under Review",
      priority: "Medium",
      officer: "Inspector Sharma",
      date: "2025-01-09",
      tsnHash: "0x3f4e8b2a9c7d1e6f",
      timestamp: "2025-01-09 09:15:42",
    },
    {
      id: "CASE-003",
      title: "Assault Investigation",
      firNumber: "FIR-2024-003",
      status: "Transferred",
      priority: "High",
      officer: "SI Patel",
      date: "2025-01-08",
      tsnHash: "0x7b5c9d3e8f1a4g2h",
      timestamp: "2025-01-08 16:45:18",
    },
    {
      id: "CASE-004",
      title: "Drug Trafficking Case",
      firNumber: "FIR-2024-004",
      status: "Active",
      priority: "High",
      officer: "SI Ram Kumar",
      date: "2025-01-07",
      tsnHash: "0x2e6f8a4b9c5d7e1f",
      timestamp: "2025-01-07 11:20:33",
    },
    {
      id: "CASE-005",
      title: "Domestic Violence Report",
      firNumber: "FIR-2024-005",
      status: "Closed",
      priority: "Low",
      officer: "Inspector Sharma",
      date: "2025-01-06",
      tsnHash: "0x9d1e3f5a7b8c4e6f",
      timestamp: "2025-01-06 13:55:07",
    },
    {
      id: "CASE-006",
      title: "Vehicle Theft Investigation",
      firNumber: "FIR-2024-006",
      status: "Under Review",
      priority: "Medium",
      officer: "SI Patel",
      date: "2025-01-05",
      tsnHash: "0x4a8c2e6f9b3d5e7f",
      timestamp: "2025-01-05 08:30:15",
    },
    {
      id: "CASE-007",
      title: "Financial Fraud Investigation",
      firNumber: "FIR-2024-007",
      status: "Active",
      priority: "High",
      officer: "Inspector Joshi",
      date: "2025-01-04",
      tsnHash: "0x6e9f2a4c8b5d3e7f",
      timestamp: "2025-01-04 15:10:28",
    },
  ]

  // Get unique values for filter options
  const statusOptions = [...new Set(allCases.map((case_) => case_.status))]
  const priorityOptions = [...new Set(allCases.map((case_) => case_.priority))]
  const officerOptions = [...new Set(allCases.map((case_) => case_.officer))]

  // Filter cases based on current filters
  const filteredCases = useMemo(() => {
    return allCases.filter((case_) => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(case_.status)) {
        return false
      }
      // Priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(case_.priority)) {
        return false
      }
      // Officer filter
      if (filters.officer.length > 0 && !filters.officer.includes(case_.officer)) {
        return false
      }
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        return (
          case_.title.toLowerCase().includes(searchLower) ||
          case_.id.toLowerCase().includes(searchLower) ||
          case_.firNumber.toLowerCase().includes(searchLower) ||
          case_.officer.toLowerCase().includes(searchLower) ||
          case_.tsnHash.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
  }, [filters])

  // Pagination logic
  const totalPages = Math.ceil(filteredCases.length / casesPerPage)
  const startIndex = (currentPage - 1) * casesPerPage
  const endIndex = startIndex + casesPerPage
  // Show all filtered cases
  const currentCases = filteredCases

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters((prev) => {
      if (filterType === "searchTerm") {
        return { ...prev, [filterType]: value }
      }
      const currentValues = prev[filterType] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]
      return { ...prev, [filterType]: newValues }
    })
    // Reset to first page when filters change
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      status: [],
      priority: [],
      officer: [],
      searchTerm: "",
    })
    setCurrentPage(1)
  }

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.officer.length > 0 ||
    filters.searchTerm.length > 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default"
      case "Under Review":
        return "secondary"
      case "Transferred":
        return "outline"
      case "Closed":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "secondary"
      case "Low":
        return "default"
      default:
        return "secondary"
    }
  }

  // Function to handle new case navigation
  const handleNewCaseClick = () => {
    navigate("/cases", { state: { openNewCaseModal: true } })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the Police Case Management System</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/cases")} className="hidden sm:flex">
            <Search className="h-4 w-4 mr-2" />
            Search Cases
          </Button>
          <Button onClick={handleNewCaseClick}>
            <Plus className="h-4 w-4 mr-2" />
            New Case
          </Button>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className="p-2 rounded-lg">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p
                  className={`text-xs flex items-center gap-1 ${stat.trend === "up" ? "text-success" : "text-red-600"}`}
                >
                  <TrendingUp className={`h-3 w-3 ${stat.trend === "down" ? "rotate-180" : ""}`} />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
      {/* Recent Cases */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Recent Cases</CardTitle>
              <CardDescription>
                Latest case updates and activities
                {hasActiveFilters && (
                  <span className="text-primary">
                    ({filteredCases.length} of {allCases.length} cases shown)
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cases..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                  className="pl-10 w-48"
                />
              </div>
              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="relative bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                    {hasActiveFilters && (
                      <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                        {filters.status.length + filters.priority.length + filters.officer.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Filter Cases
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-1 text-xs">
                        Clear All
                      </Button>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* Status Filter */}
                  <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Status</DropdownMenuLabel>
                  {statusOptions.map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={filters.status.includes(status)}
                      onCheckedChange={() => handleFilterChange("status", status)}
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  {/* Priority Filter */}
                  <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Priority</DropdownMenuLabel>
                  {priorityOptions.map((priority) => (
                    <DropdownMenuCheckboxItem
                      key={priority}
                      checked={filters.priority.includes(priority)}
                      onCheckedChange={() => handleFilterChange("priority", priority)}
                    >
                      {priority}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  {/* Officer Filter */}
                  <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Officer</DropdownMenuLabel>
                  {officerOptions.map((officer) => (
                    <DropdownMenuCheckboxItem
                      key={officer}
                      checked={filters.officer.includes(officer)}
                      onCheckedChange={() => handleFilterChange("officer", officer)}
                    >
                      {officer}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" onClick={() => navigate("/cases")}>
                View All
              </Button>
            </div>
          </div>
          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {filters.searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{filters.searchTerm}"
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("searchTerm", "")} />
                </Badge>
              )}
              {filters.status.map((status) => (
                <Badge key={status} variant="secondary" className="flex items-center gap-1">
                  Status: {status}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("status", status)} />
                </Badge>
              ))}
              {filters.priority.map((priority) => (
                <Badge key={priority} variant="secondary" className="flex items-center gap-1">
                  Priority: {priority}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("priority", priority)} />
                </Badge>
              ))}
              {filters.officer.map((officer) => (
                <Badge key={officer} variant="secondary" className="flex items-center gap-1">
                  Officer: {officer}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("officer", officer)} />
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentCases.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No cases found</p>
                <p className="text-sm">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              currentCases.map((case_) => (
                <div
                  key={case_.id}
                  className="flex flex-col p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer space-y-3"
                  onClick={() => navigate("/cases")}
                >
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h4 className="font-medium">{case_.title}</h4>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {case_.id}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {case_.firNumber}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(case_.priority)} className="text-xs">
                        {case_.priority}
                      </Badge>
                      <Badge variant={getStatusColor(case_.status)} className="text-xs">
                        {case_.status}
                      </Badge>
                    </div>
                  </div>
                  {/* TSN Hash Row */}
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3 text-blue-500 fill-blue-500" />
                    <span className="text-sm font-mono text-blue-600">{case_.tsnHash}</span>
                  </div>
                  {/* Officer and Timestamp Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                    <span>Officer: {case_.officer}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Timestamp: {case_.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleNewCaseClick}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add New Case
            </CardTitle>
            <CardDescription>Create a new case entry with all required details</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/evidence")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Manage Evidence
            </CardTitle>
            <CardDescription>Add, edit, and track evidence for active cases</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/users")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              User Management
            </CardTitle>
            <CardDescription>Manage officers and assign roles and permissions</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

export default PoliceDashboard
