import { CheckCircle, UserCheck, UserX } from "lucide-react";
import { useState } from "react";
import AttendanceModal from "./AttendanceModal";

const VolunteerCard = ({ volunteer, eventDate, onRemove, onMarkPresent, markPresentButton, eventTitle,isMarking }) => {
  //state
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [modalAction, setModalAction] = useState('present');

  const isEventToday = new Date(eventDate).getUTCDate() === new Date().getUTCDate() &&
                     new Date(eventDate).getUTCMonth() === new Date().getUTCMonth() &&
                     new Date(eventDate).getUTCFullYear() === new Date().getUTCFullYear();
  const isEventPast = new Date(eventDate) < new Date();

  //functions to handle
  const handleMarkPresentClick = () => {
    setModalAction('present');
    setShowAttendanceModal(true);
  };

  const handleMarkNotPresentClick = () => {
    setModalAction('notPresent');
    setShowAttendanceModal(true);
  };

  const handleConfirm = (volunteer) => {
    if (modalAction === 'present') {
      onMarkPresent(volunteer, true);
    } else {
      onMarkPresent(volunteer, false);
    }
    setShowAttendanceModal(false);
  };

  const handleCancel = () => {
    setShowAttendanceModal(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 py-2 pl-2 pr-1 sm:p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between relative">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {volunteer.name?.charAt(0) || 'V'}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{volunteer.name}</h4>
            <p className="text-sm text-gray-600 truncate">{volunteer.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              RegisteredAt: {volunteer?.registeredAt ? new Date(volunteer?.registeredAt).toLocaleDateString() : 'unknown'}
            </p>
            
            {volunteer.isPresent && (
              <div className="flex items-center mt-2">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-green-600 font-medium">Present</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-wrap absolute justify-center right-0 sm:static  items-end  space-y-2 sm:space-x-2 ml-4">
          {(isEventToday || isEventPast) && !volunteer.isPresent && markPresentButton && (
            <button
              onClick={handleMarkPresentClick}
              className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-lg hover:bg-green-200 transition-colors text-sm"
              title="Mark Present"
            >
              {
                isMarking===volunteer.email ? (
                <span className="flex items-center">
                    <svg className="animate-spin h-4 w-4 text-green-800 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline">Updating...</span>
                </span>
            ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Mark Present</span>
                </>
            )}
            </button>
          )}
          {(isEventToday || isEventPast) && volunteer.isPresent && markPresentButton && (
            <button
                onClick={handleMarkNotPresentClick}
                className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 sm:px-3 py-1 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                title="Mark Not Present"
              >
                {
                  isMarking===volunteer?.email ? (
                  <span className="flex items-center">
                      <svg className="animate-spin h-4 w-4 text-yellow-800 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Updating...</span>
                  </span>
              ) : (
                <>
                  <UserX className="w-4 h-4" />
                  <span className="hidden sm:inline">Mark Absent</span>
                </>
              )}
            </button>
          )}
          
          <button
            onClick={() => onRemove(volunteer)}
            className="flex items-center space-x-1 bg-red-100 text-red-800 px-2 sm:px-3 py-1 rounded-lg hover:bg-red-200 transition-colors text-sm"
            title="Remove Volunteer"
          >
            <UserX className="w-4 h-4" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
      <AttendanceModal
        isOpen={showAttendanceModal}
        volunteer={volunteer}
        eventTitle={eventTitle}
        action={modalAction}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default VolunteerCard;