// @ts-ignore
import type { Metadata } from "next"
// @ts-ignore  
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: "Sistem Manajemen Data Pensiun Guru",
  description: "Aplikasi untuk mengelola data pensiun guru dengan fitur filter, ekspor Excel, dan tracking progress pengajuan.",
  keywords: ["pensiun guru", "manajemen data", "sistem informasi", "pendidikan"],
  authors: [{ name: "Sistem Informasi Pendidikan" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="h-full">
      <body 
        className={cn(
          "min-h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 font-sans antialiased",
          inter.variable
        )}
      >
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Sistem Data Pensiun Guru
                    </h1>
                    <p className="text-sm text-gray-500">
                      Manajemen data dan tracking pengajuan pensiun
                    </p>
                  </div>
                </div>
                
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Sistem Aktif</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                <div className="text-sm text-gray-600">
                  © 2024 Sistem Manajemen Data Pensiun Guru. All rights reserved.
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Made with ❤️ for Indonesian Education</span>
                  <div className="flex items-center space-x-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>v1.0.0</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}