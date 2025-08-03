
// components/hero.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Calendar, BarChart } from 'lucide-react'

interface HeroSectionProps {
  handleGoogleCalendarAuth: () => Promise<void>
  isLoading: boolean
  isSignedIn: boolean
  error: string | null
  calendarData: any[]
}

export default function HeroSection({
  handleGoogleCalendarAuth,
  isLoading,
  isSignedIn,
  error,
  calendarData
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cg fill-opacity=%220.03%22%3E%3Cpolygon fill=%22%23000%22 points=%2250 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40%22/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            What does your calendar
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}say about you?
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Get AI-powered insights about your habits, productivity patterns, and lifestyle 
            from your Google Calendar data. No storage, no tracking. Just insights.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              onClick={handleGoogleCalendarAuth}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Connecting...
                </>
              ) : isSignedIn ? (
                <>
                  <BarChart className="mr-3 h-5 w-5" />
                  Generate My Summary ({calendarData.length} events)
                </>
              ) : (
                <>
                  <Calendar className="mr-3 h-5 w-5" />
                  Connect Google Calendar
                </>
              )}
            </Button>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-md shadow-sm">
                <p className="text-sm text-red-600">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}
            
            {isSignedIn && calendarData.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm">
                <p className="text-sm text-green-600 font-medium">
                  ✅ Successfully connected! Found {calendarData.length} events from the last 30 days.
                </p>
              </div>
            )}
            
            {!isSignedIn && !error && (
              <p className="text-sm text-gray-500 mt-2">
                Your data stays private and is never stored
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
