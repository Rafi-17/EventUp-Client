import { Eye, Star, UserCheck, X } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const EventActionButtons = ({ event, onAction }) => {
  const {user} = useAuth();
  const now = new Date();
  const eventDate = new Date(event.date);
  const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  const isCancellable = hoursUntilEvent > 24;
  const isUpcoming = event.status ==='upcoming';
  const isCompleted = event.status === 'completed';
  const isCancelled = event.status === 'cancelled';
  const isEventToday = new Date(event?.date).getUTCDate() === new Date().getUTCDate() &&
                     new Date(event?.date).getUTCMonth() === new Date().getUTCMonth() &&
                     new Date(event?.date).getUTCFullYear() === new Date().getUTCFullYear();
  // console.log(isEventToday);
  const currentVolunteer = event.volunteers?.find(v => v.email === user?.email);
  const isAlreadyPresent = currentVolunteer?.isPresent || false;
  const isEventOngoing = event?.status === 'ongoing';
  return (
    <div className="flex flex-wrap justify-between items-center gap-2">
      <Link
        to={`/eventDetails/${event._id}`}
        className="flex justify-center flex-1 items-center space-x-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
      >
        <Eye className="w-4 h-4" />
        <span>View Details</span>
      </Link>

      {(isEventOngoing || (isEventToday && !isCancelled)) && (
        <button
          onClick={() => onAction('attendance', event)}
          disabled={isAlreadyPresent}
          className={`flex w-full md:w-auto justify-center items-center space-x-1 px-3 py-1 rounded-lg transition-colors text-sm ${
            isAlreadyPresent 
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
              : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{isAlreadyPresent ? 'Already Present' : 'Mark Attendance'}</span>
        </button>
      )}
      
      {isUpcoming && !isCancelled && (
        <div className="relative group w-full md:w-auto">
        <button
          disabled={!isCancellable}
          onClick={isCancellable ? () => onAction('cancel', event) : undefined}
          className={`flex items-center w-full justify-center space-x-1 px-3 py-1 rounded-lg transition-colors text-sm ${
        isCancellable 
          ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
      }`}
        >
          <X className="w-4 h-4" />
          <span>Cancel Registration</span>
        </button>
        {!isCancellable && (
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Cannot cancel within 24 hours of event
      </div>
    )}
        </div>
      )}
      
      {isCompleted && (
        <Link to={`/dashboard/addReview/${event._id}`}
          onClick={() => onAction('review', event)}
          className="flex items-center justify-center w-full space-x-1 bg-[#FF6B00] bg-opacity-10 dark:bg-opacity-20 text-[#FF6B00] px-3 py-1 rounded-lg hover:bg-[#FF6B00] hover:bg-opacity-20 dark:hover:bg-opacity-30 transition-colors text-sm"
        >
          <Star className="w-4 h-4" />
          <span>Add Review</span>
        </Link>
      )}
    </div>
  );
};
export default EventActionButtons;