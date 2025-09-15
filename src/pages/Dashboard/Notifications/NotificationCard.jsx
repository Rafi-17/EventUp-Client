import { AlertTriangle, Calendar, CheckCircle, Clock, Trash2, User, X } from "lucide-react";
import NotificationIcon from "./NotificationIcon";
import { useState } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const NotificationCard = ({ notification, onMarkAsRead, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // ADD these functions before the return statement
    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        await onDelete(notification._id);
        setShowDeleteModal(false);
        setIsDeleting(false);
    };
  
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const diffInMs = now - notificationDate;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return notificationDate.toLocaleDateString();
  };

  const getNotificationContext = () => {
    if (notification.eventTitle) {
      return (
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <Calendar className="w-3 h-3 mr-1" />
          <span>Event: {notification.eventTitle}</span>
        </div>
      );
    }
    
    if (notification.volunteerName) {
      return (
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <User className="w-3 h-3 mr-1" />
          <span>Volunteer: {notification.volunteerName}</span>
        </div>
      );
    }
    
    return null;
  };

  return (
    <>
    <div className={`bg-white rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow ${
      notification.type === 'warning' ? 'border-l-yellow-500' :
      notification.type === 'sorry' ? 'border-l-red-500' :
      notification.type === 'success' ? 'border-l-green-500' :
      notification.type === 'neutral' ? 'border-l-blue-500' :
      'border-l-gray-500'
    } ${!notification.read ? 'ring-2 ring-[#FF6B00] ring-opacity-20' : 'bg-gray-50'}`}>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <NotificationIcon type={notification.type} />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                    {notification.message}
                  </p>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-[#FF6B00] rounded-full flex-shrink-0"></span>
                  )}
                </div>
                
                {getNotificationContext()}
                
                <div className="flex items-center text-xs text-gray-500 mt-2 flex-wrap">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formatTimeAgo(notification.timestamp)}</span>
                  </div>
                  {notification.cancelledBy && (
                    <>
                      <span className="mx-2">•</span>
                      <span>Cancelled by {notification.cancelledBy}</span>
                    </>
                  )}
                  {notification.removedBy && (
                    <>
                      <span className="mx-2">•</span>
                      <span>Removed by {notification.removedBy}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                {!notification.read && (
                  <button
                    onClick={() => onMarkAsRead(notification._id)}
                    className="p-1 text-gray-400 hover:text-[#FF6B00] transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleDeleteClick}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {notification.reason && (
              <>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-xs text-[#FF6B00] hover:text-[#E55A00] mt-2 font-medium"
                >
                  {showDetails ? 'Hide details' : 'View details'}
                </button>
                
                {showDetails && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm text-gray-700 leading-relaxed">{notification.reason}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      </div>
      {showDeleteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[990] p-4">
                <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-300 ease-out">
          
          {/* Close Button */}
          <button
            onClick={()=>setShowDeleteModal(false)}
            disabled={isDeleting}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Content */}
          <div className="p-6 sm:p-8">
            
            {/* Icon */}
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-2 sm:mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            {/* Title */}
            <h3 
              id="modal-title"
              className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-4"
            >
              Delete Notification
            </h3>

            {/* Message */}
            {/* <p className="text-base sm:text-lg font-medium text-gray-800 text-center mb-3">
              Are you sure you want to delete this notification?
            </p> */}

            {/* Action Buttons */}
            <div className="flex sm:flex-row gap-3 sm:gap-4">
              
              {/* Cancel Button */}
              <button
                type="button"
                onClick={()=>setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 sm:py-3 text-sm sm:text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              {/* Delete Button */}
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 sm:py-3 text-sm sm:text-base font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isDeleting ? (
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
            <div className="mt-3 sm:mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
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
            )}
    </>
  );
};
export default NotificationCard;
