import { Activity, Shield } from "lucide-react";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import SystemAccessSummary from "./SystemAccessSummary";

const AdminSection = ({ user }) => {
  const mockActivityLog = [
    { action: 'Approved organizer request', user: 'John Doe', time: '2 hours ago' },
    { action: 'Updated event status', event: 'Beach Cleanup', time: '5 hours ago' },
    { action: 'Created new user account', user: 'Jane Smith', time: '1 day ago' },
  ];

  const axiosSecure = useAxiosSecure();

  const { data: activityLog = [], isLoading } = useQuery({
    queryKey: ['adminActivityLog'],
    queryFn: async () => {
      const res = await axiosSecure.get('/activities');
      return res.data;
    },
  });

  // Helper function to get the correct name or title from the target object
  const getTargetName = (activity) => {
    switch (activity.target.type) {
      case 'event':
        return activity.target.title;
      case 'user':
        return activity.target.name;
      case 'volunteer':
        return activity.target.volunteerName;
      case 'comment':
        return `Comment by ${activity.target.userName || 'a user'}`;
      default:
        return 'N/A';
      }
  };

  return (
    <>
      {/* Admin Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-3 sm:p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <SectionTitle 
          subHeading="Access Level"
          heading="Administrator Privileges"
          variant="dashboard"
          alignment="left"
        />
        
        <div className="flex items-center space-x-3">
          <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
            <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">System Administrator</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Full access to all platform features and user management</p>
          </div>
        </div>
      </div>
      
      {/* System access summary */}
      <SystemAccessSummary user={user}/>

      {/* Activity Log */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-3 sm:p-6 border border-gray-200 dark:border-gray-700">
        <SectionTitle 
          subHeading="Recent Actions"
          heading="Activity Log"
          variant="dashboard"
          alignment="left"
        />
        {
          isLoading ?
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 flex items-center justify-center min-h-[150px]">
            <div className="flex flex-col items-center">
              <svg
                className="animate-spin h-8 w-8 text-[#FF6B00]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div> :
        <div className="space-y-4">
          {activityLog.length > 0 ? (
            activityLog.map((activity) => (
              <div key={activity._id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Activity className="w-5 h-5 text-[#FF6B00]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.action}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {getTargetName(activity)} • {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No recent activity.</p>
          )}
        </div>
        }
      </div>
    </>
  );
};
export default AdminSection;