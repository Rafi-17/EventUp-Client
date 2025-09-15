import { AlertTriangle, Bell, CheckCircle, MessageCircle, XCircle } from "lucide-react";

const NotificationIcon = ({ type }) => {
  const iconConfig = {
    warning: { Icon: AlertTriangle, className: 'text-yellow-600 bg-yellow-100' },
    sorry: { Icon: XCircle, className: 'text-red-600 bg-red-100' },
    success: { Icon: CheckCircle, className: 'text-green-600 bg-green-100' },
    neutral: { Icon: MessageCircle, className: 'text-blue-600 bg-blue-100' },
    default: { Icon: Bell, className: 'text-gray-600 bg-gray-100' }
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