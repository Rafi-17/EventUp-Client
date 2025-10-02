import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaUser, FaUsers, FaPlus, FaBook, FaSignOutAlt, FaBell, FaCogs, FaCalendarPlus, FaClipboardList, FaPortrait, FaUserCircle, FaIdCard, FaUserCog } from 'react-icons/fa'; // Icons for the menu
import { IoMdMenu } from 'react-icons/io';
import { FaThemeco, FaXmark } from 'react-icons/fa6';
import useRole from '../hooks/useRole';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Bell, Cog } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import useTheme from '../hooks/useTheme';


const Dashboard = () => {
    const [role] = useRole();
    const navigate = useNavigate();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logoutUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const {pathname} = useLocation();
    const {darkMode} = useTheme();

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

    const {data:ongoingEventStatus , refetch:refetchEventStatus} = useQuery({
        queryKey: ['ongoing-event-status', user?.email],
        queryFn: async()=>{
            const res = await axiosSecure('/users/ongoing-events-status')
            return res.data.isOngoing;
        },
        enabled: !!user?.email
    })

    const {data:unreadNotificationCount} = useQuery({
        queryKey: ['unread-notifications', user?.email],
        queryFn: async()=>{
            const res = await axiosSecure.get(`/notifications/${user?.email}`)
            return res.data.count;
        }
    })

    const hasShownToast = useRef(false);

    // Notification logic for MainLayout
    const { data: notifications = [], refetch } = useQuery({
        queryKey: ['notifications', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/notifications/notToastShown/${user.email}`);
            return res.data;
        }
    });

    useEffect(() => {
        if (notifications.length > 0 && !hasShownToast.current) {
            notifications.forEach(notification => {
            const toastOptions = {
                position: 'top-right',
                duration: 5000,
                style: {
                    background: darkMode ? '#1F2937' : 'white',
                    color: darkMode ? '#F9FAFB' : '#111827',
                },
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
                    toast(notification.message, {
                        ...toastOptions,
                        icon: '💬' 
                    });
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

            axiosSecure.patch(`/notifications/markToastShown/${user.email}`)
                .then(res => {
                   // console.log('Notifications marked as shown:', res.data);
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
        document.body.style.overflow = 'unset';
    };

    //freze background scrolling in small device when sidebar is open
    useEffect(() => {
    if (isSidebarOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
        document.body.style.overflow = 'unset';
    };
}, [isSidebarOpen]);    
    // Define navigation items based on user role
    const navItems = (

        <ul className='p-4 text-sm font-medium'>
            <li className='mb-4'><NavLink to='/dashboard' className={({ isActive }) =>`flex items-center gap-2 ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`} end><FaHome /> {role==='admin' ? 'Admin' : role==='organizer' ? 'Organizer' : 'Volunteer'} Home</NavLink></li>

            {role === 'admin' ? (
                <>
                    {/* <li className='mb-4'><NavLink to='/dashboard/tempProfile' className={({ isActive }) =>`flex items-center gap-2 ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`} end><FaHome /> Admin Home temp</NavLink></li> */}
                    <li className='mb-4'><NavLink to='/dashboard/allUsers' className={({ isActive }) =>`flex items-center gap-2 relative group ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`} end><FaUsers /> Manage Users
                    {totalPendingOrganizer > 0 && (
                    <>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-1"></div>
                        <div className="absolute -right-8 ml-2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-[#FF6B00] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[9999]">
                        {totalPendingOrganizer} pending request{totalPendingOrganizer > 1 ? 's' : ''}
                        </div>
                    </>
                    )}
                    </NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/manageEvents' className={({ isActive }) =>`flex items-center gap-2 ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`}><FaCalendarAlt /> Manage Events
                    {ongoingEventStatus?.organizedEvent === true && (
                    <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1"></div>
                    </>
                    )}
                    </NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/manageVolunteers' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`}><FaUserCog /> Manage Volunteers</NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/addEvent' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`}><FaCalendarPlus /> Add Event</NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/registeredEvents' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`}><FaClipboardList />My Registered Events
                    {ongoingEventStatus?.registeredEvent === true && (
                    <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1"></div>
                    </>
                    )}
                    </NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/profile' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`}><FaPortrait />Profile</NavLink></li>
                    {/* <li className='mb-4'><NavLink to='/dashboard/notifications' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`}><FaBell />Notifications</NavLink></li> */}
                    
                </>
            ) : role === 'organizer' ? (
                <>
                    {/* <li className='mb-4'><NavLink to='/dashboard/tempProfile' className={({ isActive }) =>`flex items-center gap-2 ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`} end><FaHome /> Organizer Home temp</NavLink></li> */}
                    <li className='mb-4'><NavLink to='/dashboard/manageEvents' className={({ isActive }) =>`flex items-center gap-2 ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`}><FaCalendarAlt /> My Events
                    {ongoingEventStatus?.organizedEvent === true && (
                    <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1"></div>
                    </>
                    )}
                    </NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/addEvent' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`}><FaCalendarPlus /> Add Event</NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/manageVolunteers' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`}><FaUserCog /> Manage Volunteers</NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/registeredEvents' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`}><FaClipboardList />My Registered Events
                    {ongoingEventStatus?.registeredEvent === true && (
                    <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1"></div>
                    </>
                    )}
                    </NavLink></li>
                    <li className='mb-4'><NavLink to='/dashboard/profile' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`}><FaPortrait />Profile</NavLink></li>
                    {/* <li className='mb-4'><NavLink to='/dashboard/notifications' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`}><FaBell />Notifications</NavLink></li> */}
                </>
            ) : (
                // Default to 'volunteer' role
                <>
                    <li className='mb-4'><NavLink to='/dashboard/registeredEvents' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`}><FaClipboardList />My Registered Events
                    {ongoingEventStatus?.registeredEvent === true && (
                    <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1"></div>
                    </>
                    )}
                    </NavLink></li>
                    {/* <li className='mb-4'><NavLink to='/dashboard/tempProfile' className={({ isActive }) =>`flex items-center gap-2 ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`}><FaUser /> User Profile</NavLink></li> */}
                    <li className='mb-4'><NavLink to='/dashboard/profile' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`}><FaPortrait />Profile</NavLink></li>
                    {/* <li className='mb-4'><NavLink to='/dashboard/notifications' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`}><FaBell />Notifications</NavLink></li> */}
                </>
            )}
            <li className='mb-4'><NavLink to='/dashboard/notifications' className={({isActive})=>`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-[#FF6B00]' : 'hover:text-gray-300 dark:hover:text-gray-300 text-white dark:text-gray-200'}`}><FaBell />Notifications
            {unreadNotificationCount > 0 && (
                    <>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-1"></div>
                    </>
                    )}
            </NavLink></li>
            <hr className='my-6 border-gray-700 dark:border-gray-400' />
            <li className='my-4'><NavLink to='/' className='flex items-center gap-2 text-white dark:text-gray-200 hover:text-gray-300 dark:hover:text-gray-300'><FaHome /> Home</NavLink></li>
            <li className='mb-4'><NavLink to='/events' className='flex items-center gap-2 text-white dark:text-gray-200 hover:text-gray-300 dark:hover:text-gray-300'><FaBook /> All Events</NavLink></li>
            <li onClick={()=>{
                logoutUser();
                navigate('/login')
            }} className='mb-3'><NavLink className='flex items-center gap-2 text-white dark:text-gray-200 hover:text-gray-300 dark:hover:text-gray-300 whitespace-nowrap'><FaSignOutAlt />LogOut</NavLink></li>
            <div className="flex items-center gap-2 cursor-pointer text-white dark:text-gray-200 hover:text-gray-300 dark:hover:text-gray-300">
                <span><FaCogs /></span>
                <ThemeToggle className="h-2 w-2" />
            </div>
        </ul>
    );
    


    return (
        <div className='min-h-screen bg-white dark:bg-gray-900 overflow-hidden'> {/* Add overflow-hidden */}
            
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
                <div className={`w-64 min-h-screen bg-gray-900 dark:bg-gray-800 text-white transition-transform duration-300 ease-in-out transform flex-shrink-0
                 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                 fixed top-0 left-0 z-30 lg:static lg:translate-x-0`}>
    <div className="flex flex-col h-screen lg:h-full ">
        <div className="flex flex-col items-center justify-center p-8 flex-shrink-0">
            <p className="font-sans text-xl font-extrabold tracking-tighter text-white dark:text-gray-100 mb-1">EVENTUP</p>
            <p className="font-sans text-sm font-normal tracking-[0.4em] text-gray-400 dark:text-gray-500 uppercase">DASHBOARD</p>
        </div>
        <div className="flex-1 px-4 overflow-y-auto">
            {navItems}
        </div>
        <button onClick={toggleSidebar} className="absolute top-4 right-4 lg:hidden text-2xl">
            <FaXmark />
        </button>
    </div>
</div>

                {/* Main content area - This is the key fix */}
                <div className='flex-1 min-h-screen bg-white dark:bg-gray-900 overflow-x-auto'> 
                    {/* Hamburger menu for small screens */}
                    <div className='lg:hidden p-4 bg-white dark:bg-gray-900'>
                        <button onClick={toggleSidebar} className="z-40 relative">
                            <IoMdMenu className='text-3xl text-gray-900 dark:text-gray-100' />
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