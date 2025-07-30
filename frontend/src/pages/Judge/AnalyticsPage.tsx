"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ArrowLeft, TrendingUp, TrendingDown, Users, AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Sample data for analytics charts
const caseStatusData = [
  { name: "Assigned", count: 24, color: "hsl(217.2 91.2% 59.8%)" }, // Primary blue
  { name: "Pending", count: 12, color: "hsl(210 40% 96.1%)" }, // Muted light gray
  { name: "Completed", count: 8, color: "hsl(217.2 32.6% 17.5%)" }, // Dark gray
  { name: "Urgent", count: 3, color: "hsl(0 84.2% 60.2%)" }, // Red for urgent
]

const monthlyCasesData = [
  { month: "Jan", cases: 15, verdicts: 10 },
  { month: "Feb", cases: 20, verdicts: 15 },
  { month: "Mar", cases: 18, verdicts: 12 },
  { month: "Apr", cases: 25, verdicts: 20 },
  { month: "May", cases: 22, verdicts: 18 },
  { month: "Jun", cases: 30, verdicts: 25 },
  { month: "Jul", cases: 28, verdicts: 23 },
]

const judgePerformanceData = [
  { name: "Judge Sharma", casesCompleted: 8, avgResolutionDays: 45 },
  { name: "Judge Khan", casesCompleted: 10, avgResolutionDays: 38 },
  { name: "Judge Lee", casesCompleted: 7, avgResolutionDays: 50 },
  { name: "Judge Patel", casesCompleted: 12, avgResolutionDays: 30 },
]

export default function AnalyticsPage() {
  const navigate = useNavigate()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Go back</span>
        </Button>
        <h1 className="text-3xl font-bold text-primary"> Case Analytics Dashboard</h1>
      </div>

      <p className="text-muted-foreground">
        Detailed insights into case performance, trends, and resource utilization.
      </p>

      {/* Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cases Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,976</div>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42 Days</div>
            <p className="text-xs text-red-500 flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              -5% slower
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Judges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              Stable
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Urgent Cases Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-orange-500 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              High priority
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Case Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={caseStatusData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  // Removed 'label' prop for cleaner look, info is in legend
                >
                  {caseStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Case & Verdict Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyCasesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cases"
                  stroke="hsl(217.2 91.2% 59.8%)"
                  activeDot={{ r: 8 }}
                  name="Cases Filed"
                />{" "}
                {/* Primary blue */}
                <Line
                  type="monotone"
                  dataKey="verdicts"
                  stroke="hsl(210 40% 96.1%)" // Muted light gray
                  activeDot={{ r: 8 }}
                  name="Verdicts Finalized"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Judge Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={judgePerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="casesCompleted" fill="hsl(217.2 91.2% 59.8%)" name="Cases Completed" /> {/* Primary blue */}
              <Bar dataKey="avgResolutionDays" fill="hsl(210 40% 96.1%)" name="Avg. Resolution Days" />{" "}
              {/* Muted light gray */}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
