'use client'

import Header from '../components/header'
import HeroSection from '../components/hero'
import DebugSection from '../components/debug'
import FeaturesSection from '../components/features'
import HowItWorksSection from '../components/howitworks'
import Footer from '../components/footer'
import { useCalendarAuth } from '../hooks/calendar-auth'
import { Toaster } from 'sonner'

export default function HomePage() {
  const {
    isLoading,
    isSignedIn,
    error,
    calendarData,
    selectedTimeFrame,
    setSelectedTimeFrame,
    handleGoogleCalendarAuth,
    getTimeFrameLabel
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
        selectedTimeFrame={selectedTimeFrame}
        setSelectedTimeFrame={setSelectedTimeFrame}
        getTimeFrameLabel={getTimeFrameLabel}
      />
      
      <DebugSection
        isSignedIn={isSignedIn}
        calendarData={calendarData}
      />
      
      <FeaturesSection />
      
      <HowItWorksSection />
      
      <Footer />
      
      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          className: 'font-medium bg-gradient-to-r from-green-100 to-green-50 border border-green-300 text-green-800 shadow-lg',
        }}
      />
    </div>
  )
}
