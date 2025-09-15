import { Award, BarChart3, Calendar, Check, Edit3, Save, X } from "lucide-react";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";

const VolunteerSection = ({ 
  user, 
  availableInterests,
  isEditingBio,
  bioFormData,
  setBioFormData,
  onEditBio,
  onSaveBio,
  onCancelBio,
  isSavingBio
}) => {
  
  const handleInterestToggle = (interest) => {
    const currentInterests = bioFormData.interests || [];
    const isSelected = currentInterests.includes(interest);
    
    if (isSelected) {
      // Remove interest
      setBioFormData({
        ...bioFormData,
        interests: currentInterests.filter(i => i !== interest)
      });
    } else {
      // Add interest
      setBioFormData({
        ...bioFormData,
        interests: [...currentInterests, interest]
      });
    }
  };

  return (
    <>
      {/* Personal Bio & Interests */}
      <div className="bg-white my-8 rounded-xl shadow-sm p-3 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <SectionTitle 
            subHeading="About"
            heading="Personal Bio & Interests"
            variant="dashboard"
            alignment="left"
          />
          {!isEditingBio ? (
            <button
              onClick={onEditBio}
              className="flex items-center space-x-2 text-[#FF6B00] hover:text-[#E55A00] transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:block">Edit</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={onSaveBio}
                disabled={isSavingBio}
                className="flex items-center space-x-1 bg-[#FF6B00] text-white px-3 py-1 rounded-lg hover:bg-[#E55A00] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingBio ? (
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
                onClick={onCancelBio}
                disabled={isSavingBio}
                className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:block">Cancel</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {/* Bio Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            {isEditingBio ? (
              <textarea
                value={bioFormData.bio || ''}
                onChange={(e) => setBioFormData({ ...bioFormData, bio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none"
                rows="4"
                placeholder="Tell us about yourself, your passion for volunteering, and what motivates you to make a difference..."
              />
            ) : (
              <div>
                {user?.bio ? (
                  <p className="text-gray-600 leading-relaxed">{user.bio}</p>
                ) : (
                  <p className="text-gray-500 italic">No bio provided yet. Click Edit to add your bio and let others know about your volunteering journey.</p>
                )}
              </div>
            )}
          </div>
          
          {/* Interests Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Areas of Interest</label>
            {isEditingBio ? (
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => {
                  const isSelected = (bioFormData.interests || []).includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isSelected 
                          ? 'bg-[#FF6B00] text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                {user?.interests && user.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, index) => (
                      <span key={index} className="bg-[#FF6B00] bg-opacity-10 text-[#FF6B00] px-3 py-1 rounded-full text-sm font-medium">
                        {interest}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No interests selected yet. Click Edit to select your areas of interest.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Volunteer Stats */}
      <div className="bg-white mb-8 rounded-xl shadow-sm p-3 sm:p-6">
        <SectionTitle 
            subHeading="Statistics"
            heading="Volunteer Stats"
            variant="dashboard"
            alignment="left"
          />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-100 rounded-lg">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{user?.eventsParticipated || 0}</div>
            <div className="text-sm text-gray-600">Events Participated</div>
          </div>
          <div className="text-center p-4 bg-green-100 rounded-lg">
            <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{user?.reliabilityScore || 'N/A'}%</div>
            <div className="text-sm text-gray-600">Reliability Score</div>
          </div>
          <div className="text-center p-4 bg-purple-100 rounded-lg">
            <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{user?.hoursVolunteered || 0}</div>
            <div className="text-sm text-gray-600">Hours Volunteered</div>
          </div>
        </div>
      </div>

      {/* Skills & Preferences */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
        <SectionTitle 
          subHeading="Capabilities"
          heading="Skiils & Preferences"
          variant="dashboard"
          alignment="left"
        />
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Skills</label>
            <div className="flex flex-wrap gap-2">
              {(user?.skills || ['Event Planning', 'Photography', 'First Aid']).map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
              <button className="bg-[#FF6B00] bg-opacity-10 text-[#FF6B00] px-3 py-1 rounded-full text-sm hover:bg-opacity-20 transition-colors">
                + Add Skill
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <p className="text-gray-600">{user?.availability || 'Weekends and evenings'}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VolunteerSection;