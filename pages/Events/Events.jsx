import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import EventCard from '../../components/EventCard/EventCard';
import useEvent from '../../hooks/useEvent';
import { FaChevronDown } from 'react-icons/fa';

const Events = () => {
    const [filter, setFilter] = useState('all');
    const [events, refetch, isLoading] = useEvent({num:0, status:filter});
    return (
        <div className='px-4 md:px-2 lg:px-0 mb-20'>
            {/* <SectionTitle heading={'All Upcoming Events'} subHeading={'FIND YOUR OPPORTUNITY'}></SectionTitle> */}
            <SectionTitle 
                subHeading="Volunteer Opportunities"
                heading="Upcoming Events"
                variant="default"
                alignment="center"
                size="normal"
                showLine={true}
                className=""
                // description="Find and join events that match your interests and availability"
            />
            <div className='flex justify-end mb-8'>
                <div className='relative w-max'>
                    <select 
                        className='
                            block appearance-none w-full bg-white border border-gray-300
                            text-gray-700 py-3 px-6 pr-10 rounded-lg leading-tight
                            focus:outline-none focus:ring-2 focus:ring-[#FF6B00]
                            transition-all duration-200 cursor-pointer
                        '
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value);
                        }}
                    >
                        <option value="all">All Events</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    {/* The custom arrow icon */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#FF6B00]">
                        <FaChevronDown />
                    </div>
                </div>
            </div>

            <div className='grid gap-10 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10 relative'>
                {isLoading && <span style={{ color: '#FF6B00' }} className="absolute left-[45%] top-8 md:left-[48%] loading loading-spinner text-orange loading-xl"></span>}
                {
                    events?.length>0 ? 
                    events?.map(event=><EventCard key={event._id} event={event}></EventCard>) :
                    (
                        <div className="text-center col-span-full mt-10">
                            {!isLoading &&
                            <p className="text-gray-500 text-lg">
                                'No events found.
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