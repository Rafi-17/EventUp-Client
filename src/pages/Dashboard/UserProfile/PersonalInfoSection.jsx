import { AlertTriangle, Camera, Edit3, Mail, Save, X } from "lucide-react";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import defaultImg from '../../../assets/Profile/defaultProfile.png'
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md py-3 px-3 sm:p-6 mb-8 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2 sm:mb-6">
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
            className="flex items-center space-x-2 text-[#FF6B00] dark:text-[#FF8533] hover:text-[#E55A00] transition-colors"
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
              className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:block">Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:items-start md:flex-row gap-8 pb-8">
        {/* Profile Picture */}
        <div className="flex flex-col  items-center">
          <div className="relative">
            <img 
              src={imagePreview || user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=FF6B00&color=fff&size=128`}
              alt="Profile" 
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
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
                  className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </label>
              </>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            {isEditing ? 'Click to change photo' : 'Profile photo'}
          </p>

          {/* Role field */}
          <div className="md:col-span-2 mt-2">
            <div className="flex flex-col space-y-2 items-center justify-between">
              <div className="flex flex-col items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  role === 'admin' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300' :
                  role === 'organizer' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300' :
                  'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
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
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
                      : 'bg-[#FF6B00] text-white hover:bg-[#E55A00] dark:bg-[#FF6B00] dark:hover:bg-[#E55A00]'
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
        <form onSubmit={(e) => {e.preventDefault(); onSave();}} className="flex-1 grid grid-cols-2 md:grid-cols-2 justify-center px-0 sm:px-8 lg:px-0 gap-x-2 gap-y-4 sm:gap-6">
          <div className="">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full mt-2 px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-100 py-2">{user?.name || 'Not provided'}</p>
            )}
          </div>

          <div className="">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 hidden sm:block" />
              <p className="text-gray-900 dark:text-gray-100 truncate">{user?.email}</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          <div className="">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-1 sm:py-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter phone number"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-100 py-2">{user?.phone || 'Not provided'}</p>
            )}
          </div>

          <div className="">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-1 sm:py-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter your address"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-100 py-2">{user?.address || 'Not provided'}</p>
            )}
          </div>
          
        </form>
      </div>
    </div>
  );

};

export default PersonalInfoSection;