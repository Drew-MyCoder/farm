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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Search, ShieldCheck, Edit, Trash2, Mail, Phone, ShieldX, Key } from "lucide-react"
import { format } from "date-fns"

// Mock admin data
const admins = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    phone: "+233 20 111 2222",
    role: "Super Admin",
    permissions: ["all"],
    status: "active",
    last_login: "2025-03-10T08:30:00Z",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "John Manager",
    email: "john.manager@example.com",
    phone: "+233 24 333 4444",
    role: "Farm Admin",
    permissions: ["farm_management", "user_management"],
    status: "active",
    last_login: "2025-03-09T14:45:00Z",
    created_at: "2024-02-20T09:15:00Z",
  },
  {
    id: 3,
    name: "Sarah Finance",
    email: "sarah.finance@example.com",
    phone: "+233 55 555 6666",
    role: "Finance Admin",
    permissions: ["finance_management", "reports"],
    status: "active",
    last_login: "2025-03-08T11:20:00Z",
    created_at: "2024-03-05T14:45:00Z",
  },
  {
    id: 4,
    name: "Kofi Sales",
    email: "kofi.sales@example.com",
    phone: "+233 27 777 8888",
    role: "Sales Admin",
    permissions: ["sales_management", "customer_management"],
    status: "inactive",
    last_login: "2025-02-28T09:10:00Z",
    created_at: "2024-04-10T11:20:00Z",
  },
  {
    id: 5,
    name: "Ama Support",
    email: "ama.support@example.com",
    phone: "+233 50 999 0000",
    role: "Support Admin",
    permissions: ["user_support", "reports"],
    status: "active",
    last_login: "2025-03-10T10:15:00Z",
    created_at: "2024-05-18T08:30:00Z",
  },
]

export default function AdminsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false)
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Farm Admin",
    status: "active",
  })

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddAdmin = () => {
    // In a real app, this would make an API call to add the admin
    console.log("Adding admin:", newAdmin)
    setIsAddAdminDialogOpen(false)
    // Reset form
    setNewAdmin({
      name: "",
      email: "",
      phone: "",
      role: "Farm Admin",
      status: "active",
    })
  }

  const formatPermissions = (permissions: string[]) => {
    if (permissions.includes("all")) return "Full Access"
    return permissions
      .map((p) =>
        p
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      )
      .join(", ")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Management</h2>
          <p className="text-muted-foreground">Manage administrators and their system permissions.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search admins..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddAdminDialogOpen} onOpenChange={setIsAddAdminDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Administrator</DialogTitle>
                <DialogDescription>Create a new administrator account with specific permissions.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newAdmin.phone}
                    onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                    placeholder="+233 20 123 4567"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="role">Admin Role</Label>
                    <Select value={newAdmin.role} onValueChange={(value) => setNewAdmin({ ...newAdmin, role: value })}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                        <SelectItem value="Farm Admin">Farm Admin</SelectItem>
                        <SelectItem value="Finance Admin">Finance Admin</SelectItem>
                        <SelectItem value="Sales Admin">Sales Admin</SelectItem>
                        <SelectItem value="Support Admin">Support Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newAdmin.status}
                      onValueChange={(value) => setNewAdmin({ ...newAdmin, status: value })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="farm_management" className="h-4 w-4" />
                      <Label htmlFor="farm_management" className="text-sm font-normal">
                        Farm Management
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="user_management" className="h-4 w-4" />
                      <Label htmlFor="user_management" className="text-sm font-normal">
                        User Management
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="finance_management" className="h-4 w-4" />
                      <Label htmlFor="finance_management" className="text-sm font-normal">
                        Finance Management
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sales_management" className="h-4 w-4" />
                      <Label htmlFor="sales_management" className="text-sm font-normal">
                        Sales Management
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="reports" className="h-4 w-4" />
                      <Label htmlFor="reports" className="text-sm font-normal">
                        Reports
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="customer_management" className="h-4 w-4" />
                      <Label htmlFor="customer_management" className="text-sm font-normal">
                        Customer Management
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddAdminDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAdmin}>Add Administrator</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Administrators</CardTitle>
          <CardDescription>A list of all administrators and their access permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No administrators found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-1 h-3 w-3" />
                          {admin.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="mr-1 h-3 w-3" />
                          {admin.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{admin.role}</TableCell>
                    <TableCell>
                      <span className="text-sm">{formatPermissions(admin.permissions)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={admin.status === "active" ? "default" : "secondary"}>
                        {admin.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(admin.last_login), "MMM d, yyyy")}</TableCell>
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
                            <Key className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {admin.status === "active" ? (
                              <>
                                <ShieldX className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
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

