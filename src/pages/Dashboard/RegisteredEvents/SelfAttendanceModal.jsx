import React, { useState } from 'react';
import { UserCheck, X } from 'lucide-react';

const SelfAttendanceModal = ({ isOpen, event, onConfirm, onCancel }) => {
  const [secretCode, setSecretCode] = useState('');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-2xl max-w-md w-full mx-4">
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mark Attendance</h3>
            </div>
            <button onClick={onCancel} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>
        {/* Modal body */}
        <div className="p-6">
            <div className="mb-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{event.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter the secret code provided by the event organizer to mark your attendance.
                </p>
            </div>
            
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secret Code
                </label>
                <input
                type="text"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter code..."
                maxLength={6}
                />
            </div>
        </div>
        {/* Modal footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
                Cancel
            </button>
            <button
                onClick={() => onConfirm(secretCode)}
                disabled={!secretCode}
                className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
                Submit
            </button>
            </div>
      </div>
    </div>
  );
};

export default SelfAttendanceModal;