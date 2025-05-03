import { Sidebar } from "@/components/sidebar"
import { Toaster } from "sonner"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-8">
          {children}
        </main>
        <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 mt-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Made by Orr Shoshan Levy <a href="https://autoninja.co.il" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700 hover:underline">AutoNinja</a>. © {new Date().getFullYear()}. All rights reserved.
          </div>
        </footer>
      </div>
      <Toaster position="top-right" />
    </div>
  )
} 