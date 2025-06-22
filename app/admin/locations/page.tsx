
// "use client"

// import { useState, useEffect } from "react"
// import {
//   Plus,
//   Search,
//   MapPin,
//   Users,
//   Building2,
//   MoreHorizontal,
//   Edit,
//   Trash2,
//   Eye,
//   UserPlus,
//   Building,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import { toast } from "sonner"

// // Types based on backend schemas
// interface Location {
//   id: number
//   name: string
//   address: string
//   region: string
//   status: string
//   manager_id?: number
//   created_at: string
//   updated_at: string
// }

// interface LocationWithManager extends Location {
//   manager_name?: string
// }

// // interface LocationWithCoops extends Location {
// //   total_coops: number
// //   active_coops: number
// // }

// interface UserInLocation {
//   id: number
//   username: string
//   email: string
//   role: string
//   full_name?: string
// }

// interface CoopInLocation {
//   id: number
//   name: string
//   status: string
//   member_count: number
// }

// interface LocationFullDetails extends Location {
//   users: UserInLocation[]
//   coops: CoopInLocation[]
//   manager_name?: string
// }

// export default function LocationsPage() {
//   const [locations, setLocations] = useState<LocationWithManager[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [statusFilter, setStatusFilter] = useState<string>("all")
//   const [regionFilter, setRegionFilter] = useState<string>("all")
//   const [selectedLocation, setSelectedLocation] = useState<LocationFullDetails | null>(null)
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
//   const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
//   const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
//   const [deleteLocationId, setDeleteLocationId] = useState<number | null>(null)
//   const [currentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   // Form states
//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     region: "",
//     status: "active",
//   })

//   // Mock data for development
//   const mockLocations: LocationWithManager[] = [
//     {
//       id: 1,
//       name: "Accra Central Office",
//       address: "123 Independence Avenue, Accra",
//       region: "Greater Accra",
//       status: "active",
//       manager_id: 1,
//       manager_name: "John Doe",
//       created_at: "2024-01-15T10:00:00Z",
//       updated_at: "2024-01-15T10:00:00Z",
//     },
//     {
//       id: 2,
//       name: "Kumasi Branch",
//       address: "456 Kejetia Road, Kumasi",
//       region: "Ashanti",
//       status: "active",
//       manager_id: 2,
//       manager_name: "Jane Smith",
//       created_at: "2024-01-20T14:30:00Z",
//       updated_at: "2024-01-20T14:30:00Z",
//     },
//     {
//       id: 3,
//       name: "Tamale Office",
//       address: "789 Hospital Road, Tamale",
//       region: "Northern",
//       status: "inactive",
//       created_at: "2024-02-01T09:15:00Z",
//       updated_at: "2024-02-01T09:15:00Z",
//     },
//   ]

//   const mockLocationDetails: LocationFullDetails = {
//     id: 1,
//     name: "Accra Central Office",
//     address: "123 Independence Avenue, Accra",
//     region: "Greater Accra",
//     status: "active",
//     manager_id: 1,
//     manager_name: "John Doe",
//     created_at: "2024-01-15T10:00:00Z",
//     updated_at: "2024-01-15T10:00:00Z",
//     users: [
//       { id: 1, username: "john_doe", email: "john@example.com", role: "manager", full_name: "John Doe" },
//       { id: 2, username: "jane_smith", email: "jane@example.com", role: "staff", full_name: "Jane Smith" },
//       { id: 3, username: "bob_wilson", email: "bob@example.com", role: "staff", full_name: "Bob Wilson" },
//     ],
//     coops: [
//       { id: 1, name: "Farmers Cooperative", status: "active", member_count: 45 },
//       { id: 2, name: "Women's Savings Group", status: "active", member_count: 32 },
//       { id: 3, name: "Youth Development Coop", status: "pending", member_count: 18 },
//     ],
//   }

//   useEffect(() => {
//     fetchLocations()
//   }, [searchQuery, statusFilter, regionFilter, currentPage])

//   const fetchLocations = async () => {
//     setLoading(true)
//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       let filteredLocations = mockLocations

//       if (searchQuery) {
//         filteredLocations = filteredLocations.filter(
//           (location) =>
//             location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             location.region.toLowerCase().includes(searchQuery.toLowerCase()),
//         )
//       }

//       if (statusFilter !== "all") {
//         filteredLocations = filteredLocations.filter((location) => location.status === statusFilter)
//       }

//       if (regionFilter !== "all") {
//         filteredLocations = filteredLocations.filter((location) => location.region === regionFilter)
//       }

//       setLocations(filteredLocations)
//       setTotalPages(Math.ceil(filteredLocations.length / 10))
//     } catch (error) {
//       toast.error('Failed to fetch locations', {
//               description: 'Please try again.',
//             });
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCreateLocation = async () => {
//     try {
//       // Simulate API call
//     //   await new Promise((resolve) => setTimeout(resolve, 1000))
//       toast.success("Location created successfully");

//       setIsCreateDialogOpen(false)
//       setFormData({ name: "", address: "", region: "", status: "active" })
//       fetchLocations()
//     } catch (error) {
//       toast.error('Error', {
//               description: 'Failed to create location.',
//             });
//     }
//   }

//   const handleUpdateLocation = async () => {
//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       toast.success("Location updated successfully");

//       setIsEditDialogOpen(false)
//       fetchLocations()
//     } catch (error) {
//       toast.error('Error', {
//               description: 'Failed to update location',
//             });
//     }
//   }

//   const handleDeleteLocation = async (id: number) => {
//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       toast.success("Location deleted successfully");

//       setDeleteLocationId(null)
//       fetchLocations()
//     } catch (error) {
//       toast.error('Error', {
//               description: 'failed to delete location',
//             });
//     }
//   }

//   const handleViewLocation = async (id: number) => {
//     try {
//       // Simulate API call to get full details
//       await new Promise((resolve) => setTimeout(resolve, 500))
//       setSelectedLocation(mockLocationDetails)
//       setIsViewDialogOpen(true)
//     } catch (error) {
//       toast.error('Error', {
//               description: 'failed to fetch location details',
//             });
//     }
//   }

//   const getStatusBadge = (status: string) => {
//     const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
//       active: "default",
//       inactive: "secondary",
//       pending: "outline",
//     }

//     return <Badge variant={variants[status] || "outline"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
//   }

//   const regions = [
//     "Greater Accra",
//     "Ashanti",
//     "Northern",
//     "Western",
//     "Eastern",
//     "Central",
//     "Volta",
//     "Upper East",
//     "Upper West",
//     "Brong Ahafo",
//   ]

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
//           <p className="text-muted-foreground">Manage your organization's locations and assignments</p>
//         </div>
//         <Button onClick={() => setIsCreateDialogOpen(true)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Add Location
//         </Button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
//             <MapPin className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{locations.length}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Active Locations</CardTitle>
//             <MapPin className="h-4 w-4 text-green-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{locations.filter((l) => l.status === "active").length}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">With Managers</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{locations.filter((l) => l.manager_id).length}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Regions</CardTitle>
//             <Building2 className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{new Set(locations.map((l) => l.region)).size}</div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Filters</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col gap-4 md:flex-row">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search locations..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-8"
//                 />
//               </div>
//             </div>
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Filter by status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Statuses</SelectItem>
//                 <SelectItem value="active">Active</SelectItem>
//                 <SelectItem value="inactive">Inactive</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select value={regionFilter} onValueChange={setRegionFilter}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Filter by region" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Regions</SelectItem>
//                 {regions.map((region) => (
//                   <SelectItem key={region} value={region}>
//                     {region}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Locations Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Locations</CardTitle>
//           <CardDescription>A list of all locations in your organization</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {loading ? (
//             <div className="flex items-center justify-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//             </div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Address</TableHead>
//                   <TableHead>Region</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Manager</TableHead>
//                   <TableHead>Created</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {locations.map((location) => (
//                   <TableRow key={location.id}>
//                     <TableCell className="font-medium">{location.name}</TableCell>
//                     <TableCell>{location.address}</TableCell>
//                     <TableCell>{location.region}</TableCell>
//                     <TableCell>{getStatusBadge(location.status)}</TableCell>
//                     <TableCell>{location.manager_name || "Not assigned"}</TableCell>
//                     <TableCell>{new Date(location.created_at).toLocaleDateString()}</TableCell>
//                     <TableCell className="text-right">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" className="h-8 w-8 p-0">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem onClick={() => handleViewLocation(location.id)}>
//                             <Eye className="mr-2 h-4 w-4" />
//                             View Details
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => {
//                               setFormData({
//                                 name: location.name,
//                                 address: location.address,
//                                 region: location.region,
//                                 status: location.status,
//                               })
//                               setSelectedLocation(location as LocationFullDetails)
//                               setIsEditDialogOpen(true)
//                             }}
//                           >
//                             <Edit className="mr-2 h-4 w-4" />
//                             Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => {
//                               setSelectedLocation(location as LocationFullDetails)
//                               setIsAssignDialogOpen(true)
//                             }}
//                           >
//                             <UserPlus className="mr-2 h-4 w-4" />
//                             Assign Users/Coops
//                           </DropdownMenuItem>
//                           <DropdownMenuItem onClick={() => setDeleteLocationId(location.id)} className="text-red-600">
//                             <Trash2 className="mr-2 h-4 w-4" />
//                             Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>

//       {/* Create Location Dialog */}
//       <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Create New Location</DialogTitle>
//             <DialogDescription>Add a new location to your organization</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="name">Name</Label>
//               <Input
//                 id="name"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 placeholder="Enter location name"
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="address">Address</Label>
//               <Textarea
//                 id="address"
//                 value={formData.address}
//                 onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                 placeholder="Enter full address"
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="region">Region</Label>
//               <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select region" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {regions.map((region) => (
//                     <SelectItem key={region} value={region}>
//                       {region}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="status">Status</Label>
//               <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="active">Active</SelectItem>
//                   <SelectItem value="inactive">Inactive</SelectItem>
//                   <SelectItem value="pending">Pending</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <div className="flex justify-end gap-2">
//             <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleCreateLocation}>Create Location</Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Edit Location Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Edit Location</DialogTitle>
//             <DialogDescription>Update location information</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="edit-name">Name</Label>
//               <Input
//                 id="edit-name"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="edit-address">Address</Label>
//               <Textarea
//                 id="edit-address"
//                 value={formData.address}
//                 onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="edit-region">Region</Label>
//               <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {regions.map((region) => (
//                     <SelectItem key={region} value={region}>
//                       {region}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="edit-status">Status</Label>
//               <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="active">Active</SelectItem>
//                   <SelectItem value="inactive">Inactive</SelectItem>
//                   <SelectItem value="pending">Pending</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <div className="flex justify-end gap-2">
//             <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleUpdateLocation}>Update Location</Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* View Location Details Dialog */}
//       <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle>{selectedLocation?.name}</DialogTitle>
//             <DialogDescription>Location details and assignments</DialogDescription>
//           </DialogHeader>
//           {selectedLocation && (
//             <Tabs defaultValue="details" className="w-full">
//               <TabsList className="grid w-full grid-cols-3">
//                 <TabsTrigger value="details">Details</TabsTrigger>
//                 <TabsTrigger value="users">Users ({selectedLocation.users?.length || 0})</TabsTrigger>
//                 <TabsTrigger value="coops">Coops ({selectedLocation.coops?.length || 0})</TabsTrigger>
//               </TabsList>
//               <TabsContent value="details" className="space-y-4">
//                 <div className="grid gap-4">
//                   <div>
//                     <Label className="text-sm font-medium">Address</Label>
//                     <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium">Region</Label>
//                     <p className="text-sm text-muted-foreground">{selectedLocation.region}</p>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium">Status</Label>
//                     <div className="mt-1">{getStatusBadge(selectedLocation.status)}</div>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium">Manager</Label>
//                     <p className="text-sm text-muted-foreground">{selectedLocation.manager_name || "Not assigned"}</p>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium">Created</Label>
//                     <p className="text-sm text-muted-foreground">
//                       {new Date(selectedLocation.created_at).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               </TabsContent>
//               <TabsContent value="users">
//                 <div className="space-y-2">
//                   {selectedLocation.users?.map((user) => (
//                     <div key={user.id} className="flex items-center justify-between p-2 border rounded">
//                       <div>
//                         <p className="font-medium">{user.full_name || user.username}</p>
//                         <p className="text-sm text-muted-foreground">{user.email}</p>
//                       </div>
//                       <Badge variant="outline">{user.role}</Badge>
//                     </div>
//                   ))}
//                   {(!selectedLocation.users || selectedLocation.users.length === 0) && (
//                     <p className="text-sm text-muted-foreground text-center py-4">No users assigned</p>
//                   )}
//                 </div>
//               </TabsContent>
//               <TabsContent value="coops">
//                 <div className="space-y-2">
//                   {selectedLocation.coops?.map((coop) => (
//                     <div key={coop.id} className="flex items-center justify-between p-2 border rounded">
//                       <div>
//                         <p className="font-medium">{coop.name}</p>
//                         <p className="text-sm text-muted-foreground">{coop.member_count} members</p>
//                       </div>
//                       {getStatusBadge(coop.status)}
//                     </div>
//                   ))}
//                   {(!selectedLocation.coops || selectedLocation.coops.length === 0) && (
//                     <p className="text-sm text-muted-foreground text-center py-4">No coops assigned</p>
//                   )}
//                 </div>
//               </TabsContent>
//             </Tabs>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Assignment Dialog */}
//       <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Assign Users & Coops</DialogTitle>
//             <DialogDescription>Assign users and cooperatives to {selectedLocation?.name}</DialogDescription>
//           </DialogHeader>
//           <Tabs defaultValue="users" className="w-full">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="users">Assign Users</TabsTrigger>
//               <TabsTrigger value="coops">Assign Coops</TabsTrigger>
//             </TabsList>
//             <TabsContent value="users" className="space-y-4">
//               <div className="space-y-2">
//                 <Label>Select Users</Label>
//                 <div className="border rounded-md p-2 max-h-48 overflow-y-auto">
//                   {/* Mock user list */}
//                   {[
//                     { id: 4, name: "Alice Johnson", email: "alice@example.com", role: "staff" },
//                     { id: 5, name: "Bob Smith", email: "bob@example.com", role: "manager" },
//                     { id: 6, name: "Carol Davis", email: "carol@example.com", role: "staff" },
//                   ].map((user) => (
//                     <div key={user.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
//                       <input type="checkbox" id={`user-${user.id}`} />
//                       <label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer">
//                         <div className="font-medium">{user.name}</div>
//                         <div className="text-sm text-muted-foreground">
//                           {user.email} • {user.role}
//                         </div>
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <Button className="w-full">
//                 <UserPlus className="mr-2 h-4 w-4" />
//                 Assign Selected Users
//               </Button>
//             </TabsContent>
//             <TabsContent value="coops" className="space-y-4">
//               <div className="space-y-2">
//                 <Label>Select Cooperatives</Label>
//                 <div className="border rounded-md p-2 max-h-48 overflow-y-auto">
//                   {/* Mock coop list */}
//                   {[
//                     { id: 4, name: "Tech Startup Coop", members: 25, status: "active" },
//                     { id: 5, name: "Agricultural Coop", members: 60, status: "active" },
//                     { id: 6, name: "Artisan Collective", members: 15, status: "pending" },
//                   ].map((coop) => (
//                     <div key={coop.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
//                       <input type="checkbox" id={`coop-${coop.id}`} />
//                       <label htmlFor={`coop-${coop.id}`} className="flex-1 cursor-pointer">
//                         <div className="font-medium">{coop.name}</div>
//                         <div className="text-sm text-muted-foreground">
//                           {coop.members} members • {coop.status}
//                         </div>
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <Button className="w-full">
//                 <Building className="mr-2 h-4 w-4" />
//                 Assign Selected Coops
//               </Button>
//             </TabsContent>
//           </Tabs>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={deleteLocationId !== null} onOpenChange={() => setDeleteLocationId(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete the location and remove all associated
//               assignments.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={() => deleteLocationId && handleDeleteLocation(deleteLocationId)}
//               className="bg-red-600 hover:bg-red-700"
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   )
// }


const LocationsPage = () => {
  return 
  <h1>this is the location page. yet to build</h1>
}


export default LocationsPage;

