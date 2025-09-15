import { Shield, Users, Calendar, MessageSquare, Settings, Eye, CheckCircle } from "lucide-react";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";

const SystemAccessSummary = ({ user }) => {
  // Admin privileges and permissions
  const adminPermissions = [
    {
      category: "User Management",
      icon: Users,
      permissions: [
        { name: "View all users", granted: true },
        { name: "Promote users to organizer", granted: true },
        { name: "Suspend user accounts", granted: true },
        { name: "Delete user accounts", granted: true }
      ],
      color: "blue"
    },
    {
      category: "Event Management",
      icon: Calendar,
      permissions: [
        { name: "View all events", granted: true },
        { name: "Cancel any event", granted: true },
        { name: "Manage event volunteers", granted: true },
        { name: "Override event settings", granted: true }
      ],
      color: "green"
    },
    {
      category: "Content Moderation",
      icon: MessageSquare,
      permissions: [
        { name: "Approve/reject reviews", granted: true },
        { name: "Moderate comments", granted: true },
        { name: "Manage reported content", granted: true },
        { name: "Send platform notifications", granted: true }
      ],
      color: "purple"
    },
    {
      category: "System Administration",
      icon: Settings,
      permissions: [
        { name: "Access activity logs", granted: true },
        { name: "Manage platform settings", granted: true },
        { name: "Export user data", granted: true },
        { name: "System maintenance mode", granted: true }
      ],
      color: "orange"
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200"
      },
      green: {
        bg: "bg-green-100",
        text: "text-green-600",
        border: "border-green-200"
      },
      purple: {
        bg: "bg-purple-100",
        text: "text-purple-600",
        border: "border-purple-200"
      },
      orange: {
        bg: "bg-orange-100",
        text: "text-orange-600",
        border: "border-orange-200"
      }
    };
    return colorMap[color];
  };

  const totalPermissions = adminPermissions.reduce((total, category) => total + category.permissions.length, 0);
  const grantedPermissions = adminPermissions.reduce((total, category) => 
    total + category.permissions.filter(p => p.granted).length, 0
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
      <SectionTitle 
        subHeading="Administrator Access"
        heading="System Permissions"
        variant="dashboard"
        alignment="left"
        // description="Your current access level and permissions across EventUp"
      />

      {/* Access Level Overview */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Full Administrator</h3>
                <p className="text-gray-600">Complete platform access and control</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-3xl font-bold text-red-600">{grantedPermissions}</div>
              <div className="text-sm text-gray-600">of {totalPermissions} permission</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Access Level</span>
              <span className="font-medium text-gray-900">100%</span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full w-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Categories */}
      <div className="space-y-6">
        {adminPermissions.map((category, index) => {
          const Icon = category.icon;
          const colors = getColorClasses(category.color);
          const categoryGranted = category.permissions.filter(p => p.granted).length;
          const categoryTotal = category.permissions.length;
          
          return (
            <div key={index} className={`border rounded-xl p-4 sm:p-6 ${colors.border} bg-gray-50`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{category.category}</h4>
                    <p className="text-sm text-gray-600">
                      {categoryGranted} of {categoryTotal} permissions granted
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {category.permissions.map((permission, permIndex) => (
                  <div key={permIndex} className="flex items-center space-x-3 bg-white rounded-lg p-3 border border-gray-200">
                    <div className={`p-1 rounded-full ${permission.granted ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <CheckCircle className={`w-4 h-4 ${permission.granted ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <span className={`text-sm ${permission.granted ? 'text-gray-900' : 'text-gray-500'}`}>
                      {permission.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Notice */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Shield className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Security Reminder:</p>
            <p>As a system administrator, your account has elevated privileges. Please ensure you:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Use a strong, unique password</li>
              <li>Enable two-factor authentication when available</li>
              <li>Log out from shared or public devices</li>
              <li>Report any suspicious activity immediately</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAccessSummary;