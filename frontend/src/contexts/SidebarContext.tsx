"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

interface SidebarContextType {
  state: "expanded" | "collapsed"
  toggle: () => void
  collapse: () => void
  expand: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<"expanded" | "collapsed">("expanded")

  const toggle = () => {
    setState((prevState) => (prevState === "expanded" ? "collapsed" : "expanded"))
  }

  const collapse = () => {
    setState("collapsed")
  }

  const expand = () => {
    setState("expanded")
  }

  return <SidebarContext.Provider value={{ state, toggle, collapse, expand }}>{children}</SidebarContext.Provider>
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
