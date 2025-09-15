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

  return (
    <div className="flex flex-wrap gap-2">
      {/* {true && (
    <button
        // Replace with your handler for opening the modal
        className="w-full mt-4 flex items-center justify-center space-x-2 bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#ff8c00] transition-colors"
        title="Give Attendance"
    >
        <UserCheck className="w-5 h-5" />
        <span>Give Attendance</span>
    </button>
)} */}
      <Link
        to={`/eventDetails/${event._id}`}
        className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors text-sm"
      >
        <Eye className="w-4 h-4" />
        <span>View Details</span>
      </Link>

      {isEventToday && !isCancelled && (
        <button
          onClick={() => onAction('attendance', event)}
          disabled={isAlreadyPresent}
          className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors text-sm ${
            isAlreadyPresent 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{isAlreadyPresent ? 'Already Present' : 'Mark Attendance'}</span>
        </button>
      )}
      
      {isUpcoming && !isCancelled && (
        <div className="relative group">
        <button
          disabled={!isCancellable}
          onClick={isCancellable ? () => onAction('cancel', event) : undefined}
          className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors text-sm ${
        isCancellable 
          ? 'bg-red-100 text-red-800 hover:bg-red-200' 
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
      }`}
        >
          <X className="w-4 h-4" />
          <span>Cancel Registration</span>
        </button>
        {!isCancellable && (
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Cannot cancel within 24 hours of event
      </div>
    )}
        </div>
      )}
      
      {isCompleted && (
        <Link to={`/dashboard/addReview/${event._id}`}
          onClick={() => onAction('review', event)}
          className="flex items-center space-x-1 bg-[#FF6B00] bg-opacity-10 text-[#FF6B00] px-3 py-1 rounded-lg hover:bg-[#FF6B00] hover:bg-opacity-20 transition-colors text-sm"
        >
          <Star className="w-4 h-4" />
          <span>Add Review</span>
        </Link>
      )}
    </div>
  );
};
export default EventActionButtons;