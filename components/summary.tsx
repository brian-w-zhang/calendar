'use client'

import { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useAISummary } from '../hooks/use-ai-summary'
import { Sparkles, RefreshCw } from 'lucide-react'

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
  const { 
    preprocessedData, 
    aiSummary, 
    isLoading, 
    isGeneratingAI, 
    generatePreprocessedData, 
    generateAISummary 
  } = useAISummary(calendarData, selectedTimeFrame);

  // Generate preprocessed data when modal opens and has data
  useEffect(() => {
    if (isOpen && calendarData.length > 0 && preprocessedData.length === 0 && !isLoading) {
      generatePreprocessedData();
    }
  }, [isOpen, calendarData.length, preprocessedData.length, isLoading, generatePreprocessedData]);

  // Auto-generate AI summary when preprocessed data is ready
  useEffect(() => {
    if (preprocessedData.length > 0 && !aiSummary && !isGeneratingAI) {
      generateAISummary();
    }
  }, [preprocessedData.length, aiSummary, isGeneratingAI, generateAISummary]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-8 py-6 pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Calendar Summary
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden px-8">
          <ScrollArea className="h-full pr-4">
            <div className="pb-8">
              <div className="space-y-6">
                {/* AI-Generated Summary */}
                <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-purple-600" />
                          What Your Calendar Says About You
                        </CardTitle>
                        <CardDescription>
                          AI-powered insights from your {selectedTimeFrame} calendar data
                        </CardDescription>
                      </div>
                      {aiSummary && (
                        <Button
                          onClick={generateAISummary}
                          disabled={isGeneratingAI}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className={`h-4 w-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                          Regenerate
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isGeneratingAI ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Analyzing your calendar patterns...</p>
                          <p className="text-sm text-gray-500 mt-1">This might take a moment ✨</p>
                        </div>
                      </div>
                    ) : aiSummary ? (
                      <div className="prose prose-gray max-w-none">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
                            {aiSummary}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600">Waiting for data to be processed...</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Preprocessed Data Display - Now collapsed by default */}
                {process.env.NODE_ENV === 'development' && (
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
                        </div>
                      ) : (
                        <p className="text-gray-600 text-center py-4">No data to process</p>
                      )}
                    </CardContent>
                  </Card>
                )}

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

                {/* Additional Insights */}
                <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      Additional Insights
                    </CardTitle>
                    <CardDescription>
                      More detailed analysis of your calendar patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-700">
                        Your calendar reflects your priorities and time management style. The patterns in your scheduling can reveal insights about your work-life balance, productivity peaks, and collaboration preferences.
                      </p>
                      <p className="text-gray-700">
                        Consider reviewing your calendar regularly to ensure it aligns with your goals and values. Look for opportunities to optimize your schedule for better focus time and meaningful connections.
                      </p>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-medium text-gray-800 mb-2">Tips for Better Calendar Management:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Block dedicated time for deep work and creative tasks</li>
                          <li>• Use descriptive titles and locations for better context</li>
                          <li>• Regular calendar reviews help maintain alignment with priorities</li>
                          <li>• Consider time zones when scheduling with remote team members</li>
                          <li>• Leave buffer time between meetings for transitions</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
