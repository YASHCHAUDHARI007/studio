'use client'

import * as React from 'react'
import { TeacherDashboard } from '@/components/teacher-dashboard'
import { SuperAdminDashboard } from '@/components/super-admin-dashboard'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  const [userType, setUserType] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Client-side only check
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUserType(userData.type);
    }
  }, []);

  if (!userType) {
    return (
        <div className="space-y-4 p-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-48 w-full lg:col-span-2" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    )
  }
  
  // Conditionally render the dashboard based on user type
  if (userType === 'superadmin') {
    return <SuperAdminDashboard />;
  }
  
  // Default to TeacherDashboard for 'teacher' or any other case
  return <TeacherDashboard />;
}
