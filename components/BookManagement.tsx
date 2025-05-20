"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '@/context/AppProvider';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  publisher: string;
}

interface BookManagementProps {
  books: Book[];
  onRefresh: () => void;
}

const BookManagement = ({ books, onRefresh }: BookManagementProps) => {
  const { authToken } = useAppContext();
  const [isEditing, setIsEditing] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Omit<Book, 'id'>>({
    title: '',
    author: '',
    description: '',
    publisher: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (isEditing) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/books/${isEditing.id}`,
          formData,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        toast.success('Book updated successfully!');
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/books`,
          formData,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        toast.success('Book added successfully!');
      }
      resetForm();
      onRefresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save book');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: 'Confirm Delete',
        text: "Are you sure you want to delete this book?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Delete',
        background: '#1f2937',
        color: '#fff'
      });

      if (result.isConfirmed) {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/books/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        toast.success('Book deleted successfully!');
        onRefresh();
      }
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      publisher: ''
    });
    setIsEditing(null);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.publisher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-700 to-primary-900 p-6">
          <h4 className="text-xl font-bold text-white">{isEditing ? "Edit Book" : "Add New Book"}</h4>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
              <input
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                name="publisher"
                value={formData.publisher}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex space-x-4">
              <button 
                className="flex-1 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-red-glow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  isEditing ? "Update Book" : "Add Book"
                )}
              </button>
              {isEditing && (
                <button 
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  type="button" 
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-700 to-primary-900 p-6">
          <h4 className="text-xl font-bold text-white">Book List</h4>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search books..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publisher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.map(book => (
                  <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.publisher}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors shadow-red-glow hover:shadow-lg"
                          onClick={() => {
                            setFormData({
                              title: book.title,
                              author: book.author,
                              publisher: book.publisher,
                              description: book.description
                            });
                            setIsEditing(book);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors shadow-red-glow hover:shadow-lg"
                          onClick={() => handleDelete(book.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookManagement;