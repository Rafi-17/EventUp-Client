import React from 'react';
import { Calendar, Users, Trophy, Clock, MapPin, User, ChevronRight, Plus, CheckCircle, UserPlus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';

const OrganizerDashboard = ({ user }) => {
  const axiosSecure = useAxiosSecure();

  const { data: organizerStats, isLoading } = useQuery({
    queryKey: ['organizer-stats', user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/organizer-stats/${user.email}`);
      return response.data;
    },
    enabled: !!user?.email
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6 bg-gray-50 dark:bg-gray-900">
        <div className="h-28 bg-gray-300 dark:bg-gray-700 rounded-xl w-full mb-8"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/5 mb-8"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="h-64 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
          <div className="h-80 bg-gray-300 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    });
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-700 dark:to-indigo-900 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Welcome back, {user?.name || 'Organizer'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your events and track volunteer engagement
        </p>
      </div>

      {/* My Events Summary */}
      <div>
        <SectionTitle
          subHeading="Event Management"
          heading="My Events Summary"
          variant="dashboard"
          alignment="left"
        //   description="Overview of your event portfolio by status"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
          
          {/* Upcoming Events */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow border-l-4 border-blue-500 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Upcoming Events</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {organizerStats?.eventStats?.upcoming || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">Ready to go</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Completed Events */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow border-l-4 border-green-500 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Completed Events</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {organizerStats?.eventStats?.completed || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">Successfully run</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Cancelled Events */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow border-l-4 border-red-500 dark:border-red-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">Cancelled Events</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {organizerStats?.eventStats?.cancelled || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">Not completed</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-red-600 dark:bg-red-400" />
              </div>
            </div>
          </div>

          {/* My Volunteer Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow border-l-4 border-purple-500 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">As Volunteer</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {organizerStats?.registeredEventsCount || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">Events joined</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column - Activities and Deadlines */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Upcoming Deadlines */}
          <div>
            <SectionTitle
              subHeading="Event Schedule"
              heading="Upcoming Deadlines"
              variant="dashboard"
              alignment="left"
              description="Your upcoming events sorted by date"
            />
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 mt-6">
              {organizerStats?.upcomingDeadlines?.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {organizerStats.upcomingDeadlines.map((event, index) => (
                    <div key={event._id || index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{event.title}</h4>
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                              Upcoming
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{event.volunteers?.length || 0}/{event.requiredVolunteers}</span>
                            </div>
                          </div>
                        </div>
                        <Link 
                          to={`/dashboard/manageVolunteers/${event._id}`}
                          className="ml-4 px-3 py-1 bg-[#FF6B00] text-white rounded-lg hover:bg-[#E55A00] text-sm transition-colors flex-shrink-0"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-500" />
                  <p className="font-medium">No upcoming events</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Create your first event to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Volunteer Activity */}
          <div>
            <SectionTitle
              subHeading="Live Updates"
              heading="Recent Volunteer Activity"
              variant="dashboard"
              alignment="left"
              description="Latest registrations and activities on your events"
            />
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 mt-6">
              {organizerStats?.recentActivity?.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {organizerStats.recentActivity.slice(0, 6).map((activity, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors dark:hover:bg-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                          <UserPlus className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {activity.volunteerName} joined your event
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                            {activity.eventTitle} • {formatTimeAgo(activity.registeredAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-300">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-500" />
                  <p className="font-medium">No recent volunteer activity</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Volunteer registrations will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions and Performance */}
        <div className="xl:bg-gray-50 dark:xl:bg-gray-900  xl:pl-8 xl:pb-6  space-y-6">
          
          {/* Quick Actions */}
          <div>
            <SectionTitle
              subHeading="Actions"
              heading="Quick Access"
              variant="dashboard"
              alignment="left"
              description="Common organizer tasks"
            />
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 mt-6">
              <div className="space-y-3">
                <Link
                  to="/dashboard/addEvent"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#FF6B00] dark:bg-orange-600 text-white rounded-lg hover:bg-[#E55A00] dark:hover:bg-orange-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Event</span>
                </Link>
                
                <Link
                  to="/dashboard/manageEvents"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-50 dark:bg-gray-700  text-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>My Events</span>
                </Link>
                
                <Link
                  to="/dashboard/registeredEvents"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>My Registrations</span>
                </Link>
                
                <Link
                  to="/dashboard/manageVolunteers"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Manage Volunteers</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div>
            <SectionTitle
              subHeading="Performance"
              heading="Your Impact"
              variant="dashboard"
              alignment="left"
              description="Your contribution as an organizer"
            />
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Events</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                    {(organizerStats?.eventStats?.upcoming || 0) + 
                     (organizerStats?.eventStats?.completed || 0) + 
                     (organizerStats?.eventStats?.cancelled || 0)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Events</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 text-lg">
                    {organizerStats?.eventStats?.upcoming || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate</span>
                  <span className="font-semibold text-green-600 dark:text-green-400 text-lg">
                    {organizerStats?.eventStats?.completed > 0 
                      ? Math.round((organizerStats.eventStats.completed / 
                          ((organizerStats.eventStats.upcoming || 0) + 
                           (organizerStats.eventStats.completed || 0) + 
                           (organizerStats.eventStats.cancelled || 0))) * 100)
                      : 0}%
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">You also volunteer for</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400 text-lg">
                      {organizerStats?.registeredEventsCount || 0} events
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips for Organizers */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-700 dark:to-indigo-900 rounded-xl border border-blue-200 dark:border-blue-700 p-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center">
              <Trophy className="w-4 h-4 mr-2" />
              Organizer Tips
            </h4>
            <div className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
              <p>• Promote your events early to attract more volunteers</p>
              <p>• Keep event details updated and clear</p>
              <p>• Engage with your volunteers regularly</p>
              <p>• Don't forget to mark attendance after events!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;