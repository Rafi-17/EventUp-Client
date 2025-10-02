import React from 'react';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';

const AdminRoute = ({children}) => {
    const {user, loading} = useAuth();
    const [role, , isLoading] = useRole();
    const isAdmin = role === 'admin';
    if(loading || isLoading){
        return <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin h-10 w-10 border-4 border-gray-400 rounded-full border-t-[#FF6B00]"></div>
                </div>
    }
    if(user && isAdmin){
        return children;
    }
    return <Navigate to={'/'}></Navigate>
};

export default AdminRoute;