import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FaEdit, FaTimes } from 'react-icons/fa';
import useTheme from '../../../hooks/useTheme';
import { Clock, Mail } from 'lucide-react';

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [editingUserId, setEditingUserId] = useState(null);
    const queryClient = useQueryClient();
    const {darkMode} = useTheme();
    
    // Fetch all users using TanStack Query
    const { data: users = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ['allUsers'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });
    const pendingOrganizers = users.filter(u => u.role === 'pending-organizer');
    const handleRoleChange=(role, user, e)=>{
        const previousRole = user?.role;
        if (role === user.role) {
            return;
        }
        Swal.fire({
            title: "Are you sure?",
            text: `You want to make ${user?.name} an ${role}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, Make ${role}!`,
            // Add these custom classes for dark mode styling
            customClass: {
                popup: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700',
                title: 'text-gray-900 dark:text-gray-100',
                content: 'text-gray-700 dark:text-gray-300',
                confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
                cancelButton: 'bg-red-600 hover:bg-red-700 text-white',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.patch(`/users/role/${user.email}`, { role })
                    .then(res => {
                        if (res.data.modifiedCount > 0) {
                            toast.success(`${user.name} is ${role==='volunteer' ? 'a' : 'an'} ${role} now.`, {
                                position: 'top-right',
                                style: {
                                    background: darkMode ? '#1F2937' : 'white',
                                    color: darkMode ? '#F9FAFB' : '#111827',
                                },
                            });
                        }
                        refetch();
                        queryClient.invalidateQueries(['pending-organizer-count']);
                    });
            } else {
                e.target.value = previousRole;
            }
        });
    }
//[#FF6B00]
    return (
        <div className="bg-gray-200 dark:bg-gray-900 min-h-screen p-4 md:py-2 md:px-12">
            <SectionTitle subHeading="MANAGE USERS" heading="Roles & Permissions" />
            
            <Tabs className={'lg:mt-12'} defaultIndex={0} selectedTabClassName="!border-b-4 !border-[#FF6B00] !text-[#FF6B00]">
    <TabList className="flex flex-col sm:flex-row space-x-0 sm:space-x-4 mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 border border-gray-200 dark:border-gray-700">
        <Tab className="flex-1 py-2 text-sm font-semibold text-center cursor-pointer border-b-4 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors">
            Pending Organizers
            {pendingOrganizers.length > 0 && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block ml-1"></div>
            )}
        </Tab>
        <Tab className="flex-1 py-2 text-sm font-semibold text-center cursor-pointer border-b-4 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors">All Users List</Tab>
    </TabList>

                <TabPanel>
                    {pendingOrganizers.length > 0 ? (
                        <div className="mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {pendingOrganizers.map(user => (
        <div 
            key={user._id} 
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md dark:shadow-lg flex flex-col items-center text-center border-t-4 border-[#FF6B00] hover:shadow-xl transition-shadow duration-300"
        >
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{user.name}</h4>
            <img 
                src={user.photoURL || 'https://i.ibb.co/3W4T5gW/default-avatar.png'} 
                alt={user.name} 
                className="w-24 h-24 rounded-full mb-4 object-cover ring-2 ring-[#FF6B00]/20" 
            />
            <div className="flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <p className="text-sm text-gray-700 dark:text-gray-200">{user.email}</p>
            </div>
            <div className="flex items-center gap-2 mb-4 whitespace-nowrap">
                <Clock className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <p className="text-sm text-gray-500 dark:text-gray-400 tracking-tight">
                    Requested: {user.reqTime ? 
                        `${new Date(user.reqTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at 
                        ${new Date(user.reqTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}` 
                        : 'N/A'}
                </p>
            </div>
            <div className="mt-4 flex space-x-4">
                <button
                    onClick={(e) => handleRoleChange('organizer', user, e)}
                    className="bg-green-500 dark:bg-green-600 text-white py-2 px-6 rounded-lg text-sm font-medium hover:bg-green-600 dark:hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                    Approve
                </button>
                <button
                    onClick={(e) => handleRoleChange('volunteer', user, e)}
                    className="bg-red-500 dark:bg-red-600 text-white py-2 px-6 rounded-lg text-sm font-medium hover:bg-red-600 dark:hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Reject
                </button>
            </div>
        </div>
    ))}
                            </div>
                        </div>
                    ):
                    <div className="flex justify-center items-center h-40 text-gray-500 dark:text-gray-400 font-semibold text-lg">
                        No pending organizer requests found.
                    </div>
                    }
                </TabPanel>

                <TabPanel>
                    <div className="mt-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead className="bg-gray-800 dark:bg-gray-700">
                                        <tr className="text-white dark:text-gray-100 text-sm leading-normal border-b-2 border-[#FF6B00]">
                                            <th className="py-3 px-6 text-left">#</th>
                                            <th className="py-3 px-6 text-left">Name</th>
                                            <th className="py-3 px-6 text-left">Email</th>
                                            <th className="py-3 px-6 text-left min-w-[150px]">Role</th>
                                            <th className="py-3 px-6 text-left">Registered</th>
                                            <th className="py-3 px-6 text-left">Warnings</th>
                                            <th className="py-3 px-6 text-left">Registered Events</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-800 dark:text-gray-200 text-sm font-light">
                                        {users.map((user, index) => (
                                            <tr key={user._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-default transition-colors group">
                                                <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1}</td>
                                                <td className="py-3 px-6 text-left text-nowrap text-gray-900 dark:text-gray-100">{user.name}</td>
                                                <td className="py-3 px-6 text-left text-gray-600 dark:text-gray-400">{user.email}</td>
                                                <td className='py-3 px-6 text-left min-w-[150px] relative text-nowrap'>
                                                {editingUserId === user._id ? (
                                                    <div className="flex items-center justify-center">
                                                        <select
                                                            onChange={(e) => handleRoleChange(e.target.value, user, e)} 
                                                            defaultValue={user?.role} 
                                                            className="select select-bordered text-xs font-bold bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
                                                        >
                                                            <option value={'volunteer'}>Volunteer</option>
                                                            <option value={'organizer'}>Organizer</option>
                                                            <option value={'admin'}>Admin</option>
                                                        </select> 
                                                        <button 
                                                            onClick={() => setEditingUserId(null)} 
                                                            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full text-red-600 dark:text-red-400 opacity-100 transition-opacity"
                                                        >
                                                            <FaTimes className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-start group">
                                                        <span className="capitalize text-gray-900 dark:text-gray-100">{user?.role}</span>
                                                        <button 
                                                            onClick={() => setEditingUserId(user._id)} 
                                                            className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-[#FF6B00]"
                                                        >
                                                            <FaEdit className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                                </td>
                                                <td className="py-3 px-6 text-left text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="py-3 px-6 text-left">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                                        user.warnings >= 3 ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' :
                                                        user.warnings >= 1 ? 'bg-yellow-300 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                                                        'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                                                    }`}>
                                                        {user.warnings > 0 ? `${user.warnings} Warning${user.warnings > 1 ? 's' : ''}` : 'Good Standing'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-6 text-left text-gray-900 dark:text-gray-100">
                                                    {user.registeredEvents?.length || 0}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    );
};

export default AllUsers;