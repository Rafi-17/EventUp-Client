import React, { useEffect, useRef, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { FaCaretDown } from 'react-icons/fa';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const UserDropdown = () => {
    const {user, logoutUser} = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

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
                position:'top-right',
                duration:1000
            });
        })
    }
    return (
        <div className="relative" ref={dropdownRef}>
            {/* The profile image trigger */}
            <div 
                className="cursor-pointer flex items-center gap-[2px]" 
                onClick={toggleMenu}
            >
                {user && user?.photoURL ?
                <img
                    src={user?.photoURL}
                    className="w-10 h-10 rounded-full object-cover transition-transform duration-200"
                /> : 
                <span className='rounded-full object-cover transition-transform duration-200'><CgProfile className='w-10 h-10 text-white'/></span>
                }
                <FaCaretDown className="text-white text-lg" /> {/* A more visible icon */}
            </div>

            {/* The dropdown menu, conditionally rendered */}
            {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-gray-900 rounded-lg shadow-lg transition-all duration-300 z-50">
                    <div className="flex flex-col space-y-2">
                        {/* The name is now a distinct, non-clickable element */}
                        <p className="text-white text-xs md:text-sm font-semibold p-2 bg-gray-700 rounded-md">
                            {user?.displayName || "Guest"}
                        </p>
                        <Link
                            to="/dashboard/profile"
                            className="text-gray-300 hover:bg-gray-700 hover:text-[#FF6B00] rounded-md px-3 py-2 transition-colors text-xs md:text-sm font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Profile
                        </Link>
                        <Link
                            to="/dashboard/my-events"
                            className="text-gray-300 hover:bg-gray-700 hover:text-[#FF6B00] rounded-md px-3 py-2 transition-colors text-xs md:text-sm font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        {/* New User Profile Link */}
                        {/* Logout button with a button-like design */}
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsMenuOpen(false);
                            }}
                            className="text-left w-full bg-red-600 text-white font-bold py-2 px-3 rounded-md shadow-sm hover:bg-red-700 transition-colors duration-300 text-xs md:text-sm"
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