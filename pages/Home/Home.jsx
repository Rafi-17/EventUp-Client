import React from 'react';
import Banner from './Banner/Banner';
import WhatToDo from './WhatToDo/WhatToDo';
import FeaturedEvent from './FeaturedEvent/FeaturedEvent';
import AboutSection from './AboutSection/AboutSection';
import Testimonial from './Testimonial/Testimonial';
import CallToAction from './CallToAction/CallToAction';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <WhatToDo></WhatToDo>
            <FeaturedEvent></FeaturedEvent>
            <AboutSection></AboutSection>
            <Testimonial></Testimonial>
            <CallToAction></CallToAction>
        </div>
    );
};

export default Home;