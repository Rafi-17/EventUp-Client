import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Users, 
  X, 
  Calendar, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Flag,
  MoreVertical,
  Trash2,
  Copy,
  Play,
  Pause,
  Send
} from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';
import useEvent from '../../../hooks/useEvent';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import { Link, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import CancelEventModal from './CancelEventModal';
import DuplicateEventModal from './DuplicateEventModal';

const ManageEvents = () => {
  // Mock data - replace with your actual hooks
//   const user = { email: 'organizer@example.com', name: 'John Doe' };
//   const role = 'organizer'; // or 'admin'
    const {user} = useAuth();
    const [role] = useRole();
    console.log(role);
    const [events, refetch , isLoading] = role === 'admin' ? useEvent({num:0,status:'all'}) : useEvent({num:0,status:'all',organizerEmail:user?.email})
    // console.log(events);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
  
  // Mock events data


  // State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [eventToCancel, setEventToCancel] = useState(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [eventToDuplicate, setEventToDuplicate] = useState(null);
  const [showAdminEventsOnly, setShowAdminEventsOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  useEffect(() => {
        const handleClickOutside = (event) => {
            // If the dropdown is open AND the click is outside of the dropdown's container
            setTimeout(() => {
                const isDropdownButton = event.target.closest('.dropdown-toggle-btn');
            if (!isDropdownButton &&
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)) {
                setOpenDropdownId(null);
                console.log('openDropdownId from the outside click', openDropdownId);
            }
        }, 0);
        };

        // Add the event listener when the dropdown is open
        if (openDropdownId) {
        document.addEventListener('mousedown', handleClickOutside);
    }

        // Clean up the event listener when the component unmounts or the dropdown closes
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdownId]);

    //For debugging->
//     useEffect(() => {
//     console.log('openDropdownId changed to:', openDropdownId);
// }, [openDropdownId]);

  // Filters
  const statusOptions = ['all', 'upcoming', 'completed', 'cancelled'];
  const categoryOptions = ['all', 'Environment', 'Social', 'Education', 'Health', 'Community'];

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events?.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
      const matchesOrganizer = !showAdminEventsOnly || event?.organizerEmail === user?.email;
      return matchesSearch && matchesStatus && matchesCategory && matchesOrganizer;
    });
  }, [events, searchTerm, statusFilter, categoryFilter, showAdminEventsOnly, user?.email]);

  // Helper functions
  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { bg: 'bg-green-100', text: 'text-green-800', label: 'Upcoming' },
      completed: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Completed' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
      ongoing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Ongoing' } 
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

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

  const getAvailableActions = (event) => {
    const isOwner = role === 'organizer' || event.organizerEmail === user?.email;
    const isAdmin = role === 'admin';
    
    const baseActions = ['view'];
    
    if (event.status === 'completed') {
      return [...baseActions, 'duplicate'];
    }
    
    if (event.status === 'cancelled') {
      return isOwner || isAdmin ? [...baseActions, 'reactivate'] : baseActions;
    }
    
    if (isOwner) {
      return [...baseActions, 'edit', 'volunteers', 'cancel'];
    }
    
    if (isAdmin) {
      return [...baseActions, 'volunteers', 'cancel', 'feature'];
    }
    
    return baseActions;
  };

  const ActionButton = ({ action, event, onClick }) => {
    const actionConfig = {
      view: { icon: Eye, label: 'View', className: 'text-gray-600 hover:text-[#FF6B00]' },
      edit: { icon: Edit, label: 'Edit', className: 'text-blue-600 hover:text-blue-700' },
      volunteers: { icon: Users, label: 'Volunteers', className: 'text-green-600 hover:text-green-700' },
      cancel: { icon: XCircle, label: 'Cancel', className: 'text-red-600 hover:text-red-700' },
      feature: { icon: Star, label: event.featured ? 'Unfeature' : 'Feature', className: 'text-yellow-600 hover:text-yellow-700' },
      duplicate: { icon: Copy, label: 'Duplicate', className: 'text-purple-600 hover:text-purple-700' },
      // report: { icon: Flag, label: 'Report', className: 'text-indigo-600 hover:text-indigo-700' },
      // moderate: { icon: Flag, label: 'Moderate', className: 'text-orange-600 hover:text-orange-700' }
    };
    
    const config = actionConfig[action];
    if (!config) return null;
    
    const Icon = config.icon;
    
    if(action === 'view'){
      return <Link to={`/eventDetails/${event._id}`} className={`p-1 rounded hover:bg-gray-100 transition-colors ${config.className}`}
        title={config.label}><Icon className="w-4 h-4" /></Link>
    }
    else if(action === 'edit'){
      const eventDate = new Date(event.date);
      const now = new Date();
      const oneDayInMs = 24 * 60 * 60 * 1000;
      const isEditable = (eventDate.getTime() - now.getTime()) > oneDayInMs;
      if(!isEditable){
        return <button onClick={() => {toast.error("Cannot edit this event, less than 24 hours remaining.", { position: 'top-right' });}} className={`p-1 rounded hover:bg-gray-100 transition-colors ${config.className}`}
        title={config.label}><Icon className="w-4 h-4" /></button>
      }
      return <Link to={`/dashboard/updateEvent/${event._id}`} className={`p-1 rounded hover:bg-gray-100 transition-colors ${config.className}`}
        title={config.label}><Icon className="w-4 h-4" /></Link>
    }
    else if(action === 'volunteers'){
      return <Link to={`/dashboard/manageVolunteers/${event?._id}`} className={`p-1 rounded hover:bg-gray-100 transition-colors ${config.className}`}
        title={config.label}><Icon className="w-4 h-4" /></Link>
    }
    return (
      <button
        onClick={() => onClick(action, event)}
        className={`p-1 rounded hover:bg-gray-100 transition-colors ${config.className}`}
        title={config.label}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  };

  //Handle actions--------------------------->
  const handleAction = (action, event) => {
    console.log(`${action} action for event:`, event._id);
    if(action === 'cancel'){
      setEventToCancel(event);
      setShowCancelModal(true);
    }
    if(action === 'duplicate'){
      setEventToDuplicate(event);
      setShowDuplicateModal(true);
    }
  };
  const confirmCancelEvent = async (event, reason) => {
    try {
      console.log('Cancelling event:', event.title, 'Reason:', reason);
      
      // Update event status to cancelled
      const response = await axiosSecure.patch(`/events/cancel/${event._id}`, {
        reason: reason,
        cancelledBy: user.email,
        cancelledAt: new Date()
      });

      if (response.data.modifiedCount > 0) {
        // Send notifications to all registered volunteers
        const volunteerNotifications = event.volunteers.map(volunteer => 
          axiosSecure.post('/notifications', {
            email: volunteer?.email,
            message: `Event "${event.title}" has been cancelled`,
            reason: reason,
            eventTitle: event.title,
            type: 'sorry',
            read: false,
            timestamp: new Date()
          })
        );

        // If admin cancels organizer's event, notify organizer
        if (role === 'admin' && event.organizerEmail !== user.email) {
          volunteerNotifications.push(
            axiosSecure.post('/notifications', {
              email: event.organizerEmail,
              message: `Your event "${event.title}" has been cancelled by admin`,
              reason: reason,
              eventTitle: event.title,
              type: 'sorry',
              cancelledBy: 'admin',
              read: false,
              timestamp: new Date()
            })
          );
        }

        await Promise.all(volunteerNotifications);
        
        toast.success('Event cancelled successfully', {
          position: 'top-right'
        });
        refetch();

        // Refresh events list (assuming you have refetch function)
        // refetch(); // Uncomment if you have this function
      }
    } catch (error) {
      console.error('Error cancelling event:', error);
      toast.error('Failed to cancel event', {
        position: 'top-right'
      });
    }

    setShowCancelModal(false);
    setEventToCancel(null);
  };
  const confirmDuplicateEvent = async(event, date) =>{
    try{
      console.log('Duplicating event:', date);
      const duplicateEvent = {
            title: event?.title,
            description: event?.description,
            image: event?.image,
            location: event?.location,
            date: date,
            requiredVolunteers: parseInt(event?.requiredVolunteers),
            organizerEmail: user?.email,
            volunteers: [],
            category: event?.category,
            duration: event?.duration,
            volunteersAttended: [],
            status: 'upcoming'
        };
      const res = await axiosSecure.post('/events',duplicateEvent)
      if(res.data.insertedId){
        toast.success('Duplicate event created successfully', {
          position: 'top-right'
        });
        refetch();
      }
    }
    catch(error){
      console.log('Error duplicating event:', error);
      toast.error('Failed to make duplicate',{position:'top-right'})
    }
    setShowDuplicateModal(false);
    setEventToDuplicate(null);
  }

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for events:`, selectedEvents);
    setSelectedEvents([]);
  };

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className=''>
            {/* <SectionTitle heading={'Manage All Events'} subHeading={'Monitor all events on the platform'}></SectionTitle> */}
            {/* <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {role === 'admin' ? 'Manage All Events' : 'My Events'}
            </h1>
            <p className="text-gray-600 mt-1">
              {role === 'admin' 
                ? 'Manage and monitor all events on the platform' 
                : 'Create and manage your events'
              }
            </p> */}
            <SectionTitle 
              // subHeading="Event Management"
              heading="Manage Your Events"
              variant="dashboard"
              alignment="left"
              size="normal"
              showLine={false}
              className="mt-0"
              description={role === 'admin' ? 'Manage and monitor all events on the platform' : "Monitor and manage all your created events"}
          />
          </div>
          <button
            className="bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#E55A00] transition-colors flex items-center space-x-2 justify-center sm:justify-start"
          >
            <Plus className="w-5 h-5" />
            <Link to={'/dashboard/addEvent'}>Create Event</Link>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters 
                ? 'bg-[#FF6B00] text-white border-[#FF6B00]' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full outline-none border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full outline-none border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
                >
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setCategoryFilter('all');
                  }}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedEvents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-sm text-gray-600">
              {selectedEvents.length} event{selectedEvents.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              {role === 'admin' && (
                <button
                  onClick={() => handleBulkAction('feature')}
                  className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200 transition-colors"
                >
                  Feature
                </button>
              )}
              <button
                onClick={() => handleBulkAction('cancel')}
                className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setSelectedEvents([])}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkbox for adminEvents only */}
      {role === 'admin' && (
        <div className="mb-4">
          <div className="flex items-center">
            <input
              id="show-my-events"
              name="show-my-events"
              type="checkbox"
              checked={showAdminEventsOnly}
              onChange={(e) => setShowAdminEventsOnly(e.target.checked)}
              className="h-4 w-4 text-[#FF6B00] cursor-pointer border-gray-300 rounded focus:ring-[#FF6B00]"
            />
            <label htmlFor="show-my-events" className="ml-2 block text-sm text-gray-900">
              Show only my events
            </label>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className=" overflow-hidden">
        {filteredEvents?.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : role === 'admin' 
                  ? 'No events have been created yet'
                  : "You haven't created any events yet"
              }
            </p>
            {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
              <Link to={'/dashboard/addEvent'} 
                className="bg-[#FF6B00] text-white px-6 py-2 rounded-lg hover:bg-[#E55A00] transition-colors"
              >
                Create Your First Event
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-100 h-14 border-b border-gray-200">
                  <tr className=''>
                    <th className="text-left cursor-default pl-6 pr-36 py-3 tracking-wider text-sm font-medium text-gray-700">Event</th>
                    {role === 'admin' && (
                      <th className="text-left cursor-default w-60 px-4 py-3 text-sm font-medium text-gray-700">Organizer</th>
                    )}
                    <th className="text-left cursor-default px-4 py-3 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left whitespace-nowrap cursor-default pl-6 pr-20 py-3 text-sm font-medium text-gray-700">Date & Time</th>
                    <th className="text-left cursor-default px-4 py-3 text-sm font-medium text-gray-700">Volunteers</th>
                    <th className="text-left cursor-default px-4 py-3 text-sm font-medium text-gray-700">Views</th>
                    <th className="text-center cursor-default px-4 py-3 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEvents?.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 flex flex-col justify-center gap-2 text-left">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">{event.title}
                        <span className="bg-[#FF6B00] bg-opacity-10 ml-2 text-[#FF6B00] px-2 py-0.5 rounded text-xs font-medium">{event.category}</span></div>
                        <div className="text-xs text-gray-500">{event.location}</div>
                    </td>
                      {role === 'admin' && (
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-gray-900">{event.organizerName}</div>
                          <div className="text-sm text-gray-500">{event.organizerEmail}</div>
                        </td>
                      )}
                      <td className="px-4 py-4">
                        {getStatusBadge(event.status)}
                      </td>
                      <td className="px-4 w-40 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-1 text-[#FF6B00]" />
                          {formatDate(event.date)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {event.volunteers.length}/{event.requiredVolunteers}
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#FF6B00] h-2 rounded-full"
                              style={{ 
                                width: `${Math.min((event.volunteers.length / event.requiredVolunteers) * 100, 100)}%` 
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Eye className="w-4 h-4 mr-1" />
                          {event.views || 0}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-1 justify-end">
                          {getAvailableActions(event)?.map((action) => (
                            <ActionButton
                              key={action}
                              action={action}
                              event={event}
                              onClick={handleAction}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
              {filteredEvents?.map((event) => (
                <div key={event._id} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{event.title}</h3>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusBadge(event.status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-[#FF6B00]" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-[#FF6B00]" />
                      {event.location}
                    </div>
                    {role === 'admin' && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Send className="w-4 h-4 mr-2 text-[#FF6B00]" />
                        {event.organizerEmail}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {event.volunteers.length}/{event.requiredVolunteers}
                        </span>
                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-[#FF6B00] h-1.5 rounded-full"
                            style={{ 
                              width: `${Math.min((event.volunteers.length / event.requiredVolunteers) * 100, 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{event.views}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 relative">
                      {getAvailableActions(event).slice(0, 3).map((action) => (
                        <ActionButton
                          key={action}
                          action={action}
                          event={event}
                          onClick={handleAction}
                        />
                      ))}
                      {getAvailableActions(event).length > 3 && (
                        <div>
                        <button ref={buttonRef}
                onClick={() => {
                    const newValue = openDropdownId === event._id ? null : event._id;
                    setOpenDropdownId(newValue);
                    console.log('New dropdown ID will be:', newValue); // This will show the correct value
                }}  className="dropdown-toggle-btn p-1 rounded hover:bg-gray-100 transition-colors text-gray-600">
                          <MoreVertical className="w-4 h-4 off" />
                        </button>
                        {openDropdownId===event._id && (
                            <div ref={dropdownRef} className="absolute right-0 bottom-8 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                {getAvailableActions(event).slice(3).map((action) => (
                                    <div key={action} className="p-2 hover:bg-gray-100 transition-colors cursor-pointer">
                                        <ActionButton
                                            key={action}
                                            action={action}
                                            event={event}
                                            onClick={handleAction}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Stats Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        {!isLoading && `Showing ${filteredEvents.length} of ${events?.length} events`}
      </div>
      <CancelEventModal
        isOpen={showCancelModal}
        event={eventToCancel}
        onConfirm={confirmCancelEvent}
        onCancel={() => {
          setShowCancelModal(false);
          setEventToCancel(null);
        }}
      />
      <DuplicateEventModal
        isOpen={showDuplicateModal}
        event={eventToDuplicate}
        onConfirm={confirmDuplicateEvent}
        onCancel={() => {
          setShowDuplicateModal(false);
          setEventToDuplicate(null);
        }}
      />
    </div>
  );
};

export default ManageEvents;