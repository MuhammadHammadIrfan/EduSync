import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  FiX, FiHome, FiUsers, FiCalendar, FiBookOpen, 
  FiClock, FiFileText, FiMail, FiBarChart2, FiLogOut 
} from 'react-icons/fi';


export default function Sidebar({ isOpen, toggleSidebar }) {
  const router = useRouter();
  
  // Get current path for active state
  const currentPath = router.pathname;

  // Navigation items matching the UI image
  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: FiHome 
    },
    { 
      name: 'Manage Users', 
      href: '/admin/users', 
      icon: FiUsers 
    },
    { 
      name: 'Events', 
      href: '/admin/events', 
      icon: FiCalendar 
    },
    { 
      name: 'Courses', 
      href: '/admin/courses', 
      icon: FiBookOpen 
    },
    { 
      name: 'Invoices', 
      href: '/admin/invoices', 
      icon: FiFileText 
    },
    { 
      name: 'Time Table', 
      href: '/admin/timetable', 
      icon: FiClock 
    },
    { 
      name: 'Attendance', 
      href: '/admin/attendance', 
      icon: FiCalendar 
    },
    { 
      name: 'Leaves', 
      href: '/admin/leaves', 
      icon: FiCalendar 
    },
    { 
      name: 'Inbox', 
      href: '/admin/messages', 
      icon: FiMail 
    },
    { 
      name: 'Analytics', 
      href: '/admin/analytics', 
      icon: FiBarChart2 
    },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - fixed position, dark blue background from UI */}
      <div 
        className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-64 bg-[#1e2c4f] text-white transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:inset-auto md:z-auto`}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-700">
          <Link href="/admin/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-white">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                EduSync
              </span>
            </span>
          </Link>
          <button 
            type="button" 
            className="text-gray-300 hover:text-white md:hidden" 
            onClick={toggleSidebar}
          >
            <span className="sr-only">Close sidebar</span>
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar content */}
<div className="flex-1 flex flex-col overflow-y-auto pt-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
  <nav className="flex-1 px-4 space-y-1">
    {navItems.map((item) => {
      const isActive = currentPath === item.href || 
                      (item.href !== '/admin/dashboard' && currentPath.startsWith(item.href));
      return (
        <Link
  key={item.name}
  href={item.href}
  className={`${
    isActive
      ? 'text-white bg-blue-900 bg-opacity-50'  // Changed background color and opacity
      : 'text-gray-300 hover:bg-blue-900 hover:bg-opacity-30 hover:text-white'  // Also adjusted hover state
  } group flex items-center px-4 py-3 text-base font-medium transition-colors duration-200 rounded-md relative z-0`}  // Added z-0 to ensure proper stacking
>
  <item.icon
    className="mr-3 flex-shrink-0 h-5 w-5"
  />
  {item.name}
</Link>
      );
    })}
  </nav>
</div>
        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <span>A</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-400">admin@edusync.com</p>
            </div>
          </div>
          <button className="mt-4 w-full flex items-center px-4 py-2 text-gray-300 hover:bg-[#3d476e] hover:text-white rounded-md transition-colors duration-200">
            <FiLogOut className="mr-3 h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}