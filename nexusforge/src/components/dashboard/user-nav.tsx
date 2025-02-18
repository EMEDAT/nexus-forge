// src/components/dashboard/user-nav.tsx
'use client'

import { Menu, Transition } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'
import { signOut, useSession } from 'next-auth/react'

export function UserNav() {
  const { data: session } = useSession()

  const getDefaultAvatar = () => {
    const gender = session?.user?.gender?.toLowerCase() === 'female' ? 'female' : 'male'
    return `/images/default-${gender}-avatar.svg`
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={session?.user?.image || getDefaultAvatar()}
              alt="User Avatar"
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.onerror = null
                target.src = getDefaultAvatar()
              }}
            />
          </div>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 w-56 mt-2 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg">
          <div className="p-2">
            {session?.user && (
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{session.user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{session.user.email}</p>
              </div>
            )}
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link 
                    href="/profile" 
                    className={`block px-4 py-2 text-sm ${
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } text-gray-700 dark:text-gray-300 rounded-md`}
                  >
                    Profile
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link 
                    href="/settings" 
                    className={`block px-4 py-2 text-sm ${
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } text-gray-700 dark:text-gray-300 rounded-md`}
                  >
                    Settings
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button 
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } text-gray-700 dark:text-gray-300 rounded-md`}
                  >
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default UserNav; 