'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, BarChart, ArrowRight } from 'lucide-react'

declare global {
  interface Window {
    google: any;
  }
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [calendarData, setCalendarData] = useState<any[]>([])

  console.log('Loaded env:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

  // Load Google Identity Services
  const loadGoogleIdentityServices = () => {
    return new Promise((resolve, reject) => {
      console.log('Loading Google Identity Services...')
      
      if (window.google) {
        console.log('Google Identity Services already loaded')
        resolve(window.google)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      
      script.onload = () => {
        console.log('✅ Google Identity Services loaded successfully')
        resolve(window.google)
      }
      
      script.onerror = (error) => {
        console.error('❌ Failed to load Google Identity Services:', error)
        reject(new Error('Failed to load Google Identity Services'))
      }
      
      document.head.appendChild(script)
    })
  }

  // Fetch calendar data using access token
  const fetchCalendarData = async (accessToken: string) => {
    try {
      console.log('🗓️ Fetching calendar data...')
      
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      const now = new Date().toISOString()
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        new URLSearchParams({
          timeMin: thirtyDaysAgo,
          timeMax: now,
          maxResults: '100',
          singleEvents: 'true',
          orderBy: 'startTime'
        }),
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Calendar API error:', errorData)
        throw new Error(`Calendar API error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      console.log('✅ Calendar events fetched:', data.items?.length || 0, 'events')
      console.log('Sample events:', data.items?.slice(0, 3))
      
      setCalendarData(data.items || [])
      return data.items || []
      
    } catch (error) {
      console.error('❌ Error fetching calendar data:', error)
      throw error
    }
  }

  // Main authentication handler using Google Identity Services
  const handleGoogleCalendarAuth = async () => {
    console.log('=== Starting Google Calendar Authentication (GIS) ===')
    console.log('Environment check:')
    console.log('- Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? '✅ Present' : '❌ Missing')
    console.log('- Current origin:', window.location.origin)
    
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      setError('Google Client ID not configured')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Load Google Identity Services
      await loadGoogleIdentityServices()
      
      console.log('🔄 Initializing OAuth2 token client...')
      
      // Initialize OAuth2 token client for Calendar API
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar.readonly',
        callback: async (response: any) => {
          console.log('OAuth2 callback response:', response)
          
          if (response.error !== undefined) {
            console.error('❌ OAuth2 error:', response.error)
            setError(`Authentication failed: ${response.error}`)
            setIsLoading(false)
            return
          }
          
          console.log('✅ Authentication successful!')
          console.log('Access token received:', response.access_token ? 'Yes' : 'No')
          
          setIsSignedIn(true)
          
          try {
            // Fetch calendar data
            const events = await fetchCalendarData(response.access_token)
            console.log(`✅ Successfully fetched ${events.length} calendar events`)
            
            // Here you can process the events for AI analysis
            // For now, just log some basic stats
            const eventTitles = events.map((event: { summary?: string }) => event.summary).filter(Boolean)
            console.log('Event titles sample:', eventTitles.slice(0, 5))
            
          } catch (fetchError) {
            console.error('❌ Error fetching calendar:', fetchError)
            setError('Failed to fetch calendar data')
          }
          
          setIsLoading(false)
        },
      })
      
      console.log('🚀 Requesting access token...')
      
      // Request access token (this will show Google's consent popup)
      tokenClient.requestAccessToken({
        prompt: 'consent' // Forces consent screen to show
      })
      
    } catch (error) {
      console.error('❌ Error during authentication:', error)
      
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Authentication failed')
      }
      
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CalendarAI</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How it works</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            What does your calendar
            <span className="text-blue-600"> say about you?</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Get AI-powered insights about your habits, productivity patterns, and lifestyle 
            from your Google Calendar data. No storage, no tracking—just insights.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={handleGoogleCalendarAuth}
              disabled={isLoading}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : isSignedIn ? (
                <>
                  <BarChart className="mr-2 h-5 w-5" />
                  Generate My Summary ({calendarData.length} events)
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-5 w-5" />
                  Connect Google Calendar
                </>
              )}
            </Button>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 max-w-md">
                <p className="text-sm text-red-600">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}
            
            {isSignedIn && calendarData.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-600">
                  ✅ Successfully connected! Found {calendarData.length} events from the last 30 days.
                </p>
              </div>
            )}
            
            {!isSignedIn && !error && (
              <p className="text-sm text-gray-500">
                Your data stays private and is never stored
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && isSignedIn && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Card>
            <CardHeader>
              <CardTitle>Debug Info</CardTitle>
              <CardDescription>Calendar data summary (development only)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Total events:</strong> {calendarData.length}</p>
                <p><strong>Sample event titles:</strong></p>
                <ul className="list-disc list-inside ml-4 text-sm">
                  {calendarData.slice(0, 5).map((event, index) => (
                    <li key={index}>{event.summary || 'Untitled event'}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What you'll discover
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI analyzes your calendar patterns to reveal insights about your lifestyle and habits
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Productivity Patterns</CardTitle>
              <CardDescription>
                Discover your most productive hours and optimize your schedule
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Social Insights</CardTitle>
              <CardDescription>
                Understand your meeting patterns and collaboration style
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Lifestyle Analysis</CardTitle>
              <CardDescription>
                Get insights into your work-life balance and daily routines
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, secure, and private analysis of your calendar data
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Calendar</h3>
              <p className="text-gray-600">
                Securely connect your Google Calendar with read-only permissions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes your calendar patterns and generates insights
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Insights</h3>
              <p className="text-gray-600">
                Receive your personal summary and actionable recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Calendar className="h-6 w-6" />
              <span className="text-lg font-semibold">CalendarAI</span>
            </div>
            <p className="text-gray-400">
              Understanding people through their calendar patterns. Privacy-first, no data storage.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
