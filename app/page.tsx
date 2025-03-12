import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
        <div className="flex-1">
          <h1 className="text-lg font-semibold md:text-xl">Worker Portal</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/sign-in">
            <Button variant="outline">Login</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Welcome to the Worker Portal
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Access your schedule, tasks, and performance metrics all in one place. Stay connected with your team
                  and manage your work efficiently.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link href="/dashboard">
                    <Button>Go to Dashboard</Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button variant="outline">Login</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/images/poult.jpg"
                  alt="Dashboard Preview"
                  className="rounded-lg object-cover"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Features</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Everything you need to manage your work day efficiently
                </p>
              </div>
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                  <div className="rounded-full bg-primary/10 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M8 2v4" />
                      <path d="M16 2v4" />
                      <path d="M3 10h18" />
                      <rect width="18" height="12" x="3" y="6" rx="2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Schedule Management</h3>
                  <p className="text-center text-muted-foreground">
                    View your shifts, request time off, and manage your work schedule.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                  <div className="rounded-full bg-primary/10 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Task Management</h3>
                  <p className="text-center text-muted-foreground">
                    Track your daily tasks, mark them as complete, and stay on top of your workload.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                  <div className="rounded-full bg-primary/10 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Performance Tracking</h3>
                  <p className="text-center text-muted-foreground">
                    Monitor your performance metrics and identify areas for improvement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6">
          <p className="text-center text-sm text-muted-foreground">
            Drew-MyCoder &copy; {new Date().getFullYear()} Worker Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

