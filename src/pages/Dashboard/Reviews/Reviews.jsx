import { useQueries, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import { ArrowLeft, CheckCircle, MessageSquare, Star, Trash2, XCircle } from 'lucide-react';
import useRole from '../../../hooks/useRole';
import useTheme from '../../../hooks/useTheme';
import toast from 'react-hot-toast';

const Reviews = () => {
    const {eventId} = useParams();
    const axiosSecure = useAxiosSecure();
    const [role] = useRole();
    const navigate = useNavigate();
    const {darkMode} = useTheme();
    // states
    const [activeFilter, setActiveFilter] = useState('eventReviews');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reviewToActOnId, setReviewToActOnId] = useState(null);
    const [actionType, setActionType] = useState('');
    // console.log(eventId);
    const reviewsQueries = useQueries({
        queries: [
            {
                queryKey: ['reviews', eventId, 'eventReviews'],
                queryFn: async () => {
                    const res = await axiosSecure.get(`/reviews/${eventId}`);
                    // console.log(res.data);
                    return res.data;
                },
                enabled: !!eventId,
            },
            {
                queryKey: ['reviews', eventId, 'allApproved'],
                queryFn: async () => {
                    const res = await axiosSecure.get(`/reviews/${eventId}?status=approved`);
                    return res.data;
                },
                enabled: !!eventId && role === 'admin',
            },
        ],
    });

    const [eventReviewsQuery, allApprovedReviewsQuery] = reviewsQueries;
    const eventReviews = eventReviewsQuery.data || [];
    const allApprovedReviews = allApprovedReviewsQuery.data || [];
    const isLoading = eventReviewsQuery.isLoading || allApprovedReviewsQuery.isLoading;
    const {data:eventInfo = {}} = useQuery({
        queryKey: ['eventInfo', eventId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/events/${eventId}`);
            return res.data;
        },
        enabled: !!eventId,
    });

    const handleReviewAction = async () => {
        setIsModalOpen(false);
        try {
            const res = await axiosSecure.patch(`/reviews/${reviewToActOnId}/status`, { approved: actionType === 'approved' });
            if (res.data.modifiedCount > 0) {
                toast.success(`Review has been ${actionType}.`, { position: 'top-right',
                    style: {
                        background: darkMode ? '#1F2937' : 'white',
                        color: darkMode ? '#F9FAFB' : '#111827',
                    },
                 });
                eventReviewsQuery.refetch();
                allApprovedReviewsQuery.refetch();
            } else {
                toast.error('Failed to update review status.', { position: 'top-right',
                    style: {
                        background: darkMode ? '#1F2937' : 'white',
                        color: darkMode ? '#F9FAFB' : '#111827',
                    },
                 });
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Please try again.', { position: 'top-right' });
        }
    };

    const openConfirmationModal = (reviewId, action) => {
        setReviewToActOnId(reviewId);
        setActionType(action);
        setIsModalOpen(true);
    };
    

    const renderStars = (rating) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                    />
                ))}
            </div>
        );
    };

    let reviews = [];
    if (activeFilter === 'eventReviews') {
        reviews = eventReviews;
    } else {
        reviews = allApprovedReviews;
    }

    const hasAnyReviews = eventReviews?.length > 0;

    if (isLoading) {
        return <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">Loading...</div>;
    }

//     if ((!reviews || reviews.length === 0) && reviewsQueries[0].data?.length === 0) {
//     return (
//         <div className="px-4 pb-4 sm:p-4 lg:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
//             <div className="max-w-7xl mx-auto">
//                 <div className="flex items-center justify-between mb-8 md:mb-20 lg:mb-28">
//                     <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">Reviews for "{eventInfo.title}"</h1>
//                     <button
//                         onClick={()=>navigate('/dashboard/manageEvents')}
//                         className="hidden sm:flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] transition-colors"
//                     >
//                         <ArrowLeft className="w-5 h-5" />
//                         <span>Back</span>
//                     </button>
//                 </div>

//                 <div className="text-center py-12">
//                     <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
//                     <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Reviews Found</h3>
//                     <p className="text-gray-600 dark:text-gray-400">There are no reviews for this event yet.</p>
//                 </div>
//             </div>
//         </div>
//     );
// }
    
    return (
        <div className="px-4 pb-4 sm:p-4 lg:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Reviews for "{eventInfo.title}"
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            A list of all volunteer reviews for this event.
                        </p>
                    </div>
                     <button
                        onClick={()=>navigate('/dashboard/manageEvents')}
                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                </div>

                {/* Review Tabs (Admin Only) */}
                {role === 'admin' && (
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
                        <nav className="flex space-x-8">
                            <button
                                onClick={() => setActiveFilter('eventReviews')}
                                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeFilter === 'eventReviews'
                                        ? 'border-[#FF6B00] text-[#FF6B00]'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                                Event Reviews ({eventReviews.length})
                            </button>
                            <button
                                onClick={() => setActiveFilter('allApproved')}
                                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeFilter === 'allApproved'
                                        ? 'border-[#FF6B00] text-[#FF6B00]'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                                All Approved Reviews ({allApprovedReviews.filter(r => r.approved).length})
                            </button>
                        </nav>
                    </div>
                )}

                {/* {!hasAnyReviews && (
                    <div className="text-center py-12">
                        <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Reviews Found</h3>
                        <p className="text-gray-600 dark:text-gray-400">There are no reviews for this event yet.</p>
                    </div>
                )}

                {hasAnyReviews && reviewsToDisplay.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            No {activeFilter === 'eventReviews' ? 'pending' : 'approved'} reviews found.
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            There are no reviews in this category for this event.
                        </p>
                    </div>
                )} */}


                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.length === 0 ? (
                         <div className="text-center py-32">
                        <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Reviews Found</h3>
                        <p className="text-gray-600 dark:text-gray-400">There are no reviews for this event yet.</p>
                    </div>
                    ) : (
                        reviews.map(review => (
                            <div key={review._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-7 h-7 md:w-10 md:h-10 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                            {review?.reviewerName?.split(' ').map(n=>n[0])}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{review.reviewerName}</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{review.reviewerRole}</p>
                                            <div className="flex items-center mt-1">
                                                {renderStars(review.rating)}
                                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                                    ({review.rating}/5)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {role === 'admin' && activeFilter === 'eventReviews' && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openConfirmationModal(review._id, 'approved')}
                                                className="p-2 rounded-full text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
                                                title="Approve Review"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                     {role === 'admin' && activeFilter === 'allApproved' && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openConfirmationModal(review._id, 'rejected')}
                                                className="p-2 rounded-full text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                                                title="Remove Approval"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                     )}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium italic">"{review.quote}"</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{review.eventExperience}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {
                isModalOpen && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Confirm Action</h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{`Are you sure you want to ${actionType==='approved' ? 'approve' : 'disapprove'} this review?`}</p>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleReviewAction}
                                        className="px-4 py-2 text-sm font-medium rounded-md text-white bg-[#FF6B00] hover:bg-[#E65A00] transition-colors"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default Reviews;