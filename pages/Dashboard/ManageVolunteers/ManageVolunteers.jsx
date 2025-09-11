import { useEffect, useRef, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useEvent from "../../../hooks/useEvent";
import useRole from "../../../hooks/useRole";
import { ArrowLeft, Calendar, MapPin, Search, Users } from "lucide-react";
import VolunteerCard from "./VolunteerCard";
import RemoveConfirmationModal from "./RemoveConfirmationModal";
import EventTab from "./EventTab";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ManageVolunteers = () => {
    const containerRef = useRef(null);
    const activeTabRef = useRef(null);
    const hasScrolled = useRef(false);
    const { eventId } = useParams();
    const navigate = useNavigate();
    const {user} = useAuth();
    const [role] = useRole();
    // console.log(role);
    const [allEvents,refetch , isLoading] = role === 'admin' ? useEvent({num:0,status:'all'}) : useEvent({num:0,status:'all',organizerEmail:user?.email})
    // console.log(events);
    const axiosSecure = useAxiosSecure();

    const events = allEvents?.filter(event => 
      event.status !== 'completed' && event.status !== 'cancelled'
    );
  

  // State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [volunteerToRemove, setVolunteerToRemove] = useState(null);
  const [isMarking, setIsMarking] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
        month: 'short',
        day: 'numeric',
        // year: 'numeric'
    };
    
    // Get the date string formatted for UTC
    const datePart = date.toLocaleDateString('en-US', { ...options, timeZone: 'UTC' });

    // Get the time parts in UTC
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${datePart}, ${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Set initial selected event
  useEffect(() => {
        if (events && events.length > 0) {
            let eventToSelect;
            if (eventId) {
                const eventFromUrl = events.find(event => event._id === eventId);
                eventToSelect = eventFromUrl || events[0];
                if (!eventFromUrl) {
                    navigate(`/dashboard/manageVolunteers/${events[0]._id}`, { replace: true });
                }
            } else {
                eventToSelect = events[0];
                navigate(`/dashboard/manageVolunteers/${events[0]._id}`, { replace: true });
            }
            setSelectedEvent(eventToSelect);
        }
    }, [events, eventId, navigate]);

    // This effect handles the scrolling logic after the component renders
    useEffect(() => {
        if (activeTabRef.current && eventId && !hasScrolled.current) {
            activeTabRef.current.scrollIntoView({
                behavior: 'smooth',
                inline: 'center'
            });
            hasScrolled.current=true;
        }
    }, [selectedEvent,eventId]);

    const handleEventTabClick = (event) => {
        navigate(`/dashboard/manageVolunteers/${event._id}`);
        // The useEffect hook above will handle setting the selectedEvent state
    };

  // Get volunteers for selected event
  const selectedEventVolunteers = selectedEvent?.volunteers || [];

  // Filter volunteers based on search
  const filteredVolunteers = selectedEventVolunteers.filter(volunteer =>
    volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle volunteer removal
  const handleRemoveVolunteer = (volunteer) => {
    setVolunteerToRemove(volunteer);
    setShowRemoveModal(true);
  };

  const confirmRemoveVolunteer = async(volunteer, explanation) => {
    console.log('Removing volunteer:', volunteer);
    const res = await axiosSecure.patch(`/events/removeVolunteer/${selectedEvent._id}`, {
        volunteerEmail: volunteer.email
    });
    if(res.data.modifiedCount>0){
      await axiosSecure.post('/notifications', {
          email: volunteer.email,
          message: `You have been removed from "${selectedEvent.title}" event`,
          reason: explanation,
          eventTitle: selectedEvent.title,
          type:'sorry',
          read: false,
          timestamp: new Date()
      });
      if (role === 'admin' && selectedEvent.organizerEmail !== user.email) {
         await axiosSecure.post('/notifications', {
          email: selectedEvent.organizerEmail,
          message: `Volunteer ${volunteer.name} has been removed from your event "${selectedEvent.title}"`,
          reason: explanation,
          eventTitle: selectedEvent.title,
          volunteerName: volunteer.name,
          removedBy: 'admin',
          type:'sorry',
          read: false,
          timestamp: new Date()
      });
      }
      toast.success(`${volunteer?.name} has been removed`,{position:'top-right'})
      refetch();
    }
    // Update the events state to remove the volunteer
    setShowRemoveModal(false);
    setVolunteerToRemove(null);
  };

  // Handle mark present
  const handleAttendance = async(volunteer, isPresent) => {
    console.log('Marking present:', volunteer, isPresent);
    setIsMarking(volunteer.email);
    try{
      const res = await axiosSecure.patch(`/events/${selectedEvent._id}/volunteers/${volunteer?.email}/attendance`,{isPresent})
      console.log(res.data);
      if(res.data.modifiedCount>0){
        await refetch();
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    }
    catch(error){
      toast.error("Failed to update attendance");
    }finally{
      setIsMarking(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="flex space-x-4 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-72 h-32 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Manage Volunteers</h1>
            <button 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-[#FF6B00] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>
          
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600">You haven't created any events yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Manage Volunteers
            </h1>
            <p className="text-gray-600 mt-1">
              {role === 'admin' 
                ? 'Manage volunteers across all events' 
                : 'Manage volunteers for your events'
              }
            </p>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-[#FF6B00] transition-colors self-start sm:self-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Events</span>
          </button>
        </div>

        {/* Event Tabs */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Event</h2>
          <div ref={containerRef} className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
            {events.map((event) => (
              <EventTab
                key={event._id}
                event={event}
                isActive={selectedEvent?._id === event._id}
                onClick={() => handleEventTabClick(event)}
                ref={selectedEvent?._id === event._id ? activeTabRef : null}
              />
            ))}
          </div>
        </div>

        {/* Selected Event Content */}
        {selectedEvent && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            
            {/* Event Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="w-full">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{selectedEvent?.title}</h3>
                    <span className="bg-[#FF6B00] bg-opacity-10 text-[#FF6B00] px-3 py-1 rounded-full text-sm font-medium">
                      {selectedEvent?.category || 'uncategorized'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-[#FF6B00]" />
                      {formatDate(selectedEvent?.date)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-[#FF6B00]" />
                      {selectedEvent?.location}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Volunteer Progress</span>
                      <span className="font-semibold text-gray-900">
                        {selectedEventVolunteers?.length}/{selectedEvent?.requiredVolunteers} registered
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#FF6B00] h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((selectedEventVolunteers.length / selectedEvent.requiredVolunteers) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search volunteers by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
                />
              </div>
            </div>

            {/* Volunteers List */}
            <div className="p-3 sm:p-6">
              {filteredVolunteers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'No volunteers found' : 'No volunteers registered'}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm 
                      ? 'Try adjusting your search terms'
                      : 'No one has registered for this event yet'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">
                      Registered Volunteers ({filteredVolunteers.length})
                    </h4>
                    {/* <div className="text-sm text-gray-600">
                      Present: {filteredVolunteers.filter(v => v.isPresent).length}
                    </div> */}
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredVolunteers.map((volunteer) => (
                      <VolunteerCard
                        key={volunteer.email}
                        volunteer={volunteer}
                        eventDate={selectedEvent.date}
                        onRemove={handleRemoveVolunteer}
                        onMarkPresent={handleAttendance}
                        markPresentButton={user?.email===selectedEvent?.organizerEmail}
                        eventTitle={selectedEvent?.title}
                        isMarking={isMarking}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Remove Confirmation Modal */}
        <RemoveConfirmationModal
          isOpen={showRemoveModal}
          volunteer={volunteerToRemove}
          onConfirm={confirmRemoveVolunteer}
          onCancel={() => {
            setShowRemoveModal(false);
            setVolunteerToRemove(null);
          }}
        />
      </div>
    </div>
  );
};

export default ManageVolunteers;