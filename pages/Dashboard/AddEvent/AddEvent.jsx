import EventForm from '../../../components/EventForm/EventForm';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';

const AddEvent = () => {

    return (
        <div className="bg-gray-50 min-h-screen py-4 px-4 md:px-8 flex flex-col items-center">
            {/* Section Title moved outside */}
            <SectionTitle 
                subHeading="Event Creation"
                heading="Create New Event"
                variant="dashboard"
                alignment="center"
                size="normal"
                showLine={true}
                className=""
                // description="Fill in the details to create your volunteer opportunity"
            />

            {/* Main Form Container */}
            <EventForm page={'add'}></EventForm>
        </div>
    );
};

export default AddEvent;