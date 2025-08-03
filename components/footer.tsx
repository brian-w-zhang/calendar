// components/footer.tsx
'use client'

import { Calendar } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Bond Calendar
            </span>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Understanding people through their calendar patterns. Privacy-first, no data storage.
          </p>
        </div>
      </div>
    </footer>
  )
}
