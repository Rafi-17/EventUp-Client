import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import EventCard from '../../components/EventCard/EventCard';
import useEvent from '../../hooks/useEvent';
import { FaChevronDown } from 'react-icons/fa';
import { Search } from 'lucide-react';

const Events = () => {
    //states
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    //hooks
    // const [events, refetch, isLoading] = useEvent({status:filter});
    const [events, refetch, isLoading] = useEvent({
        status: statusFilter,
        category: categoryFilter,
        search: searchTerm
    });
    const categoryOptions = ['all', 'Environment', 'Social', 'Education', 'Health', 'Community'];
    const statusOptions = ['all', 'upcoming', 'completed', 'cancelled'];
    return (
        <div className='bg-gray-100 dark:bg-gray-900 px-4 md:px-2 lg:px-4 xl:px-8 mb-20'>
            <SectionTitle 
                subHeading="Volunteer Opportunities"
                heading="Upcoming Events"
                variant="default"
                alignment="center"
                size="normal"
                showLine={true}
                className=""
            />
            
            <div className='md:flex flex-col md:flex-row items-center justify-between gap-4 mb-8'>
                {/* Search Input */}
                <div className="relative md:flex-1 mb-2 md:mb-0">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by title, location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full outline-none pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                </div>

                {/* Category Filter */}
                <div className='relative w-max inline-block md:block mr-2 md:mr-0'>
                    <select
                        className='
                            block appearance-none w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                            text-gray-700 dark:text-gray-300 py-3 px-3 md:px-6 pr-10 md:pr-10 rounded-lg leading-tight tracking-tighter md:tracking-normal
                            focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all duration-200 cursor-pointer
                        '
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        {categoryOptions.map(category => (
                            <option key={category} value={category}>
                                {category === 'all' ? 'All Categories' : category}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#FF6B00]">
                        <FaChevronDown />
                    </div>
                </div>

                {/* Status Filter */}
                <div className='relative w-max inline-block md:block'>
                    <select
                        className='
                            block appearance-none w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                            text-gray-700 dark:text-gray-300 py-3 px-3 md:px-6 pr-10 md:pr-10 rounded-lg leading-tight tracking-tighter md:tracking-normal
                            focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all duration-200 cursor-pointer
                        '
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        {statusOptions.map(status => (
                            <option key={status} value={status}>
                                {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#FF6B00]">
                        <FaChevronDown />
                    </div>
                </div>
            </div>

            <div className='grid gap-10 md:grid-cols-2 md:gap-8 xl:grid-cols-3 lg:gap-10 relative'>
                {isLoading && <span style={{ color: '#FF6B00' }} className="absolute left-[45%] top-8 md:left-[48%] loading loading-spinner text-orange loading-xl"></span>}
                {
                    events?.length > 0 ? 
                    events?.map(event => <EventCard key={event._id} event={event}></EventCard>) :
                    (
                        <div className="text-center col-span-full mt-10">
                            {!isLoading &&
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                No events found.
                            </p>
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Events;