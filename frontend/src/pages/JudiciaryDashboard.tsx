"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, Clock, CheckCircle, AlertTriangle, Calendar, Scale, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CaseReviewModal } from "./Judge/CaseReviewModal"

// Initial number of items to display
const INITIAL_DISPLAY_COUNT = 3

// Dashboard case structure
interface DashboardCase {
  id: string
  type: string
  date: string
  status: string
  priority: string
}

// Expanded data for recent cases to simulate more items
const allRecentCases: DashboardCase[] = [
  {
    id: "CASE-001",
    type: "Theft",
    date: "2025-07-12",
    status: "pending",
    priority: "high",
  },
  {
    id: "CASE-002",
    type: "Fraud",
    date: "2025-07-10",
    status: "pending",
    priority: "medium",
  },
  {
    id: "CASE-003",
    type: "Assault",
    date: "2025-07-08",
    status: "pending",
    priority: "low",
  },
  {
    id: "CASE-004",
    type: "Burglary",
    date: "2025-07-07",
    status: "completed",
    priority: "low",
  },
  {
    id: "CASE-005",
    type: "Cybercrime",
    date: "2025-07-05",
    status: "pending",
    priority: "high",
  },
  {
    id: "CASE-006",
    type: "Homicide",
    date: "2025-07-03",
    status: "pending",
    priority: "high",
  },
]

// Expanded data for upcoming tasks to simulate more items
const allUpcomingTasks = [
  {
    task: "Review CASE-001 evidence",
    due: "Today, 2:00 PM",
    type: "review",
  },
  {
    task: "Finalize CASE-005 verdict",
    due: "Tomorrow, 10:00 AM",
    type: "verdict",
  },
  {
    task: "Court hearing preparation",
    due: "Jul 18, 9:00 AM",
    type: "hearing",
  },
  {
    task: "Client meeting for CASE-002",
    due: "Jul 19, 11:00 AM",
    type: "meeting",
  },
  {
    task: "Research legal precedents",
    due: "Jul 20, 4:00 PM",
    type: "research",
  },
  {
    task: "Draft appeal for CASE-003",
    due: "Jul 22, 1:00 PM",
    type: "drafting",
  },
]

const stats = [
  {
    title: "Total Assigned Cases",
    value: "24",
    icon: FileText,
    trend: "+3 this week",
    color: "text-green-500",
  },
  {
    title: "Pending Verdicts",
    value: "12",
    icon: Clock,
    trend: "4 due today",
    color: "text-orange-500",
  },
  {
    title: "Completed Cases",
    value: "8",
    icon: CheckCircle,
    trend: "+2 this week",
    color: "text-green-500",
  },
  {
    title: "Urgent Cases",
    value: "3",
    icon: AlertTriangle,
    trend: "Immediate attention",
    color: "text-red-500",
  },
]

// Function to transform dashboard case to detailed case format expected by modal
const transformToDetailedCase = (dashboardCase: DashboardCase) => {
  const mockOfficers = ["Officer Smith", "Officer Johnson", "Officer Williams"]
  const mockLocations = ["Downtown District", "North Side", "East End", "West Plaza", "Central Square"]

  return {
    id: `detailed-${dashboardCase.id}`,
    caseId: dashboardCase.id,
    crimeType: dashboardCase.type,
    dateReceived: dashboardCase.date,
    labReportStatus: "approved" as const,
    verdictStatus: dashboardCase.status === "completed" ? ("finalized" as const) : ("pending" as const),
    txnHash: `0x${Math.random().toString(16).substr(2, 40)}`,
    timestamp: new Date(dashboardCase.date).toISOString(),
    firNumber: `FIR-${dashboardCase.id.split("-")[1]}/2025`,
    officers: mockOfficers.slice(0, Math.floor(Math.random() * 2) + 1),
    location: mockLocations[Math.floor(Math.random() * mockLocations.length)],
    verdictSummary:
      dashboardCase.status === "completed"
        ? `Case ${dashboardCase.id} has been resolved. The defendant was found guilty of ${dashboardCase.type.toLowerCase()} and sentenced accordingly.`
        : undefined,
  }
}

export function JudiciaryDashboard() {
  const navigate = useNavigate()
  const [showAllRecentCases, setShowAllRecentCases] = useState(false)
  const [showAllUpcomingTasks, setShowAllUpcomingTasks] = useState(false)

  // Modal states
  const [caseReviewModal, setCaseReviewModal] = useState<{
    isOpen: boolean
    caseData: ReturnType<typeof transformToDetailedCase> | null
  }>({
    isOpen: false,
    caseData: null,
  })

  const displayedRecentCases = showAllRecentCases ? allRecentCases : allRecentCases.slice(0, INITIAL_DISPLAY_COUNT)
  const displayedUpcomingTasks = showAllUpcomingTasks
    ? allUpcomingTasks
    : allUpcomingTasks.slice(0, INITIAL_DISPLAY_COUNT)

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="border-orange-400 text-orange-500 text-xs">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="secondary" className="text-xs">
            Low
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {priority}
          </Badge>
        )
    }
  }

  const handleCaseReview = (dashboardCase: DashboardCase) => {
    const detailedCase = transformToDetailedCase(dashboardCase)
    setCaseReviewModal({
      isOpen: true,
      caseData: detailedCase,
    })
  }

  const handleVerdictFinalize = async (
    caseId: string,
    verdictData: { summary: string; remarks: string; dateOfJudgment: string },
  ) => {
    // Mock finalization logic
    console.log(`Finalizing verdict for case ${caseId}:`, verdictData)

    // Here you would typically make an API call to finalize the verdict
    // For now, we'll just simulate success
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update the case status in the local state (in a real app, this would come from the backend)
    // For demo purposes, we'll just close the modal
    setCaseReviewModal({ isOpen: false, caseData: null })

    // Show success message or update UI as needed
    console.log("Verdict finalized successfully!")
  }

  return (
    <div className="space-y-6 p-4">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Judiciary Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Judge Sharma</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="relative overflow-hidden rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200"
          >
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className={`text-xs flex items-center gap-1 ${stat.color}`}>
                  {stat.trend.startsWith("+") ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : stat.trend.startsWith("-") ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : stat.trend.includes("due") || stat.trend.includes("Immediate") ? (
                    <AlertTriangle className="h-3 w-3" />
                  ) : null}
                  {stat.trend}
                </p>
              </div>
              {/* Icon positioned absolutely as per image */}
              <div className="absolute top-4 right-4 p-2 rounded-lg bg-gray-50 text-muted-foreground">
                <stat.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayedRecentCases.map((case_) => (
                <div
                  key={case_.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-primary">{case_.id}</p>
                    <p className="text-sm text-muted-foreground">{case_.type}</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{case_.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(case_.priority)}
                    <Button size="sm" variant="outline" onClick={() => handleCaseReview(case_)}>
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {allRecentCases.length > INITIAL_DISPLAY_COUNT && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setShowAllRecentCases(!showAllRecentCases)}
                >
                  {showAllRecentCases ? "Show Less" : "View All Assigned Cases"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayedUpcomingTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{task.task}</p>
                    <p className="text-sm text-muted-foreground">{task.due}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {task.type}
                  </Badge>
                </div>
              ))}
            </div>
            {allUpcomingTasks.length > INITIAL_DISPLAY_COUNT && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setShowAllUpcomingTasks(!showAllUpcomingTasks)}
                >
                  {showAllUpcomingTasks ? "Show Less" : "View Full Schedule"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => navigate("/judiciary/cases")}
            >
              <FileText className="h-6 w-6" />
              Review New Cases
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => navigate("/judiciary/cases?openVerdictForm=true")}
            >
              <CheckCircle className="h-6 w-6" />
              Finalize Verdicts
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => navigate("/analytics")}
            >
              <TrendingUp className="h-6 w-6" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <CaseReviewModal
        case={caseReviewModal.caseData}
        isOpen={caseReviewModal.isOpen}
        onClose={() => setCaseReviewModal({ isOpen: false, caseData: null })}
        onFinalize={handleVerdictFinalize}
        initialTab="overview"
      />
    </div>
  )
}

export default JudiciaryDashboard
