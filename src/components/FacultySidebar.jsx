'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  User,
  Calendar,
  CheckSquare,
  Inbox,
  Send,
  CalendarDays,
  CheckCircle, 
  Menu,
  X,
  FileText,
} from 'lucide-react';
import { getCurrentFaculty } from '../../utils/api/faculty';
import { logoutUser } from '../../utils/api/common';

// Add custom scrollbar styling
const scrollbarStyles = `
  /* Custom scrollbar for the sidebar */
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

export default function FacultySidebar() {
  const [faculty, setFaculty] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchFacultyData() {
      const data = await getCurrentFaculty();
      setFaculty(data);
    }

    fetchFacultyData();
  }, []);

  const navItems = [
    { name: 'Dashboard', href: '/faculty/dashboard', icon: LayoutDashboard },
    { name: 'Profile', href: '/faculty/profile', icon: User },
    { name: 'Class Schedule', href: '/faculty/classSchedule', icon: Calendar },
    { name: 'Attendance', href: '/faculty/attendance', icon: CheckSquare },
    { name: 'Leave Requests', href: '/faculty/leaveRequests', icon: FileText },
    { name: 'Approve Leaves', href: '/faculty/approveLeaves', icon: CheckCircle },
    { name: 'Messages Received', href: '/faculty/messages/inbox', icon: Inbox },
    { name: 'Messages Sent', href: '/faculty/messages/sent', icon: Send },
    { name: 'Upcoming Events', href: '/faculty/events', icon: CalendarDays },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Custom scrollbar styles */}
      <style jsx global>
        {scrollbarStyles}
      </style>

      {/* Mobile menu button */}
      <div className='fixed top-4 left-4 z-50 md:hidden'>
        <button
          onClick={toggleMobileMenu}
          className='p-2 rounded-md bg-[#2c3e50] text-white'
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? (
            <X className='h-6 w-6' />
          ) : (
            <Menu className='h-6 w-6' />
          )}
        </button>
      </div>

      {/* Sidebar for desktop and mobile */}
      <div
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:sticky top-0 left-0 h-screen w-64 bg-[#2c3e50] text-white flex flex-col z-40 transition-transform duration-300 ease-in-out`}
      >
        <div className='p-6 flex items-center'>
          <div className='text-2xl font-bold flex items-center'>
            <div className='mr-2'>
              <svg
                width='32'
                height='32'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M9.75 12.25L4.75 15L12 19.25L19.25 15L14.25 12.25'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <span>EduSync</span>
          </div>
        </div>

        <nav className='flex-1 mt-6 overflow-y-auto scrollbar-thin'>
          <ul className='space-y-1'>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  {/* Make the entire Link cover the full width of the nav item */}
                  <Link
                    href={item.href}
                    className={`flex items-center px-6 py-3 text-sm font-medium transition-colors cursor-pointer w-full ${
                      isActive
                        ? 'bg-[#1e2a3a] text-white'
                        : 'text-gray-300 hover:bg-[#1e2a3a] hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className='flex items-center w-full'>
                      <Icon className='h-5 w-5 mr-3 flex-shrink-0' />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className='p-6 border-t border-[#3d5166]'>
          {faculty ? (
            <>
              <div className='flex items-center'>
                <div className='relative w-8 h-8 rounded-full overflow-hidden bg-gray-600'>
                  <Image
                    src='/images/user.png'
                    alt='Faculty profile'
                    fill
                    className='object-cover'
                    unoptimized
                  />
                </div>
                <div className='ml-3'>
                  <p className='text-sm font-medium'>{faculty.name}</p>
                  <p className='text-xs text-gray-400'>{faculty.department}</p>
                </div>
              </div>
              
              {/* Add logout button */}
              <button
                onClick={logoutUser}
                className='mt-4 w-full flex items-center px-4 py-2 text-gray-300 hover:bg-[#1e2a3a] hover:text-white rounded-md transition-colors duration-200'
              >
                <X className='mr-3 h-5 w-5' />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            // Existing loading state...
            <div className='flex items-center'>
              <div className='w-8 h-8 rounded-full bg-gray-600 animate-pulse'></div>
              <div className='ml-3'>
                <div className='h-4 w-24 bg-gray-600 rounded animate-pulse'></div>
                <div className='h-3 w-20 bg-gray-700 rounded mt-1 animate-pulse'></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden'
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
}
