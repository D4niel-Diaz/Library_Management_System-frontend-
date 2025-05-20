"use client";

import { useAppContext } from "../../context/AppProvider";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BookOpenIcon,
  UserGroupIcon,
  ClockIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const { user } = useAppContext();
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
      current: pathname === "/dashboard",
    },
    {
      name: "Books",
      href: "/dashboard/books",
      icon: BookOpenIcon,
      current: pathname === "/dashboard/books",
    },
    {
      name: "Borrowings",
      href: "/dashboard/borrowings",
      icon: ClockIcon,
      current: pathname === "/dashboard/borrowings",
    },
    {
      name: "Users",
      href: "/dashboard/users",
      icon: UserGroupIcon,
      current: pathname === "/dashboard/users",
      adminOnly: true,
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-gray-200 z-50">
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center shadow-md">
              {user?.profile_image ? (
                <img 
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/${user.profile_image}`} 
                  alt={user.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4B5563&color=fff`;
                  }}
                />
              ) : (
                <span className="text-white text-lg font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
                {user?.role === "admin" ? "Administrator" : "Library Member"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            if (item.adminOnly && user?.role !== "admin") return null;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  item.current
                    ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
} 