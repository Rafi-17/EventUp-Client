import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../pages/Shared/Navbar/Navbar';
import Footer from '../pages/Shared/Footer/Footer';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const MainLayout = () => {
    const location = useLocation();
    const noNavbarFooter = location?.pathname.includes('login') || location?.pathname.includes('register') || location?.pathname.includes('eventDetails');
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Notification logic for MainLayout
    // const { data: notifications = [], refetch } = useQuery({
    //     queryKey: ['notifications', user?.email],
    //     enabled: !!user?.email,
    //     queryFn: async () => {
    //         const res = await axiosSecure.get(`/notifications/${user.email}`);
    //         return res.data;
    //     }
    // });

    // useEffect(() => {
    //     if (notifications.length > 0) {
    //         notifications.forEach(notification => {
    //             toast.success(notification.message, {
    //                 position: 'top-right',
    //                 duration: 5000
    //             });
    //         });

    //         axiosSecure.patch(`/notifications/markRead/${user.email}`)
    //             .then(res => {
    //                 console.log('Notifications marked as read:', res.data);
    //             });
    //     }
    // }, [notifications, user, axiosSecure]);
    // useEffect(() => {
    //     if (location.pathname) {
    //         refetch();
    //     }
    // }, [location.pathname, refetch]);
    
    return (
        <div className='bitter dark:bg-gray-900'>
            {!noNavbarFooter && <Navbar></Navbar> }
            <Outlet></Outlet>
            {!noNavbarFooter && <Footer></Footer> }
        </div>
    );
};

export default MainLayout;