import EventForm from '../../../components/EventForm/EventForm';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';

const AddEvent = () => {

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-4 sm:py-4 px-4 md:px-8 flex flex-col items-center">
            {/* Section Title moved outside */}
            <SectionTitle 
                subHeading="Event Creation"
                heading="Create New Event"
                variant="dashboard"
                alignment="center"
                size="normal"
                showLine={true}
                className="my-0 md:my-3 lg:my-6"
                // description="Fill in the details to create your volunteer opportunity"
            />

            {/* Main Form Container */}
            <EventForm page={'add'}></EventForm>
        </div>
    );
};

export default AddEvent;