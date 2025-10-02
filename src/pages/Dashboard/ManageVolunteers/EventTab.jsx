import { Calendar, MapPin } from "lucide-react";
import React from "react";

const EventTab = React.forwardRef(({ event, isActive, onClick }, ref) => {
  const volunteersCount = event?.volunteers?.length || 0;
  const requiredVolunteers = event?.requiredVolunteers || 0;
  const progressPercentage = requiredVolunteers > 0 ? (volunteersCount / requiredVolunteers) * 100 : 0;

  const getStatusColor = (status) => {
    switch(status) {
      case 'ongoing': return 'bg-green-500';
      case 'completed': return 'bg-purple-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`flex-shrink-0 w-72 p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
        isActive 
          ? 'border-[#FF6B00] bg-[#FF6B00] bg-opacity-5 dark:bg-gray-800 dark:bg-opacity-20 shadow-md' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#FF6B00] hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`font-semibold text-sm line-clamp-2 ${
            isActive ? 'text-[#FF6B00]' : 'text-gray-900 dark:text-gray-100'
          }`}>
            {event?.title}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              isActive ? 'bg-[#FF6B00] text-white' : 'bg-[#FF6B00] bg-opacity-10 dark:bg-opacity-20 text-[#FF6B00]'
            }`}>
              {event?.category || 'uncategorized'}
            </span>
            <div className={`w-2 h-2 rounded-full ${getStatusColor(event?.status)}`}></div>
          </div>
        </div>
        <div className={`p-2 rounded-lg ${
          isActive ? 'bg-[#FF6B00] bg-opacity-20' : 'bg-gray-100 dark:bg-gray-700'
        }`}>
          <Calendar className={`w-4 h-4 ${
            isActive ? 'text-[#FF6B00]' : 'text-gray-600 dark:text-gray-300'
          }`} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
          <MapPin className="w-3 h-3 mr-1" />
          <span className="truncate">{event?.location}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className={`font-medium ${isActive ? 'text-[#FF6B00]' : 'text-gray-700 dark:text-gray-300'}`}>
            {volunteersCount}/{requiredVolunteers} volunteers
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}
          </span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${
              isActive ? 'bg-[#FF6B00]' : 'bg-gray-400 dark:bg-gray-500'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
});
export default EventTab;