import React from 'react';
import bannerImg from '../../../assets/Banner/bannerBG.png'
import banner from '../../../assets/Banner/bannerBG1.png'
const Banner = () => {
    return (
        <div 
            className='bg-cover min-h-[calc(100vh-130px)] md:min-h-[calc(100vh-100px)] relative' 
            style={{backgroundImage:`url(${bannerImg})`}}
        >
            <div className='bg-black absolute h-full w-full top-0 bg-opacity-30'>
            <div className='flex flex-col text-white w-full px-4 md:max-w-2xl lg:max-w-3xl mx-auto justify-center items-center py-32 md:py-44'>

                <h3 className='text-3xl sm:text-5xl md:text-6xl font-bold'>
                    Make a Difference
                </h3>

                <p className='text-sm sm:text-xl md:text-2xl font-medium mt-8 text-center'>
                    Browse a wide variety of community events and join a network of dedicated volunteers to build a stronger world, together.
                </p>

            </div>
            </div>

        </div>
    );
};

export default Banner;