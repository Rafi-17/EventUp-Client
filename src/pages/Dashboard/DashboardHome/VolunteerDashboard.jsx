import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Award, Clock, Star, MapPin, Users, Heart, FlagOff } from 'lucide-react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import { Link } from 'react-router-dom';

const VolunteerDashboard = ({ user }) => {
  const axiosSecure = useAxiosSecure();

  const { data: volunteerStats, isLoading } = useQuery({
    queryKey: ['volunteer-stats', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/volunteer-stats/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-700 dark:to-indigo-900 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Welcome back, {user?.name || 'Organizer'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Continue your volunteer journey and make an impact
        </p>
      </div>

      {/* Volunteer Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Events Joined */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow border-l-4 border-blue-500 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Events Joined</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{volunteerStats?.impact?.totalEvents || 0}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Hours Contributed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow border-l-4 border-green-500 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Hours Contributed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{volunteerStats?.impact?.totalHours || 0}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Events Completed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow border-l-4 border-yellow-500 dark:border-yellow-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Events Completed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{volunteerStats?.impact?.completedEvents || 0}</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
              <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Events Missed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow border-l-4 border-red-500 dark:border-red-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">Events Missed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{volunteerStats?.impact?.missedEvents || 0}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
              <FlagOff className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-6">
        <SectionTitle 
          subHeading="Schedule"
          heading="My Upcoming Events"
          variant="dashboard"
          alignment="left"
        />
        
        <div className="mt-6">
          {volunteerStats?.upcomingEvents?.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {volunteerStats.upcomingEvents.map((event, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{event.title}</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-[#FF6B00]" />
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-[#FF6B00]" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-[#FF6B00]" />
                      Organized by {event.organizerName}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link 
                      to={`/eventDetails/${event._id}`}
                      className="text-[#FF6B00] hover:text-[#E55A00] text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No upcoming events yet</p>
              <Link 
                to="/events"
                className="bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#E55A00] transition-colors"
              >
                Browse Events
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Events */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-6">
        <SectionTitle 
          subHeading="Discover"
          heading="Recommended Events"
          variant="dashboard"
          alignment="left"
        />
        
        {volunteerStats?.recommendationMessage && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-700 rounded-lg">
            <div className="flex items-start space-x-3">
              <Heart className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-800 dark:text-blue-300 font-medium">Personalize Your Experience</p>
                <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">{volunteerStats?.recommendationMessage}</p>
                <Link 
                  to="/dashboard/profile"
                  className="text-blue-700 dark:text-blue-300 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
                >
                  Update Your Interests →
                </Link>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6">
          {volunteerStats?.recommendedEvents?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {volunteerStats.recommendedEvents.slice(0, 6).map((event, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-[#FF6B00] bg-opacity-10 dark:bg-opacity-20 text-[#FF6B00] px-2 py-1 rounded text-xs font-medium">
                      {event.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {event.volunteers?.length || 0}/{event.requiredVolunteers} joined
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">{event.title}</h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {event.location}
                    </div>
                  </div>
                  <Link 
                    to={`/eventDetails/${event._id}`}
                    className="text-[#FF6B00] hover:text-[#E55A00] text-sm font-medium"
                  >
                    Learn More →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8 italic">No recommended events available</p>
          )}
        </div>
      </div>

      {/* Community Reviews */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-6">
        <SectionTitle 
          subHeading="Community"
          heading="Recent Reviews"
          variant="dashboard"
          alignment="left"
        />
        
        <div className="mt-6">
          {volunteerStats?.recentReviews?.length > 0 ? (
            <div className="space-y-4">
              {volunteerStats.recentReviews.map((review, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-gray-100">{review.eventTitle}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">by {review.reviewerName}</p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{review.quote}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8 italic">No recent reviews available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;