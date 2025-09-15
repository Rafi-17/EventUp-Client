import { Briefcase, Calendar, Edit3, Save, Star, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";

const OrganizerSection = ({ user, isEditing, onEdit, onSave, onCancel, formData, setFormData, isSaving }) => {
  const [notificationPrefs, setNotificationPrefs] = useState({
    newVolunteers: true,
    eventReminders: true,
    platformUpdates: false
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditOptions, setShowEditOptions] = useState(false);

  const hasOrganizationInfo = user?.organizationName && user?.organizationName !== 'Solo Organizer';
  const isSoloOrganizer = user?.organizationName === 'Solo Organizer';

  const handleSoloOrganizerClick = () => {
    setShowConfirmModal(true);
  };

  const confirmSoloOrganizer = () => {
    // Pass a specific flag to the parent onSave handler
    onSave({ isSoloOrganizer: true });
    setShowConfirmModal(false);
    setShowEditOptions(false);
};

  // Reset edit options when editing state changes
  useEffect(() => {
    if (!isEditing) {
      setShowEditOptions(false);
    }
  }, [isEditing]);

  const handleShowEditOptions = () => {
    setShowEditOptions(true);
  };

  const handleStartFormEdit = () => {
    onEdit();
    setShowEditOptions(false);
  };

  const handleCancelEditOptions = () => {
    setShowEditOptions(false);
  };

  return (
    <div className="mt-8">
      {/* Organization Info */}
      {isSaving ?
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex items-center justify-center min-h-[150px]">
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="mt-4 text-gray-600 font-medium">Saving...</p>
      </div>
    </div> :
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <SectionTitle
            subHeading="Organization"
            heading="Organization Information"
            variant="dashboard"
            alignment="left"
          />

          {/* Action Buttons */}
          {!isEditing && !showEditOptions && hasOrganizationInfo && (
            <button
              onClick={handleShowEditOptions}
              className="flex items-center space-x-2 text-[#FF6B00] hover:text-[#E55A00] transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:block">Edit</span>
            </button>
          )}

          {!isEditing && !showEditOptions && isSoloOrganizer && (
            <button
              onClick={onEdit}
              className="flex items-center space-x-1 bg-[#FF6B00] text-white px-3 py-1 rounded-lg hover:bg-[#E55A00] transition-colors text-sm"
            >
              <Briefcase className="w-4 h-4" />
              <span className="sm:hidden">Add</span>
              <span className="hidden sm:block">Add Organization</span>
            </button>
          )}

          {isEditing && (
            <div className="flex space-x-2">
              <button
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center space-x-1 bg-[#FF6B00] text-white px-3 py-1 rounded-lg hover:bg-[#E55A00] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:block">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:block">Save</span>
                  </>
                )}
              </button>
              <button
                onClick={onCancel}
                disabled={isSaving}
                className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:block">Cancel</span>
              </button>
            </div>
          )}

          {showEditOptions && (
            <button
              onClick={handleCancelEditOptions}
              className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:block">Cancel</span>
            </button>
          )}
        </div>
        
        {isEditing ? (
          // Editing Form
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
              <input
                type="text"
                value={formData.organizationName || ''}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none"
                placeholder="Enter organization name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.organizationDescription || ''}
                onChange={(e) => setFormData({ ...formData, organizationDescription: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none"
                rows="4"
                placeholder="Describe your organization's mission and purpose"
              />
            </div>
          </div>
        ) : showEditOptions ? (
          // Options to edit or become a solo organizer
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 text-center sm:text-left mb-4">What would you like to do?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleSoloOrganizerClick}
                className="flex items-center justify-center space-x-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm"
              >
                <Users className="w-4 h-4" />
                <span>I am a solo organizer</span>
              </button>
              <button
                onClick={handleStartFormEdit}
                className="flex items-center justify-center space-x-2 bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#E55A00] transition-colors text-sm"
              >
                <Briefcase className="w-4 h-4" />
                <span>Edit organization info</span>
              </button>
            </div>
          </div>
        ) : hasOrganizationInfo ? (
          // Displaying Organization Info
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
              <p className="text-gray-900 font-medium">{user?.organizationName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <p className="text-gray-600 leading-relaxed">
                {user?.organizationDescription || 'No description provided'}
              </p>
            </div>
          </div>
        ) : isSoloOrganizer ? (
          // Displaying Solo Organizer Status
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <p className="font-medium text-blue-800">Solo Organizer</p>
            </div>
            <p className="text-blue-700 text-sm">
              You are currently registered as a solo organizer. You can add organization details anytime.
            </p>
          </div>
        ) : (
          // Initial State - No organization info
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 mb-4">No organization information provided yet.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleSoloOrganizerClick}
                className="flex items-center justify-center space-x-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm"
              >
                <Users className="w-4 h-4" />
                <span>I am a solo organizer</span>
              </button>
              <button
                onClick={onEdit}
                className="flex items-center justify-center space-x-2 bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#E55A00] transition-colors text-sm"
              >
                <Briefcase className="w-4 h-4" />
                <span>Add organization</span>
              </button>
            </div>
          </div>
        )}
      </div>}

      {/* Confirmation Modal for Solo Organizer */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[990] p-4">
          <div className="relative p-6 bg-white rounded-xl shadow-xl w-11/12 md:w-1/3 max-w-md mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900 mb-2">
                Confirm Solo Organizer Status
              </h3>
              <p className="text-xs text-justify sm:text-\ sm:text-sm text-gray-500 mb-6">
                Are you sure you want to proceed as a solo organizer? This will remove any existing organization information.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSoloOrganizer}
                  className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#E55A00] transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Metrics */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6 mb-8">
        <SectionTitle 
          subHeading="Performance"
          heading="Event Metrics"
          variant="dashboard"
          alignment="left"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-[#FF6B00] bg-opacity-10 rounded-lg">
            <Calendar className="w-8 h-8 text-[#FF6B00] mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{user?.totalEvents || 0}</div>
            <div className="text-sm text-gray-600">Total Events</div>
          </div>
          <div className="text-center p-4 bg-green-100 rounded-lg">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{user?.totalVolunteers || 0}</div>
            <div className="text-sm text-gray-600">Volunteers Managed</div>
          </div>
          <div className="text-center p-4 bg-yellow-100 rounded-lg">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{user?.averageRating || 'N/A'}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
        <SectionTitle 
          subHeading="Communication"
          heading="Notification Preferences"
          variant="dashboard"
          alignment="left"
        />
        
        <div className="space-y-4">
          {Object.entries(notificationPrefs).map(([key, value]) => (
            <div key={key} className="flex items-start sm:items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex-1 min-w-0 mr-4">
                <p className="font-medium text-gray-900 mb-1">
                  {key === 'newVolunteers' && 'New Volunteer Registrations'}
                  {key === 'eventReminders' && 'Event Reminders'}
                  {key === 'platformUpdates' && 'Platform Updates'}
                </p>
                <p className="text-sm text-gray-600">
                  {key === 'newVolunteers' && 'Get notified when volunteers register for your events'}
                  {key === 'eventReminders' && 'Receive reminders about upcoming events'}
                  {key === 'platformUpdates' && 'Stay updated with new features and announcements'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotificationPrefs({ ...notificationPrefs, [key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6B00] peer-focus:ring-opacity-25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizerSection;
