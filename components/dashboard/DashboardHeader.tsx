'use client'

import { useState } from 'react'
import { Menu, Bell, User } from 'lucide-react'
import type { User as UserType } from '@/types'

interface DashboardHeaderProps {
  user: UserType
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Search (placeholder) */}
          <div className="hidden sm:flex sm:items-center">
            <span className="text-sm text-gray-500">
              Bem-vindo de volta, {user.name}!
            </span>
          </div>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-6 w-6" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>

            {/* Notifications dropdown (placeholder) */}
            {showNotifications && (
              <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-2 border-b">
                  <h3 className="text-sm font-medium text-gray-900">Notificações</h3>
                </div>
                <div className="px-4 py-3 text-sm text-gray-500">
                  Nenhuma notificação no momento.
                </div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              className="-m-1.5 flex items-center p-1.5 hover:bg-gray-50 rounded-md"
              onClick={() => setShowProfile(!showProfile)}
            >
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    className="h-8 w-8 rounded-full" 
                    src={user.avatar} 
                    alt={user.name} 
                  />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="hidden lg:flex lg:items-center">
                <span className="ml-3 text-sm font-semibold leading-6 text-gray-900">
                  {user.name}
                </span>
              </div>
            </button>

            {/* Profile dropdown menu (placeholder) */}
            {showProfile && (
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Perfil
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Configurações
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 