import { AlertTriangle, Bell, CheckCircle, MessageCircle, XCircle } from "lucide-react";

const NotificationIcon = ({ type }) => {
  const iconConfig = {
      warning: { Icon: AlertTriangle, className: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900' },
      sorry: { Icon: XCircle, className: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900' },
      success: { Icon: CheckCircle, className: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900' },
      neutral: { Icon: MessageCircle, className: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900' },
      default: { Icon: Bell, className: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800' }
  };

  const config = iconConfig[type] || iconConfig.default;
  const { Icon, className } = config;

  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${className}`}>
      <Icon className="w-5 h-5" />
    </div>
  );
};
export default NotificationIcon;