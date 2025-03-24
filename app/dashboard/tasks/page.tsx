"use client"

import { useState } from "react"
import { Calendar, CheckCircle2, Clock, Filter, Plus, Search, SortAsc, Tag, Trash2, XCircle } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header"
import { DashboardShell } from "@/app/dashboard/components/dashboard-shell"

interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed" | "overdue"
  priority: "low" | "medium" | "high" | "urgent"
  dueDate: string
  assignedTo: string
  category: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete inventory check",
      description: "Perform a full inventory check in Warehouse A",
      status: "pending",
      priority: "high",
      dueDate: "2025-03-11T11:00:00",
      assignedTo: "John Doe",
      category: "Inventory",
    },
    {
      id: "2",
      title: "Process shipment #4392",
      description: "Process incoming shipment at Loading Dock B",
      status: "in-progress",
      priority: "medium",
      dueDate: "2025-03-11T13:30:00",
      assignedTo: "John Doe",
      category: "Shipping",
    },
    {
      id: "3",
      title: "Morning safety check",
      description: "Perform safety checks in all areas",
      status: "completed",
      priority: "high",
      dueDate: "2025-03-11T08:15:00",
      assignedTo: "John Doe",
      category: "Safety",
    },
    {
      id: "4",
      title: "Team meeting",
      description: "Attend weekly team meeting in Conference Room C",
      status: "pending",
      priority: "medium",
      dueDate: "2025-03-11T15:00:00",
      assignedTo: "John Doe",
      category: "Meetings",
    },
    {
      id: "5",
      title: "Equipment maintenance",
      description: "Perform scheduled maintenance on equipment in Zone 3",
      status: "overdue",
      priority: "urgent",
      dueDate: "2025-03-09T10:00:00",
      assignedTo: "John Doe",
      category: "Maintenance",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
    assignedTo: "John Doe",
    category: "General",
  })

  const filteredTasks = tasks.filter((task) => {
    // Search filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || task.status === statusFilter

    // Priority filter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleStatusChange = (taskId: string, newStatus: "pending" | "in-progress" | "completed" | "overdue") => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const handleCreateTask = () => {
    const id = (tasks.length + 1).toString()
    setTasks([...tasks, { id, ...newTask }])
    setNewTask({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: "",
      assignedTo: "John Doe",
      category: "General",
    })
    setIsNewTaskDialogOpen(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-blue-500/10 text-blue-500"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500"
      case "high":
        return "bg-orange-500/10 text-orange-500"
      case "urgent":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "overdue":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <CheckCircle2 className="h-5 w-5 text-primary" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const calculateTaskCompletion = () => {
    const completed = tasks.filter((task) => task.status === "completed").length
    return Math.round((completed / tasks.length) * 100)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Tasks" text="Manage your tasks and track your progress.">
        <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Add a new task to your list. Click save when you&apos;re done.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, 
                      priority: value as "high" | "low" | "medium" | "urgent" })}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newTask.category}
                    onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Inventory">Inventory</SelectItem>
                      <SelectItem value="Shipping">Shipping</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Safety">Safety</SelectItem>
                      <SelectItem value="Meetings">Meetings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewTaskDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-5">
          <CardHeader>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <CardTitle>Task List</CardTitle>
                <CardDescription>Manage and track your assigned tasks</CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search tasks..."
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
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SortAsc className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4 space-y-4">
                {filteredTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-full bg-muted p-3">
                      <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try adjusting your search or filters to find what you&apos;re looking for.
                    </p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-4 rounded-lg border p-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        {getStatusIcon(task.status)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium leading-none">{task.title}</h4>
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </Badge>
                          <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
                            <Tag className="mr-1 h-3 w-3" />
                            {task.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDate(task.dueDate)}
                          </div>
                          <div>Assigned to: {task.assignedTo}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={task.status}
                          onValueChange={(value) => handleStatusChange(task.id,
                             value as "pending" | "in-progress" | "completed" | "overdue")}
                        >
                          <SelectTrigger className="h-8 w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
              <TabsContent value="today" className="mt-4 space-y-4">
                {/* Similar content as "all" but filtered for today's tasks */}
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Calendar className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Today&apos;s Tasks</h3>
                  <p className="mt-2 text-sm text-muted-foreground">You have 3 tasks scheduled for today.</p>
                </div>
              </TabsContent>
              <TabsContent value="upcoming" className="mt-4 space-y-4">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Calendar className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Upcoming Tasks</h3>
                  <p className="mt-2 text-sm text-muted-foreground">You have 2 upcoming tasks scheduled.</p>
                </div>
              </TabsContent>
              <TabsContent value="completed" className="mt-4 space-y-4">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Completed Tasks</h3>
                  <p className="mt-2 text-sm text-muted-foreground">You have completed 1 task.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Task Summary</CardTitle>
            <CardDescription>Your task progress and statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Task Completion</div>
                <div className="text-sm font-medium">{calculateTaskCompletion()}%</div>
              </div>
              <Progress value={calculateTaskCompletion()} className="h-2" />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Task Breakdown</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center rounded-lg border p-3">
                  <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "pending").length}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border p-3">
                  <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "in-progress").length}</div>
                  <div className="text-xs text-muted-foreground">In Progress</div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border p-3">
                  <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "completed").length}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border p-3">
                  <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "overdue").length}</div>
                  <div className="text-xs text-muted-foreground">Overdue</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Priority Breakdown</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                    <div className="text-sm">Urgent</div>
                  </div>
                  <div className="text-sm font-medium">{tasks.filter((t) => t.priority === "urgent").length}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-orange-500"></div>
                    <div className="text-sm">High</div>
                  </div>
                  <div className="text-sm font-medium">{tasks.filter((t) => t.priority === "high").length}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div className="text-sm">Medium</div>
                  </div>
                  <div className="text-sm font-medium">{tasks.filter((t) => t.priority === "medium").length}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
                    <div className="text-sm">Low</div>
                  </div>
                  <div className="text-sm font-medium">{tasks.filter((t) => t.priority === "low").length}</div>
                </div>
              </div>
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

