"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MoreHorizontal,
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  FileText,
  Download,
  Filter,
  XCircle,
} from "lucide-react"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

// Mock expenditure data
const expenditures = [
  {
    id: 1,
    description: "Feed Purchase",
    category: "Feed",
    amount: 5000,
    date: "2025-03-01T00:00:00Z",
    payment_method: "Bank Transfer",
    status: "approved",
    approved_by: "Admin User",
    created_at: "2025-03-01T10:30:00Z",
  },
  {
    id: 2,
    description: "Medication for Chickens",
    category: "Medication",
    amount: 1200,
    date: "2025-03-03T00:00:00Z",
    payment_method: "Cash",
    status: "approved",
    approved_by: "John Manager",
    created_at: "2025-03-03T09:15:00Z",
  },
  {
    id: 3,
    description: "Equipment Repair",
    category: "Maintenance",
    amount: 800,
    date: "2025-03-05T00:00:00Z",
    payment_method: "Mobile Money",
    status: "approved",
    approved_by: "Admin User",
    created_at: "2025-03-05T14:45:00Z",
  },
  {
    id: 4,
    description: "Utility Bills",
    category: "Utilities",
    amount: 650,
    date: "2025-03-07T00:00:00Z",
    payment_method: "Bank Transfer",
    status: "approved",
    approved_by: "Sarah Finance",
    created_at: "2025-03-07T11:20:00Z",
  },
  {
    id: 5,
    description: "New Feeding Equipment",
    category: "Equipment",
    amount: 3500,
    date: "2025-03-09T00:00:00Z",
    payment_method: "Bank Transfer",
    status: "pending",
    approved_by: null,
    created_at: "2025-03-09T08:30:00Z",
  },
  {
    id: 6,
    description: "Staff Salaries",
    category: "Salaries",
    amount: 8000,
    date: "2025-03-10T00:00:00Z",
    payment_method: "Bank Transfer",
    status: "approved",
    approved_by: "Admin User",
    created_at: "2025-03-10T13:10:00Z",
  },
  {
    id: 7,
    description: "Transportation Costs",
    category: "Transportation",
    amount: 1200,
    date: "2025-03-11T00:00:00Z",
    payment_method: "Cash",
    status: "rejected",
    approved_by: "Sarah Finance",
    created_at: "2025-03-11T16:40:00Z",
  },
]

export default function ExpendituresPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false)
  const [newExpense, setNewExpense] = useState({
    description: "",
    category: "Feed",
    amount: "",
    date: new Date().toISOString(),
    payment_method: "Bank Transfer",
    notes: "",
  })

  const filteredExpenditures = expenditures.filter((expense) => {
    // Search filter
    const matchesSearch =
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase())

    // Category filter
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter

    // Status filter
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter

    // Date filter
    const matchesDate = !date || format(new Date(expense.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")

    return matchesSearch && matchesCategory && matchesStatus && matchesDate
  })

  const handleAddExpense = () => {
    // In a real app, this would make an API call to add the expense
    console.log("Adding expense:", newExpense)
    setIsAddExpenseDialogOpen(false)
    // Reset form
    setNewExpense({
      description: "",
      category: "Feed",
      amount: "",
      date: new Date().toISOString(),
      payment_method: "Bank Transfer",
      notes: "",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const calculateTotalExpenses = () => {
    return filteredExpenditures.reduce((total, expense) => {
      if (expense.status !== "rejected") {
        return total + expense.amount
      }
      return total
    }, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Expenditure Management</h2>
          <p className="text-muted-foreground">Track and manage all farm expenses and approvals.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Dialog open={isAddExpenseDialogOpen} onOpenChange={setIsAddExpenseDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Record a new expense for the farm. Fill in all the required information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="Feed purchase"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newExpense.category}
                      onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Feed">Feed</SelectItem>
                        <SelectItem value="Medication">Medication</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Salaries">Salaries</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount (₵)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newExpense.date && "text-muted-foreground",
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {newExpense.date ? format(new Date(newExpense.date), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={new Date(newExpense.date)}
                          onSelect={(date) =>
                            setNewExpense({ ...newExpense, date: date?.toISOString() || new Date().toISOString() })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="payment_method">Payment Method</Label>
                    <Select
                      value={newExpense.payment_method}
                      onValueChange={(value) => setNewExpense({ ...newExpense, payment_method: value })}
                    >
                      <SelectTrigger id="payment_method">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                        <SelectItem value="Check">Check</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={newExpense.notes}
                    onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                    placeholder="Any additional information about this expense"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddExpenseDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExpense}>Add Expense</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search expenses..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Feed">Feed</SelectItem>
            <SelectItem value="Medication">Medication</SelectItem>
            <SelectItem value="Equipment">Equipment</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="Utilities">Utilities</SelectItem>
            <SelectItem value="Salaries">Salaries</SelectItem>
            <SelectItem value="Transportation">Transportation</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Filter by date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-left font-normal"
                onClick={() => setDate(undefined)}
              >
                Clear date filter
              </Button>
            </div>
            <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CardDescription>All approved and pending expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₵{calculateTotalExpenses().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For the selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <CardDescription>Expenses awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredExpenditures.filter((e) => e.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">
              ₵
              {filteredExpenditures
                .filter((e) => e.status === "pending")
                .reduce((sum, e) => sum + e.amount, 0)
                .toLocaleString()}{" "}
              total value
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Largest Category</CardTitle>
            <CardDescription>Highest spending category</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const categories = filteredExpenditures.reduce(
                (acc, expense) => {
                  if (expense.status !== "rejected") {
                    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
                  }
                  return acc
                },
                {} as Record<string, number>,
              )

              const largestCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]

              return largestCategory ? (
                <>
                  <div className="text-2xl font-bold">{largestCategory[0]}</div>
                  <p className="text-xs text-muted-foreground">₵{largestCategory[1].toLocaleString()} total spent</p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">N/A</div>
                  <p className="text-xs text-muted-foreground">No data available</p>
                </>
              )
            })()}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Records</CardTitle>
          <CardDescription>A list of all expenses with their approval status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenditures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No expenses found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenditures.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>₵{expense.amount.toLocaleString()}</TableCell>
                    <TableCell>{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{expense.payment_method}</TableCell>
                    <TableCell>{getStatusBadge(expense.status)}</TableCell>
                    <TableCell>{expense.approved_by || "—"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {expense.status === "pending" && (
                            <>
                              <DropdownMenuItem className="text-green-600">
                                <DollarSign className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

