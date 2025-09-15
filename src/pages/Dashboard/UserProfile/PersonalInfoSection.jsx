import { Camera, Edit3, Mail, Save, X } from "lucide-react";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import { useState } from "react";

const PersonalInfoSection = ({ 
  user, 
  isEditing, 
  formData, 
  setFormData, 
  onEdit, 
  onSave, 
  onCancel, 
  isSaving,
  onImageSelect,
  imagePreview,
  role,
  requestLoading,
  handleOrganizerRequest
}) => {
  //state
  const handleSave = (e) => {
    e.preventDefault(); // Stop the page from reloading
    onSave(); // Call the original save function
  };
  return (
    <div className="bg-white rounded-xl shadow-sm py-3 px-3 sm:p-6 mb-8">
      <div className="flex items-center justify-between mb-10">
        <SectionTitle
          subHeading="Profile"
          heading="Personal Information"
          variant="dashboard"
          alignment="left"
          description="Update your personal details and contact information"
        />
        {!isEditing ? (
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 text-[#FF6B00] hover:text-[#E55A00] transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:block">Edit</span>
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
            type="submit"
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
      </div>

      <div className="flex flex-col lg:items-start lg:flex-row gap-8">
        {/* Profile Picture */}
        <div className="flex flex-col  items-center">
          <div className="relative">
            <img 
              src={imagePreview || user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=FF6B00&color=fff&size=128`}
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {isEditing && (
              <>
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={onImageSelect}
                  className="hidden"
                />
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-gray-600" />
                </label>
              </>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            {isEditing ? 'Click to change photo' : 'Profile photo'}
          </p>

          {/* Role field */}
          <div className="md:col-span-2 mt-2">
            <div className="flex flex-col space-y-2 items-center justify-between">
              <div className="flex flex-col items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  role === 'organizer' ? 'bg-blue-100 text-blue-800' :
                  // role === 'pending-organizer' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {role === 'pending-organizer' ? 'Volunteer' : role}
                </span>
              </div>
              
              {(role === 'volunteer' || role === 'pending-organizer') && (
                <button
                  type="button"
                  onClick={handleOrganizerRequest}
                  disabled={requestLoading}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    role === 'pending-organizer'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-[#FF6B00] text-white hover:bg-[#E55A00]'
                  } disabled:opacity-50`}
                >
                  {requestLoading ? 'Processing...' : 
                  role === 'pending-organizer' ? 'Cancel Organizer Request' : 'Request to be Organizer'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={(e) => {e.preventDefault(); onSave();}} className="flex-1 grid grid-cols-1 md:grid-cols-2 justify-center px-0 sm:px-8 lg:px-0 gap-4 sm:gap-6">
          <div className="">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none"
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-gray-900 py-2">{user?.name || 'Not provided'}</p>
            )}
          </div>

          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div className="">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none"
                placeholder="Enter phone number"
              />
            ) : (
              <p className="text-gray-900 py-2">{user?.phone || 'Not provided'}</p>
            )}
          </div>

          <div className="">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none"
                placeholder="Enter your address"
              />
            ) : (
              <p className="text-gray-900 py-2">{user?.address || 'Not provided'}</p>
            )}
          </div>
          {/* User Role */}
          {/* <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  role === 'organizer' ? 'bg-blue-100 text-blue-800' :
                  role === 'pending-organizer' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {role === 'pending-organizer' ? 'Pending Organizer' : role}
                </span>
                {role === 'pending-organizer' && (
                  <span className="text-xs text-yellow-600">
                    Request pending admin approval
                  </span>
                )}
                {role === 'volunteer' && (
                  <span className="text-xs text-gray-500">
                    Want to organize events?
                  </span>
                )}
              </div>
              
              {(role === 'volunteer' || role === 'pending-organizer') && (
                <button
                  type="button"
                  onClick={handleOrganizerRequest}
                  disabled={requestLoading}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    role === 'pending-organizer'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-[#FF6B00] text-white hover:bg-[#E55A00]'
                  } disabled:opacity-50`}
                >
                  {requestLoading ? 'Processing...' : 
                  role === 'pending-organizer' ? 'Cancel Request' : 'Request to be Organizer'}
                </button>
              )}
            </div>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default PersonalInfoSection;