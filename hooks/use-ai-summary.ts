'use client'

import { useState } from 'react';
import { preprocessCalendarDataForAI } from '../lib/preprocess-events';

export function useAISummary(calendarData: any[], selectedTimeFrame: string) {
  const [preprocessedData, setPreprocessedData] = useState<any[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const generatePreprocessedData = () => {
    setIsLoading(true);
    try {
      const processed = preprocessCalendarDataForAI(calendarData);
      setPreprocessedData(processed);
      console.log('Preprocessed data:', processed);
    } catch (error) {
      console.error('Failed to preprocess data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAISummary = async () => {
    if (preprocessedData.length === 0) return;
    
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/openai-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preprocessedData,
          timeFrame: selectedTimeFrame
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI summary');
      }

      const data = await response.json();
      setAiSummary(data.summary);
      console.log('AI Summary generated:', data.summary);
    } catch (error) {
      console.error('Failed to generate AI summary:', error);
      setAiSummary('Unable to generate AI summary at this time. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return { 
    preprocessedData, 
    aiSummary,
    isLoading, 
    isGeneratingAI,
    generatePreprocessedData,
    generateAISummary
  };
}
