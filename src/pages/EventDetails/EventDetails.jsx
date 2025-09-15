import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  FolderPen, 
  MapPin, 
  Users, 
  User, 
  Mail, 
  Share2, 
  MessageCircle, 
  Send,
  Clock,
  UserPlus,
  ArrowLeft,
  Heart,
  Eye,
  X,
  CheckCircle,
  Globe
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { Link, useLoaderData, useParams } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FaComments, FaCopy, FaFacebook, FaFacebookMessenger, FaTrash, FaWhatsapp } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './EventDetails.css'

const EventDetails = () => {
    const totalCommentsValue = useLoaderData();
    const [totalComments,setTotalComments] = useState(totalCommentsValue)
    // console.log(totalComments);
    const {eventId} = useParams(); 
    const { user } = useAuth();
    // console.log(user);
    const axiosSecure = useAxiosSecure();
    const axiosPublic = useAxiosPublic();
  
  const [commentText, setCommentText] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(89);
  const [shareCount, setShareCount] = useState(23);
  const [hasMoreComments, setHasMoreComments] = useState(totalComments>3)
  // const [isCommentCollectionChanged, setIsCommentCollectionChanged] = useState(false);
  const { data : event={}, refetch, isLoading:isEventLoading } = useQuery({
        queryKey:['event'],
        queryFn: async()=>{
            const res = await axiosPublic.get(`/events/${eventId}`)
            // console.log(res.data);
            return res.data;
        }
    })
  
  const { data : allComments = [], refetch:refetchComments, isLoading } = useQuery({
    queryKey: ['comments', eventId],
    queryFn: async() =>{
        const res = await axiosPublic.get(`/comments/${eventId}`)
        // console.log(res.data);
        return res.data;
    }
  })
  const [page, setPage] = useState(0);
  const initialComments = 3;
  const commentsPerLoad = 5;
  const [displayComments,setDisplayComments] = useState([]);
  const [currentComments, setCurrentComments] = useState(initialComments);

  useEffect(() => {
      // This effect runs only when allComments has data
      if (allComments && allComments.length > 0) {
          // We set the initial display comments to the first 3
          setDisplayComments(allComments.slice(0, currentComments));
      }
  }, [allComments]); // The effect depends on allComments

  const handleLoadMoreComments = () =>{
      console.log('load more comments tapped');
      setPage(page + 1);
      const lastIndex = (page + 1) * commentsPerLoad + initialComments;
      setDisplayComments(allComments.slice(0, lastIndex));
      setCurrentComments(currentComments+5);
  }

  useEffect(()=>{
      if(currentComments>=totalComments){
          setHasMoreComments(false);
      }
  },[currentComments])
//   useEffect(() => {
//         const limit = page===0 ? initialComments : commentsPerLoad;
//         const skip = page < 2 ? page*3 : ((page-1)*5)+3;
//         axiosPublic.get(`/comments/${eventId}?limit=${limit}&skip=${skip}`)
//         .then(res=>{
//             setDisplayComments([...displayComments,...res.data])
//         })
//         // if (fetchedComments && fetchedComments.length > 0) {
//         //     setComments(prevComments => [...prevComments, ...fetchedComments]);
//         // }
//     }, [page]);

//     // Check if there are more comments to load
//     useEffect(() => {
//       // Logic to determine if there are more comments
//       // You would get the total count from the backend response. For now, we simulate.
//       if (fetchedComments.length < commentsPerLoad && page > 0) {
//         setHasMoreComments(false);
//       }
//       if (fetchedComments.length < initialCommentsToLoad && page === 0) {
//         setHasMoreComments(false);
//       }
//     }, [fetchedComments, commentsPerLoad, page, initialCommentsToLoad]);

//     const handleLoadMoreComments = () => {
//         setPage(prevPage => prevPage + 1);
//     };

  const isEventFull = event.volunteers?.length >= event.requiredVolunteers;
  const isVolunteerRegistered = event.volunteers?.some(volunteer => volunteer.email === user?.email);
  const volunteersNeeded = event.requiredVolunteers;
  const volunteersJoined = event.volunteers ? event.volunteers.length : 0;
  const progress = volunteersNeeded > 0 ? (volunteersJoined / volunteersNeeded) * 100 : 0;
  const vacanciesLeft = volunteersNeeded > volunteersJoined ? volunteersNeeded - volunteersJoined : 0;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const handleSubmitComment = async(e) => {
      e.preventDefault();
      const comment = e.target.comment.value;
      if(!comment.trim()){
        return <span>Empty</span>
      }
      const commentObj={
        user_name : user?.displayName,
        user_email : user?.email,
        comment,
        timestamp : new Date(),
        eventId
      }
      const res = await axiosSecure.post('/comments',commentObj)
      if(res.data.insertedId){
        e.target.reset();
        setTotalComments(totalComments+1)
        refetchComments();
      }
  };

  const handleDeleteComment=(id)=>{
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: 'responsive-swal',
        title: 'responsive-swal-title',
        htmlContainer: 'responsive-swal-text',
        icon: 'responsive-icon',
        confirmButton: 'responsive-confirm',
        cancelButton: 'responsive-cancel'
      }
    }).then(async(result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/comments/${id}`) 
        if(res.data.deletedCount>0){
          setTotalComments(totalComments-1)
          refetchComments();
        }
      }
    });
  }

  const handleRegister = async () => {
        if (!user) {
            toast.error("Please log in to register for this event.");
            return;
        }
        if (isVolunteerRegistered) {
            toast.info("You are already registered for this event.");
            return;
        }
        if (isEventFull) {
            toast.error("Sorry, this event is full.");
            return;
        }

        try {
            const res = await axiosSecure.patch(`/events/addVolunteer/${event._id}`, { userEmail: user.email });
            if(res.data.modifiedCount>0){
                toast.success("Successfully registered for the event!");
                refetch();
            }
        } catch (error) {
            console.error("Registration failed:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to register. Please try again.");
            }
        }
    };


  const handleShare = () => {
    setIsShareModalOpen(true);
  };
  const handleShareCount=async()=>{
    await axiosPublic.patch(`/events/share/${eventId}`)
    refetch();
  }

  useEffect(()=>{
    if(event && user){
      const hasLiked = event?.interestedUsers?.includes(user?.email) || false;
      setIsLiked(hasLiked);
    }
  },[user,event])
  const handleLike = () => {
    if(!user){
      return toast.error("Please login to show interest!",{position:'top-right'})
    }
    if (user?.email === event?.organizerEmail) {
        return toast.error("You can't mark your own event as interested.", {position:'top-right'});
    }
    const isUserInterested = event?.interestedUsers?.includes(user?.email) || false;
    // console.log(isUserInterested);
    if(isUserInterested){
      handleUninterested();
    }
    else{
      handleInterested();
    }
    setIsLiked(!isLiked);
  };
  const handleInterested=async()=>{
    await axiosSecure.patch(`/events/interested/${eventId}`,{userEmail:user?.email})
    refetch();
  }
  const handleUninterested= async()=>{
    await axiosSecure.patch(`/events/uninterested/${eventId}`,{userEmail:user?.email})
    refetch();
  }

  const timeAgo = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const seconds = Math.round((now - past) / 1000);

  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30.44); // Average days in a month
  const years = Math.round(days / 365.25); // Average days in a year

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (seconds < 60) {
    return rtf.format(-seconds, 'second');
  } else if (minutes < 60) {
    return rtf.format(-minutes, 'minute');
  } else if (hours < 24) {
    return rtf.format(-hours, 'hour');
  } else if (days < 30) {
    return rtf.format(-days, 'day');
  } else if (months < 12) {
    return rtf.format(-months, 'month');
  } else {
    return rtf.format(-years, 'year');
  }
};

//   const displayComments = comments.slice(0, 3); // Show only first 3 comments
//   const hasMoreComments = comments.length > 3;

  const shareOptions = [
    { name: 'Copy Link', action: () => navigator.clipboard.writeText(window.location.href) },
    { name: 'Facebook', action: () => window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`) },
    { name: 'WhatsApp', action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this event: ${event.title}\n\n${window.location.href}`)}`) },
    { name: 'Messenger', action: () => {
        // You must replace 'YOUR_FACEBOOK_APP_ID' with your actual App ID
        const appId = '1274439771046033'; 
        const link = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/dialog/send?link=${link}&app_id=${appId}`);
    }}
];
const isOrganizer = user?.email === event?.organizerEmail;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to={'/events'} className="flex items-center space-x-2 text-gray-600 hover:text-[#FF6B00] transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Events</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            {isEventLoading ? <span style={{ color: '#FF6B00' }} className="loading loading-dots text-orange loading-md"></span> :
            <button 
              onClick={handleLike}
              className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>}
            <button 
              onClick={handleShare}
              className="flex items-center space-x-2 bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#E55A00] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto md:px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 px-2 md:px-6 space-y-8">
            {/* Event Image and Title */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Eye className="w-4 h-4 text-[#FF6B00]" />
                    <span>{event.views} views</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                
                {/* Key Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#FF6B00] bg-opacity-10 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-[#FF6B00]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-semibold text-gray-900">{formattedDate}</p>
                      <p className="text-sm text-gray-700">{formattedTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#FF6B00] bg-opacity-10 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-[#FF6B00]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold text-gray-900">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-[#FF6B00] bg-opacity-10 p-2 rounded-lg">
                        <Clock className="w-5 h-5 text-[#FF6B00]" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold text-gray-900">{event?.duration || 'Not Fixed'}</p>
                    </div>
                </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-[#FF6B00] bg-opacity-10 p-2 rounded-lg">
                        <FolderPen className="w-5 h-5 text-[#FF6B00]" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-semibold text-gray-900">{event?.category || 'Uncategorized'}</p>
                    </div>
                </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#FF6B00] bg-opacity-10 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-[#FF6B00]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-semibold text-gray-900">{event.status}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-[#FF6B00] bg-opacity-10 p-2 rounded-lg">
                      <Globe className="w-5 h-5 text-[#FF6B00]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Timezone</p>
                      <p className="font-semibold text-gray-900">BST (UTC+6)</p>
                    </div>
                  </div>
                </div>

                
                

              {/* Description */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Event</h3>
                  <p className="text-gray-700 leading-relaxed">{event.description}</p>
                </div>

              {/* Stats */}
              {/* <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#FF6B00]">{volunteersJoined}</div>
                  <div className="text-sm text-gray-600">Joined</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{vacanciesLeft}</div>
                  <div className="text-sm text-gray-600">Spots Left</div>
                </div>
              </div> */}

              {/* Event Stats For Tablet and Mobile */}
                <div className="border-t lg:hidden border-gray-200 pt-6 mb-6">
                <div className="flex items-center justify-center space-x-8">
                    <div className="flex items-center space-x-2 text-gray-600">
                    <Eye className="w-4 h-4 text-[#FF6B00]" />
                    <span className="text-sm">{event?.views} views</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                    <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : 'text-[#FF6B00]'}`} />
                    <span className="text-sm">{event?.interestedCount} likes</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                    <Share2 className="w-4 h-4 text-[#FF6B00]" />
                    <span className="text-sm">{event?.share} shares</span>
                    </div>
                </div>
                </div>

              {/* Organizer Info For Tablet and Mobile */}
            <div className="bg-white block lg:hidden rounded-xl shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Organizer</h3>
              
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-[#FF6B00] bg-opacity-10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-[#FF6B00]" />
                </div>
                <div className="flex-1">
                    <div className='flex gap-2 items-center text-sm'>
                        {/* <FolderPen className='w-4 h-4 text-[#FF6B00]'/> */}
                        <h4 className="font-semibold text-gray-900">{event.organizerName} (Organizer)</h4>
                    </div>
                  {user && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-[#FF6B00]" />
                        <a href={`mailto:${event.organizerEmail}`} className="text-blue-500 hover:underline">
                                    {event.organizerEmail}
                                </a>
                      </div>
                    </div>
                  )}
                  {!user && (
                    <p className="text-sm text-gray-500 mt-1">Log in to view contact details</p>
                  )}
                </div>
              </div>
            </div>

              {/* Registration Button For Tablet and Mobile */}
              <div className="bg-white rounded-xl lg:hidden shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Registration</h3>
              
              {/* Progress Bar for Tablet and Mobile */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Volunteers Joined</span>
                  <span className="text-sm font-semibold text-gray-900">{volunteersJoined}/{volunteersNeeded}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-[#FF6B00] h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <div className='lg:hidden'>
              {user ? (
                <div>
                  {user?.email === event.organizerEmail ? (
                    <button
                        disabled
                        className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
                    >
                        You are the Organizer
                    </button>
                ) :
                  isVolunteerRegistered ? (
                    <button className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2">
                      <UserPlus className="w-5 h-5" />
                      <span>Already Registered</span>
                    </button>
                  ) : isEventFull ? (
                    <button disabled className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed">
                      Event Full
                    </button>
                  ) : (
                    <button 
                      onClick={handleRegister}
                      className="w-full bg-[#FF6B00] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#E55A00] transition-colors flex items-center justify-center space-x-2"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>Register as Volunteer</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <button className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed mb-2">
                    Login to Register
                  </button>
                  <p className="text-sm text-gray-600">Please log in to register for this event</p>
                </div>
              )}
            </div>
            </div>

                
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 relative">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-[#FF6B00]" />
                    Comments ({totalComments})
                </h3>
                
                {/* Comment Form */}
                {user ? (
                    <div className="mb-6">
                        <div className="flex space-x-3">
                            <div className="w-7 h-7 md:w-10 md:h-10 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {user.displayName ? user?.displayName.split(' ').map(n => n[0]).join('') : 'U'}
                            </div>
                            <div className="flex-1">
                                <form onSubmit={handleSubmitComment}>
                                <textarea
                                    
                                    placeholder="Share your thoughts about this event..."
                                    className="w-full px-2 py-1 md:p-3 border border-gray-300 rounded-lg resize-none outline-none focus:ring-2 focus:ring-[#FF6B00] placeholder:text-sm md:placeholder:text-base focus:border-transparent"
                                    rows="3"
                                    name='comment'
                                    required
                                />
                                <div className="flex justify-end mt-1 md:mt-3">
                                    <button
                                        className="flex items-center text-sm md:text-base space-x-1 md:space-x-2 bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#E55A00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-3 h-3 md:w-4 md:h-4" />
                                        <span>Post Comment</span>
                                    </button>
                                </div>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-center">
                        <p className="text-gray-600">Please log in to leave a comment</p>
                    </div>
                )}
                
                {/* Comments List */}
                {isLoading && <span style={{ color: '#FF6B00' }} className="absolute bottom-12 left-1/2 loading loading-dots text-orange loading-md"></span>}
                <div className="space-y-4">
                    {displayComments.map((comment,idx) => (
                        <div key={idx} className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
                            <div className="w-7 h-7 md:w-10 md:h-10 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {comment.user_name.split(' ').map(n=>n[0])}
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center space-x-2 mb-1">
                                    <span className="font-semibold text-gray-900">{comment.user_name}</span>
                                    <span className="text-sm text-gray-500">{timeAgo(comment.timestamp)}</span>
                                </div>
                                <p className="text-gray-700">{comment.comment}</p>
                            </div>
                            {user?.email===comment.user_email && <button onClick={()=>handleDeleteComment(comment._id)} className='text-red-600 text-xs'><FaTrash/></button>}
                        </div>
                    ))}
                    
                    {hasMoreComments && (
                        <div className="text-center pt-4">
                            <button
                                onClick={()=>handleLoadMoreComments()}
                                className="text-[#FF6B00] hover:text-[#E55A00] font-medium transition-colors"
                            >
                                Load More Comments
                            </button>
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* Sidebar  for large device, in tablet and mobile it is hidden*/}
          <div className="space-y-6 hidden lg:block">
            {/* Registration Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Registration</h3>
              
              {/* Progress Bar */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Volunteers Joined</span>
                  <span className="text-sm font-semibold text-gray-900">{volunteersJoined}/{volunteersNeeded}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-[#FF6B00] h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              {/* <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#FF6B00]">{volunteersJoined}</div>
                  <div className="text-sm text-gray-600">Joined</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{vacanciesLeft}</div>
                  <div className="text-sm text-gray-600">Spots Left</div>
                </div>
              </div> */}

              {/* Registration Button */}
              {user ? (
                <div>
                  {user?.email === event.organizerEmail ? (
                    <button
                        disabled
                        className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
                    >
                        You are the Organizer
                    </button>
                ) :
                  isVolunteerRegistered ? (
                    <button className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2">
                      <UserPlus className="w-5 h-5" />
                      <span>Already Registered</span>
                    </button>
                  ) : isEventFull ? (
                    <button disabled className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed">
                      Event Full
                    </button>
                  ) : (
                    <button 
                      onClick={handleRegister}
                      className="w-full bg-[#FF6B00] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#E55A00] transition-colors flex items-center justify-center space-x-2"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>Register as Volunteer</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <button className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed mb-2">
                    Login to Register
                  </button>
                  <p className="text-sm text-gray-600">Please log in to register for this event</p>
                </div>
              )}
            </div>

            {/* Organizer Info */}
            <div className="bg-white block rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Organizer</h3>
              
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-[#FF6B00] bg-opacity-10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-[#FF6B00]" />
                </div>
                <div className="flex-1">
                    <div className='flex gap-2 items-center text-sm'>
                        {/* <FolderPen className='w-4 h-4 text-[#FF6B00]'/> */}
                        <h4 className="font-semibold text-gray-900">{event.organizerName} (Organizer)</h4>
                    </div>
                  {user && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-[#FF6B00]" />
                        <a href={`mailto:${event.organizerEmail}`} className="text-blue-500 hover:underline">
                                    {event.organizerEmail}
                                </a>
                      </div>
                    </div>
                  )}
                  {!user && (
                    <p className="text-sm text-gray-500 mt-1">Log in to view contact details</p>
                  )}
                </div>
              </div>
            </div>
            {/* Event stats */}
            <div className="bg-white rounded-xl block shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Stats</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Views */}
                    <div className="flex flex-col items-center space-x-2 py-3 px-1 bg-gray-50 rounded-lg">
                    <Eye className="w-4 h-4 text-[#FF6B00]" />
                    <span className="text-sm">
                        <span className="font-semibold text-gray-900">{event.views}</span> views
                    </span>
                    </div>
                    
                    {/* Interested */}
                    <div className="flex flex-col items-center space-x-2 py-3 px-1 bg-gray-50 rounded-lg">
                    <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : 'text-[#FF6B00]'}`} />
                    <span className="text-sm">
                        <span className="font-semibold text-gray-900">{event?.interestedCount || 0}</span> interested
                    </span>
                    </div>
                    
                    {/* Shares */}
                    <div className="flex flex-col items-center space-x-2 py-3 px-1 bg-gray-50 rounded-lg">
                    <Share2 className="w-4 h-4 text-[#FF6B00]" />
                    <span className="text-sm">
                        <span className="font-semibold text-gray-900">{event?.share || 0}</span> shares
                    </span>
                </div>
            </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Comments Modal */}

      {/* Share Modal */}
      {isShareModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Share Event</h3>
                <button
                    onClick={() => setIsShareModalOpen(false)}
                    className="text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Social Share Buttons */}
            <div className="flex space-x-6 mb-6">
                {shareOptions.map((option, index) => {
                    const getIcon = (name) => {
                        switch (name) {
                            case 'Facebook':
                                return <FaFacebook className="w-6 h-6" />;
                            case 'WhatsApp':
                                return <FaWhatsapp className="w-6 h-6" />;
                            case 'Messenger':
                                return <FaFacebookMessenger className="w-6 h-6" />;
                            case 'Copy Link':
                                return <FaCopy className="w-6 h-6" />;
                            default:
                                return null;
                        }
                    };
                    const getColor = (name) => {
                        switch (name) {
                            case 'Facebook':
                                return 'bg-blue-600 hover:bg-blue-700';
                            case 'WhatsApp':
                                return 'bg-green-500 hover:bg-green-600';
                            case 'Messenger':
                                return 'bg-blue-500 hover:bg-blue-600';
                            case 'Copy Link':
                                return 'bg-gray-500 hover:bg-gray-600';
                            default:
                                return 'bg-gray-200 hover:bg-gray-300';
                        }
                    };

                    // Only show icons for social media, not for Copy Link
                    if (option.name !== 'Copy Link') {
                        return (
                            <button
                                key={index}
                                onClick={()=>{option.action(); handleShareCount();}}
                                className={`p-3 rounded-full ${getColor(option.name)} text-white transition-colors shadow-md`}
                            >
                                {getIcon(option.name)}
                            </button>
                        );
                    }
                    return null;
                })}
            </div>

            {/* Copy Link Section */}
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or copy event link
                </label>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={window.location.href}
                        readOnly
                        className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-shadow"
                    />
                    <button
                        onClick={()=>{shareOptions.find(opt => opt.name === 'Copy Link')?.action(); handleShareCount();}}
                        className="p-3 bg-[#FF6B00] text-white rounded-lg hover:bg-[#E66200] transition-colors"
                    >
                        <FaCopy className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    </div>
)}
    </div>
  );
};

export default EventDetails;