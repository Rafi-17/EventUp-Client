import React from 'react';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import { Navigate } from 'react-router-dom';

const OrganizerRoute = ({children}) => {
    const {user, loading} = useAuth();
    const [role, , isLoading] = useRole();
    const isOrganizer = role ==='organizer' || role === 'admin';
    if(loading || isLoading){
        return <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin h-10 w-10 border-4 border-gray-400 rounded-full border-t-[#FF6B00]"></div>
                </div>
    }
    if(user && isOrganizer){
        return children;
    }
    return <Navigate to={'/'}></Navigate>
};

export default OrganizerRoute;