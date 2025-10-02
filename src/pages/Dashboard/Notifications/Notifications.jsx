import { useMemo, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, Search } from "lucide-react";
import FilterNotificationTabs from "./FilterNotificationTabs";
import NotificationCard from "./NotificationCard";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import toast from "react-hot-toast";
import useTheme from "../../../hooks/useTheme";

const Notifications = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const {darkMode} = useTheme();
  
  // State
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch all notifications (both read and unread)
  const { data: allNotifications = [], isLoading, refetch } = useQuery({
    queryKey: ['notifications-all', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/notifications/all/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Calculate counts for filter tabs
  const counts = useMemo(() => {
    return {
      all: allNotifications.length,
      unread: allNotifications.filter(n => !n.read).length,
      warning: allNotifications.filter(n => n.type === 'warning').length,
      sorry: allNotifications.filter(n => n.type === 'sorry').length,
      success: allNotifications.filter(n => n.type === 'success').length,
      neutral: allNotifications.filter(n => n.type === 'neutral').length
    };
  }, [allNotifications]);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return allNotifications.filter(notification => {
      const matchesFilter = activeFilter === 'all' || 
        (activeFilter === 'unread' ? !notification.read : notification.type === activeFilter);
      
      const matchesSearch = searchTerm === '' ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.reason?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });
  }, [allNotifications, activeFilter, searchTerm]);

  // Handle mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await axiosSecure.patch(`/notifications/markAsRead/${notificationId}`);
      refetch();
      queryClient.invalidateQueries(['unread-notifications', user?.email]);
      toast.success('Notification marked as read', { position: 'top-right',
        style: {
          background: darkMode ? '#1F2937' : 'white',
          color: darkMode ? '#F9FAFB' : '#111827',
        },
       });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark as read', { position: 'top-right',
        style: {
          background: darkMode ? '#1F2937' : 'white',
          color: darkMode ? '#F9FAFB' : '#111827',
        },
       });
    }
  };

  // Handle delete notification
  const handleDelete = async (notificationId) => {
    try {
        await axiosSecure.delete(`/notifications/${notificationId}`);
        refetch();
        toast.success('Notification deleted', { position: 'top-right',
          style: {
          background: darkMode ? '#1F2937' : 'white',
          color: darkMode ? '#F9FAFB' : '#111827',
        },
         });
    } catch (error) {
        console.error('Error deleting notification:', error);
        toast.error('Failed to delete notification', { position: 'top-right',
          style: {
          background: darkMode ? '#1F2937' : 'white',
          color: darkMode ? '#F9FAFB' : '#111827',
        },
         });
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    if (counts.unread === 0) return;
    
    try {
      await axiosSecure.patch(`/notifications/markAllAsRead/${user.email}`);
      refetch();
      toast.success(`${counts.unread} notifications marked as read`, { position: 'top-right',
        style: {
          background: darkMode ? '#1F2937' : 'white',
          color: darkMode ? '#F9FAFB' : '#111827',
        },
       });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all as read', { position: 'top-right',
        style: {
          background: darkMode ? '#1F2937' : 'white',
          color: darkMode ? '#F9FAFB' : '#111827',
        },
       });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4 sm:p-4 lg:p-6 xl:px-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <SectionTitle 
            subHeading="Notifications"
            heading={`${counts.unread > 0 
                ? `You have ${counts.unread} unread notification${counts.unread > 1 ? 's' : ''}`
                : 'You\'re all caught up!'
              }`}
              variant="dashboard"
              alignment="left"
              icon={<Bell className="w-6 h-6 text-[#FF6B00]" />}
              className="my-0 lg:my-6"
          />
          
          {counts.unread > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center space-x-2 bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#E55A00] transition-colors self-start sm:self-auto"
            >
              <Check className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <FilterNotificationTabs 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {searchTerm 
                ? 'No notifications found' 
                : activeFilter === 'all'
                  ? 'No notifications yet'
                  : `No ${activeFilter} notifications`
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'When you have notifications, they\'ll appear here'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredNotifications.length} of {allNotifications.length} notifications
        </div>
      </div>
    </div>
  );
};

export default Notifications;