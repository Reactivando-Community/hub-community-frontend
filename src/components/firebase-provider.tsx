'use client';

import { app, initializeAnalytics } from '@/lib/firebase';
import { useEffect } from 'react';

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Firebase app and Analytics
    if (app) {
      // Initialize Analytics asynchronously
      initializeAnalytics().catch(error => {
        console.error('Failed to initialize Firebase Analytics:', error);
      });
    } else {
      console.warn('Firebase app not initialized');
    }
  }, []);

  return <>{children}</>;
}
