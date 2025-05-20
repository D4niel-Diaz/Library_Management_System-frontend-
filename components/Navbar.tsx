"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppProvider";
import { useState, useCallback } from "react";
import { 
  BookOpenIcon, 
  BellIcon, 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { logout, authToken, user, isLoading } = useAppContext();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout]);

  const handleDashboardClick = useCallback((e: React.MouseEvent) => {
    if (!authToken) {
      e.preventDefault();
      router.push('/auth');
    }
  }, [authToken, router]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  if (isLoading) {
    return (
      <nav className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 group"
            aria-label="Home"
          >
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
              <BookOpenIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 font-['Montserrat']">LibraTech</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {authToken ? (
              <>
                {user?.role === 'admin' && (
                  <Link 
                    href="/dashboard" 
                    className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                    onClick={handleDashboardClick}
                    aria-label="Admin Dashboard"
                  >
                    Admin Portal
                  </Link>
                )}
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 relative"
                  aria-label="View Notifications"
                >
                  <BellIcon className="h-6 w-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <UserCircleIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  <button 
                    onClick={handleLogout} 
                    className="ml-4 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center space-x-1"
                    aria-label="Sign Out"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <Link 
                href="/auth" 
                className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="Sign In"
              >
               
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden bg-white border-t border-gray-100"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="mobile-menu-button"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {authToken ? (
                <>
                  {user?.role === 'admin' && (
                    <Link 
                      href="/dashboard" 
                      className="block px-4 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                      role="menuitem"
                      aria-label="Admin Dashboard"
                    >
                      Admin Portal
                    </Link>
                  )}
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="w-full text-left px-4 py-3 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 flex items-center space-x-2"
                    role="menuitem"
                    aria-label="View Notifications"
                  >
                    <BellIcon className="h-6 w-6" />
                    <span>Notifications</span>
                  </button>
                  <div className="px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <UserCircleIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center space-x-2"
                      role="menuitem"
                      aria-label="Sign Out"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <Link 
                  href="/auth" 
                  className="block px-4 py-3 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                  role="menuitem"
                  aria-label="Sign In"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Notifications Panel */}
        {isNotificationsOpen && (
          <div className="absolute right-4 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 font-['Montserrat']">Notifications</h3>
                <button 
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm font-['Inter']">You're all caught up!</p>
                  <p className="text-gray-400 text-xs mt-1">No new notifications at this time</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;