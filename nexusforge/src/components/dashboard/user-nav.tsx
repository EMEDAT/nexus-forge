// src\components\dashboard\user-nav.tsx

'use client'

import { Menu, Transition } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'

export function UserNav() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none">
          <Image
            src="/placeholder-avatar.jpg"
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
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
        <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link 
                  href="/profile" 
                  className={`block px-4 py-2 text-sm ${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } text-gray-700 dark:text-gray-300`}
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
                  } text-gray-700 dark:text-gray-300`}
                >
                  Settings
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link 
                  href="/logout" 
                  className={`block px-4 py-2 text-sm ${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } text-gray-700 dark:text-gray-300`}
                >
                  Logout
                </Link>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}