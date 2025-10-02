import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const CancelEventModal = ({ isOpen, event, onConfirm, onCancel }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(event, reason);
    setReason(''); // Clear after confirm
  };

  const handleCancel = () => {
    onCancel();
    setReason(''); // Clear on cancel
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500 dark:text-red-400" />
            Cancel Event
          </h3>
          <button onClick={handleCancel} className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to cancel <strong>"{event?.title}"</strong>?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            This action cannot be undone and all registered volunteers will be notified.
          </p>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Reason for cancellation <span className="text-red-500 dark:text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why you are cancelling this event..."
              className="w-full outline-none bg-gray-50 dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-sm text-gray-900 dark:text-gray-100"
              rows="3"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 text-nowrap dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Keep Event
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="px-4 py-2 bg-red-600 dark:bg-red-600 text-nowrap text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelEventModal;