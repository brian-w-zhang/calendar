// app/page.tsx
'use client'

import Header from '../components/header'
import HeroSection from '../components/hero'
import DebugSection from '../components/debug'
import FeaturesSection from '../components/features'
import HowItWorksSection from '../components/howitworks'
import Footer from '../components/footer'
import { useCalendarAuth } from '../hooks/calendar-auth'

export default function HomePage() {
  const {
    isLoading,
    isSignedIn,
    error,
    calendarData,
    handleGoogleCalendarAuth
  } = useCalendarAuth()

  console.log('Loaded env:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <HeroSection
        handleGoogleCalendarAuth={handleGoogleCalendarAuth}
        isLoading={isLoading}
        isSignedIn={isSignedIn}
        error={error}
        calendarData={calendarData}
      />
      
      <DebugSection
        isSignedIn={isSignedIn}
        calendarData={calendarData}
      />
      
      <FeaturesSection />
      
      <HowItWorksSection />
      
      <Footer />
    </div>
  )
}
