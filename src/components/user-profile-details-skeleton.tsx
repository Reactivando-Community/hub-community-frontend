import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function UserProfileDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-10 sm:py-12 lg:py-16 xl:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:gap-6">
            <Skeleton className="h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 rounded-full bg-white/20" />
            <div className="text-center lg:text-left">
              <Skeleton className="h-8 w-48 mb-2 bg-white/20" />
              <Skeleton className="h-5 w-32 mb-2 bg-white/20" />
              <Skeleton className="h-6 w-20 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-1" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="rounded-lg border overflow-hidden"
                  >
                    <Skeleton className="h-36 sm:h-40 w-full" />
                    <div className="p-3 sm:p-4">
                      <Skeleton className="h-5 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
