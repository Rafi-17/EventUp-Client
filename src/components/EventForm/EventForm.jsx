import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axios from 'axios';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`

const EventForm = ({page, event}) => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // const [secretCode, setSecretCode] = useState('');
    // const debounceTimeoutRef = useRef(null);

    const { register, handleSubmit, reset, formState: { errors }, watch, setError, clearErrors, setValue } = useForm();

    const watchedSecretCode = watch('secretCode', '');
    const watchedImageFile = watch("image", null);
    const previewImage = (watchedImageFile && watchedImageFile.length > 0) ? URL.createObjectURL(watchedImageFile[0]) : (event?.image || null);

    //convert duration to minutes
    const convertDurationToMinutes = (durationString) => {
        let totalMinutes = 0;
        const lowerCaseString = durationString.toLowerCase();

        // Regex to find all number-unit pairs
        const regex = /(\d+\.?\d*)\s*(day|days|hour|hours|minute|minutes)/g;
        let match;

        while ((match = regex.exec(lowerCaseString)) !== null) {
            const value = parseFloat(match[1]);
            const unit = match[2];

            switch (unit) {
                case 'day':
                case 'days':
                    totalMinutes += value * 24 * 60;
                    break;
                case 'hour':
                case 'hours':
                    totalMinutes += value * 60;
                    break;
                case 'minute':
                case 'minutes':
                    totalMinutes += value;
                    break;
            }
        }

        return parseInt(totalMinutes);
    };

    const generateCode = useCallback(() => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        setValue('secretCode',code);
        return code;
    }, [setValue]);

    const { data: codeAvailability, isFetching, isLoading, isError } = useQuery({
        queryKey: ['checkSecretCode', watchedSecretCode],
        queryFn: async () => {
            const res = await axiosSecure.post('/events/check-secret-code', { secretCode: watchedSecretCode });
            return res.data;
        },
        enabled: !!watchedSecretCode,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 5000,
    });

    const addEventMutation = useMutation({
        mutationFn: async (eventData) => {
            if (event) {
                const res = await axiosSecure.patch(`/events/${event._id}`, eventData);
                return res.data;
            } else {
                const res = await axiosSecure.post('/events', eventData);
                return res.data;
            }
        },
        onSuccess: () => {
            if (event) {
                toast.success('Event updated successfully!', { position: 'top-right' });
                navigate(`/dashboard/manageEvents`);
            } else {
                toast.success('Event added successfully!', { position: 'top-right' });
                queryClient.invalidateQueries({ queryKey: ['events'] });
                reset();
            }
        },
        onError: (error) => {
            if (event) {
                toast.error('Failed to update event. Please try again.', { position: 'top-right' });
            } else {
                toast.error('Failed to add event. Please try again.', { position: 'top-right' });
            }
        }
    });

    const onSubmit = async (data) => {
        if (codeAvailability && !codeAvailability.isAvailable &&!event) {
            setError('secretCode', {
                type: 'manual',
                message: 'This secret code is not available.'
            });
            return;
        }

        let imageUrl = '';
        if (data.image.length > 0) {
            const imageFile = { image: data.image[0] };
            try {
                const res = await axios.post(image_hosting_api, imageFile, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                });
                if (res.data.success) {
                    imageUrl = res.data.data.display_url;
                }
            } catch (error) {
                toast.error('Image upload failed. Please try again.', { position: 'top-right' });
                console.error('Image upload error:', error);
                return; // Stop form submission if image upload fails
            }
        }
        const newEvent = {
            title: data.title,
            description: data.description,
            category: data.category,
            image: imageUrl,
            location: data.location,
            requiredVolunteers: parseInt(data.requiredVolunteers),
            date: (new Date(`${data.date}T${data.time}:00Z`)).toISOString(),
            duration: convertDurationToMinutes(data.duration),
            secretCode: data.secretCode,
            organizerEmail: user?.email,
            status:'upcoming',
            volunteers: []
        }
        
        const updatedEvent = {
            title: data.title,
            description: data.description,
            image: imageUrl || event?.image, // Use the hosted image URL
            category: data.category,
            location: data.location,
            date: (new Date(`${data.date}T${data.time}:00Z`)).toISOString(),
            requiredVolunteers: parseInt(data.requiredVolunteers),
            duration: convertDurationToMinutes(data.duration)
        };

        addEventMutation.mutate(event ? updatedEvent : newEvent);
    };

    return (
        <div className="max-w-6xl w-full mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-12 border border-gray-100 mt-8">
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-1">
                        {/* Event Title */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base" htmlFor="title">
                                Event Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                defaultValue={event?.title}
                                {...register('title', { required: 'Event title is required.' })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-shadow placeholder:text-xs md:placeholder:text-sm text-sm"
                                placeholder="e.g., Annual Beach Cleanup"
                            />
                            {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title.message}</p>}
                        </div>
                        {/* Description */}
                        <div className="mb-6 lg:col-span-2">
                            <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                id="description"
                                defaultValue={event?.description}
                                {...register('description', { required: 'Description is required.' })}
                                rows="6"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-shadow placeholder:text-xs md:placeholder:text-sm text-sm"
                                placeholder="Provide a detailed description of the event, what volunteers will do, and any other important information."
                            ></textarea>
                            {errors.description && <p className="text-red-500 text-xs italic mt-1">{errors.description.message}</p>}
                        </div>
                        {/* Category */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base" htmlFor="category">
                                Category
                            </label>
                            <select
                                id="category"
                                defaultValue={event?.category || ''}
                                {...register('category', { required: 'Category is required.' })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-shadow text-sm appearance-none bg-white cursor-pointer"
                            >
                                <option value="" disabled className="text-gray-500">
                                    Select a category
                                </option>
                                <option value="Environment">Environment</option>
                                <option value="Social">Social</option>
                                <option value="Education">Education</option>
                                <option value="Health">Health</option>
                                <option value="Community">Community</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-xs italic mt-1">{errors.category.message}</p>}
                        </div>
                        {/* Image Uploader */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base" htmlFor="image">
                                Event Image
                            </label>
                            <input
                                type="file"
                                id="image"
                                {...register('image', { required: !event && 'Event image is required.' })}
                                className="hidden"
                            />
                            <label
                                htmlFor="image"
                                className="w-full flex items-center justify-between cursor-pointer px-4 py-3 text-xs md:text-sm rounded-lg border border-gray-300 transition-colors bg-gray-50 hover:bg-gray-100"
                            >
                                <span className={`${(watchedImageFile && watchedImageFile.length > 0) || event?.image ? 'text-black font-medium line-clamp-1' : 'text-gray-500'}`}>
                                    {watchedImageFile && watchedImageFile.length > 0 ? watchedImageFile[0].name : event?.image || "Upload Event Image"}
                                </span>
                                <span className="text-gray-500 border border-gray-400 ml-1 md:ml-0 px-3 py-1 rounded-md text-[10px] md:text-xs font-semibold">
                                    Browse...
                                </span>
                            </label>
                            {errors.image && <p className="text-red-500 text-xs italic mt-1">{errors.image.message}</p>}
                            {previewImage && <img className='w-48 h-28 rounded-md mt-3' src={previewImage} alt="" />}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1">
                        {/* Location */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base" htmlFor="location">
                                Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                defaultValue={event?.location}
                                {...register('location', { required: 'Location is required.' })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-shadow placeholder:text-xs md:placeholder:text-sm text-sm"
                                placeholder="e.g., Santa Monica Pier, Los Angeles, CA"
                            />
                            {errors.location && <p className="text-red-500 text-xs italic mt-1">{errors.location.message}</p>}
                        </div>
                        

                        {/* Required volunteer */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base" htmlFor="requiredVolunteers">
                                Required Volunteers
                            </label>
                            <input
                                type="number"
                                id="requiredVolunteers"
                                defaultValue={event?.requiredVolunteers}
                                {...register('requiredVolunteers', { required: 'Number of volunteers is required.', min: { value: 1, message: 'Must be at least 1 volunteer.' } })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-shadow placeholder:text-xs md:placeholder:text-sm text-sm"
                                placeholder="e.g., 50"
                            />
                            {errors.requiredVolunteers && <p className="text-red-500 text-xs italic mt-1">{errors.requiredVolunteers.message}</p>}
                        </div>

                        {/* Date and Time */}
                        <div className="mb-[26px]">
                            <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base" htmlFor="date">
                                Date and Time
                            </label>
                            <div className="flex space-x-4">
                                <input
                                    type="date"
                                    id="date"
                                    defaultValue={event?.date ? new Date(event.date).toISOString().split('T')[0] : ''}
                                    {...register('date', { required: 'Date is required.' })}
                                    className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-shadow text-xs md:text-sm"
                                />
                                <input
                                    type="time"
                                    id="time"
                                    defaultValue={event?.date ? new Date(event.date).toISOString().split('T')[1].substring(0, 5) : ''}
                                    {...register('time', { required: 'Time is required.' })}
                                    className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-shadow text-xs md:text-sm"
                                />
                            </div>
                            {errors.date && <p className="text-red-500 text-xs italic mt-1">{errors.date.message}</p>}
                            {errors.time && <p className="text-red-500 text-xs italic mt-1">{errors.time.message}</p>}
                        </div>
                        {/* Event duration */}
                        <div className="mb-7">
                            <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base" htmlFor="duration">
                                Event Duration
                            </label>
                            <input
                                type="text"
                                id="duration"
                                defaultValue={event?.duration}
                                {...register('duration', { required: 'Duration is required.' })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-shadow placeholder:text-xs md:placeholder:text-sm text-sm"
                                placeholder="e.g., 3 hours, Half day, Full day"
                            />
                            {errors.duration && <p className="text-red-500 text-xs italic mt-1">{errors.duration.message}</p>}
                        </div>

                        {/* Secret Code */}
                        <div className="md:mb-6">
                            <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base" htmlFor="secretCode">
                                Secret Code
                            </label>
                            <div className="flex flex-col md:flex-row gap-2 md:gap-0 items-start md:items-center space-x-2">
                                <input
                                    type="text"
                                    id="secretCode"
                                    defaultValue={event?.secretCode}
                                    {...register('secretCode', { required: 'Secret code is required.' })}
                                    className="w-full flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-shadow placeholder:text-xs md:placeholder:text-sm text-sm"
                                    readOnly
                                    placeholder="Click 'Generate' to create a unique code"
                                />
                                <button
                                    disabled={!!event}
                                    type="button"
                                    onClick={() => {
                                        const generatedCode = generateCode();
                                        setValue('secretCode', generatedCode);
                                    }}
                                    className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors text-xs md:text-sm"
                                >
                                    Generate
                                </button>
                            </div>
                            {isFetching || isLoading ? (
                                <p className="text-gray-500 text-sm mt-1">Checking availability...</p>
                            ) : watchedSecretCode && codeAvailability ? (
                                codeAvailability.isAvailable ? (
                                    <p className="text-green-600 text-sm mt-1 font-semibold">Secret code is available!</p>
                                ) : (
                                    !event && <p className="text-red-600 text-sm mt-1 font-semibold">This secret code is already in use.</p>
                                )
                            ) : null}
                            {errors.secretCode && <p className="text-red-500 text-xs italic mt-1">{errors.secretCode.message}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="lg:col-span-2 mt-8 md:mt-4">
                        <button
                            type="submit"
                            disabled={addEventMutation.isPending || isFetching || (!event && watchedSecretCode && codeAvailability && !codeAvailability.isAvailable)}
                            className="w-full bg-[#FF6B00] text-white font-bold py-2 md:py-3 px-4 md:px-8 rounded-full shadow-lg hover:bg-[#E66200] transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-base md:text-lg"
                        >
                            {
                                page==='add' ?
                                addEventMutation.isPending ? 'Adding...' : 'Create Event' :
                                addEventMutation.isPending ? 'Updating...' : 'Update Event'
                            }
                        </button>
                    </div>
                </form>
            </div>
    );
};

export default EventForm;