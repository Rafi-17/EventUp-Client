import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FaEdit, FaTimes } from 'react-icons/fa';

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [editingUserId, setEditingUserId] = useState(null);
    const queryClient = useQueryClient();
    
    // Fetch all users using TanStack Query
    const { data: users = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ['allUsers'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });
    const pendingOrganizers = users.filter(u => u.role === 'pending-organizer');
    const handleRoleChange=(role, user)=>{
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
            confirmButtonText: `Yes, Make ${role}!`
            }).then((result) => {
            if (result.isConfirmed) {        
                axiosSecure.patch(`/users/role/${user.email}`,{role})
                .then(res=>{
                    if(res.data.modifiedCount>0){
                        toast.success(`${user.name} is an ${role} now.`,{
                            position:'top-right'
                        })
                    }
                    refetch();
                    queryClient.invalidateQueries(['pending-organizer-count']);
                })
            }
            else{
                e.target.value = previousRole;
            }
        });
    }
//[#FF6B00]
    return (
        <div className="bg-gray-200 min-h-screen p-4 md:py-2 md:px-12">
            <SectionTitle subHeading="MANAGE USERS" heading="Roles & Permissions" />
            
            <Tabs className={'lg:mt-12'} defaultIndex={0} selectedTabClassName="!border-b-4 !border-[#FF6B00] !text-[#FF6B00]">
    <TabList className="flex flex-col sm:flex-row space-x-0 sm:space-x-4 mb-4 bg-white rounded-lg shadow-md p-2">
        <Tab className="flex-1 py-2 text-sm font-semibold text-center cursor-pointer border-b-4 border-gray-300 text-gray-700 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors">Pending Organizers</Tab>
        <Tab className="flex-1 py-2 text-sm font-semibold text-center cursor-pointer border-b-4 border-gray-300 text-gray-700 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors">All Users List</Tab>
    </TabList>

                <TabPanel>
                    {pendingOrganizers.length > 0 ? (
                        <div className="mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingOrganizers.map(user => (
                                    <div key={user._id} className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center border-t-4 border-[#FF6B00]">
                                        <img src={user.photoURL || 'https://i.ibb.co/3W4T5gW/default-avatar.png'} alt={user.name} className="w-20 h-20 rounded-full mb-4 object-cover" />
                                        <h4 className="text-xl font-bold text-gray-900">{user.name}</h4>
                                        <p className=" text-sm text-gray-600 mb-4">{user.email}</p>
                                        <div className="mt-4 flex space-x-3">
                                            <button
                                                onClick={() => handleRoleChange('organizer', user)}
                                                className="bg-green-600 text-white py-2 w-28 rounded-full text-sm font-bold hover:bg-green-700 transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleRoleChange('volunteer', user)}
                                                className="bg-red-600 text-white py-2 w-28 rounded-full text-sm font-bold hover:bg-red-700 transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ):
                    <div className="flex justify-center items-center h-40 text-gray-500 font-semibold text-lg">
                        No pending organizer requests found.
                    </div>
                    }
                </TabPanel>

                <TabPanel>
                    <div className="mt-8">
                        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead className="bg-gray-800">
                                        <tr className="text-white text-sm leading-normal border-b-2 border-[#FF6B00]">
                                            <th className="py-3 px-6 text-left">#</th>
                                            <th className="py-3 px-6 text-left">Name</th>
                                            <th className="py-3 px-6 text-left">Email</th>
                                            <th className="py-3 px-6 text-left min-w-[150px]">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-800 text-sm font-light">
                                        {users.map((user, index) => (
                                            <tr key={user._id} className="border-b border-gray-200 hover:bg-orange-50 cursor-default transition-colors">
                                                <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1}</td>
                                                <td className="py-3 px-6 text-left text-nowrap">{user.name}</td>
                                                <td className="py-3 px-6 text-left">{user.email}</td>
                                                <td className='py-3 px-6 text-left min-w-[150px] relative text-nowrap'>
                                                {editingUserId === user._id ? (
                                                    <div className="flex items-center justify-center group">
                                                        <select
                                                            onChange={(e) => handleRoleChange(user, e.target.value)} 
                                                            defaultValue={user?.role} 
                                                            className="select select-bordered text-xs font-bold"
                                                        >
                                                            <option value={'volunteer'}>Volunteer</option>
                                                            <option value={'organizer'}>Organizer</option>
                                                            <option value={'admin'}>Admin</option>
                                                        </select> 
                                                        <button 
                                                            onClick={() => setEditingUserId(null)} 
                                                            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full text-red-600 opacity-100 transition-opacity"
                                                        >
                                                            <FaTimes className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-start group">
                                                        <span className="capitalize">{user?.role}</span>
                                                        <button 
                                                            onClick={() => setEditingUserId(user._id)} 
                                                            className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full text-gray-500 hover:text-[#FF6B00]"
                                                        >
                                                            <FaEdit className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
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