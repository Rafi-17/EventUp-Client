import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaUser, FaUsers, FaPlus, FaBook, FaSignOutAlt } from 'react-icons/fa'; // Icons for the menu
import { IoMdMenu } from 'react-icons/io';
import { FaXmark } from 'react-icons/fa6';
import useRole from '../hooks/useRole';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';


const Dashboard = () => {
    const [role] = useRole();
    const navigate = useNavigate();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logoutUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const {pathname} = useLocation();

    //page scroll remains at top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const {data:totalPendingOrganizer, refetch:refetchPendingOrganizer} = useQuery({
        queryKey:['pending-organizer-count'],
        queryFn:async()=>{
            const res=await axiosSecure.get('/users/pending-organizer-count')
            return res.data;
        },
        enabled:role==='admin'
    })

    const hasShownToast = useRef(false);

    // Notification logic for MainLayout
    const { data: notifications = [], refetch } = useQuery({
        queryKey: ['notifications', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/notifications/${user.email}`);
            return res.data;
        }
    });

    useEffect(() => {
        if (notifications.length > 0 && !hasShownToast.current) {
            notifications.forEach(notification => {
            const toastOptions = {
                position: 'top-right',
                duration: 5000,
            };

            switch (notification.type) {
                case 'success':
                    toast.success(notification.message, toastOptions);
                    break;
                case 'sorry':
                    toast(notification.message, {
                        ...toastOptions,
                        icon: '😢',
                    });
                    break;
                case 'neutral':
                    toast.info(notification.message, toastOptions);
                    break;
                case 'warning': 
                    toast(notification.message, {
                        ...toastOptions,
                        icon: '⚠️' 
                    });
                    break;
                default:
                    toast(notification.message, toastOptions); // Default toast
            }
            });

            hasShownToast.current = true;

            axiosSecure.patch(`/notifications/markRead/${user.email}`)
                .then(res => {
                    console.log('Notifications marked as read:', res.data);
                });
        }
    }, [notifications, user, axiosSecure]);
    // useEffect(() => {
    //     if (location.pathname) {
    //         refetch();
    //     }
    // }, [location.pathname, refetch]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const handleBackdropClick = () => {
        setIsSidebarOpen(false);
    };
    // Define navigation items based on user role
    const navItems = (
        <ul className='p-4 text-sm font-medium'>
            {role === 'admin' ? (
                <>
                    <li className='mb-4'><NavLink to='/dashboard/admin-home' className={({ isActive }) =>`flex items-center gap-2 ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 text-white'}`} end><FaHome /> Admin Home</NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/allUsers' className={({ isActive }) =>`flex items-center gap-2 relative group ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 text-white'}`} end><FaUsers /> All Users
                    {totalPendingOrganizer > 0 && (
                    <>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-1"></div>
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-[#FF6B00] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {totalPendingOrganizer} pending request{totalPendingOrganizer > 1 ? 's' : ''}
                        </div>
                    </>
                    )}
                    </NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/manageEvents' className={({ isActive }) =>`flex items-center gap-2 ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 text-white'}`}><FaCalendarAlt /> Manage Events</NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/manageVolunteers' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 text-white'}`}><FaUsers /> Manage Volunteers</NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/registeredEvents' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 text-white'}`}><FaUsers />My Registered Events</NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/addEvent' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 text-white'}`}><FaUsers /> Add Event</NavLink></li>
                    
                </>
            ) : role === 'organizer' ? (
                <>
                    <li className='mb-4'><NavLink to='/dashboard/profile' className={({ isActive }) =>`flex items-center gap-2 ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 text-white'}`} end><FaHome /> Organizer Home</NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/manageEvents' className={({ isActive }) =>`flex items-center gap-2 ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 text-white'}`}><FaCalendarAlt /> My Events</NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/manageVolunteers' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 text-white'}`}><FaUsers /> Manage Volunteers</NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/registeredEvents' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 text-white'}`}><FaCalendarAlt />My Registered Events</NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/addEvent' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 text-white'}`}><FaUsers /> Add Event</NavLink></li>
                </>
            ) : (
                // Default to 'volunteer' role
                <>
                    <li className='mb-4'><NavLink to='/dashboard/registeredEvents' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 text-white'}`}><FaCalendarAlt />My Registered Events</NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/profile' className={({ isActive }) =>`flex items-center gap-2 ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 text-white'}`}><FaUser /> User Profile</NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/add-review' className={({ isActive }) =>`flex items-center gap-2 ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 text-white'}`}><FaPlus /> Add Review</NavLink></li>
                </>
            )}
            <hr className='my-6 border-gray-700' />
            <li className='my-4'><NavLink to='/' className='flex items-center gap-2 text-white'><FaHome /> Home</NavLink></li>
            <li className='mb-4'><NavLink to='/events' className='flex items-center gap-2 text-white'><FaBook /> All Events</NavLink></li>
            <li onClick={()=>{
                logoutUser();
                navigate('/login')
            }} className='mb-4'><NavLink className='flex items-center gap-2 text-white whitespace-nowrap'><FaSignOutAlt />LogOut</NavLink></li>
        </ul>
    );
    


    return (
        // <div className='flex min-h-screen'>
        //     {/* Sidebar for large screens, hidden on small screens */}
        //     <div className={`w-72 min-h-screen bg-gray-900 text-white transition-transform duration-300 ease-in-out transform
        //                      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        //                      fixed top-0 left-0 z-30 lg:static lg:translate-x-0 lg:block`}>
        //         <div className="flex flex-col items-center justify-center p-8">
        //             <p className="font-sans text-xl font-extrabold tracking-tighter text-white mb-1">EVENTUP</p>
        //             <p className="font-sans text-sm font-normal tracking-[0.4em] text-gray-400 uppercase">DASHBOARD</p>
        //         </div>
        //         <div className="p-4">
        //             {navItems}
        //         </div>
        //         <button onClick={toggleSidebar} className="absolute top-4 right-4 lg:hidden text-2xl">
        //             <FaXmark />
        //         </button>
        //     </div>

        //     {/* Hamburger menu for small screens */}
        //     <div className='lg:hidden p-4 fixed z-40'>
        //         <button onClick={toggleSidebar}>
        //             <IoMdMenu className='text-3xl text-gray-900' />
        //         </button>
        //     </div>
            
        //     {/* Main content area */}
        //     <div className='w-full p-4 lg:p-0'>
        //         <Outlet />
        //     </div>
        // </div>
        <div className='min-h-screen bg-white overflow-hidden'> {/* Add overflow-hidden */}
            
            {/* Mobile backdrop overlay - ONLY show on mobile when sidebar is open */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={handleBackdropClick}
                />
            )}

            {/* Container with proper flex layout */}
            <div className="flex w-full min-h-screen">
                
                {/* Sidebar */}
                <div className={`w-64 min-h-screen bg-gray-900 text-white transition-transform duration-300 ease-in-out transform flex-shrink-0
                                 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                                 fixed top-0 left-0 z-30 lg:static lg:translate-x-0`}>
                    <div className="flex flex-col items-center justify-center p-8">
                        <p className="font-sans text-xl font-extrabold tracking-tighter text-white mb-1">EVENTUP</p>
                        <p className="font-sans text-sm font-normal tracking-[0.4em] text-gray-400 uppercase">DASHBOARD</p>
                    </div>
                    <div className="p-4">
                        {navItems}
                    </div>
                    <button onClick={toggleSidebar} className="absolute top-4 right-4 lg:hidden text-2xl">
                        <FaXmark />
                    </button>
                </div>

                {/* Main content area - This is the key fix */}
                <div className='flex-1 min-h-screen bg-white overflow-x-auto'> 
                    {/* Hamburger menu for small screens */}
                    <div className='lg:hidden p-4 bg-white'>
                        <button onClick={toggleSidebar} className="z-40 relative">
                            <IoMdMenu className='text-3xl text-gray-900' />
                        </button>
                    </div>
                    
                    {/* Outlet container with proper width constraints */}
                    <div className="w-full max-w-full">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;