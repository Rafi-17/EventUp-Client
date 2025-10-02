import React, { useEffect, useRef, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { FaCaretDown } from 'react-icons/fa';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle';
import useUser from '../../../hooks/useUser';
import { CircleUserRound, UserCircle, UserCircle2 } from 'lucide-react';
import defaultImg from '../../../assets/Profile/defaultProfile.png'
import useTheme from '../../../hooks/useTheme';

const UserDropdown = () => {
    const {user, logoutUser} = useAuth();
    const [dbUser] = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const {darkMode} = useTheme();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Effect to close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);
    const handleLogout=()=>{
        logoutUser()
        .then(()=>{
            toast('Logged out successfully. See you again soon!',{
                position:'top-center',
                duration:1000,
                style: {
                    background: darkMode ? '#1F2937' : 'white',
                    color: darkMode ? '#F9FAFB' : '#111827',
                },
            });
        })
    }

        const getAvatarColors = () => {
        if (darkMode) {
        return {
            background: 'EA580C', // Black background for dark mode
            color: 'F9FAFB', // White text for dark mode
        };
        } else {
        return {
            background: 'EA580C', // White background for light mode
            color: 'F9FAFB', // Black text for light mode
        };
        }
    };

    const { background, color } = getAvatarColors();
    const avatarUrl = dbUser?.photoURL || 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(dbUser?.name || '')}&background=${background}&color=${color}&size=128`;
    return (
        <div className="relative" ref={dropdownRef}>
            {/* The profile image trigger */}
            <div 
                className="cursor-pointer flex items-center gap-[2px]" 
                onClick={toggleMenu}
            >
                <img 
                src={avatarUrl}
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover shadow-lg transition-transform duration-200"
              /> 
                {/* {dbUser && dbUser?.photoURL ?
                <img
                    src={dbUser?.photoURL}
                    className="w-10 h-10 rounded-full object-cover transition-transform duration-200"
                /> : 
                <img
                    src={defaultImg}
                    className="w-10 h-10 rounded-full object-cover transition-transform duration-200"
                /> 
                // <span className='rounded-full object-cover transition-transform duration-200'><CircleUserRound className='w-10 h-10 text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 rounded-full'/></span>
                } */}
                <FaCaretDown className="text-white text-lg" /> {/* A more visible icon */}
            </div>

            {/* The dropdown menu, conditionally rendered */}
            {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 transition-all duration-300 z-50 dark:border-gray-600">
                    <div className="flex flex-col space-y-2">
                        {/* The name is now a distinct, non-clickable element */}
                        <p className="text-white dark:text-gray-100 text-xs md:text-sm font-semibold p-2 bg-gray-700 dark:bg-gray-600 rounded-md">
                            {user?.displayName || "Guest"}
                        </p>
                        <Link
                            to="/dashboard"
                            className="text-gray-300 dark:text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-600 hover:text-[#FF6B00] rounded-md px-3 py-2 transition-colors text-xs md:text-sm font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/dashboard/profile"
                            className="text-gray-300 dark:text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-600 hover:text-[#FF6B00] rounded-md px-3 py-2 transition-colors text-xs md:text-sm font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Profile
                        </Link>
                        <Link className=" px-3 py-1 text-gray-300 dark:text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-600 hover:text-[#FF6B00] rounded-md">
                            {/* <span className="text-xs md:text-sm font-medium">Theme</span> */}
                            <ThemeToggle className="h-4 w-4" />
                        </Link>
                        {/* New User Profile Link */}
                        {/* Logout button with a button-like design */}
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsMenuOpen(false);
                            }}
                            className="text-left w-full bg-red-600 dark:bg-red-700 text-white dark:text-gray-100 font-bold py-2 px-3 rounded-md shadow-sm hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-300 text-xs md:text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;