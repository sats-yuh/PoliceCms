"use client"
import type React from "react"
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  FileText,
  TrendingUp,
  Clock,
  Package,
  AlertTriangle,
  Search,
  Plus,
  Filter,
  TrendingDown,
  FlaskConical,
  CheckCircle,
  Calendar,
  User,
  MapPin,
  ArrowLeft,
  BarChart3,
  PieChart,
  Users,
  Activity,
  Eye,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DashboardProps {
  userRole: "Admin" | "Officer-in-Charge" | "Investigator"
  onNavigate: (section: string) => void
}

interface Case {
  id: string
  title: string
  firNumber: string
  status: string
  priority: string
  officer: string
  date: string
  crimeType: string
  location: string
  description: string
  txnHash: string
}

const Dashboard: React.FC<DashboardProps> = ({ userRole, onNavigate }) => {
  const navigate = useNavigate()
  const [currentView, setCurrentView] = useState<"dashboard" | "analytics">("dashboard")
  const [showAllCases, setShowAllCases] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>("All Statuses")
  const [selectedPriority, setSelectedPriority] = useState<string>("All Priorities")
  const [selectedOfficer, setSelectedOfficer] = useState<string>("All Officers")
  const [globalSearchTerm, setGlobalSearchTerm] = useState("")
  const [casesSearchTerm, setCasesSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [casesPerPage, setCasesPerPage] = useState(6)
  const [showCaseDetailsModal, setShowCaseDetailsModal] = useState(false)
  const [selectedCaseForDetails, setSelectedCaseForDetails] = useState<Case | null>(null)
  const [allCases, setAllCases] = useState<Case[]>([
    {
      id: "CASE-001",
      title: "Cybercrime Investigation",
      firNumber: "FIR-2024-001",
      status: "In Review",
      priority: "High",
      officer: "Officer R. Singh",
      date: "2025-01-10",
      crimeType: "Theft",
      location: "Delhi",
      description: "Investigation of online fraud case involving multiple victims",
      txnHash: "0x8ac7f2b9e4d3c1a5",
    },
    {
      id: "CASE-002",
      title: "Electronics Store Theft",
      firNumber: "FIR-2024-002",
      status: "Awaiting Approval",
      priority: "Medium",
      officer: "Officer M. Patel",
      date: "2025-01-09",
      crimeType: "Digital Forensics",
      location: "Mumbai",
      description: "Theft of electronic goods from retail store",
      txnHash: "0x7bd8a1c2e3f4d5e6",
    },
    {
      id: "CASE-003",
      title: "Assault Investigation",
      firNumber: "FIR-2024-003",
      status: "Transferred",
      priority: "Low",
      officer: "Officer S. Kumar",
      date: "2025-01-08",
      crimeType: "DNA Analysis",
      location: "Bangalore",
      description: "Physical assault case requiring forensic analysis",
      txnHash: "0xb5d8c9a1f2e3d4c5",
    },
    {
      id: "CASE-004",
      title: "Drug Trafficking Case",
      firNumber: "FIR-2024-004",
      status: "Active",
      priority: "High",
      officer: "Officer R. Singh",
      date: "2025-01-07",
      crimeType: "Drug Trafficking",
      location: "Chennai",
      description: "Large scale drug trafficking investigation",
      txnHash: "0xc5e8f1a2b3c4d5e6",
    },
    {
      id: "CASE-005",
      title: "Domestic Violence Report",
      firNumber: "FIR-2024-005",
      status: "Closed",
      priority: "Low",
      officer: "Officer M. Patel",
      date: "2025-01-06",
      crimeType: "Domestic Violence",
      location: "Kolkata",
      description: "Domestic violence case resolved",
      txnHash: "0xd6f9a2b3c4e5f6a7",
    },
    {
      id: "CASE-006",
      title: "Vehicle Theft Investigation",
      firNumber: "FIR-2024-006",
      status: "In Review",
      priority: "Medium",
      officer: "Officer S. Kumar",
      date: "2025-01-05",
      crimeType: "Vehicle Theft",
      location: "Pune",
      description: "Investigation of stolen vehicle case",
      txnHash: "0xe7a8b3c4d5f6a7b8",
    },
    {
      id: "CASE-007",
      title: "Financial Fraud Investigation",
      firNumber: "FIR-2024-007",
      status: "Awaiting Approval",
      priority: "High",
      officer: "Officer R. Singh",
      date: "2025-01-04",
      crimeType: "Financial Fraud",
      location: "Hyderabad",
      description: "Complex financial fraud investigation",
      txnHash: "0xf8b9c4d5e6f7a8b9",
    },
    {
      id: "CASE-008",
      title: "Burglary Case",
      firNumber: "FIR-2024-008",
      status: "Transferred",
      priority: "Medium",
      officer: "Officer M. Patel",
      date: "2025-01-03",
      crimeType: "Burglary",
      location: "Ahmedabad",
      description: "Residential burglary investigation",
      txnHash: "0xa9c5d6e7f8a9b0c1",
    },
  ])

  const stats = [
    {
      title: "Assigned Cases",
      value: "12",
      icon: FileText,
      change: "+2 from last week",
      isPositive: true,
    },
    {
      title: "Pending Reports",
      value: "5",
      icon: Clock,
      change: "Due this week",
      isPositive: false,
    },
    {
      title: "Tests Completed",
      value: "28",
      icon: Package,
      change: "+15% this month",
      isPositive: true,
    },
    {
      title: "Pending Transfers",
      value: "3",
      icon: AlertTriangle,
      change: "Awaiting approval",
      isPositive: false,
    },
  ]

  const statusOptions = [...new Set(allCases.map((case_) => case_.status))]
  const priorityOptions = [...new Set(allCases.map((case_) => case_.priority))]
  const officerOptions = [...new Set(allCases.map((case_) => case_.officer))]

  const filteredCases = useMemo(() => {
    return allCases.filter((case_) => {
      if (selectedStatus !== "All Statuses" && case_.status !== selectedStatus) {
        return false
      }
      if (selectedPriority !== "All Priorities" && case_.priority !== selectedPriority) {
        return false
      }
      if (selectedOfficer !== "All Officers" && case_.officer !== selectedOfficer) {
        return false
      }
      const searchTerm = globalSearchTerm || casesSearchTerm
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          case_.title.toLowerCase().includes(searchLower) ||
          case_.id.toLowerCase().includes(searchLower) ||
          case_.firNumber.toLowerCase().includes(searchLower) ||
          case_.officer.toLowerCase().includes(searchLower) ||
          case_.crimeType.toLowerCase().includes(searchLower) ||
          case_.location.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
  }, [selectedStatus, selectedPriority, selectedOfficer, globalSearchTerm, casesSearchTerm, allCases])

  const casesToShow = showAllCases ? filteredCases : filteredCases.slice(0, 3)
  const totalPages = Math.ceil(filteredCases.length / casesPerPage)
  const startIndex = (currentPage - 1) * casesPerPage
  const endIndex = startIndex + casesPerPage
  const paginatedCases = showAllCases ? filteredCases.slice(startIndex, endIndex) : casesToShow

  const clearAllFilters = () => {
    setSelectedStatus("All Statuses")
    setSelectedPriority("All Priorities")
    setSelectedOfficer("All Officers")
    setGlobalSearchTerm("")
    setCasesSearchTerm("")
    setCurrentPage(1)
  }

  const hasActiveFilters =
    selectedStatus !== "All Statuses" ||
    selectedPriority !== "All Priorities" ||
    selectedOfficer !== "All Officers" ||
    globalSearchTerm.length > 0 ||
    casesSearchTerm.length > 0

  const getActiveFilterCount = () => {
    let count = 0
    if (selectedStatus !== "All Statuses") count++
    if (selectedPriority !== "All Priorities") count++
    if (selectedOfficer !== "All Officers") count++
    if (globalSearchTerm) count++
    if (casesSearchTerm) count++
    return count
  }

  const getPriorityBadge = (priority: string) => {
    return <Badge variant="outline">{priority}</Badge>
  }

  const getStatusBadge = (status: string) => {
    return <Badge variant="outline">{status}</Badge>
  }

  const getPriorityBadgeForModal = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">{priority} Priority</Badge>
      case "Medium":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            {priority} Priority
          </Badge>
        )
      case "Low":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {priority} Priority
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getStatusBadgeForModal = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
            {status}
          </Badge>
        )
      case "Awaiting Approval":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-200">
            {status}
          </Badge>
        )
      case "Transferred":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {status}
          </Badge>
        )
      case "Approved":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border-emerald-200"
          >
            {status}
          </Badge>
        )
      case "In Review":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200">
            {status}
          </Badge>
        )
      case "Closed":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-gray-100 text-gray-700 border-gray-200">
            {status}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewEvidenceFromDashboardModal = () => {
    if (selectedCaseForDetails) {
      navigate("/evidence", { state: { caseId: selectedCaseForDetails.id } })
      setShowCaseDetailsModal(false) // Close the case details modal after navigating
    }
  }

  const AnalyticsView = () => {
    const analyticsData = {
      totalCases: allCases.length,
      activeCases: allCases.filter((c) => c.status === "Active").length,
      closedCases: allCases.filter((c) => c.status === "Closed").length,
      highPriority: allCases.filter((c) => c.priority === "High").length,
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setCurrentView("dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cases</p>
                <p className="text-3xl font-bold">{analyticsData.totalCases}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Cases</p>
                <p className="text-3xl font-bold text-green-600">{analyticsData.activeCases}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <p className="text-3xl font-bold text-red-600">{analyticsData.highPriority}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Closed Cases</p>
                <p className="text-3xl font-bold text-blue-600">{analyticsData.closedCases}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Case Status Distribution
            </h3>
            <div className="space-y-4">
              {statusOptions.map((status) => {
                const count = allCases.filter((c) => c.status === status).length
                const percentage = ((count / allCases.length) * 100).toFixed(1)
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(status)}
                      <span className="text-sm">{status}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{count} cases</div>
                      <div className="text-xs text-muted-foreground">{percentage}%</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Priority Distribution
            </h3>
            <div className="space-y-4">
              {priorityOptions.map((priority) => {
                const count = allCases.filter((c) => c.priority === priority).length
                const percentage = ((count / allCases.length) * 100).toFixed(1)
                return (
                  <div key={priority} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(priority)}
                      <span className="text-sm">{priority}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{count} cases</div>
                      <div className="text-xs text-muted-foreground">{percentage}%</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Officer Workload
          </h3>
          <div className="space-y-4">
            {officerOptions.map((officer) => {
              const assignedCases = allCases.filter((c) => c.officer === officer)
              const activeCases = assignedCases.filter((c) => c.status === "Active").length
              const totalCases = assignedCases.length
              return (
                <div key={officer} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">{officer}</div>
                    <div className="text-sm text-muted-foreground">
                      {activeCases} active of {totalCases} total cases
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">{totalCases} Total</Badge>
                    <Badge variant="default">{activeCases} Active</Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    )
  }

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Dr. Anita Sharma</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Cases"
              className="pl-10 w-64"
              value={globalSearchTerm}
              onChange={(e) => setGlobalSearchTerm(e.target.value)}
            />
          </div>
          <Button className="flex items-center gap-2" onClick={() => navigate("/nfsl/cases")}>
            <Plus className="h-4 w-4" />
            <span>New Case</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          const TrendingIcon = stat.isPositive ? TrendingUp : TrendingDown
          const trendingColor = stat.isPositive ? "text-green-600" : "text-red-600"
          return (
            <Card key={stat.title} className="p-6 hover:shadow-elevated transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${trendingColor}`}>
                    <TrendingIcon className="h-3 w-3" />
                    {stat.change}
                  </p>
                </div>
                <Icon className="h-6 w-6 text-muted-foreground" />
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{showAllCases ? "All Cases" : "Recent Cases"}</h2>
            <p className="text-sm text-muted-foreground">
              {showAllCases
                ? `Showing ${paginatedCases.length} of ${filteredCases.length} cases`
                : "Latest case updates and activities"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cases..."
                className="pl-10 w-48"
                value={casesSearchTerm}
                onChange={(e) => setCasesSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  <span>Filter by Status</span>
                  <ChevronDown className="h-4 w-4" />
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setSelectedStatus("All Statuses")}
                  className={selectedStatus === "All Statuses" ? "bg-blue-50 text-blue-700" : ""}
                >
                  All Statuses
                </DropdownMenuItem>
                {statusOptions.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={selectedStatus === status ? "bg-blue-50 text-blue-700" : ""}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <span>Filter by Priority</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setSelectedPriority("All Priorities")}
                  className={selectedPriority === "All Priorities" ? "bg-blue-50 text-blue-700" : ""}
                >
                  All Priorities
                </DropdownMenuItem>
                {priorityOptions.map((priority) => (
                  <DropdownMenuItem
                    key={priority}
                    onClick={() => setSelectedPriority(priority)}
                    className={selectedPriority === priority ? "bg-blue-50 text-blue-700" : ""}
                  >
                    {priority}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <span>Filter by Officer</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setSelectedOfficer("All Officers")}
                  className={selectedOfficer === "All Officers" ? "bg-blue-50 text-blue-700" : ""}
                >
                  All Officers
                </DropdownMenuItem>
                {officerOptions.map((officer) => (
                  <DropdownMenuItem
                    key={officer}
                    onClick={() => setSelectedOfficer(officer)}
                    className={selectedOfficer === officer ? "bg-blue-50 text-blue-700" : ""}
                  >
                    {officer}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear Filters
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAllCases(!showAllCases)
                setCurrentPage(1)
              }}
              className="flex items-center gap-1"
            >
              {showAllCases ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  View All
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          {paginatedCases.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No cases found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            paginatedCases.map((case_) => (
              <div
                key={case_.id}
                className="flex items-center justify-between p-4 bg-background border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex flex-col space-y-1">
                  <h3 className="font-semibold text-foreground">{case_.crimeType}</h3>
                  <div className="flex items-center space-x-2 text-sm">
                    <Badge variant="outline">{case_.id}</Badge>
                    <Badge variant="outline">{case_.firNumber}</Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                                                        <Shield className="h-3 w-3 text-blue-500 fill-blue-500" />

                    <a
                      href={`https://etherscan.io/tx/${case_.txnHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline font-mono text-sm"
                    >
                      {case_.txnHash}
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Officer: {case_.officer} • Location: {case_.location} • Date: {case_.date}
                  </p>
                  {showAllCases && <p className="text-sm text-muted-foreground mt-1">{case_.description}</p>}
                </div>
                <div className="flex items-center space-x-3">
                  {getPriorityBadge(case_.priority)}
                  {getStatusBadge(case_.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCaseForDetails(case_)
                      setShowCaseDetailsModal(true)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        {showAllCases && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Label>Cases per page:</Label>
              <Select
                value={casesPerPage.toString()}
                onValueChange={(value) => {
                  setCasesPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="default" className="h-16 flex-col space-y-2" onClick={() => navigate("/nfsl/reports")}>
            <FlaskConical className="h-6 w-6" />
            <span>Add Lab Report</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex-col space-y-2 bg-transparent"
            onClick={() => navigate("/nfsl/cases", { state: { filterStatus: "Awaiting Approval" } })}
          >
            <CheckCircle className="h-6 w-6" />
            <span>Approve Cases</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex-col space-y-2 bg-transparent"
            onClick={() => setCurrentView("analytics")}
          >
            <TrendingUp className="h-6 w-6" />
            <span>View Analytics</span>
          </Button>
        </div>
      </Card>

      {selectedCaseForDetails && (
        <Dialog open={showCaseDetailsModal} onOpenChange={setShowCaseDetailsModal}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Case Details: {selectedCaseForDetails.title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Case ID:</p>
                <p className="col-span-3 font-semibold">{selectedCaseForDetails.id}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">FIR Number:</p>
                <p className="col-span-3">{selectedCaseForDetails.firNumber}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Crime Type:</p>
                <p className="col-span-3">{selectedCaseForDetails.crimeType}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Transaction Hash:</p>
                <p className="col-span-3">
                  <a
                    href={`https://etherscan.io/tx/${selectedCaseForDetails.txnHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-mono text-sm break-all"
                  >
                    {selectedCaseForDetails.txnHash}
                  </a>
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Officer:</p>
                <p className="col-span-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {selectedCaseForDetails.officer}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Location:</p>
                <p className="col-span-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {selectedCaseForDetails.location}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Date:</p>
                <p className="col-span-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {selectedCaseForDetails.date}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Status:</p>
                <p className="col-span-3">{getStatusBadgeForModal(selectedCaseForDetails.status)}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Priority:</p>
                <p className="col-span-3">{getPriorityBadgeForModal(selectedCaseForDetails.priority)}</p>
              </div>
              <div className="grid grid-cols-1 gap-2 mt-4">
                <p className="text-sm font-medium text-muted-foreground">Description:</p>
                <p className="text-base">{selectedCaseForDetails.description}</p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={handleViewEvidenceFromDashboardModal}>
                  <Eye className="h-4 w-4 mr-2" /> View Evidence
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )

  switch (currentView) {
    case "analytics":
      return <AnalyticsView />
    default:
      return <DashboardView />
  }
}

export default Dashboard
