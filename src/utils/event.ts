import { Event } from '../lib/types';

// Function to adjust date to Brazil timezone (+3 hours)
export const adjustToBrazilTimezone = (date: Date): Date => {
  // Create a new date object and add 3 hours
  const adjustedDate = new Date(date);
  // adjustedDate.setHours(adjustedDate.getHours() + 3);
  return adjustedDate;
};

// Function to validate if event start date is ahead of current date
export const isEventInFuture = (startDate: string): boolean => {
  try {
    const eventDate = new Date(startDate);
    const currentDate = new Date();
    return eventDate > currentDate;
  } catch {
    return false;
  }
};

// Function to validate if event start date is in the past
export const isEventInPast = (startDate: string): boolean => {
  try {
    const eventDate = new Date(startDate);
    const currentDate = new Date();
    return eventDate < currentDate;
  } catch {
    return false;
  }
};

// Function to validate if event is currently ongoing
export const isEventOngoing = (startDate: string, endDate: string): boolean => {
  try {
    const eventStartDate = new Date(startDate);
    const eventEndDate = new Date(endDate);
    const currentDate = new Date();
    return currentDate >= eventStartDate && currentDate <= eventEndDate;
  } catch {
    return false;
  }
};

// Function to get the next future event from a list of events
export const getNextFutureEvents = (events: Event[]): Event[] | null => {
  if (!Array.isArray(events) || events.length === 0) {
    return null;
  }

  const futureEvents = events.filter(event => {
    if (!event || typeof event.start_date !== 'string') {
      return false;
    }

    // Exclude ongoing events if they have end_date
    if (typeof event.end_date === 'string') {
      return (
        !isEventOngoing(event.start_date, event.end_date) &&
        isEventInFuture(event.start_date)
      );
    }

    // If no end_date, just check if start_date is in the future
    return isEventInFuture(event.start_date);
  });

  if (futureEvents.length === 0) {
    return null;
  }

  // Sort by start date and return the earliest future event
  return futureEvents.sort(
    (a, b) =>
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );
};

// Function to get past events from a list of events
export const getPastEvents = (events: Event[]): Event[] | null => {
  if (!Array.isArray(events) || events.length === 0) {
    return null;
  }

  const pastEvents = events.filter(event => {
    if (!event || typeof event.start_date !== 'string') {
      return false;
    }

    // If event has end_date, check if it's not ongoing and end_date is in the past
    if (typeof event.end_date === 'string') {
      const eventEndDate = new Date(event.end_date);
      const currentDate = new Date();
      return (
        !isEventOngoing(event.start_date, event.end_date) &&
        eventEndDate < currentDate
      );
    }

    // If no end_date, check if start_date is in the past
    return isEventInPast(event.start_date);
  });

  if (pastEvents.length === 0) {
    return null;
  }

  // Sort by start date (most recent first) and return past events
  return pastEvents.sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );
};

// Function to get ongoing events from a list of events
export const getOngoingEvents = (events: Event[]): Event[] | null => {
  if (!Array.isArray(events) || events.length === 0) {
    return null;
  }

  const ongoingEvents = events.filter(
    event =>
      event &&
      typeof event.start_date === 'string' &&
      typeof event.end_date === 'string' &&
      isEventOngoing(event.start_date, event.end_date)
  );

  if (ongoingEvents.length === 0) {
    return null;
  }

  // Sort by start date (most recent first) and return ongoing events
  return ongoingEvents.sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );
};
