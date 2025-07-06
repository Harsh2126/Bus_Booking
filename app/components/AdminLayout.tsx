"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';

const adminNavLinks = [
  { label: 'Dashboard', href: '/dashboard/admin-dashboard', icon: '📊' },
  { label: 'User Management', href: '/admin/users', icon: '👥' },
  { label: 'Booking Management', href: '/admin/bookings', icon: '📋' },
  { label: 'Bus Management', href: '/admin/buses', icon: '🚌' },
  { label: 'City Management', href: '/admin/cities', icon: '🌆' },
  { label: 'Recommendations', href: '/admin/recommendations', icon: '⭐' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="text-2xl font-bold text-gray-900 mb-1">Admin Panel</div>
          <div className="text-sm text-gray-600">Bus Booking System</div>
        </div>
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {adminNavLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-base font-medium ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link
            href="/profile"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors mb-3"
          >
            <FaUserCircle className="text-xl" />
            <span className="font-medium">Profile</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-base mt-2 hover:from-red-600 hover:to-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
} 