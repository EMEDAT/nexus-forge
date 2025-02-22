// src/components/dashboard/sidebar.tsx - Fixed width class issue
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRole } from '@/components/role-context';
import { useCountry } from '@/components/country-context';
import { signOut } from 'next-auth/react';
import { ModeToggle } from '@/components/mode-toggle';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Book,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Award,
  Building,
  HeartHandshake,
  Menu,
  X,
  Palette,
  Ruler,
  MapPin,
  BookOpen
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

const getRoleIcon = (role: string) => {
  switch (role?.toUpperCase()) {
    case 'STUDENT': return GraduationCap;
    case 'PROFESSIONAL': return Building;
    case 'VETERAN': return Award;
    case 'CLIENT': return Briefcase;
    default: return Users;
  }
};

type NavigationItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { userRole, roleConfig } = useRole();
  const { countryCode, countryConfig } = useCountry();
  
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Get lowercase role for routes
  const roleLowerCase = userRole?.toLowerCase() || '';
  const RoleIcon = getRoleIcon(userRole || '');

  // Define navigation based on role
  const getNavigationItems = () => {
    if (!userRole) {
      // Fallback navigation if role not available
      return [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Projects', href: '/projects', icon: FileText },
        { name: 'Messages', href: '/messages', icon: MessageSquare },
      ];
    }

    // Base dashboard item
    const baseItems = [
      {
        name: 'Dashboard',
        href: `/${roleLowerCase}/dashboard`,
        icon: LayoutDashboard
      }
    ];

    // Role-specific items
    const roleItems: Record<string, NavigationItem[]> = {
      'STUDENT': [
        { name: 'Projects', href: `/${roleLowerCase}/projects`, icon: FileText },
        { name: 'Mentorship', href: `/${roleLowerCase}/mentorship`, icon: HeartHandshake },
        { name: 'Portfolio', href: `/${roleLowerCase}/portfolio`, icon: Book }
      ],
      'PROFESSIONAL': [
        { name: 'Clients', href: `/${roleLowerCase}/clients`, icon: Users },
        { name: 'Projects', href: `/${roleLowerCase}/projects`, icon: FileText },
        { name: 'Mentorship', href: `/${roleLowerCase}/mentorship`, icon: HeartHandshake }
      ],
      'VETERAN': [
        { name: 'Mentorship', href: `/${roleLowerCase}/mentorship`, icon: HeartHandshake },
        { name: 'Knowledge Base', href: `/${roleLowerCase}/knowledge`, icon: Book },
        { name: 'Projects', href: `/${roleLowerCase}/projects`, icon: FileText }
      ],
      'CLIENT': [
        { name: 'Projects', href: `/${roleLowerCase}/projects`, icon: FileText },
        { name: 'Find Architects', href: `/${roleLowerCase}/architects`, icon: Users }
      ]
    };

    // Common items for all roles
    const commonItems = [
      { name: 'Messages', href: `/${roleLowerCase}/messages`, icon: MessageSquare },
      { name: 'Settings', href: `/${roleLowerCase}/settings`, icon: Settings }
    ];

    const selectedRoleItems = roleItems[userRole] || [];
    return [...baseItems, ...selectedRoleItems, ...commonItems];
  };

  // Country-specific resources
  const getCountryNavigationItems = () => {
    if (!countryCode) return [];
    
    const countryLower = countryCode.toLowerCase();
    return [
      {
        name: 'Materials',
        href: `/country/${countryLower}/materials`,
        icon: Palette,
        description: 'Local building materials'
      },
      {
        name: 'Regulations',
        href: `/country/${countryLower}/regulations`,
        icon: Ruler,
        description: 'Building codes and permits'
      },
      {
        name: 'Styles',
        href: `/country/${countryLower}/styles`,
        icon: MapPin,
        description: 'Regional architectural styles'
      },
      {
        name: 'Resources',
        href: `/country/${countryLower}/resources`,
        icon: BookOpen,
        description: 'Educational resources'
      }
    ];
  };

  const navigationItems = getNavigationItems();
  const countryNavigationItems = getCountryNavigationItems();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Dynamic colors based on role and country
  const roleColor = roleConfig?.theme.primary || '#4361ee';

  // Render navigation link
  const NavLink = ({ 
    item,
    onClick = () => {} 
  }: { 
    item: NavigationItem,
    onClick?: () => void
  }) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    
    return (
      <Link
        href={item.href}
        onClick={onClick}
        className={`
          flex items-center px-3 py-2 rounded-md transition-colors
          ${active
            ? 'bg-opacity-10 font-medium'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }
        `}
        style={{
          color: active ? roleColor : undefined,
          backgroundColor: active ? `${roleColor}15` : undefined
        }}
      >
        <Icon className={`${collapsed ? 'mx-auto' : 'mr-3'} h-5 w-5`} />
        {!collapsed && (
          <div className="flex-1">
            <span>{item.name}</span>
            {item.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {item.description}
              </p>
            )}
          </div>
        )}
      </Link>
    );
  };

  // Desktop sidebar - FIXED WIDTH
  const desktopSidebar = (
    <div className={`hidden md:flex md:flex-col ${collapsed ? 'md:w-16' : 'md:w-64'}`}>
      <div className="flex flex-col flex-grow bg-white dark:bg-gray-900 overflow-y-auto border-r border-gray-200 dark:border-gray-800 h-screen">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          {!collapsed ? (
            <>
              <div className="flex items-center space-x-2">
                {userRole && <RoleIcon className="h-6 w-6" style={{ color: roleColor }} />}
                <h1 className="text-xl font-bold">NexusForge</h1>
              </div>
              <button
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              onClick={toggleSidebar}
              className="mx-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className={`flex-1 overflow-y-auto py-4 ${collapsed ? 'px-2' : 'px-4'} space-y-4`}>
          {/* Role-specific navigation */}
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>
          
          {/* Country-specific navigation */}
          {!collapsed && countryNavigationItems.length > 0 && countryConfig && (
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center px-3 mb-2">
                {countryConfig.flag && (
                  <Image 
                    src={countryConfig.flag} 
                    alt={countryConfig.name} 
                    width={16} 
                    height={12}
                    className="mr-2"
                  />
                )}
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {countryConfig.name} Resources
                </h3>
              </div>
              <nav className="space-y-1 mt-2">
                {countryNavigationItems.map((item) => (
                  <NavLink key={item.name} item={item} />
                ))}
              </nav>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <ModeToggle />
            
            <button
              onClick={() => signOut()}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md dark:text-red-400 dark:hover:bg-red-900/20"
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile menu button
  const mobileMenuButton = (
    <button
      onClick={toggleMobileMenu}
      className="md:hidden fixed top-4 right-4 z-40 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
      aria-label="Toggle mobile menu"
    >
      {mobileMenuOpen ? (
        <X className="h-6 w-6 text-gray-700 dark:text-gray-200" />
      ) : (
        <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
      )}
    </button>
  );

  // Mobile sidebar
  const mobileSidebar = mobileMenuOpen && (
    <div className="md:hidden fixed inset-0 z-30 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            {userRole && <RoleIcon className="h-6 w-6" style={{ color: roleColor }} />}
            <h1 className="text-xl font-bold">NexusForge</h1>
          </div>
          <button 
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        <div className="py-4 px-4 space-y-4">
          {/* Role-specific navigation */}
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink 
                key={item.name} 
                item={item} 
                onClick={toggleMobileMenu}
              />
            ))}
          </nav>
          
          {/* Country-specific navigation */}
          {countryNavigationItems.length > 0 && countryConfig && (
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center px-3 mb-2">
                {countryConfig.flag && (
                  <Image 
                    src={countryConfig.flag}
                    alt={countryConfig.name}
                    width={16}
                    height={12}
                    className="mr-2"
                  />
                )}
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {countryConfig.name} Resources
                </h3>
              </div>
              <nav className="space-y-1 mt-2">
                {countryNavigationItems.map((item) => (
                  <NavLink 
                    key={item.name} 
                    item={item}
                    onClick={toggleMobileMenu}
                  />
                ))}
              </nav>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <ModeToggle />
          
          <button
            onClick={() => signOut()}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>
    </div>
  );

  return (
    <>
      {desktopSidebar}
      {mobileMenuButton}
      {mobileSidebar}
    </>
  );
}