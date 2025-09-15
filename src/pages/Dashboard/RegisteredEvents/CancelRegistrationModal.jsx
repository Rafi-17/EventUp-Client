import React from 'react';
import { X, AlertTriangle, Calendar, MapPin } from 'lucide-react';

const CancelRegistrationModal = ({ isOpen, event, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Cancel Registration
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Event Details */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">{event?.title}</h4>
            
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800 mb-1">
                  Are you sure you want to cancel?
                </p>
                <p className="text-sm text-amber-700">
                  Your spot will become available for other volunteers. You may need to re-register if you change your mind.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 rounded-b-xl">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none transition-all font-medium"
          >
            Keep Registration
          </button>
          <button
            onClick={() => onConfirm(event)}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all font-medium flex items-center space-x-2"
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
