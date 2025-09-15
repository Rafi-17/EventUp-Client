import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Notification",
  message = "Are you sure you want to delete this notification?",
  description = "This action cannot be undone. The notification will be permanently removed from your account.",
  isLoading = false 
}) => {
  if (!isOpen) return null;

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      document.body.style.overflow = 'unset';
    }
  };

  const handleClose = () => {
    onClose();
    document.body.style.overflow = 'unset'; // Reset overflow
  };

  // Modified onConfirm to reset overflow
  const handleConfirm = async () => {
    await onConfirm();
    document.body.style.overflow = 'unset'; // Reset overflow after confirm
  };

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading]);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-out"
        onClick={handleBackdropClick}
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-300 ease-out">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Content */}
          <div className="p-6 sm:p-8">
            
            {/* Icon */}
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            {/* Title */}
            <h3 
              id="modal-title"
              className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-4"
            >
              {title}
            </h3>

            {/* Message */}
            <p className="text-base sm:text-lg font-medium text-gray-800 text-center mb-3">
              {message}
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-600 text-center mb-8 leading-relaxed">
              {description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              
              {/* Cancel Button */}
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 text-sm sm:text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              {/* Delete Button */}
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-3 text-sm sm:text-base font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>

            {/* Warning Note */}
            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-yellow-800 font-medium">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;