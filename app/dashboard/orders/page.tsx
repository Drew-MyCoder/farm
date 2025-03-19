"use client"

import { useEffect, useState } from "react"
import { Calendar, CheckCircle2, Clock, Filter, Plus, Search, Trash2, XCircle, Package, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header"
import { DashboardShell } from "@/app/dashboard/components/dashboard-shell"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn, getUsername } from "@/lib/utils"
import axios from "axios"
import { useRouter } from "next/navigation"
import { getBuyers } from "@/lib/actions/auth"

interface Order {
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

export default function OrdersPage() {
  
  const [data, setData] = useState<Order[]>([]);

  useEffect(() => {
    const fetchBuyers = async() => {
      const response = await getBuyers();
      if(response && response.success !== false){
        setData(response);
        console.log(response, ' this is my response from database')
      }
    }; 
    
    fetchBuyers();
  }, [])
  

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false)
  const [newOrder, setNewOrder] = useState<Omit<Order, "id" | "created_at" | "updated_at">>({
    name: "",
    date_of_delivery: new Date().toISOString(),
    crates_desired: 0,
    amount: 0,
    status_of_delivery: "pending",
    by: "",
  })
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: ''});
  const router = useRouter();
  const userName = getUsername();
  console.log('this is the new user name in oder', userName);
  
  

  const filteredOrders = data.filter((order) => {
    // Search filter
    const matchesSearch =
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) || order.id.toString().includes(searchQuery)

    // Status filter
    const matchesStatus = statusFilter === "all" || order.status_of_delivery === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (orderId: number, newStatus: "pending" | "processing" | "delivered" | "cancelled") => {
    setData(
      data.map((order) =>
        order.id === orderId
          ? { ...order, status_of_delivery: newStatus, updated_at: new Date().toISOString() }
          : order,
      ),
    )
  }

  const handleDeleteOrder = (orderId: number) => {
    setData(data.filter((order) => order.id !== orderId))
  }

  const handleCreateOrder = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    const id = Math.max(...data.map((o) => o.id), 0) + 1
    const now = new Date().toISOString()

    setData([
      ...data,
      {
        id,
        ...newOrder,
        created_at: now,
        updated_at: now,
      },
    ])

    setNewOrder({
      name: "",
      date_of_delivery: new Date().toISOString(),
      crates_desired: 0,
      amount: 0,
      status_of_delivery: "pending",
      by: "",
    })
    
    try {
      const response = await axios.post(
        "http://localhost:8000/buyers/buyer",
        {
          name: newOrder.name,
          date_of_delivery: newOrder.date_of_delivery,
          crates_desired: newOrder.crates_desired,
          amount: newOrder.amount,
          status_of_delivery: newOrder.status_of_delivery,
          by: userName,
        },
        { headers: { "Content-Type": "application/json" }},
      );
      // console.log('full api order response', response);
      
      const data = await response
      if (!response) {
        throw new Error(data.statusText || 'Failed to create order');
      }
      if (response.status !== 200) {
        throw new Error (response.statusText || 'sorry something went wrong. try again');
      }
      setStatus({ type: 'Success', message: 'Order created successfully'});
      router.push('/dashboard/orders')
    } catch (error) {
      let errorMessage = 'Failed to create order. Please try again.'

      if (axios.isAxiosError(error)) {
        if (error.response){
          // server errors
          const status = error.response.status;
          if (status === 401) {
            errorMessage = 'Invalid OTP or username. Please check and try again.';
          } else if (status === 404) {
            errorMessage = 'User not found. Please check your username.';
          } else if (status === 410) {
            errorMessage = 'OTP has expired. Please request a new one.';
          } else {
            errorMessage = error.response.data?.message || errorMessage;
          } 
        } else if (error.request) {
          // No response received
          errorMessage = 'Server not responding. Please check your connection and try again.';
        }
      }
      console.log(error)
      setStatus({ 
        type: 'error', 
        message: error.message || 'Failed to create order. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }

    setIsNewOrderDialogOpen(false)
    
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500"
      case "processing":
        return "bg-blue-500/10 text-blue-500"
      case "delivered":
        return "bg-green-500/10 text-green-500"
      case "cancelled":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "MMM d, yyyy")
  }

  const calculateTotalRevenue = () => {
    return data
      .filter((order) => order.status_of_delivery !== "cancelled")
      .reduce((sum, order) => sum + order.amount, 0)
  }

  const calculatePendingOrders = () => {
    return data.filter((order) => order.status_of_delivery === "pending").length
  }

  const calculateTotalCrates = () => {
    return data
      .filter((order) => order.status_of_delivery !== "cancelled")
      .reduce((sum, order) => sum + order.crates_desired, 0)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Orders" text="Manage customer data and track deliveries.">
        <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>Add a new customer order. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Customer Name</Label>
                <Input
                  id="name"
                  value={newOrder.name}
                  onChange={(e) => setNewOrder({ ...newOrder, name: e.target.value })}
                  placeholder="Customer name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date_of_delivery">Delivery Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newOrder.date_of_delivery && "text-muted-foreground",
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newOrder.date_of_delivery ? (
                        format(new Date(newOrder.date_of_delivery), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={new Date(newOrder.date_of_delivery)}
                      onSelect={(date) =>
                        setNewOrder({ ...newOrder, date_of_delivery: date?.toISOString() || new Date().toISOString() })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="crates_desired">Crates Desired</Label>
                  <Input
                    id="crates_desired"
                    type="number"
                    min="1"
                    value={newOrder.crates_desired}
                    onChange={(e) => {
                      const crates = Number.parseInt(e.target.value) || 0
                      setNewOrder({
                        ...newOrder,
                        crates_desired: crates,
                        amount: crates * 55, // Assuming 55 per crate
                      })
                    }}
                    placeholder="Number of crates"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount (₵)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    value={newOrder.amount}
                    onChange={(e) => setNewOrder({ ...newOrder, amount: Number.parseFloat(e.target.value) || 0 })}
                    placeholder="Total amount"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newOrder.status_of_delivery}
                  onValueChange={(value) => setNewOrder({ ...newOrder, status_of_delivery: value as any })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewOrderDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrder}>Create Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-5">
          <CardHeader>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <CardTitle>Order List</CardTitle>
                <CardDescription>Manage and track customer data</CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search data..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4 space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-full bg-muted p-3">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No data found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    
                    <div key={order.id} className="flex items-start gap-4 rounded-lg border p-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        {getStatusIcon(order.status_of_delivery)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium leading-none">
                            Order #{order.id} - {order.name}
                          </h4>
                          <Badge variant="outline" className={getStatusColor(order.status_of_delivery)}>
                            {order.status_of_delivery.charAt(0).toUpperCase() + order.status_of_delivery.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.crates_desired} crates - ₵{order.amount.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            Delivery: {formatDate(order.date_of_delivery)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            Created: {format(new Date(order.created_at), "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            By: {order.by ? order.by: "Unknown"}
                            
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={order.status_of_delivery}
                          onValueChange={(value) => handleStatusChange(order.id, value as any)}
                        >
                          <SelectTrigger className="h-8 w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        {/* <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button> */}
                      </div>
                    </div>
                  ))
                )}
                
              </TabsContent>
              <TabsContent value="pending" className="mt-4 space-y-4">
                {filteredOrders.filter((o) => o.status_of_delivery === "pending").length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-full bg-muted p-3">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No pending data</h3>
                    <p className="mt-2 text-sm text-muted-foreground">All data have been processed or delivered.</p>
                  </div>
                ) : (
                  filteredOrders
                    .filter((o) => o.status_of_delivery === "pending")
                    .map((order) => (
                      <div key={order.id} className="flex items-start gap-4 rounded-lg border p-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          {getStatusIcon(order.status_of_delivery)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium leading-none">
                              Order #{order.id} - {order.name}
                            </h4>
                            <Badge variant="outline" className={getStatusColor(order.status_of_delivery)}>
                              {order.status_of_delivery.charAt(0).toUpperCase() + order.status_of_delivery.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.crates_desired} crates - ₵{order.amount.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              Delivery: {formatDate(order.date_of_delivery)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              Created: {format(new Date(order.created_at), "MMM d, yyyy")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={order.status_of_delivery}
                            onValueChange={(value) => handleStatusChange(order.id, value as any)}
                          >
                            <SelectTrigger className="h-8 w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </TabsContent>
              <TabsContent value="processing" className="mt-4 space-y-4">
                {filteredOrders.filter((o) => o.status_of_delivery === "processing").length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-full bg-muted p-3">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No data in processing</h3>
                    <p className="mt-2 text-sm text-muted-foreground">No data are currently being processed.</p>
                  </div>
                ) : (
                  filteredOrders
                    .filter((o) => o.status_of_delivery === "processing")
                    .map((order) => (
                      <div key={order.id} className="flex items-start gap-4 rounded-lg border p-4">
                        {/* Same content as above */}
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          {getStatusIcon(order.status_of_delivery)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium leading-none">
                              Order #{order.id} - {order.name}
                            </h4>
                            <Badge variant="outline" className={getStatusColor(order.status_of_delivery)}>
                              {order.status_of_delivery.charAt(0).toUpperCase() + order.status_of_delivery.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.crates_desired} crates - ₵{order.amount.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              Delivery: {formatDate(order.date_of_delivery)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              Created: {format(new Date(order.created_at), "MMM d, yyyy")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={order.status_of_delivery}
                            onValueChange={(value) => handleStatusChange(order.id, value as any)}
                          >
                            <SelectTrigger className="h-8 w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </TabsContent>
              <TabsContent value="delivered" className="mt-4 space-y-4">
                {filteredOrders.filter((o) => o.status_of_delivery === "delivered").length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-full bg-muted p-3">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No delivered data</h3>
                    <p className="mt-2 text-sm text-muted-foreground">No data have been delivered yet.</p>
                  </div>
                ) : (
                  filteredOrders
                    .filter((o) => o.status_of_delivery === "delivered")
                    .map((order) => (
                      <div key={order.id} className="flex items-start gap-4 rounded-lg border p-4">
                        {/* Same content as above */}
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          {getStatusIcon(order.status_of_delivery)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium leading-none">
                              Order #{order.id} - {order.name}
                            </h4>
                            <Badge variant="outline" className={getStatusColor(order.status_of_delivery)}>
                              {order.status_of_delivery.charAt(0).toUpperCase() + order.status_of_delivery.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.crates_desired} crates - ₵{order.amount.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              Delivery: {formatDate(order.date_of_delivery)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              Created: {format(new Date(order.created_at), "MMM d, yyyy")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={order.status_of_delivery}
                            onValueChange={(value) => handleStatusChange(order.id, value as any)}
                          >
                            <SelectTrigger className="h-8 w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Order statistics and metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Total Revenue</div>
                <div className="text-sm font-medium">₵{calculateTotalRevenue().toLocaleString()}</div>
              </div>
              <Progress value={75} className="h-2" />
            </div> */}

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Order Breakdown</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center rounded-lg border p-3">
                  <div className="text-2xl font-bold">
                    {data.filter((o) => o.status_of_delivery === "pending").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border p-3">
                  <div className="text-2xl font-bold">
                    {data.filter((o) => o.status_of_delivery === "processing").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Processing</div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border p-3">
                  <div className="text-2xl font-bold">
                    {data.filter((o) => o.status_of_delivery === "delivered").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Delivered</div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border p-3">
                  <div className="text-2xl font-bold">
                    {data.filter((o) => o.status_of_delivery === "cancelled").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Cancelled</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Upcoming Deliveries</h4>
              <div className="space-y-2">
                {data
                  .filter((o) => o.status_of_delivery !== "delivered" && o.status_of_delivery !== "cancelled")
                  .sort((a, b) => new Date(a.date_of_delivery).getTime() - new Date(b.date_of_delivery).getTime())
                  .slice(0, 3)
                  .map((order) => (
                    <div key={order.id} className="flex items-center justify-between rounded-lg border p-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${getStatusColor(order.status_of_delivery)}`}></div>
                        <div className="text-sm">{order.name}</div>
                      </div>
                      <div className="text-sm font-medium">{formatDate(order.date_of_delivery)}</div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Total Crates</div>
                <div className="text-sm font-medium">{calculateTotalCrates()}</div>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Detailed Report
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardShell>
  )
}

