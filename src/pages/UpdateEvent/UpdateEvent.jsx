import React from 'react';
import { useLoaderData } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import EventForm from '../../components/EventForm/EventForm';

const UpdateEvent = () => {
    const event = useLoaderData();
    console.log(event);
    return (
        <div className="bg-gray-50 min-h-screen py-4 px-4 md:px-8 flex flex-col items-center">
            {/* Section Title moved outside */}
            <SectionTitle 
                subHeading="Event Management"
                heading="Update Event"
                variant="dashboard"
                alignment="center"
                size="normal"
                showLine={true}
                className=""
                // description="Modify your event details and settings"
            />

            {/* Main Form Container */}
            <EventForm page={'update'} event={event}></EventForm>
        </div>
    );
};

export default UpdateEvent;