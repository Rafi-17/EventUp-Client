import React from 'react';
import { Users, Calendar, UserPlus, Activity, AlertTriangle, CheckCircle, Shield, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';

const AdminDashboard = ({ user }) => {
  const axiosSecure = useAxiosSecure();

  const { data: adminStats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await axiosSecure.get('/admin-stats');
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="h-64 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
          <div className="h-80 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getActivityIcon = (action) => {
    if (action.includes('user') || action.includes('User')) return <Users className="w-4 h-4" />;
    if (action.includes('event') || action.includes('Event')) return <Calendar className="w-4 h-4" />;
    if (action.includes('organizer') || action.includes('Organizer')) return <UserPlus className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getTargetName = (activity) => {
    switch (activity.target?.type) {
      case 'event':
        return activity.target.title;
      case 'user':
        return activity.target.name;
      case 'volunteer':
        return activity.target.volunteerName;
      case 'comment':
        return `Comment by ${activity.target.userName || 'a user'}`;
      default:
        return 'System';
    }
  };

  const pendingCard = (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow border-l-4 border-orange-500 dark:border-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {adminStats?.pendingRequests || 0}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 font-medium">
                  {adminStats?.pendingRequests > 0 ? 'Needs attention' : 'All clear'}
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
                <UserPlus className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
  )

  return (
    <div className="space-y-8">
      
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-700 dark:to-orange-900 rounded-xl p-6 border border-red-200 dark:border-red-700">
        <div className="flex items-center space-x-4">
          <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
            <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Welcome back, {user?.name || 'Admin'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor platform health and manage system operations
            </p>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div>
        <SectionTitle
          subHeading="Platform Overview"
          heading="System Statistics"
          variant="dashboard"
          alignment="left"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          
          {/* Total Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow border-l-4 border-blue-500 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {adminStats?.totalUsers || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Excluding admins</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Total Events */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow border-l-4 border-green-500 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Total Events</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {adminStats?.totalEvents || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All time events</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Pending Organizer Requests */}
          {
            adminStats?.pendingRequests > 0 ?
            <Link to="/dashboard/allUsers">
                {pendingCard}
            </Link> :
            <div>
                {pendingCard}
            </div>
          }

          {/* Active Organizers */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow border-l-4 border-purple-500 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Active Organizers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {adminStats?.activeOrganizers || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Approved users</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column - Activity and Users */}
        <div className="xl:col-span-2 xl:bg-gray-50 dark:xl:bg-gray-900 xl:bg-opacity-50 xl:rounded-xl xl:p-6 space-y-8">
          
          {/* Recent System Activity */}
          <div>
            <SectionTitle
              subHeading="Platform Activity"
              heading="Recent System Activity"
              variant="dashboard"
              alignment="left"
              description="Latest actions and events across the platform"
            />
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 mt-6">
              {adminStats?.recentActivity?.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {adminStats.recentActivity.map((activity, index) => (
                    <div key={activity._id || index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="bg-[#FF6B00] bg-opacity-10 dark:bg-opacity-20 p-2 rounded-full text-[#FF6B00]">
                          {getActivityIcon(activity.action)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {getTargetName(activity)} • {formatTimeAgo(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="font-medium">No recent activity</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Platform activities will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent User Registrations */}
          <div>
            <SectionTitle
              subHeading="User Management"
              heading="Recent Registrations"
              variant="dashboard"
              alignment="left"
              description="New users who joined in the last 7 days"
            />
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 mt-6">
              {adminStats?.recentUsers?.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {adminStats.recentUsers.map((newUser, index) => (
                    <div key={newUser._id || index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                            <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{newUser.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{newUser.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            newUser.role === 'organizer' 
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' 
                              : newUser.role === 'pending-organizer'
                              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
                              : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                          }`}>
                            {newUser.role === 'pending-organizer' ? 'Pending' : newUser.role}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatTimeAgo(newUser.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl">
                  <UserPlus className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="font-medium">No recent registrations</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">New user registrations will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions and Controls */}
        <div className="space-y-6">
          
          {/* Urgent Actions */}
          {adminStats?.pendingRequests > 0 && (
            <div>
              <SectionTitle
                subHeading="Action Required"
                heading="Urgent Tasks"
                variant="dashboard"
                alignment="left"
                description="Items that need immediate attention"
              />
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-orange-200 dark:border-orange-700 p-6 mt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full">
                    <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Organizer Requests</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{adminStats.pendingRequests} pending approval</p>
                  </div>
                </div>
                <Link
                  to="/dashboard/allUsers"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 dark:bg-orange-700 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-800 transition-colors font-medium"
                >
                  <Eye className="w-4 h-4" />
                  <span>Review Now</span>
                </Link>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <SectionTitle
              subHeading="Admin Tools"
              heading="Quick Actions"
              variant="dashboard"
              alignment="left"
              description="Common administrative tasks"
            />
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4 mt-6">
              <div className="space-y-3">
                <Link
                  to="/dashboard/allUsers"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#FF6B00] dark:bg-orange-600 text-white rounded-lg hover:bg-[#E55A00] dark:hover:bg-orange-700 transition-colors font-medium"
                >
                  <Users className="w-4 h-4" />
                  <span>Manage Users</span>
                </Link>
                
                <Link
                  to="/dashboard/manageEvents"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Manage Events</span>
                </Link>
                
                <Link
                  to="/dashboard/addEvent"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Event</span>
                </Link>

                <Link
                  to="/dashboard/notifications"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Activity className="w-4 h-4" />
                  <span>View Notifications</span>
                </Link>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 rounded-xl border border-green-200 dark:border-green-700 p-6">
            <h4 className="font-semibold text-green-900 dark:text-green-200 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              System Health
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-800 dark:text-green-300">Platform Status</span>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-800 dark:text-green-300">Active Users</span>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">{adminStats?.totalUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-800 dark:text-green-300">Success Rate</span>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  {adminStats?.pendingRequests === 0 ? '100%' : '99%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;