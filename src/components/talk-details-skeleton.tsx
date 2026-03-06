import { Skeleton } from '@/components/ui/skeleton';

export function TalkDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-6 w-20 rounded-full mb-4" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          {/* Info Banner */}
          <div className="bg-muted border-l-4 border-primary p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Skeleton className="h-5 w-5 mr-3" />
                <div>
                  <Skeleton className="h-3 w-12 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex items-center">
                <Skeleton className="h-5 w-5 mr-3" />
                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-card rounded-lg shadow-sm p-8 mb-8">
          <Skeleton className="h-7 w-40 mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Speakers */}
        <div className="bg-card rounded-lg shadow-sm p-8 mb-8">
          <Skeleton className="h-7 w-36 mb-6" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2].map(i => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 bg-muted rounded-lg"
              >
                <Skeleton className="h-24 w-24 rounded-full mb-4" />
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>

        {/* Event Info */}
        <div className="bg-card rounded-lg shadow-sm p-8 mb-8">
          <Skeleton className="h-7 w-48 mb-6" />
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div>
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-4 w-48 mb-1" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-card rounded-lg shadow-sm p-8">
          <Skeleton className="h-7 w-36 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
