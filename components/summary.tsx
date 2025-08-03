'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SummaryModalProps {
  isOpen: boolean
  onClose: () => void
  calendarData: any[]
  selectedTimeFrame: string
}

export default function SummaryModal({ 
  isOpen, 
  onClose, 
  calendarData, 
  selectedTimeFrame 
}: SummaryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Calendar Summary
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)] p-6">
          <div className="space-y-6">
            {/* Summary Stats */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Calendar Overview
                </CardTitle>
                <CardDescription>
                  Analysis from your {selectedTimeFrame} calendar data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">{calendarData.length}</div>
                    <div className="text-sm text-gray-600">Total Events</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">
                      {calendarData.filter(event => event.attendees && event.attendees.length > 1).length}
                    </div>
                    <div className="text-sm text-gray-600">Meetings</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600">
                      {calendarData.filter(event => !event.attendees || event.attendees.length <= 1).length}
                    </div>
                    <div className="text-sm text-gray-600">Personal Events</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Breakdown */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Recent Events
                </CardTitle>
                <CardDescription>
                  Your latest calendar activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {calendarData.slice(0, 10).map((event, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.summary || 'Untitled Event'}
                        </p>
                        {event.start?.dateTime && (
                          <p className="text-xs text-gray-500">
                            {new Date(event.start.dateTime).toLocaleDateString()} at{' '}
                            {new Date(event.start.dateTime).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        )}
                        {event.location && (
                          <p className="text-xs text-gray-500 truncate">📍 {event.location}</p>
                        )}
                      </div>
                      {event.attendees && event.attendees.length > 1 && (
                        <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          {event.attendees.length} attendees
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {calendarData.length > 10 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">
                        ... and {calendarData.length - 10} more events
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Debug Info (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <Card className="border-dashed border-2 border-orange-300 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-700">🔧 Debug Information</CardTitle>
                  <CardDescription>Development data (not visible in production)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-orange-800">
                        Total events: <span className="text-orange-600">{calendarData.length}</span>
                      </p>
                    </div>
                    
                    <div>
                      <p className="font-semibold text-orange-800 mb-2">Sample event data:</p>
                      <div className="bg-white rounded p-3 text-xs font-mono">
                        <pre className="whitespace-pre-wrap text-gray-700">
                          {JSON.stringify(calendarData.slice(0, 2), null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
