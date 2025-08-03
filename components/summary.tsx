'use client'

import { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAISummary } from '../hooks/use-ai-summary'

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
  const { preprocessedData, isLoading, generatePreprocessedData } = useAISummary(calendarData, selectedTimeFrame);

  // Generate preprocessed data when modal opens and has data
  useEffect(() => {
    if (isOpen && calendarData.length > 0 && preprocessedData.length === 0 && !isLoading) {
      generatePreprocessedData();
    }
  }, [isOpen, calendarData.length, preprocessedData.length, isLoading, generatePreprocessedData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-8 py-6 pb-0 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Calendar Summary
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 overflow-auto">
          <div className="px-8 pb-8">
            <div className="space-y-6 pr-4">
              {/* Preprocessed Data Display */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    🔄 Preprocessed Calendar Data
                  </CardTitle>
                  <CardDescription>
                    Cleaned and structured data ready for AI analysis ({selectedTimeFrame})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">Processing calendar data...</span>
                    </div>
                  ) : preprocessedData.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-xl font-bold text-green-600">{preprocessedData.length}</div>
                          <div className="text-xs text-gray-600">Processed Events</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-xl font-bold text-blue-600">
                            {preprocessedData.filter(event => event.isMeeting).length}
                          </div>
                          <div className="text-xs text-gray-600">Meetings</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-xl font-bold text-purple-600">
                            {preprocessedData.filter(event => event.location).length}
                          </div>
                          <div className="text-xs text-gray-600">With Location</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-xl font-bold text-orange-600">
                            {preprocessedData.filter(event => event.description).length}
                          </div>
                          <div className="text-xs text-gray-600">With Description</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Sample Preprocessed Events:</h4>
                        <div className="space-y-3">
                          {preprocessedData.slice(0, 5).map((event, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium text-gray-900 flex-1 pr-4">
                                  {event.summary}
                                </h5>
                                {event.isMeeting && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap">
                                    Meeting ({event.attendeeCount} people)
                                  </span>
                                )}
                              </div>
                              
                              <div className="text-sm text-gray-600 space-y-1">
                                {event.start?.dateTime && (
                                  <p>📅 {new Date(event.start.dateTime).toLocaleString()}</p>
                                )}
                                {event.location && (
                                  <p>📍 {event.location}</p>
                                )}
                                {event.organizer && (
                                  <p>👤 Organizer: {event.organizer}</p>
                                )}
                                {event.attendees && event.attendees.length > 0 && (
                                  <p>👥 Attendees: {event.attendees.map((a: any) => a.email).join(', ')}</p>
                                )}
                                {event.eventType && event.eventType !== 'default' && (
                                  <p>🏷️ Type: {event.eventType}</p>
                                )}
                              </div>
                              
                              {event.description && (
                                <div className="mt-2 pt-2 border-t border-gray-100">
                                  <p className="text-xs text-gray-500 truncate">
                                    Description: {event.description.substring(0, 100)}...
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {preprocessedData.length > 5 && (
                            <div className="text-center py-2">
                              <p className="text-sm text-gray-500">
                                ... and {preprocessedData.length - 5} more processed events
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-4">No data to process</p>
                  )}
                </CardContent>
              </Card>

              {/* Summary Stats */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    Calendar Overview
                  </CardTitle>
                  <CardDescription>
                    Quick stats from your {selectedTimeFrame} calendar data
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

              {/* Recent Events */}
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
                    {calendarData.slice(Math.max(calendarData.length - 5, 0), calendarData.length).map((event, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg overflow-hidden">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {event.summary || 'Untitled Event'}
                          </p>
                          {event.start?.dateTime && (
                            <p className="text-xs text-gray-500 truncate">
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
                          <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex-shrink-0 whitespace-nowrap">
                            {event.attendees.length} attendees
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {calendarData.length > 5 && (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">
                          ... and {calendarData.length - 5} more events
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
                    <CardTitle className="text-orange-700">🔧 Raw Debug Information</CardTitle>
                    <CardDescription>Original calendar data (development only)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-orange-800">
                          Total raw events: <span className="text-orange-600">{calendarData.length}</span>
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-orange-800 mb-2">Sample raw event data:</p>
                        <div className="bg-white rounded p-3 text-xs font-mono overflow-hidden">
                          <pre className="whitespace-pre-wrap text-gray-700 overflow-x-auto break-words">
                            {JSON.stringify(calendarData.slice(0, 1), null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
