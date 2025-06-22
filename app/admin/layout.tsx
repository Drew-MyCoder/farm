"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, ShieldCheck, DollarSign, Menu, X, Home, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ProtectedRoute } from "@/components/ProtectedRoute"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    {
      href: "/admin",
      label: "Analytics",
      icon: BarChart3,
      active: pathname === "/admin",
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: Users,
      active: pathname === "/admin/users",
    },
    {
      href: "/admin/locations",
      label: "Locations",
      icon: MapPin,
      active: pathname === "/admin/locations",
    },
    {
      href: "/admin/admins",
      label: "Admins",
      icon: ShieldCheck,
      active: pathname === "/admin/admins",
    },
    {
      href: "/admin/expenditures",
      label: "Expenditures",
      icon: DollarSign,
      active: pathname === "/admin/expenditures",
    },
  ]

  return (
    <ProtectedRoute requiredRole="admin" fallback={<div>Checking permissions...</div>}>
      <div className="flex min-h-screen bg-muted/40">
        {/* Sidebar for desktop */}
        <aside className="hidden w-64 border-r bg-background md:block">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-6 w-6" />
                <span>Admin Panel</span>
              </Link>
            </div>
            <nav className="grid gap-2 p-4 text-sm font-medium lg:p-6">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2",
                    route.active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              ))}
              <div className="my-2 border-t"></div>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Home className="h-5 w-5" />
                Main Dashboard
              </Link>
            </nav>
          </div>
        </aside>

        {/* Mobile navigation */}
        <div className="md:hidden">
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-14 items-center justify-between border-b px-4">
                  <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-6 w-6" />
                    <span>Admin Panel</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileNavOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="grid gap-2 p-4 text-sm font-medium">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2",
                        route.active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                      onClick={() => setIsMobileNavOpen(false)}
                    >
                      <route.icon className="h-5 w-5" />
                      {route.label}
                    </Link>
                  ))}
                  <div className="my-2 border-t"></div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    Main Dashboard
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsMobileNavOpen(true)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold md:text-xl">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}