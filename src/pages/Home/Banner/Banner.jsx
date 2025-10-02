import React from 'react';
import bannerImg from '../../../assets/Banner/bannerBG.png'
import banner from '../../../assets/Banner/bannerBG1.png'
const Banner = () => {
    return (
        <div 
            className='bg-cover bg-no-repeat bg-center h-[60vh] md:min-h-[calc(100vh-100px)] xl:min-h-[calc(100vh-40px)] relative' 
            style={{backgroundImage:`url(${bannerImg})`}}
        >
            <div className='bg-black dark:bg-gray-900 absolute h-full w-full top-0 bg-opacity-50 dark:bg-opacity-70'>
            <div className='flex flex-col text-white dark:text-gray-100 w-full px-4 md:max-w-2xl lg:max-w-3xl mx-auto justify-center items-center py-40 md:py-44'>

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