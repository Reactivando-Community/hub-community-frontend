import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';

// Event names
export const ANALYTICS_EVENTS = {
  ADD_TALK_TO_AGENDA: 'add_talk_to_agenda',
  REMOVE_TALK_FROM_AGENDA: 'remove_talk_from_agenda',
  CREATE_AGENDA: 'create_agenda',
  VIEW_EVENT_DETAIL: 'view_event_detail',
  VIEW_TALK_DETAIL: 'view_talk_detail',
  VIEW_AGENDA_DETAIL: 'view_agenda_detail',
  SEND_COMMENT: 'send_comment',
} as const;

// Analytics utility functions
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  // In this environment we make analytics a safe no-op on the server to avoid
  // accessing browser globals like `window` during Next.js build/SSR.
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (analytics) {
      // Send event to Firebase Analytics
      logEvent(analytics, eventName, parameters);

      if (process.env.NODE_ENV !== 'production') {
        console.log(`Analytics event tracked: ${eventName}`, parameters);
      }
    } else {
      // Analytics not yet initialized
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `Analytics not initialized. Event not tracked: ${eventName}`,
          parameters
        );
      }
    }
  } catch (error) {
    console.error('Error tracking analytics event:', error);
  }
};

// Specific event tracking functions
export const trackAddTalkToAgenda = (talkId: string, eventSlug: string) => {
  trackEvent(ANALYTICS_EVENTS.ADD_TALK_TO_AGENDA, {
    talk_id: talkId,
    event_slug: eventSlug,
  });
};

export const trackRemoveTalkFromAgenda = (talkId: string, eventSlug: string) => {
  trackEvent(ANALYTICS_EVENTS.REMOVE_TALK_FROM_AGENDA, {
    talk_id: talkId,
    event_slug: eventSlug,
  });
};

export const trackCreateAgenda = (eventSlug: string) => {
  trackEvent(ANALYTICS_EVENTS.CREATE_AGENDA, {
    event_slug: eventSlug,
  });
};

export const trackViewEventDetail = (eventSlug: string) => {
  trackEvent(ANALYTICS_EVENTS.VIEW_EVENT_DETAIL, {
    event_slug: eventSlug,
  });
};

export const trackViewTalkDetail = (talkId: string, eventSlug?: string) => {
  trackEvent(ANALYTICS_EVENTS.VIEW_TALK_DETAIL, {
    talk_id: talkId,
    event_slug: eventSlug,
  });
};

export const trackViewAgendaDetail = (agendaId: string) => {
  trackEvent(ANALYTICS_EVENTS.VIEW_AGENDA_DETAIL, {
    agenda_id: agendaId,
  });
};

export const trackCommentSent = (talkId: string) => {
  trackEvent(ANALYTICS_EVENTS.SEND_COMMENT, {
    talk_id: talkId,
  });
};
