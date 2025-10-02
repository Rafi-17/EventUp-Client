import React from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaRegClock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const EventCard = ({ event }) => {
    const axiosPublic= useAxiosPublic();
    const navigate = useNavigate();
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
    const volunteersNeeded = event.requiredVolunteers;
    const volunteersJoined = event?.volunteers?.length || 0;
    const vacanciesLeft = volunteersNeeded - volunteersJoined;

    //change the minutes to readable timer
    const formatMinutesToDuration = (totalMinutes) => {
        if (totalMinutes === 0) {
            return "Less than 1 minute";
        }
        
        const minutesInDay = 60 * 24;
        const minutesInHour = 60;
        
        if (totalMinutes >= minutesInDay) {
            const days = Math.floor(totalMinutes / minutesInDay);
            return `${days} day${days > 1 ? 's' : ''}`;
        } else if (totalMinutes >= minutesInHour) {
            const hours = Math.floor(totalMinutes / minutesInHour);
            return `${hours} hour${hours > 1 ? 's' : ''}`;
        } else {
            return `${totalMinutes} minute${totalMinutes > 1 ? 's' : ''}`;
        }
    };

    const handleUpdateView = async()=>{
        const res = await axiosPublic.patch(`/events/views/${event._id}`)
    }
    const handleNavigateDetails= ()=>{
        navigate(`/eventDetails/${event._id}`);
    }

    return (
        <div onClick={handleNavigateDetails} className="bg-white cursor-pointer dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-2xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Image section */}
            <div className="relative h-48 sm:h-56 w-full">
                <img 
                    src={event.image} 
                    alt={event.title} 
                    className="h-full w-full object-cover" 
                />
                <span className={`absolute top-4 right-4 px-3 py-1 text-sm font-semibold rounded-full ${event?.status==='completed' ? 'text-gray-800 bg-gray-100 dark:text-gray-200 dark:bg-gray-600' : 'text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-800'}`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
            </div>
            
                <div className="mb-2">
                    <span className="px-2 py-1 text-sm font-semibold rounded-full text-blue-800 bg-blue-100 dark:text-blue-200 dark:bg-blue-800">
                        {event.category || 'Uncategorized'}
                    </span>
                </div>
            {/* All Info section */}
            <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                <div className="h-12 sm:h-16 flex flex-wrap items-start">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight line-clamp-2">
                        {event.title}
                    </h3>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1 mt-2">
                    <FaCalendarAlt className="mr-2 text-sm text-[#FF6B00]" />
                    <p className="font-semibold text-sm dark:text-gray-300">{formatDate(event.date)}</p>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                    <FaMapMarkerAlt className="mr-2 text-sm text-[#FF6B00]" />
                    <p className="font-semibold text-sm dark:text-gray-300">{event.location}</p>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                    <FaRegClock className="mr-2 text-sm text-[#FF6B00]" />
                    <p className="font-semibold text-sm dark:text-gray-300">{formatMinutesToDuration(event?.duration) || "Not Fixed"}</p>
                </div>
                
                {/* New section for volunteer data */}
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                    <FaUsers className="mr-2 text-sm text-[#FF6B00]" />
                    <p className="font-semibold text-sm dark:text-gray-300">
                        {volunteersNeeded ? (
                            <span>
                                {vacanciesLeft > 0 ? (
                                    <span>
                                        Vacancies Left: <span className="text-[#FF6B00] dark:text-[#FF8533]">{vacanciesLeft}</span>
                                    </span>
                                ) : (
                                    <span className="text-green-600 dark:text-green-400">
                                        All Volunteer Slots Filled
                                    </span>
                                )}
                                <span className="text-gray-500 dark:text-gray-400 ml-2 text-xs">
                                    ({volunteersJoined} of {volunteersNeeded})
                                </span>
                            </span>
                        ) : (
                            <span>Volunteers: Not specified</span>
                        )}
                    </p>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-2">
                    {event.description}
                </p>
                
                <Link onClick={handleUpdateView} to={`/eventDetails/${event._id}`} className="w-full bg-[#FF6B00] text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors duration-300 hover:bg-[#E66200] focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-opacity-50">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default EventCard;