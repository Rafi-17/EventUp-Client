import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
// import SectionHeading from '../../components/SectionHeading';
import { Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useRole from '../../../hooks/useRole';
import { CgProfile } from 'react-icons/cg';

const UserProfile = () => {
    const { user } = useAuth();
    const [role, refetch] = useRole();
    console.log(role);
    console.log(user);
    const axiosSecure = useAxiosSecure();
    
    const handleSentRequest = () =>{
        axiosSecure.patch(`/users/roleRequest/${user.email}`,{role:'pending-organizer'})
        .then(res=>{
            if(res.data.modifiedCount>0){
                refetch();
            }
        })
    }
    const handleCancelRequest = () =>{
        axiosSecure.patch(`/users/roleRequest/${user.email}`,{role:'volunteer'})
        .then(res=>{
            if(res.data.modifiedCount>0){
                refetch();
            }
        })
    }
    useEffect(() => {
        // Check if the user object has a message and it's not null
        if (user?.message) {
            toast.error(user.message); // Display the message
            
            // To prevent the message from showing again on reload, clear it from the database
            updateUserInDB(user._id, { message: null });
        }
    }, [user]);

    const defaultAvatar = <CgProfile></CgProfile>;

    // Placeholder data for demonstration
    const organizerStats = { totalPostedEvents: 5 };
    const adminStats = { totalUsers: 25, pendingOrganizers: 3 };

    const renderVolunteerProfile = () => (
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            {/* Left Column: Stats & Info */}
            <div className="w-full md:w-1/3 bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Summary</h2>
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md">
                        <h3 className="text-gray-600">Events Registered</h3>
                        <p className="text-2xl font-bold text-[#FF6B00]">
                            {user?.registeredEvents?.length || 0}
                        </p>
                    </div>
                </div>
                {/* The Button for a volunteer to request organizer role */}
                <div className="mt-8 text-center">
                    {role === 'pending-organizer' ? (
                        <button onClick={handleCancelRequest} className="bg-[#FF6B00] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#E66200] transition-colors duration-300">
                            Cancel Request
                        </button>
                    ) : (
                        <button onClick={handleSentRequest} className="bg-[#FF6B00] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#E66200] transition-colors duration-300">
                            Request to be an Organizer
                        </button>
                    )}
                </div>
            </div>

            {/* Right Column: Other Information */}
            <div className="w-full md:w-2/3">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Other Information</h2>
                <div className="bg-white p-8 rounded-lg shadow-xl">
                    <p className="text-gray-700">You are a volunteer. Your profile is public to event organizers when you sign up for events.</p>
                </div>
            </div>
        </div>
    );

    const renderOrganizerProfile = () => (
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            {/* Left Column: Stats & Info */}
            <div className="w-full md:w-1/3 bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Summary</h2>
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md">
                        <h3 className="text-gray-600">Events Posted</h3>
                        <p className="text-2xl font-bold text-[#FF6B00]">
                            {organizerStats.totalPostedEvents}
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column: Other Information */}
            <div className="w-full md:w-2/3">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Organizer Details</h2>
                <div className="bg-white p-8 rounded-lg shadow-xl">
                    <p className="text-gray-700">You are an organizer. You can post and manage events from your dashboard.</p>
                </div>
            </div>
        </div>
    );

    const renderAdminProfile = () => (
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            {/* Left Column: Stats & Info */}
            <div className="w-full md:w-1/3 bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Stats</h2>
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md">
                        <h3 className="text-gray-600">Total Users</h3>
                        <p className="text-2xl font-bold text-[#FF6B00]">
                            {adminStats.totalUsers}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                        <h3 className="text-gray-600">Pending Organizers</h3>
                        <p className="text-2xl font-bold text-[#FF6B00]">
                            {adminStats.pendingOrganizers}
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column: Other Information */}
            <div className="w-full md:w-2/3">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Details</h2>
                <div className="bg-white p-8 rounded-lg shadow-xl">
                    <p className="text-gray-700">You are the administrator. You have full access to manage the platform.</p>
                </div>
            </div>
        </div>
    );
    
    // Conditional rendering based on user role
    const renderProfileContent = () => {
        if (!user) {
            return <div>Please log in to view your profile.</div>;
        }

        if (role === 'organizer') {
            return renderOrganizerProfile();
        } else if (role === 'admin') {
            return renderAdminProfile();
        } else {
            return renderVolunteerProfile();
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Header Section (Common to all roles) */}
            <section className="bg-white py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    { user?.photoURL ?
                    <img 
                        src={user?.photoURL || defaultAvatar} 
                        alt="User Avatar"
                        className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-[#FF6B00] mb-4"
                    /> : <span className="rounded-full mx-auto object-cover mb-4 flex justify-center items-center text-4xl">
        <CgProfile className='w-32 h-32 ' />
    </span>
                    }
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                        {user?.displayName || "Guest"}
                    </h1>
                    <p className="text-[#FF6B00] font-semibold text-lg">{user?.email}</p>
                </div>
            </section>

            {/* Profile Content (Conditional based on role) */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    {renderProfileContent()}
                </div>
            </section>
        </div>
    );
};

export default UserProfile;