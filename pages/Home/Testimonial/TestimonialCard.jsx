import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa'; // A popular quote icon
import quoteImg from '../../../assets/Testimonial/quote.png'

const TestimonialCard = ({ review }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col justify-between relative h-full transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div 
                className="absolute -top-24 -left-24 w-96 h-96 opacity-20 bg-no-repeat bg-contain bg-center
                           sm:-top-16 sm:-left-16 sm:w-56 sm:h-56 
                           md:-top-24 md:-left-24 md:w-96 md:h-96"
                style={{ 
                    backgroundImage: `url(${quoteImg})` 
                }}
            ></div>
            {/* Quote Icon */}
            <FaQuoteLeft className="text-[#FF6B00] text-3xl mb-4" />

            {/* Quote Text */}
            <p className="text-gray-800 text-lg sm:text-xl font-medium leading-relaxed italic mb-6">
                {review.quote}
            </p>

            {/* Reviewer Info */}
            <div>
                <p className="font-bold text-gray-900 text-base">{review.reviewerName}</p>
                <p className="text-[#333333] text-sm mt-1">{review.reviewerRole}</p>
            </div>
        </div>
    );
};

export default TestimonialCard;