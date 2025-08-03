// components/debug.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DebugSectionProps {
  isSignedIn: boolean
  calendarData: any[]
}

export default function DebugSection({ isSignedIn, calendarData }: DebugSectionProps) {
  if (process.env.NODE_ENV !== 'development' || !isSignedIn) {
    return null
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Card className="shadow-lg border-0 bg-gradient-to-r from-gray-50 to-gray-100">
        <CardHeader>
          <CardTitle className="text-gray-800">Debug Info</CardTitle>
          <CardDescription>Calendar data summary (development only)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Total events:</strong> {calendarData.length}</p>
            <p><strong>Sample event titles:</strong></p>
            <ul className="list-disc list-inside ml-4 text-sm space-y-1">
              {calendarData.slice(0, 5).map((event, index) => (
                <li key={index} className="text-gray-700">
                  {event.summary || 'Untitled event'}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
