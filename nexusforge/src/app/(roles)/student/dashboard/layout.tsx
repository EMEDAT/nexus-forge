// src/app/(roles)/student/dashboard/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Suspense } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Loading } from '@/components/common/loading';

export default async function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Wrap in try/catch to handle errors gracefully
  try {
    const session = await getServerSession(authOptions)
    
    // Check for session and redirect if needed
    if (!session?.user) {
      redirect('/login')
    }

    console.log('Dashboard Layout Session:', JSON.stringify(session, null, 2))
    
    // Check role
    if (session.user.role !== 'STUDENT') {
      // Redirect to user's actual role dashboard
      redirect(`/${session.user.role.toLowerCase()}/dashboard`);
    }
    
    // If we get here, session is valid
    return (
      <div className="flex min-h-screen">
        {/* Sidebar component */}
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader user={session.user} />
          
          <div className="flex-1 px-6 pb-6 overflow-auto bg-gray-50 dark:bg-gray-900">
            <Suspense fallback={<div className="flex justify-center items-center h-40"><Loading /></div>}>
              {children}
            </Suspense>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Layout error:', error);
    
    // Redirect to login on auth errors
    redirect('/login');
  }
}