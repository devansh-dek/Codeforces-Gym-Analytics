'use client';

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header Skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-10 w-32 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-10 w-40 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Timeline Skeleton */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
        <div className="space-y-4">
          <div className="h-8 w-full bg-gray-700 rounded animate-pulse"></div>
          <div className="h-3 w-full bg-gray-700 rounded animate-pulse"></div>
          <div className="flex gap-4">
            <div className="h-10 w-24 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Standings Skeleton */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-6 w-12 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 flex-1 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
