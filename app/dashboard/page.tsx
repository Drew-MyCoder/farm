"use client"

import React, { useEffect, useState } from "react"
import {
  Bell,
  CheckCircle2,
  Clock,
  Egg,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  XCircle,
  Package,
  Syringe,

} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { GetUsername } from "@/lib/utils"
import { getBuyers, getCoops } from "@/lib/actions/auth"
import { Skeleton } from "@/components/ui/skeleton"
// import { format } from "date-fns"



interface EggRecord {
  id: string
  coopId: string
  coop_name: string
  collection_date: string
  egg_count: number
  broken_eggs: number
  total_feed: number
  notes: string
  
}

interface OrderData {
  id: number
  name: string
  date_of_delivery: string
  crates_desired: number
  amount: number
  status_of_delivery: "pending" | "processing" | "delivered" | "cancelled"
  created_at: string
  updated_at: string
  by: string
}


const DashboardPage: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<EggRecord[]>([]); 
  const [error, setError] = useState("")
  const [eggRecords, setEggRecords] = useState<EggRecord[]>([])
  const userName = GetUsername();
  const [orderData, setOrderData] = useState<OrderData[]>([]);
  const [searchQuery] = useState("")
  const [statusFilter] = useState<string>("all")

  const showUserName = true;

  useEffect(() => {
    async function fetchEggRecords() {
      try {
        setLoading(true)
        const mockEggRecords: EggRecord[] = await getCoops();
            if(mockEggRecords) {
            setData(mockEggRecords);
            console.log(mockEggRecords, ' this is my egg response from database')
          }
         

        // Simulate API call
        setTimeout(() => {
          setEggRecords(mockEggRecords)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching egg records:", error)
        setError("Failed to load egg collection records. Please try again.")
        setLoading(false)
      }
    }

    fetchEggRecords()
  }, [])
  console.log(error);

  useEffect(() => {
    const fetchBuyers = async() => {
      const response = await getBuyers();
      if(response && response.success !== false){
        setOrderData(response);
        console.log(response, ' this is my buyers response from database')
      }
    }; 
    
    fetchBuyers();
  }, [])

  // const calculatePendingOrders = () => {
  //   return orderData.filter((order) => order.status_of_delivery === "pending").length
  // }

  const filteredOrders = orderData.filter((order) => {
    // Search filter
    const matchesSearch =
    order.name.toLowerCase().includes(searchQuery.toLowerCase()) || order.id.toString().includes(searchQuery)

    // Status filter
    const matchesStatus = statusFilter === "all"  

    return matchesSearch && matchesStatus
  })

  const totalEggsToday = eggRecords?.length
    ? eggRecords
        .filter((record) => new Date(record.collection_date).toDateString() === new Date().toDateString())
        .reduce((sum, record) => sum + record.egg_count, 0)
    : 0;

  const pendingOrders = orderData?.length
    ? orderData.filter((o) => o.status_of_delivery === 'pending').length
    : 0;

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "pending":
  //       return "bg-yellow-500/10 text-yellow-500"
  //     case "processing":
  //       return "bg-blue-500/10 text-blue-500"
  //     case "delivered":
  //       return "bg-green-500/10 text-green-500"
  //     case "cancelled":
  //       return "bg-red-500/10 text-red-500"
  //     default:
  //       return "bg-gray-500/10 text-gray-500"
  //   }
  // }

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { bg: "bg-yellow-500/10", icon: <Clock className="h-5 w-5 text-yellow-500" />, text: "text-yellow-500" };
      case "processing":
        return { bg: "bg-blue-500/10", icon: <Clock className="h-5 w-5 text-blue-500" />, text: "text-blue-500" };
      case "delivered":
        return { bg: "bg-green-500/10", icon: <CheckCircle2 className="h-5 w-5 text-green-500" />, text: "text-green-500" };
      case "cancelled":
        return { bg: "bg-red-500/10", icon: <XCircle className="h-5 w-5 text-red-500" />, text: "text-red-500" };
      default:
        return { bg: "bg-gray-500/10", icon: <Clock className="h-5 w-5 text-gray-500" />, text: "text-gray-500" };
    }
  };

  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString)
  //   return format(date, "MMM d, yyyy")
  // }

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
          {/* <div className="flex-1"> */}
            <h1 className="text-lg font-semibold md:text-xl">Dashboard</h1>
          {/* </div> */}
          <div className="flex items-center gap-4">
          {showUserName && userName && (
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
           {userName}
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
            {/* <Card>
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
            </Card> */}
            <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Eggs Today</CardTitle>
            <Egg className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : totalEggsToday || 'Nothing to show'}
            </div>
            <p className="text-xs text-muted-foreground">Across all coops</p>
            <p className="text-xs text-muted-foreground">+15 from yesterday</p>
                <div className="mt-4">
                  <Progress value={totalEggsToday ? 80 : 0} className="h-2" />
                </div>
          </CardContent>
        </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border p-3 mb-1">
                  <div className="text-2xl font-bold">
                    {pendingOrders || 'Nothing to show'}
                  </div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Awaiting processing</p>
                <div className="mt-4">
                  <Progress value={40} className="h-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Feed Consumption</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">95.2 kg</div>
                <p className="text-xs text-muted-foreground">-2.5 kg from yesterday</p>
                <div className="mt-4">
                  <Progress value={85} className="h-2" />
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
<Card defaultValue="all" className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest customer orders and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const { bg, icon, text } = getStatusStyle(order.status_of_delivery);
            return (
              <div key={order.id} className="flex items-center gap-4">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${bg}`}>{icon}</div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Order #{index + 1} - {order.name}</p>
                  <p className="text-sm text-muted-foreground">{order.crates_desired} crates - ₵{order.amount} - Due {new Date(order.date_of_delivery).toDateString()}</p>
                </div>
                <Button variant="ghost" size="sm" className={text}>{order.status_of_delivery}</Button>
              </div>
            );
          })}
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
                    We&apos;ve added a new vaccination schedule system to track and manage all fowl vaccinations.
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
                    We&apos;ve added a new admin dashboard with analytics, user management, and expenditure tracking
                    features.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">New OrderData System</h3>
                    </div>
                    <div className="text-xs text-muted-foreground">5 days ago</div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ve updated our OrderData management system. You can now track OrderDatas more efficiently.
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
                  {data.length > 0 ? (
                    data.map((coop) => {
                    // Set progress dynamically based on egg count
                    const progress = coop.egg_count > 0 ? Math.min((coop.egg_count / 3000) * 100, 100) : 0; 

                    return (
                      <div key={coop.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">{coop.coop_name}</div>
                          <div className="text-sm font-medium">{coop.egg_count} eggs</div>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    );
                  }) ): (
                    <p className="text-center text-sm text-muted-foreground">Nothing to show</p>
                  )}
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

export default DashboardPage;
