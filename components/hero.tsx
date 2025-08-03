'use client'

import { Button } from '@/components/ui/button'
import { Calendar, BarChart } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { TimeFrame } from '../hooks/calendar-auth'

interface HeroSectionProps {
  handleGoogleCalendarAuth: () => Promise<void>
  isLoading: boolean
  isSignedIn: boolean
  error: string | null
  calendarData: any[]
  selectedTimeFrame: TimeFrame
  setSelectedTimeFrame: (timeFrame: TimeFrame) => void
  getTimeFrameLabel: (timeFrame: TimeFrame) => string
}

const timeFrameOptions: { value: TimeFrame; label: string }[] = [
  { value: '30days', label: 'Last 30 Days' },
  { value: '1year', label: 'Last Year' },
  { value: 'alltime', label: 'All Time' }
]

export default function HeroSection({
  handleGoogleCalendarAuth,
  isLoading,
  isSignedIn,
  error,
  calendarData,
  selectedTimeFrame,
  setSelectedTimeFrame,
  getTimeFrameLabel
}: HeroSectionProps) {
  
  // Show success toast when calendar data is loaded
  useEffect(() => {
    if (isSignedIn && calendarData.length > 0) {
      toast.success(
        `Successfully connected! Found ${calendarData.length} events from the ${getTimeFrameLabel(selectedTimeFrame)}.`,
        {
          duration: 4000,
        }
      )
    }
  }, [isSignedIn, calendarData.length, selectedTimeFrame, getTimeFrameLabel])

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      toast.error(`Connection failed: ${error}`, {
        duration: 5000,
      })
    }
  }, [error])

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
          
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Main action area */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {/* Connect button or Generate button */}
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
              
              {/* Time frame selector - only show when not signed in */}
              {!isSignedIn && (
                <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg border border-gray-200">
                  <div className="flex items-center">
                    {timeFrameOptions.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedTimeFrame(option.value)}
                        disabled={isLoading}
                        className={`
                          px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer
                          ${selectedTimeFrame === option.value
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }
                          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Privacy message */}
            <p className="text-sm text-gray-500 mt-2">
              🔒 Your data stays private and is never stored
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
