import useRole from '../../../hooks/useRole';
import useUser from '../../../hooks/useUser';
import AdminDashboard from './AdminDashboard';
// import AdminDashboard from './components/AdminDashboard';
import OrganizerDashboard from './OrganizerDashboard';
import VolunteerDashboard from './VolunteerDashboard';
// import VolunteerDashboard from './components/VolunteerDashboard';

const DashboardHome = () => {
  const [role] = useRole();
  const [dbUser, isLoading] = useUser();

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-28 bg-gray-300 dark:bg-gray-700 rounded-xl w-full mb-8"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/5 mb-8"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (role) {
      case 'admin':
        return <AdminDashboard user={dbUser} />;
      case 'organizer':
        return <OrganizerDashboard user={dbUser} />;
      case 'volunteer':
      default:
        return <VolunteerDashboard user={dbUser} />;
    }
  };

  return (
    <div className="p-4 lg:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default DashboardHome;