import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({children}) => {
    const {user, loading} = useAuth();
    const location = useLocation();
    if(loading){
        return <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin h-10 w-10 border-4 border-gray-400 rounded-full border-t-[#FF6B00]"></div>
                </div>
    }
    if(user){
        return children;
    }
    return <Navigate to={'/login'} state={location.pathname}></Navigate>
};

export default PrivateRoute;