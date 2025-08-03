// components/header.tsx
'use client'

import { Calendar } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bond Calendar
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a 
              href="#features" 
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer font-medium"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer font-medium"
            >
              How it works
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
