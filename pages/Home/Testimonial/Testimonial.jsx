import React, { useEffect, useState } from 'react';
import TestimonialCard from './TestimonialCard';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import useAxiosPublic from '../../../hooks/useAxiosPublic';

const Testimonial = () => {
    const axiosPublic = useAxiosPublic();
    const [approvedReviews, setApprovedReviews] = useState([]);

    useEffect(() => {
        axiosPublic.get('/reviews')
            .then(response => {
                setApprovedReviews(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the reviews!", error);
            });
    }, []);

    return (
        <section className="bg-gray-50 py-16 md:py-24">
            <div className="container mx-auto px-4">
                {/* <SectionTitle 
                    subHeading="WHAT OUR COMMUNITY SAYS" 
                    heading="Building Trust"
                /> */}
                <SectionTitle 
                    subHeading="Community Voices"
                    heading="What Volunteers Say"
                    variant="default"
                    alignment="center"
                    size="normal"
                    showLine={true}
                    className=""
                    // description="Real stories from our amazing volunteer community"
                />

                {/* Responsive grid for the cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mt-12">
                    {approvedReviews.map(review => (
                        <TestimonialCard key={review._id} review={review} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonial;