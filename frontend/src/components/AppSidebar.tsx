"use client"
import { LayoutDashboard, FileText, Package, Users, Settings, LogOut, Shield, FlaskConical, Gavel } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar";


const policeMenuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Cases", url: "/cases", icon: FileText },
  { title: "Evidence", url: "/evidence", icon: Package },
  { title: "User Management", url: "/users", icon: Users },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
]

const nfslMenuItems = [
  { title: "Dashboard", url: "/nfsl", icon: LayoutDashboard },
  { title: "Assigned Cases", url: "/nfsl/cases", icon: FileText },
  { title: "Evidence", url: "/nfsl/evidence", icon: Package },
  { title: "Lab Reports", url: "/nfsl/reports", icon: FlaskConical },
  { title: "Transfers", url: "/nfsl/transfers", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
]

const judiciaryMenuItems = [
  { title: "Dashboard", url: "/judiciary", icon: LayoutDashboard },
  { title: "Assigned Cases", url: "/judiciary/cases", icon: FileText },
  { title: "Case History", url: "/judiciary/history", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const { user, department, logout } = useAuth()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const getMenuItems = () => {
    switch (department) {
      case "police":
        return policeMenuItems
      case "nfsl":
        return nfslMenuItems
      case "judiciary":
        return judiciaryMenuItems
      default:
        return policeMenuItems
    }
  }

  const getDepartmentInfo = () => {
    switch (department) {
      case "police":
        return { name: "Police CMS", subtitle: "Case Management", icon: Shield }
      case "nfsl":
        return { name: "NFSL Portal", subtitle: "Forensic Analysis", icon: FlaskConical }
      case "judiciary":
        return { name: "Judiciary Portal", subtitle: "Case Review", icon: Gavel }
      default:
        return { name: "Police CMS", subtitle: "Case Management", icon: Shield }
    }
  }

  const isActive = (path: string) => {
    if (path === "/" && department === "police") return currentPath === "/"
    if (path === "/nfsl" && department === "nfsl") return currentPath === "/nfsl"
    if (path === "/judiciary" && department === "judiciary") return currentPath === "/judiciary"
    return currentPath === path || currentPath.startsWith(path + "/")
  }

  const getNavClass = (path: string) =>
    isActive(path)
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"

  const menuItems = getMenuItems()
  const deptInfo = getDepartmentInfo()
  const DeptIcon = deptInfo.icon

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
  <div className={`flex items-center w-full ${collapsed ? "justify-center" : "justify-between"}`}>
    <div className="flex items-center space-x-3">
      <DeptIcon className="h-8 w-8 text-sidebar-foreground" />
      {!collapsed && (
        <div>
          <h2 className="text-lg font-bold text-sidebar-foreground leading-tight">
            {deptInfo.name}
          </h2>
          <p className="text-sm text-sidebar-foreground/70 leading-tight">
            {deptInfo.subtitle}
          </p>
        </div>
      )}
    </div>
    
    {/* Toggle button always visible */}
    <SidebarTrigger className="text-sidebar-foreground hover:text-sidebar-accent-foreground" />
  </div>
</SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Quick Actions section has been removed */}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!collapsed && user && (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/70 capitalize">{user.role.replace("-", " ")}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
