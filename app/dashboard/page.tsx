"use client"

import { useEffect, useState } from "react"
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Egg,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Users,
  XCircle,
  Package,
  DollarSign,
  ShieldCheck,
  Syringe,
} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  showUserName?: boolean;
}


export default function DashboardPage({ heading, text, showUserName = true }: DashboardHeaderProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // only run on client side
    if (typeof window !== 'undefined') {
      let storedName = localStorage.getItem('userName');

      if (!storedName) {
        storedName = localStorage.getItem('user')
      }
      setUserName(storedName);
    }
  }, []);

  console.log(userName, 'this is my username')

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar for desktop */}
      <aside className="hidden w-64 border-r bg-background md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <LayoutDashboard className="h-6 w-6" />
              <span>Poultry Farm</span>
            </Link>
          </div>
          <nav className="grid gap-2 p-4 text-sm font-medium lg:p-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Package className="h-5 w-5" />
              Orders
            </Link>
            <Link
              href="/dashboard/eggs"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Egg className="h-5 w-5" />
              Egg Collection
            </Link>
            <Link
              href="/dashboard/coops"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Users className="h-5 w-5" />
              Coops
            </Link>
            <Link
              href="/dashboard/schedule"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Syringe className="h-5 w-5" />
              Vaccination Schedule
            </Link>
          </nav>
          <div className="mt-auto p-4 lg:p-6">
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Link>
          </div>
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
              <div className="flex h-14 items-center border-b px-4">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <LayoutDashboard className="h-6 w-6" />
                  <span>Poultry Farm</span>
                </Link>
              </div>
              <nav className="grid gap-2 p-4 text-sm font-medium">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Package className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  href="/dashboard/eggs"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Egg className="h-5 w-5" />
                  Egg Collection
                </Link>
                <Link
                  href="/dashboard/coops"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  Coops
                </Link>
                <Link
                  href="/dashboard/schedule"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Syringe className="h-5 w-5" />
                  Vaccination Schedule
                </Link>
              </nav>
              <div className="mt-auto p-4">
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </Link>
              </div>
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
            <h1 className="text-lg font-semibold md:text-xl">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
          {showUserName && userName && (
          <div className="text-base text-center capitalize font-medium bg-muted py-1 px-3 rounded-full">
          Welcome {userName}
        </div>
        
        )}
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary"></span>
              <span className="sr-only">Toggle notifications</span>
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Eggs Today</CardTitle>
                <Egg className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">365</div>
                <p className="text-xs text-muted-foreground">+15 from yesterday</p>
                <div className="mt-4">
                  <Progress value={80} className="h-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Awaiting processing</p>
                <div className="mt-4">
                  <Progress value={40} className="h-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₵23,950</div>
                <p className="text-xs text-muted-foreground">+₵9,000 from new orders</p>
                <div className="mt-4">
                  <Progress value={65} className="h-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Vaccinations</CardTitle>
                <Syringe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Next: Mar 20 (Coop A)</p>
                <div className="mt-4">
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-500/10">
                      <Clock className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Order #2 - Kofi</p>
                      <p className="text-sm text-muted-foreground">100 crates - ₵9,000 - Due Feb 19, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Process
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-500/10">
                      <Clock className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Order #1 - John Doe</p>
                      <p className="text-sm text-muted-foreground">50 crates - ₵4,500 - Due Mar 15, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Process
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10">
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Order #3 - Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">75 crates - ₵6,750 - Due Mar 10, 2025</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-500">
                      Processing
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Order #4 - Ama Mensah</p>
                      <p className="text-sm text-muted-foreground">30 crates - ₵2,700 - Delivered Mar 5, 2025</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-green-500">
                      Delivered
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Order #5 - David Chen</p>
                      <p className="text-sm text-muted-foreground">120 crates - ₵10,800 - Cancelled</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      Cancelled
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Vaccinations</CardTitle>
                <CardDescription>Next scheduled vaccinations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-lg border p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Syringe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Newcastle Disease Vaccine</p>
                      <p className="text-xs text-muted-foreground">Coop A - Mar 20, 2025 at 9:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Syringe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Infectious Bronchitis Vaccine</p>
                      <p className="text-xs text-muted-foreground">Coop B - Mar 15, 2025 at 10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Syringe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Avian Influenza Vaccine</p>
                      <p className="text-xs text-muted-foreground">Coop B - Apr 5, 2025 at 10:00 AM</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Link href="/dashboard/schedule">
                      <Button variant="outline" className="w-full">
                        View Vaccination Schedule
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Announcements</CardTitle>
                <CardDescription>Stay updated with the latest farm news</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">Vaccination Schedule Added</h3>
                    </div>
                    <div className="text-xs text-muted-foreground">Today</div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We've added a new vaccination schedule system to track and manage all fowl vaccinations.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">New Admin Dashboard</h3>
                    </div>
                    <div className="text-xs text-muted-foreground">2 days ago</div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We've added a new admin dashboard with analytics, user management, and expenditure tracking
                    features.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">New Order System</h3>
                    </div>
                    <div className="text-xs text-muted-foreground">5 days ago</div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We've updated our order management system. You can now track orders more efficiently.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Coop Performance</CardTitle>
                <CardDescription>Egg production by coop</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Coop A</div>
                    <div className="text-sm font-medium">120 eggs</div>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Coop B</div>
                    <div className="text-sm font-medium">95 eggs</div>
                  </div>
                  <Progress value={73} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Coop C</div>
                    <div className="text-sm font-medium">150 eggs</div>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Coop D</div>
                    <div className="text-sm font-medium">100 eggs</div>
                  </div>
                  <Progress value={77} className="h-2" />
                </div>
                <div className="pt-4">
                  <Link href="/dashboard/eggs">
                    <Button className="w-full">View Detailed Report</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

