"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DailyReportSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-10 w-48 bg-gray-200 rounded" />
        </div>

        <div className="flex gap-2">
          <div className="h-10 w-28 bg-gray-200 rounded" />
          <div className="h-10 w-36 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Report container */}
      <div className="space-y-6 bg-white p-6 rounded-lg border">
        {/* Header */}
        <div className="border-b pb-4 space-y-2">
          <div className="h-8 w-72 bg-gray-200 rounded" />
          <div className="h-4 w-40 bg-gray-200 rounded" />
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-gray-200">
              <CardHeader className="pb-3">
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-10 w-20 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Products table skeleton */}
        <div className="space-y-3">
          <div className="h-6 w-48 bg-gray-200 rounded" />

          <div className="border rounded-lg overflow-hidden">
            {/* header */}
            <div className="grid grid-cols-4 bg-gray-100 p-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded mx-2" />
              ))}
            </div>

            {/* rows */}
            {[1, 2, 3, 4].map((row) => (
              <div
                key={row}
                className="grid grid-cols-4 p-3 border-t items-center"
              >
                <div className="h-10 w-10 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Stock table skeleton */}
        <div className="space-y-3">
          <div className="h-6 w-40 bg-gray-200 rounded" />

          <div className="border rounded-lg overflow-hidden">
            {/* header */}
            <div className="grid grid-cols-5 bg-gray-100 p-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded mx-2" />
              ))}
            </div>

            {/* rows */}
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="grid grid-cols-5 p-3 border-t items-center"
              >
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-6 w-10 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-4 flex justify-center">
          <div className="h-3 w-64 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
