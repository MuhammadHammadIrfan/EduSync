import { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiBell, FiMail, FiUser, FiLogOut, FiSearch } from 'react-icons/fi';

export default function Header({ toggleSidebar, title = "Dashboard" }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setProfileOpen(false);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    setNotificationsOpen(false);
  };

  return (
    <header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm">
      <button
        type="button"
        className="px-4 text-gray-500 focus:outline-none focus:text-gray-600 md:hidden"
        onClick={toggleSidebar}
      >
        <FiMenu className="h-6 w-6" />
      </button>
      
      <div className="flex-1 px-4 flex justify-between items-center">
        <div className="flex-1 flex items-center">
          {/* Welcome message */}
          <h1 className="text-xl font-semibold text-gray-800">Welcome, Admin!</h1>
          
          {/* Search bar */}
          <div className="hidden ml-10 md:block max-w-md w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex items-center">
          {/* Quick Actions Dropdown */}
          <div className="mr-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150">
              Quick Action
            </button>
          </div>
          
          {/* Notifications */}
          <div className="ml-3 relative">
            <button
              type="button"
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={toggleNotifications}
            >
              <FiBell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>
            
            {notificationsOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-bold">Notifications</div>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {/* Notification items */}
                    <a href="#" className="block px-4 py-3 hover:bg-gray-100 transition ease-in-out duration-150">
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <FiMail />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">New message from faculty</p>
                          <p className="text-sm text-gray-500">Prof. Sana Khan has requested leave approval</p>
                          <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </a>
                    <a href="#" className="block px-4 py-3 hover:bg-gray-100 transition ease-in-out duration-150">
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">
                          <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                            <FiBell />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Course assignment completed</p>
                          <p className="text-sm text-gray-500">All faculty members have been assigned courses</p>
                          <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="border-t">
                    <a href="#" className="block px-4 py-2 text-sm text-center font-medium text-blue-600 hover:text-blue-800">
                      View all notifications
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <div>
              <button
                type="button"
                className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={toggleProfile}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <FiUser />
                </div>
              </button>
            </div>
            
            {profileOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-bold">Admin User</p>
                    <p className="text-xs text-gray-500">admin@edusync.com</p>
                  </div>
                  <a
                    href="/admin/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <div className="flex items-center">
                      <FiUser className="mr-2 h-4 w-4" />
                      Your Profile
                    </div>
                  </a>
                  <a
                    href="/logout"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <div className="flex items-center">
                      <FiLogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </div>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}