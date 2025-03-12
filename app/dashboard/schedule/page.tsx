"use client"

import { useState } from "react"
import { format, addDays, isBefore, isAfter } from "date-fns"
import {
  Calendar,
  Filter,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  CalendarIcon,
  Syringe,
  MoreHorizontal,
  Trash2,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header"
import { DashboardShell } from "@/app/dashboard/components/dashboard-shell"
import { cn } from "@/lib/utils"

// Mock data for vaccinations
const initialVaccinations = [
  {
    id: 1,
    vaccine_name: "Newcastle Disease Vaccine",
    coop_id: "1",
    coop_name: "Coop A",
    scheduled_date: "2025-03-20T09:00:00Z",
    status: "scheduled",
    notes: "First dose for all birds",
    administered_by: null,
    created_at: "2025-03-01T10:30:00Z",
  },
  {
    id: 2,
    vaccine_name: "Infectious Bronchitis Vaccine",
    coop_id: "2",
    coop_name: "Coop B",
    scheduled_date: "2025-03-15T10:30:00Z",
    status: "scheduled",
    notes: "Booster shot required after 2 weeks",
    administered_by: null,
    created_at: "2025-03-02T14:15:00Z",
  },
  {
    id: 3,
    vaccine_name: "Fowl Pox Vaccine",
    coop_id: "3",
    coop_name: "Coop C",
    scheduled_date: "2025-03-10T08:00:00Z",
    status: "completed",
    notes: "All birds vaccinated successfully",
    administered_by: "John Doe",
    created_at: "2025-02-25T09:45:00Z",
  },
  {
    id: 4,
    vaccine_name: "Marek's Disease Vaccine",
    coop_id: "4",
    coop_name: "Coop D",
    scheduled_date: "2025-03-05T11:00:00Z",
    status: "completed",
    notes: "Some birds showed mild reaction",
    administered_by: "Jane Smith",
    created_at: "2025-02-20T13:30:00Z",
  },
  {
    id: 5,
    vaccine_name: "Infectious Bursal Disease Vaccine",
    coop_id: "1",
    coop_name: "Coop A",
    scheduled_date: "2025-03-01T09:30:00Z",
    status: "missed",
    notes: "Rescheduled for next week due to staff shortage",
    administered_by: null,
    created_at: "2025-02-15T10:00:00Z",
  },
  {
    id: 6,
    vaccine_name: "Avian Influenza Vaccine",
    coop_id: "2",
    coop_name: "Coop B",
    scheduled_date: "2025-04-05T10:00:00Z",
    status: "scheduled",
    notes: "Annual vaccination",
    administered_by: null,
    created_at: "2025-03-10T11:20:00Z",
  },
  {
    id: 7,
    vaccine_name: "Fowl Cholera Vaccine",
    coop_id: "3",
    coop_name: "Coop C",
    scheduled_date: "2025-04-10T09:00:00Z",
    status: "scheduled",
    notes: "First time using this vaccine",
    administered_by: null,
    created_at: "2025-03-12T14:30:00Z",
  },
]

// Mock data for coops
const coops = [
  { id: "1", name: "Coop A" },
  { id: "2", name: "Coop B" },
  { id: "3", name: "Coop C" },
  { id: "4", name: "Coop D" },
]

// Mock data for vaccine types
const vaccineTypes = [
  "Newcastle Disease Vaccine",
  "Infectious Bronchitis Vaccine",
  "Fowl Pox Vaccine",
  "Marek's Disease Vaccine",
  "Infectious Bursal Disease Vaccine",
  "Avian Influenza Vaccine",
  "Fowl Cholera Vaccine",
  "Coccidiosis Vaccine",
  "Mycoplasma Gallisepticum Vaccine",
]

export default function VaccinationSchedulePage() {
  const [vaccinations, setVaccinations] = useState(initialVaccinations)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [coopFilter, setCoopFilter] = useState("all")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isAddVaccinationDialogOpen, setIsAddVaccinationDialogOpen] = useState(false)
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false)
  const [selectedVaccination, setSelectedVaccination] = useState<any>(null)
  const [newVaccination, setNewVaccination] = useState({
    vaccine_name: "",
    coop_id: "",
    scheduled_date: new Date().toISOString(),
    notes: "",
  })

  const filteredVaccinations = vaccinations.filter((vaccination) => {
    // Search filter
    const matchesSearch =
      vaccination.vaccine_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vaccination.coop_name.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || vaccination.status === statusFilter

    // Coop filter
    const matchesCoop = coopFilter === "all" || vaccination.coop_id === coopFilter

    // Date filter
    const matchesDate =
      !date || format(new Date(vaccination.scheduled_date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")

    return matchesSearch && matchesStatus && matchesCoop && matchesDate
  })

  const handleAddVaccination = () => {
    const id = Math.max(...vaccinations.map((v) => v.id), 0) + 1
    const coopName = coops.find((coop) => coop.id === newVaccination.coop_id)?.name || ""

    const newVaccinationRecord = {
      id,
      vaccine_name: newVaccination.vaccine_name,
      coop_id: newVaccination.coop_id,
      coop_name: coopName,
      scheduled_date: newVaccination.scheduled_date,
      status: "scheduled",
      notes: newVaccination.notes,
      administered_by: null,
      created_at: new Date().toISOString(),
    }

    setVaccinations([...vaccinations, newVaccinationRecord])
    setIsAddVaccinationDialogOpen(false)

    // Reset form
    setNewVaccination({
      vaccine_name: "",
      coop_id: "",
      scheduled_date: new Date().toISOString(),
      notes: "",
    })
  }

  const handleUpdateStatus = (id: number, newStatus: string) => {
    setVaccinations(
      vaccinations.map((vaccination) =>
        vaccination.id === id
          ? {
              ...vaccination,
              status: newStatus,
              administered_by: newStatus === "completed" ? "John Doe" : vaccination.administered_by,
            }
          : vaccination,
      ),
    )
  }

  const handleDeleteVaccination = (id: number) => {
    setVaccinations(vaccinations.filter((vaccination) => vaccination.id !== id))
  }

  const viewVaccinationDetails = (vaccination: any) => {
    setSelectedVaccination(vaccination)
    setIsViewDetailsDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "scheduled":
        return <Badge className="bg-blue-500">Scheduled</Badge>
      case "missed":
        return <Badge className="bg-red-500">Missed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getUpcomingVaccinations = () => {
    const today = new Date()
    return vaccinations
      .filter((v) => v.status === "scheduled" && isAfter(new Date(v.scheduled_date), today))
      .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())
      .slice(0, 3)
  }

  const getOverdueVaccinations = () => {
    const today = new Date()
    return vaccinations
      .filter((v) => v.status === "scheduled" && isBefore(new Date(v.scheduled_date), today))
      .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())
  }

  const getTodayVaccinations = () => {
    const today = format(new Date(), "yyyy-MM-dd")
    return vaccinations
      .filter((v) => format(new Date(v.scheduled_date), "yyyy-MM-dd") === today)
      .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Vaccination Schedule" text="Manage and track fowl vaccinations.">
        <Dialog open={isAddVaccinationDialogOpen} onOpenChange={setIsAddVaccinationDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Vaccination
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Schedule New Vaccination</DialogTitle>
              <DialogDescription>
                Add a new vaccination to the schedule. Fill in all the required information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="vaccine_name">Vaccine Type</Label>
                <Select
                  value={newVaccination.vaccine_name}
                  onValueChange={(value) => setNewVaccination({ ...newVaccination, vaccine_name: value })}
                >
                  <SelectTrigger id="vaccine_name">
                    <SelectValue placeholder="Select vaccine type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vaccineTypes.map((vaccine) => (
                      <SelectItem key={vaccine} value={vaccine}>
                        {vaccine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="coop_id">Coop</Label>
                <Select
                  value={newVaccination.coop_id}
                  onValueChange={(value) => setNewVaccination({ ...newVaccination, coop_id: value })}
                >
                  <SelectTrigger id="coop_id">
                    <SelectValue placeholder="Select coop" />
                  </SelectTrigger>
                  <SelectContent>
                    {coops.map((coop) => (
                      <SelectItem key={coop.id} value={coop.id}>
                        {coop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="scheduled_date">Scheduled Date & Time</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !newVaccination.scheduled_date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newVaccination.scheduled_date ? (
                          format(new Date(newVaccination.scheduled_date), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={new Date(newVaccination.scheduled_date)}
                        onSelect={(date) => {
                          if (date) {
                            const currentDate = new Date(newVaccination.scheduled_date)
                            date.setHours(currentDate.getHours())
                            date.setMinutes(currentDate.getMinutes())
                            setNewVaccination({ ...newVaccination, scheduled_date: date.toISOString() })
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    value={format(new Date(newVaccination.scheduled_date), "HH:mm")}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(":").map(Number)
                      const date = new Date(newVaccination.scheduled_date)
                      date.setHours(hours)
                      date.setMinutes(minutes)
                      setNewVaccination({ ...newVaccination, scheduled_date: date.toISOString() })
                    }}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newVaccination.notes}
                  onChange={(e) => setNewVaccination({ ...newVaccination, notes: e.target.value })}
                  placeholder="Any additional information about this vaccination"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddVaccinationDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddVaccination}>Schedule Vaccination</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search vaccinations..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={coopFilter} onValueChange={setCoopFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Coop" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Coops</SelectItem>
            {coops.map((coop) => (
              <SelectItem key={coop.id} value={coop.id}>
                {coop.name}
              </SelectItem>
            ))}
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
            <CardTitle className="text-sm font-medium">Today's Vaccinations</CardTitle>
            <CardDescription>Scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTodayVaccinations().length}</div>
            <p className="text-xs text-muted-foreground">
              {getTodayVaccinations().length > 0
                ? `Next: ${getTodayVaccinations()[0].coop_name} at ${format(new Date(getTodayVaccinations()[0].scheduled_date), "h:mm a")}`
                : "No vaccinations scheduled for today"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Vaccinations</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                vaccinations.filter(
                  (v) =>
                    v.status === "scheduled" &&
                    isAfter(new Date(v.scheduled_date), new Date()) &&
                    isBefore(new Date(v.scheduled_date), addDays(new Date(), 7)),
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Across all coops</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue Vaccinations</CardTitle>
            <CardDescription>Scheduled but not completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{getOverdueVaccinations().length}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Vaccinations</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Vaccination Schedule</CardTitle>
              <CardDescription>A complete list of all scheduled and completed vaccinations.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vaccine</TableHead>
                    <TableHead>Coop</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Administered By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVaccinations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No vaccinations found. Try adjusting your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVaccinations.map((vaccination) => (
                      <TableRow key={vaccination.id}>
                        <TableCell className="font-medium">{vaccination.vaccine_name}</TableCell>
                        <TableCell>{vaccination.coop_name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{format(new Date(vaccination.scheduled_date), "MMM d, yyyy")}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(vaccination.scheduled_date), "h:mm a")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(vaccination.status)}</TableCell>
                        <TableCell>{vaccination.administered_by || "—"}</TableCell>
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
                              <DropdownMenuItem onClick={() => viewVaccinationDetails(vaccination)}>
                                <FileText className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {vaccination.status === "scheduled" && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(vaccination.id, "completed")}>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Mark as Completed
                                </DropdownMenuItem>
                              )}
                              {vaccination.status === "scheduled" && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(vaccination.id, "missed")}>
                                  <AlertCircle className="mr-2 h-4 w-4" />
                                  Mark as Missed
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteVaccination(vaccination.id)}
                              >
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
        </TabsContent>
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Vaccinations</CardTitle>
              <CardDescription>Vaccinations scheduled for the future.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vaccine</TableHead>
                    <TableHead>Coop</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVaccinations.filter(
                    (v) => v.status === "scheduled" && isAfter(new Date(v.scheduled_date), new Date()),
                  ).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No upcoming vaccinations found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVaccinations
                      .filter((v) => v.status === "scheduled" && isAfter(new Date(v.scheduled_date), new Date()))
                      .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())
                      .map((vaccination) => (
                        <TableRow key={vaccination.id}>
                          <TableCell className="font-medium">{vaccination.vaccine_name}</TableCell>
                          <TableCell>{vaccination.coop_name}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{format(new Date(vaccination.scheduled_date), "MMM d, yyyy")}</span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(vaccination.scheduled_date), "h:mm a")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{vaccination.notes || "—"}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => viewVaccinationDetails(vaccination)}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Vaccinations</CardTitle>
              <CardDescription>Vaccinations that have been administered.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vaccine</TableHead>
                    <TableHead>Coop</TableHead>
                    <TableHead>Date Administered</TableHead>
                    <TableHead>Administered By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVaccinations.filter((v) => v.status === "completed").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No completed vaccinations found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVaccinations
                      .filter((v) => v.status === "completed")
                      .sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime())
                      .map((vaccination) => (
                        <TableRow key={vaccination.id}>
                          <TableCell className="font-medium">{vaccination.vaccine_name}</TableCell>
                          <TableCell>{vaccination.coop_name}</TableCell>
                          <TableCell>{format(new Date(vaccination.scheduled_date), "MMM d, yyyy")}</TableCell>
                          <TableCell>{vaccination.administered_by}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => viewVaccinationDetails(vaccination)}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Vaccinations</CardTitle>
              <CardDescription>Vaccinations that are past their scheduled date but not completed.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vaccine</TableHead>
                    <TableHead>Coop</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getOverdueVaccinations().length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No overdue vaccinations found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    getOverdueVaccinations().map((vaccination) => (
                      <TableRow key={vaccination.id}>
                        <TableCell className="font-medium">{vaccination.vaccine_name}</TableCell>
                        <TableCell>{vaccination.coop_name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-red-500">
                              {format(new Date(vaccination.scheduled_date), "MMM d, yyyy")}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(vaccination.scheduled_date), "h:mm a")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(vaccination.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(vaccination.id, "completed")}
                            >
                              Complete
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(vaccination.id, "missed")}
                            >
                              Mark Missed
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Vaccination Details Dialog */}
      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Vaccination Details</DialogTitle>
            <DialogDescription>Detailed information about the selected vaccination.</DialogDescription>
          </DialogHeader>
          {selectedVaccination && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Vaccine Type</h4>
                  <p className="text-sm">{selectedVaccination.vaccine_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <div className="mt-1">{getStatusBadge(selectedVaccination.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Coop</h4>
                  <p className="text-sm">{selectedVaccination.coop_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Scheduled Date</h4>
                  <p className="text-sm">
                    {format(new Date(selectedVaccination.scheduled_date), "PPP")} at{" "}
                    {format(new Date(selectedVaccination.scheduled_date), "h:mm a")}
                  </p>
                </div>
              </div>
              {selectedVaccination.status === "completed" && (
                <div>
                  <h4 className="text-sm font-medium">Administered By</h4>
                  <p className="text-sm">{selectedVaccination.administered_by}</p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium">Notes</h4>
                <p className="text-sm whitespace-pre-wrap">{selectedVaccination.notes || "No notes available."}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Created</h4>
                <p className="text-sm">{format(new Date(selectedVaccination.created_at), "PPP")}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Vaccination Calendar</CardTitle>
            <CardDescription>Monthly view of all scheduled vaccinations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Upcoming Vaccinations</h3>
              <div className="space-y-2">
                {getUpcomingVaccinations().length === 0 ? (
                  <p className="text-muted-foreground">No upcoming vaccinations scheduled.</p>
                ) : (
                  getUpcomingVaccinations().map((vaccination) => (
                    <div key={vaccination.id} className="flex items-center gap-4 rounded-lg border p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Syringe className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{vaccination.vaccine_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {vaccination.coop_name} - {format(new Date(vaccination.scheduled_date), "PPP")} at{" "}
                          {format(new Date(vaccination.scheduled_date), "h:mm a")}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => viewVaccinationDetails(vaccination)}>
                        View
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setIsAddVaccinationDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule New Vaccination
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardShell>
  )
}

