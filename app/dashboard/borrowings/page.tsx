"use client";

import { useAppContext } from "@/context/AppProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

interface Borrowing {
  id: number;
  book: {
    id: number;
    title: string;
    author: string;
    isbn: string;
  };
  borrowed_date: string;
  due_date: string;
  returned_date?: string;
  status: "active" | "returned" | "overdue";
}

export default function BorrowingsPage() {
  const { user, authToken } = useAppContext();
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  useEffect(() => {
    fetchBorrowings();
  }, [authToken]);

  const fetchBorrowings = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/transactions`,
        {
          headers: { 
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json'
          },
        }
      );
      setBorrowings(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      console.error("Failed to fetch borrowings:", error);
      toast.error(
        error.response?.data?.message || 
        "Failed to load borrowings"
      );
      setBorrowings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturn = async (borrowingId: number) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/borrowings/${borrowingId}/return`,
        {},
        {
          headers: { 
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json'
          },
        }
      );
      toast.success("Book returned successfully");
      fetchBorrowings();
    } catch (error: any) {
      console.error("Failed to return book:", error);
      toast.error(
        error.response?.data?.message || 
        "Failed to return book"
      );
    }
  };

  const handleRenew = async (borrowingId: number) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/borrowings/${borrowingId}/renew`,
        {},
        {
          headers: { 
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json'
          },
        }
      );
      toast.success("Book renewed successfully");
      fetchBorrowings();
    } catch (error: any) {
      console.error("Failed to renew book:", error);
      toast.error(
        error.response?.data?.message || 
        "Failed to renew book"
      );
    }
  };

  const filteredBorrowings = Array.isArray(borrowings) ? borrowings.filter((borrowing) =>
    activeTab === "active"
      ? borrowing.status === "active" || borrowing.status === "overdue"
      : borrowing.status === "returned"
  ) : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Borrowings</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === "active"
                ? "bg-primary-100 text-primary-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === "history"
                ? "bg-primary-100 text-primary-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Borrowings List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredBorrowings.map((borrowing) => (
            <li key={borrowing.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {borrowing.book.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {borrowing.book.author}
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <p>
                        Due: {new Date(borrowing.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        borrowing.status === "active"
                          ? "bg-green-100 text-green-800"
                          : borrowing.status === "overdue"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {borrowing.status === "active" ? (
                        <CheckCircleIcon className="mr-1 h-4 w-4" />
                      ) : borrowing.status === "overdue" ? (
                        <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                      ) : null}
                      {borrowing.status.charAt(0).toUpperCase() +
                        borrowing.status.slice(1)}
                    </span>
                    {borrowing.status === "active" && (
                      <button
                        onClick={() => handleReturn(borrowing.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Return
                      </button>
                    )}
                    {borrowing.status === "active" && (
                      <button
                        onClick={() => handleRenew(borrowing.id)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Renew
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
          {filteredBorrowings.length === 0 && (
            <li className="px-4 py-6 text-center text-gray-500">
              No {activeTab} borrowings found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
} 