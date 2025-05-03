import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-gray-900 dark:to-cyan-950 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-[300px] h-[300px] bg-blue-300/20 dark:bg-blue-700/10 rounded-full blur-3xl -z-5"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-300/10 dark:bg-cyan-700/5 rounded-full blur-3xl -z-5"></div>
      <div className="absolute top-1/3 right-1/4 w-[200px] h-[200px] bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-2xl -z-5 animate-pulse"></div>
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24 flex flex-col items-center justify-center text-center">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400">
              Flomy
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Simplify your bill management. Upload, track, and never miss a due date again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
