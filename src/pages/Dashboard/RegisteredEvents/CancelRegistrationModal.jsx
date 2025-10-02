import React from 'react';
import { X, AlertTriangle, Calendar, MapPin } from 'lucide-react';

const CancelRegistrationModal = ({ isOpen, event, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full shadow-2xl transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Cancel Registration
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Event Details */}
        <div className="p-6">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{event?.title}</h4>
            
          </div>

          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">
                  Are you sure you want to cancel?
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-200">
                  Your spot will become available for other volunteers. You may need to re-register if you change your mind.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between space-x-3 p-6 bg-gray-50 dark:bg-gray-900 rounded-b-xl border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-200 focus:outline-none transition-all font-medium"
          >
            Keep Registration
          </button>
          <button
            onClick={() => onConfirm(event)}
            className="px-5 py-2.5 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-600 focus:outline-none transition-all font-medium flex items-center space-x-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Cancel Registration</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelRegistrationModal;
