import { Skeleton } from '@/components/ui/skeleton';

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700" />
        <div className="relative container mx-auto px-4 sm:px-6 pt-12 pb-20 sm:pt-16 sm:pb-24">
          <div className="flex flex-col items-center text-center">
            <Skeleton className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-white/10" />
            <Skeleton className="h-7 w-40 mt-5 bg-white/10" />
            <Skeleton className="h-4 w-28 mt-2 bg-white/10" />
            <Skeleton className="h-6 w-28 mt-3 rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 sm:px-6 -mt-8 pb-12 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8">

          {/* Contact Info Section */}
          <div className="bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden">
            <div className="px-5 py-4 sm:px-6">
              <Skeleton className="h-4 w-40" />
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="px-5 sm:px-6 py-3.5 flex items-center gap-4 border-t border-border/40">
                <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-14 mb-1.5" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            ))}
          </div>

          {/* Events Section */}
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3.5 p-3 rounded-xl">
                  <Skeleton className="h-14 w-14 rounded-xl flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden">
            <div className="px-5 py-4 sm:px-6">
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="px-5 sm:px-6 py-4 border-t border-border/40">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>

          {/* Account Section */}
          <div className="bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden">
            <div className="px-5 py-4 sm:px-6">
              <Skeleton className="h-4 w-16" />
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="px-5 sm:px-6 py-4 flex items-center gap-4 border-t border-border/40">
                <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-28 mb-1" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
