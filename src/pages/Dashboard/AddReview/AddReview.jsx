import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Calendar, MapPin, User, Send, AlertTriangle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const AddReview = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [role] = useRole();
  const axiosSecure = useAxiosSecure();

  // State
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [review, setReview] = useState({
    quote: '',
    rating: 0,
    eventExperience: ''
  });
  const [errors, setErrors] = useState({});

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axiosSecure.get(`/events/${eventId}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
        navigate('/dashboard/registeredEvents');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, []);
  console.log(event);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!review.quote.trim()) {
      newErrors.quote = 'Review quote is required';
    } else if (review.quote.trim().length < 10) {
      newErrors.quote = 'Review must be at least 10 characters long';
    } else if (review.quote.trim().length > 300) {
      newErrors.quote = 'Review must not exceed 300 characters';
    }

    if (review.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!review.eventExperience.trim()) {
      newErrors.eventExperience = 'Please share your experience';
    } else if (review.eventExperience.trim().length < 20) {
      newErrors.eventExperience = 'Experience description must be at least 20 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const reviewData = {
        eventId: event._id,
        eventTitle: event.title,
        quote: review.quote.trim(),
        rating: review.rating,
        eventExperience: review.eventExperience.trim(),
        reviewerName: user?.displayName,
        reviewerEmail: user?.email,
        reviewerRole: role,
        date: new Date(),
        approved: false
      };

      const response = await axiosSecure.post('/reviews', reviewData);

      if (response.data.insertedId) {
        toast.success('Review submitted successfully! It will be reviewed by admin before being published.', {
          position: 'top-right',
          duration: 5000
        });
        navigate('/dashboard/registeredEvents');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle rating click
  const handleRatingClick = (rating) => {
    setReview(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setReview(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="bg-white rounded-xl p-6 space-y-4">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto text-center py-12">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Event Not Found</h3>
          <p className="text-gray-600 mb-6">The event you're trying to review could not be found.</p>
          <button
            onClick={() => navigate('/dashboard/registeredEvents')}
            className="bg-[#FF6B00] text-white px-6 py-2 rounded-lg hover:bg-[#E55A00] transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Add Review</h1>
            <p className="text-gray-600 mt-1">Share your experience with this event</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard/registeredEvents')}
            className="flex items-center space-x-2 text-gray-600 hover:text-[#FF6B00] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Event Info Card */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{event.title}</h2>
              <span className="bg-[#FF6B00] bg-opacity-10 text-[#FF6B00] px-3 py-1 rounded-full text-sm font-medium">
                {event.category}
              </span>
            </div>
            
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-[#FF6B00]" />
                <span>{formatDate(event.date)}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-[#FF6B00]" />
                <span>{event.location}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-[#FF6B00]" />
                <span>Organized by {event.organizerName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Your Review</h3>
            <p className="text-gray-600 text-sm mt-1">
              Your review will be reviewed by admin before being published on the website
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Rate this event *
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className={`p-1 transition-colors ${
                      star <= review.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                ))}
                <span className="ml-3 text-sm text-gray-600">
                  {review.rating > 0 && (
                    <span className="font-medium">
                      {review.rating === 1 ? 'Poor' :
                       review.rating === 2 ? 'Fair' :
                       review.rating === 3 ? 'Good' :
                       review.rating === 4 ? 'Very Good' : 'Excellent'}
                    </span>
                  )}
                </span>
              </div>
              {errors.rating && (
                <p className="mt-2 text-sm text-red-600">{errors.rating}</p>
              )}
            </div>

            {/* Review Quote */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Review Quote *
              </label>
              <textarea
                value={review.quote}
                onChange={(e) => handleInputChange('quote', e.target.value)}
                placeholder="Write a brief, impactful quote about your experience..."
                className={`w-full outline-none
                     px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent resize-none ${
                  errors.quote ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
                maxLength={300}
              />
              <div className="flex justify-between items-center mt-2">
                <div>
                  {errors.quote && (
                    <p className="text-sm text-red-600">{errors.quote}</p>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {review.quote.length}/300 characters
                </p>
              </div>
            </div>

            {/* Event Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tell us about your experience *
              </label>
              <textarea
                value={review.eventExperience}
                onChange={(e) => handleInputChange('eventExperience', e.target.value)}
                placeholder="Describe your overall experience, what you liked, what could be improved..."
                className={`w-full outline-none px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent resize-none ${
                  errors.eventExperience ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={5}
              />
              {errors.eventExperience && (
                <p className="mt-2 text-sm text-red-600">{errors.eventExperience}</p>
              )}
            </div>

            {/* Reviewer Info Display */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Review will be submitted as:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Name:</span> {user.displayName || user.name}</p>
                <p><span className="font-medium">Role:</span> {role}</p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Review Guidelines:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Reviews are moderated and must be approved before appearing on the website</li>
                    <li>Please be honest and constructive in your feedback</li>
                    <li>Inappropriate content or spam will be rejected</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard/registeredEvents')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-[#FF6B00] text-white rounded-lg hover:bg-[#E55A00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default AddReview;