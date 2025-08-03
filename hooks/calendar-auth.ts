// hooks/calendar-auth.ts
'use client'

import { useState } from 'react'

declare global {
  interface Window {
    google: any;
  }
}

export function useCalendarAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [calendarData, setCalendarData] = useState<any[]>([])

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

  return {
    isLoading,
    isSignedIn,
    error,
    calendarData,
    handleGoogleCalendarAuth
  }
}
