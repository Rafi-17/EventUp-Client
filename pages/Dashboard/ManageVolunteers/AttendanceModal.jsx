import { UserCheck, UserX, X } from "lucide-react";

const AttendanceModal = ({ isOpen, volunteer, eventTitle, action, onConfirm, onCancel }) => {
  if (!isOpen || !volunteer) return null;

  const config = {
    present: {
      title: "Mark Present",
      icon: UserCheck,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      alertBg: "bg-green-50",
      alertBorder: "border-green-200",
      alertTextMain: "text-green-800",
      alertTextSub: "text-green-600",
      buttonBg: "bg-green-600 hover:bg-green-700",
      message: "Mark this volunteer as present?",
      description: `This will record their attendance for "${eventTitle}"`,
      note: "This action will be recorded in the attendance log. You can change this later if needed."
    },
    notPresent: {
      title: "Mark Not Present",
      icon: UserX,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      alertBg: "bg-yellow-50",
      alertBorder: "border-yellow-200",
      alertTextMain: "text-yellow-800",
      alertTextSub: "text-yellow-600",
      buttonBg: "bg-yellow-600 hover:bg-yellow-700",
      message: "Mark this volunteer as not present?",
      description: `This will update their attendance status for "${eventTitle}"`,
      note: "This will remove their \"Present\" status from the attendance record. You can mark them present again if needed."
    }
  };

  const currentConfig = config[action] || config.present;
  const Icon = currentConfig.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${currentConfig.iconBg} rounded-full flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${currentConfig.iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{currentConfig.title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-semibold">
              {volunteer.name?.charAt(0) || 'V'}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{volunteer.name}</h4>
              <p className="text-sm text-gray-600">{volunteer.email}</p>
            </div>
          </div>

          <div className={`${currentConfig.alertBg} ${currentConfig.alertBorder} border rounded-lg p-4 mb-6`}>
            <div className="flex items-start space-x-3">
              <Icon className={`w-5 h-5 ${currentConfig.iconColor} mt-0.5`} />
              <div>
                <p className={`text-sm font-medium ${currentConfig.alertTextMain}`}>
                  {currentConfig.message}
                </p>
                <p className={`text-sm ${currentConfig.alertTextSub} mt-1`}>
                  {currentConfig.description}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> {currentConfig.note}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(volunteer)}
            className={`px-4 py-2 ${currentConfig.buttonBg} text-white rounded-lg transition-colors font-medium flex items-center space-x-2`}
          >
            <Icon className="w-4 h-4" />
            <span>{currentConfig.title}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default AttendanceModal;