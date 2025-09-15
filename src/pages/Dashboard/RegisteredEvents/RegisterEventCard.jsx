import { Calendar, MapPin, User } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import EventStatusBadge from "./EventStatusBadge";
import EventActionButtons from "./EventActionButtons";

const RegisterEventCard = ({ event, onAction }) => {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'UTC' 
  });

  const volunteerProgress = event.requiredVolunteers > 0 
    ? (event.volunteers.length / event.requiredVolunteers) * 100 
    : 0;

  return (
    <div className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow ${
      event.status === 'cancelled' ? 'opacity-60' : ''
    }`}>
      <div className={`p-6 ${event?.status === 'cancelled' ? '' : 'flex flex-col h-full'} `}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className={`text-lg font-semibold ${
                event.status === 'cancelled' ? 'text-gray-500' : 'text-gray-900'
              }`}>
                {event.title}
              </h3>
              <span className="bg-[#FF6B00] bg-opacity-10 text-[#FF6B00] px-2 py-1 rounded-full text-xs font-medium">
                {event.category}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <EventStatusBadge status={event.status} />
              <CountdownTimer eventDate={event.date} />
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-3 mb-4 flex-grow">
          <div className="flex items-center space-x-3 text-gray-600">
            <Calendar className="w-5 h-5 text-[#FF6B00] flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">{formattedDate}</div>
              <div className="text-sm">{formattedTime}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-gray-600">
            <MapPin className="w-5 h-5 text-[#FF6B00] flex-shrink-0" />
            <span className="text-sm">{event.location}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-gray-600">
            <User className="w-5 h-5 text-[#FF6B00] flex-shrink-0" />
            <span className="text-sm">Organized by {event.organizerName}</span>
          </div>
        </div>

        {/* Volunteer Progress */}
        <div className="mb-4 ">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Volunteer Progress</span>
            <span className="font-medium text-gray-900">
              {event.volunteers.length}/{event.requiredVolunteers} registered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#FF6B00] h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(volunteerProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 pt-4">
          
          <EventActionButtons event={event} onAction={onAction} />
        </div>
      </div>
    </div>
  );
};
export default RegisterEventCard;