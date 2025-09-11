import React, { useEffect, useState } from 'react';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules';
import EventCard from '../../../components/EventCard/EventCard';
import './FeaturedEvent.css'
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import useEvent from '../../../hooks/useEvent';

const FeaturedEvent = () => {
    const [events] = useEvent({num:4,status:'upcoming'})
    const axiosPublic = useAxiosPublic();
    // const [events, setEvents] = useState([]);
    // useEffect(()=>{
    //     axiosPublic.get(`/events?limit=${4}`)
    //     .then(res=>{
    //         // console.log(res.data);
    //         setEvents(res.data);
    //     });
    // },[])

    return (
        <div className='py-20'>
            <div className="container mx-auto px-4">
                {/* <SectionTitle heading={'Upcoming Events'} subHeading={'MAKE A DIFFERENCE'}></SectionTitle> */}
                <SectionTitle 
                    subHeading="Don't Miss Out"
                    heading="Featured Events"
                    variant="default"
                    alignment="center"
                    size="normal"
                    showLine={true}
                    className=""
                    // description="Join these highlighted volunteer opportunities in your area"
                />
                <div className="relative">
                    <Swiper 
                    modules={[Pagination]}
                    pagination={{ clickable: true }}
                    className="mySwiper"
                                        
                    breakpoints={{
                         0: {
                            slidesPerView: 1,
                            spaceBetween: 10,
                        },
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                    }}
                >
                        <div className=''>
                            {
                                events?.slice(0,4).map(event => (
                                    <SwiperSlide key={event._id}>
                                        <EventCard event={event}></EventCard>
                                    </SwiperSlide>
                                ))
                            }
                        </div>
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default FeaturedEvent;