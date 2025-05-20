"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '@/context/AppProvider';
import toast from 'react-hot-toast';
import { XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user }) => {
  const { authToken, updateUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Handle profile update (name, email)
      const formDataToSend = new FormData();
      let hasChanges = false;

      if (formData.name !== user?.name) {
        formDataToSend.append('name', formData.name);
        hasChanges = true;
      }

      if (formData.email !== user?.email) {
        formDataToSend.append('email', formData.email);
        hasChanges = true;
      }

      // Update profile if there are changes
      if (hasChanges) {
        const profileResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/update`,
          formDataToSend,
          {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (profileResponse.data.success) {
          const updatedUser = {
            ...user,
            ...profileResponse.data.data
          };
          updateUser(updatedUser);
          toast.success('Profile updated successfully');
        }
      }

      // Handle password update if all password fields are filled
      const hasPasswordFields = formData.current_password.trim() && 
                              formData.new_password.trim() && 
                              formData.new_password_confirmation.trim();

      if (hasPasswordFields) {
        if (formData.new_password !== formData.new_password_confirmation) {
          toast.error('New passwords do not match');
          setLoading(false);
          return;
        }

        if (formData.new_password.length < 8) {
          toast.error('New password must be at least 8 characters long');
          setLoading(false);
          return;
        }

        const passwordData = {
          current_password: formData.current_password,
          new_password: formData.new_password,
          new_password_confirmation: formData.new_password_confirmation
        };

        const passwordResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/update-password`,
          passwordData,
          {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );

        if (passwordResponse.data.success) {
          toast.success('Password updated successfully');
          // Clear password fields
          setFormData(prev => ({
            ...prev,
            current_password: '',
            new_password: '',
            new_password_confirmation: ''
          }));
        }
      }

      if (!hasChanges && !hasPasswordFields) {
        toast.error('No changes were made');
        setLoading(false);
        return;
      }

      onClose();
      window.location.reload();
    } catch (error: any) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          Object.values(validationErrors).forEach((messages: any) => {
            messages.forEach((message: string) => toast.error(message));
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Update Profile</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Password Section */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Change Password</h4>
            <p className="text-xs text-gray-500 mb-4">Leave these fields empty if you don't want to change your password</p>
            
            {/* Current Password */}
            <div className="mb-4">
              <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                id="current_password"
                name="current_password"
                value={formData.current_password}
                onChange={handleInputChange}
                placeholder="Enter current password to change it"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                value={formData.new_password}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <label htmlFor="new_password_confirmation" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="new_password_confirmation"
                name="new_password_confirmation"
                value={formData.new_password_confirmation}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? (
                <div className="flex items-center">
                  <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Updating...
                </div>
              ) : (
                'Update Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal; 