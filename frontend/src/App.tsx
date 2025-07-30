"use client"

import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { Layout } from "./components/Layout"
import { LoginForm } from "./components/LoginForm"
import PoliceDashboard from "./pages/PoliceDashboard"
import NFSLDashboard from "./pages/NFSLDashboard"
import JudiciaryDashboard from "./pages/JudiciaryDashboard" // Confirmed import path
import CasesList from "./pages/CasesList"
import NewCase from "./pages/NewCase"
import EvidenceManagement from "./pages/EvidenceManagement"
import UserManagement from "./pages/UserManagement"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"
import CasesNSFL from "./pages/CasesNSFL"
import Evidence from "./pages/EvidenceNSFL"
import ReportsNSFL from "./pages/ReportsNSFL"
import Transfers from "./pages/TransfersNSFL"
import NotFound from "./pages/NotFound"
import AssignedCases from "./pages/Judge/AssignedCases"
import CaseHistoryPlaceholder from "./pages/Judge/CaseHistoryPlaceholder"

// Placeholder for AnalyticsPage - you might have this already
import AnalyticsPage from "./pages/Judge/AnalyticsPage"

const queryClient = new QueryClient()

function AppRoutes() {
  const { isAuthenticated, department } = useAuth()

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return (
    <Layout>
      <Routes>
        {/* Police Department Routes */}
        <Route path="/" element={department === "police" ? <PoliceDashboard /> : <Navigate to={`/${department}`} />} />
        <Route path="/cases" element={<CasesList />} />
        <Route path="/cases/new" element={<NewCase />} />
        <Route path="/evidence" element={<EvidenceManagement />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        {/* NFSL Routes */}
        <Route path="/nfsl" element={department === "nfsl" ? <NFSLDashboard /> : <Navigate to="/" />} />
        <Route path="/nfsl/cases" element={<CasesNSFL />} />
        <Route path="/nfsl/evidence" element={<Evidence />} />
        <Route path="/nfsl/reports" element={<ReportsNSFL />} />
        <Route path="/nfsl/transfers" element={<Transfers />} />
        {/* Judiciary Routes */}
        <Route path="/judiciary" element={department === "judiciary" ? <JudiciaryDashboard /> : <Navigate to="/" />} />
        <Route path="/judiciary/cases" element={<AssignedCases />} />
        <Route path="/judiciary/history" element={<CaseHistoryPlaceholder />} />
        {/* Shared Routes */}
        {/* Note: If /settings is meant to be shared, ensure it's not duplicated or handled correctly */}
        <Route path="/settings" element={<Settings />} /> {/* Using your imported Settings component */}
        {/* New Analytics Route */}
        <Route path="/analytics" element={<AnalyticsPage />} />
        {/* Fallback for undefined routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
