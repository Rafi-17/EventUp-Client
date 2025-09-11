import React, { useMemo, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useEvent from '../../../hooks/useEvent';
import { ArrowLeft, Calendar, Search } from 'lucide-react';
import FilterTabs from './FilterTabs';
import RegisterEventCard from './RegisterEventCard';
import SectionTitle from '../../../components/SectionTitle/SectionTitle'
import SelfAttendanceModal from './SelfAttendanceModal';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import CancelRegistrationModal from './CancelRegistrationModal';

const RegisteredEvents = () => {
    const {user} = useAuth();
    const axiosSecure = useAxiosSecure();
    const [events, refetch , isLoading] = useEvent({userEmail:user?.email})

    // State
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Calculate event counts
    const eventCounts = useMemo(() => {
        return {
            all: events?.length,
            upcoming: events?.filter(e => e.status === 'upcoming')?.length,
            completed: events?.filter(e => e.status === 'completed')?.length,
            cancelled: events?.filter(e => e.status === 'cancelled')?.length
        };
    }, [events]);

    // Filter events
    const filteredEvents = useMemo(() => {
        return events?.filter(event => {
            const matchesFilter = activeFilter === 'all' || event.status === activeFilter;
            const matchesSearch = event.title?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                                event.location?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                                event.organizerName?.toLowerCase().includes(searchTerm?.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [events, activeFilter, searchTerm]);

    // Handle actions
    const handleAction = (action, event) => {
        console.log(`${action} action for event:`, event._id);
        switch (action) {
        case 'view':
            window.location.href = `/eventDetails/${event._id}`;
            break;
        case 'cancel':
            setSelectedEvent(event);
            setShowCancelModal(true);
            break;
        case 'attendance':
            setSelectedEvent(event);
            setShowAttendanceModal(true);
            break;
        case 'review':
            // Navigate to add review page
            window.location.href = `/dashboard/reviews?eventId=${event._id}`;
            break;
        default:
            break;
        }
    };
    const handleAttendanceConfirm = async (secretCode) => {
        try {
            const response = await axiosSecure.patch(
            `/events/${selectedEvent._id}/mark-self-attendance`,
            { secretCode }
            );
            
            if (response.data.modifiedCount>0) {
                toast.success('Attendance marked successfully!', {
                    position: 'top-right'
                });
                setShowAttendanceModal(false);
                setSelectedEvent(null);
                refetch();
            }
            
        } catch (error) {
            console.error('Attendance marking error:', error);
            
                // Show specific error message from backend
                const errorMessage = error.response?.data?.message || 'Failed to mark attendance';
                toast.error(errorMessage, {
                position: 'top-right'
            });
            
            // Don't close modal on error so user can try again
        }
    };

    const handleAttendanceCancel = () => {
        setShowAttendanceModal(false);
        setSelectedEvent(null);
    };

    const handleCancelRegConfirm= async(event)=>{
        // console.log(event);
        try{
            const res = await axiosSecure.patch(`/events/cancelRegistration/${event._id}`)
            if(res.data.modifiedCount>0){
                toast.success('Registration cancelled!', {
                    position: 'top-right'
                });
                setShowCancelModal(false);
                setSelectedEvent(null);
                refetch();
            }
        }catch(error){
            console.error('Attendance marking error:', error);
                const errorMessage = error.response?.data?.message || 'Failed to cancel registration';
                toast.error(errorMessage, {
                position: 'top-right'
            });   
        }
    }

    const handleCancelRegCancel=()=>{
        setShowCancelModal(false);
        setSelectedEvent(null);
    }

    if (isLoading) {
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 bg-gray-300 rounded-xl"></div>
                ))}
                </div>
            </div>
            </div>
        </div>
        );
    }

    return (
        <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
        
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        My Registered Events
                        </h1>
                        <p className="text-gray-600 mt-1">
                        You're registered for {events?.length} event{events?.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="mb-4 text-sm text-gray-500">
                        Dashboard / My Registered Events
                    </div>
                </div>
                {/* <SectionTitle heading={"My Registered Events"} subHeading={"A list of all the events you have signed up for"}></SectionTitle> */}

                {/* Search */}
                <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                    type="text"
                    placeholder="Search events by title, location, or organizer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full outline-none pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
                    />
                </div>
                </div>

                {/* Filter Tabs */}
                <FilterTabs 
                activeFilter={activeFilter} 
                onFilterChange={setActiveFilter}
                eventCounts={eventCounts}
                />

                {/* Events List */}
                {filteredEvents?.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'No events found' : `No ${activeFilter === 'all' ? '' : activeFilter} events`}
                    </h3>
                    <p className="text-gray-600 mb-4">
                    {searchTerm 
                        ? 'Try adjusting your search terms'
                        : activeFilter === 'all' 
                        ? "You haven't registered for any events yet"
                        : `You don't have any ${activeFilter} events`
                    }
                    </p>
                    {!searchTerm && activeFilter === 'all' && (
                    <button 
                        onClick={() => window.location.href = '/events'}
                        className="bg-[#FF6B00] text-white px-6 py-2 rounded-lg hover:bg-[#E55A00] transition-colors"
                    >
                        Browse Events
                    </button>
                    )}
                </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                    <RegisterEventCard
                        key={event._id}
                        event={event}
                        onAction={handleAction}
                    />
                    ))}
                </div>
                )}

                {/* Stats Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                Showing {filteredEvents?.length} of {events?.length} registered events
                </div>
            </div>
            <SelfAttendanceModal
                isOpen={showAttendanceModal}
                event={selectedEvent}
                onConfirm={handleAttendanceConfirm}
                onCancel={handleAttendanceCancel}
            />
            <CancelRegistrationModal
                isOpen={showCancelModal}
                event={selectedEvent}
                onConfirm={handleCancelRegConfirm}
                onCancel={handleCancelRegCancel}
            />
        </div>
    );

};

export default RegisteredEvents;