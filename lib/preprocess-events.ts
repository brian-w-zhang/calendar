// Preprocess calendar data for AI summary generation
export function preprocessCalendarDataForAI(calendarData: any[]) {
  return calendarData.map(event => {
    const processedEvent: any = {
      created: event.created,
      updated: event.updated,
      summary: event.summary || 'Untitled Event',
      start: event.start,
      end: event.end
    };

    // Only include optional fields if they exist and have meaningful content
    if (event.description && event.description.trim()) {
      processedEvent.description = event.description;
    }
    
    if (event.location && event.location.trim()) {
      processedEvent.location = event.location;
    }

    // Include organizer info (email only for privacy)
    if (event.organizer?.email) {
      processedEvent.organizer = event.organizer.email;
    }

    // Include attendee info for meeting analysis (but not email addresses for privacy)
    if (event.attendees && event.attendees.length > 0) {
      processedEvent.attendeeCount = event.attendees.length;
      processedEvent.isMeeting = event.attendees.length > 1;
      
      // Include attendee emails if they exist (you can remove this if too sensitive)
      processedEvent.attendees = event.attendees.map((attendee: any) => ({
        email: attendee.email,
        responseStatus: attendee.responseStatus,
        organizer: attendee.organizer || false
      }));
    }

    // Include event type if it provides context
    if (event.eventType && event.eventType !== 'default') {
      processedEvent.eventType = event.eventType;
    }

    return processedEvent;
  });
}
