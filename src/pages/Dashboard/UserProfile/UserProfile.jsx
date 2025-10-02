import { useState } from "react";
import PersonalInfoSection from "./PersonalInfoSection";
import AdminSection from "./AdminSection";
import OrganizerSection from "./OrganizerSection";
import VolunteerSection from "./VolunteerSection";
import useRole from "../../../hooks/useRole";
import useUser from "../../../hooks/useUser";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import { AlertTriangle } from "lucide-react";
import WarningCard from "./WarningCard";
import useTheme from "../../../hooks/useTheme";

const UserProfile = () => {
  const [dbUser, isLoading, , refetch] = useUser();
  const [role, refetchRole] = useRole();
  const axiosSecure = useAxiosSecure();
  const { updateUser } = useAuth();
  const {darkMode} = useTheme();
  
  // Image upload setup
  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
  
  // Separate editing states
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingOrganization, setIsEditingOrganization] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  
  // Separate form data
  const [personalFormData, setPersonalFormData] = useState({});
  const [organizationFormData, setOrganizationFormData] = useState({});
  const [bioFormData, setBioFormData] = useState({});

  // Image upload states
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  //organizer request state
  const [requestLoading, setRequestLoading] = useState(false);

  //interest options
  const availableInterests = [
    'Environment', 'Community', 'Education', 'Social', 
    'Health', 'Arts & Culture', 'Technology', 'Sports & Recreation', 
    'Animal Welfare', 'Disaster Relief'
  ];

  //volunteer role change
  const handleOrganizerRequest = async () => {
    setRequestLoading(true);
    try {
      if (role === 'pending-organizer') {
        // Cancel request - change role back to volunteer
        await axiosSecure.patch(`/users/roleRequest/${dbUser.email}`, {
          role: 'volunteer'
        });
        toast.success('Organizer request cancelled',{
          style: {
            background: darkMode ? '#1F2937' : 'white',
            color: darkMode ? '#F9FAFB' : '#111827',
          },
        });
      } else {
        // Submit request - change role to pending-organizer
        await axiosSecure.patch(`/users/roleRequest/${dbUser.email}`, {
          role: 'pending-organizer'
        });
        toast.success('Organizer request submitted for admin approval',{
          style: {
            background: darkMode ? '#1F2937' : 'white',
            color: darkMode ? '#F9FAFB' : '#111827',
          },
        });
      }
      refetchRole(); 
      await new Promise(resolve => setTimeout(resolve, 350));
    } catch (error) {
      console.log(error);
      toast.error('Failed to process request',{
        style: {
          background: darkMode ? '#1F2937' : 'white',
          color: darkMode ? '#F9FAFB' : '#111827',
        },
      });
    } finally {
      setRequestLoading(false);
    }
  };

  // Personal Info Mutation
  const { mutate: updatePersonal, isPending: isSavingPersonal } = useMutation({
    mutationFn: async (updatedData) => {
      let photoURL = dbUser.photoURL;

      // Upload image if selected using your method
      if (selectedImage) {
        const imageFile = { image: selectedImage };
        try {
          const res = await axios.post(image_hosting_api, imageFile, {
            headers: {
              'content-type': 'multipart/form-data'
            }
          });
          if (res.data.success) {
            photoURL = res.data.data.display_url;
          }
        } catch (error) {
          toast.error('Image upload failed. Please try again.', { position: 'top-right',
            style: {
              background: darkMode ? '#1F2937' : 'white',
              color: darkMode ? '#F9FAFB' : '#111827',
            },
           });
          console.error('Image upload error:', error);
          throw error; // Stop form submission if image upload fails
        }
      }

      const dataToUpdate = { ...updatedData, photoURL };

      // Update Firebase Auth profile
      if (updatedData.name || photoURL !== dbUser.photoURL) {
        await updateUser({
          displayName: updatedData.name || dbUser.name,
          photoURL: photoURL
        });
      }

      // Update database
      return axiosSecure.patch(`/users/${dbUser.email}`, dataToUpdate);
    },
    onSuccess: () => {
      toast.success("Personal information updated successfully!", { position: 'top-right',
        style: {
          background: darkMode ? '#1F2937' : 'white',
          color: darkMode ? '#F9FAFB' : '#111827',
        },
       });
      setIsEditingPersonal(false);
      setSelectedImage(null);
      setPreviewImage('');
      refetch();
    },
    onError: (error) => {
      console.error("Failed to update personal info:", error);
      toast.error("Failed to update personal information.", { position: 'top-right',
        style: {
          background: darkMode ? '#1F2937' : 'white',
          color: darkMode ? '#F9FAFB' : '#111827',
        },
       });
    },
  });

  // Organization Info Mutation
  const { mutate: updateOrganization, isPending: isSavingOrganization } = useMutation({
    mutationFn: (updatedData) => {
      return axiosSecure.patch(`/users/${dbUser.email}`, updatedData);
    },
    onSuccess: () => {
      toast.success("Organization information updated successfully!", { position: 'top-right',
        style: {
          background: darkMode ? '#1F2937' : 'white',
          color: darkMode ? '#F9FAFB' : '#111827',
        },
       });
      setIsEditingOrganization(false);
      refetch();
    },
    onError: (error) => {
      console.error("Failed to update organization info:", error);
      toast.error("Failed to update organization information.", { position: 'top-right',
        style: {
          background: darkMode ? '#1F2937' : 'white',
          color: darkMode ? '#F9FAFB' : '#111827',
        },
       });
    },
  });

  // Bio Info Mutation
const { mutate: updateBio, isPending: isSavingBio } = useMutation({
  mutationFn: (updatedData) => {
    return axiosSecure.patch(`/users/${dbUser.email}`, updatedData);
  },
  onSuccess: () => {
    toast.success("Bio and interests updated successfully!", { position: 'top-right',
      style: {
          background: darkMode ? '#1F2937' : 'white',
          color: darkMode ? '#F9FAFB' : '#111827',
        },
     });
    setIsEditingBio(false);
    refetch();
  },
  onError: (error) => {
    console.error("Failed to update bio info:", error);
    toast.error("Failed to update bio information.", { position: 'top-right',
      style: {
          background: darkMode ? '#1F2937' : 'white',
          color: darkMode ? '#F9FAFB' : '#111827',
        },
     });
  },
});

  // Image handling using your method
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB", { position: 'top-right',
          style: {
          background: darkMode ? '#1F2937' : 'white',
          color: darkMode ? '#F9FAFB' : '#111827',
        },
         });
        return;
      }
      
      setSelectedImage(file);
      // Create a temporary URL for the selected file
      const newImageURL = URL.createObjectURL(file);
      setPreviewImage(newImageURL);
    } else {
      // If user cancels selection, revert to original image
      setPreviewImage(dbUser?.photoURL || '');
    }
  };

  // Personal Info Handlers
  const handleEditPersonal = () => {
    setIsEditingPersonal(true);
    setPersonalFormData({
      name: dbUser?.name || '',
      phone: dbUser?.phone || '',
      address: dbUser?.address || '',
    });
  };

  const handleSavePersonal = () => {

    updatePersonal(personalFormData);
  };

  const handleCancelPersonal = () => {
    setIsEditingPersonal(false);
    setPersonalFormData({});
    setSelectedImage(null);
    setPreviewImage('');
  };

  // Organization Info Handlers
  const handleEditOrganization = () => {
    setIsEditingOrganization(true);
    setOrganizationFormData({
      organizationName: dbUser?.organizationName || '',
      organizationDescription: dbUser?.organizationDescription || '',
    });
  };

  const handleSaveOrganization = (soloOrganizerData) => {
    let dataToUpdate;

    // Check if the call is coming from the Solo Organizer confirmation
    if (soloOrganizerData && soloOrganizerData.isSoloOrganizer) {
        dataToUpdate = {
            organizationName: 'Solo Organizer',
            organizationDescription: ''
        };
    } else {
        // Otherwise, use the data from the form state
        dataToUpdate = organizationFormData;
    }

    updateOrganization(dataToUpdate);
  };

  const handleCancelOrganization = () => {
    setIsEditingOrganization(false);
    setOrganizationFormData({});
  };

  // Bio Info Handlers
  const handleEditBio = () => {
    setIsEditingBio(true);
    setBioFormData({
      bio: dbUser?.bio || '',
      interests: dbUser?.interests || [],
    });
  };

  const handleSaveBio = () => {
    updateBio(bioFormData);
  };

  const handleCancelBio = () => {
    setIsEditingBio(false);
    setBioFormData({});
  };

  const renderRoleSpecificSections = () => {
    switch (role) {
      case 'admin':
        return <AdminSection user={dbUser} />;
      case 'organizer':
        return (
          <OrganizerSection 
            user={dbUser}
            isEditing={isEditingOrganization}
            formData={organizationFormData}
            setFormData={setOrganizationFormData}
            onEdit={handleEditOrganization}
            onSave={handleSaveOrganization}
            onCancel={handleCancelOrganization}
            isSaving={isSavingOrganization} 
          />
        );
      case 'pending-organizer':
      case 'volunteer':
        return (
          <VolunteerSection 
            user={dbUser}
            availableInterests={availableInterests}
            isEditingBio={isEditingBio}
            bioFormData={bioFormData}
            setBioFormData={setBioFormData}
            onEditBio={handleEditBio}
            onSaveBio={handleSaveBio}
            onCancelBio={handleCancelBio}
            isSavingBio={isSavingBio}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-full md:w-72 h-32 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4 sm:p-4 lg:p-6 xl:px-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className=" mx-auto">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account information and preferences
          </p>
        </div>

        {/* Content */}
        <div className="mt-8">
          {/* Personal Information Section */}
          <PersonalInfoSection
            user={dbUser}
            isEditing={isEditingPersonal}
            formData={personalFormData}
            setFormData={setPersonalFormData}
            onEdit={handleEditPersonal}
            onSave={handleSavePersonal}
            onCancel={handleCancelPersonal}
            isSaving={isSavingPersonal}
            onImageSelect={handleImageSelect}
            imagePreview={previewImage}
            role={role}
            requestLoading={requestLoading}
            handleOrganizerRequest={handleOrganizerRequest}
          />
          {/* Warning section */}
          <WarningCard dbUser={dbUser} role={role}></WarningCard> 
          {/* Role-specific Sections */}
          {renderRoleSpecificSections()}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;