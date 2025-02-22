// src/app/(roles)/[role]/dashboard/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Suspense } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Loading } from '@/components/common/loading';

export default async function RoleDashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { role: string };
}) {
  try {
    const session = await getServerSession(authOptions);
    
    // Comprehensive session check
    if (!session || !session.user || !session.user.id) {
      redirect('/login');
    }
    
    // Check if user has this role - normalize to lowercase for comparison
    const userRole = session.user.role?.toLowerCase();
    const requestedRole = params.role.toLowerCase();
    
    if (userRole !== requestedRole) {
      // Redirect to user's actual role dashboard
      redirect(`/${userRole}/dashboard`);
    }
    
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
    console.error('Role layout error:', error);
    // Redirect to login on errors
    redirect('/login');
  }
}