import React from 'react';
import wtdImg from '../../../assets/WhatToDo/whatToDoImg.png'
const WhatToDo = () => {
    return (
        <section className="bg-gray-100 py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 lg:gap-24">
                    {/* Left Column: Image/Icon */}
                    <div className="w-full md:w-1/2 flex justify-center">
                        <img 
                            src={wtdImg}
                            alt="Volunteers collaborating" 
                            className="rounded-lg shadow-xl object-cover w-full h-auto"
                        />
                    </div>
                    {/* Right Column: Text Content */}
                    <div className="w-full md:w-1/2 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                            Connecting Communities, One Event at a Time
                        </h2>
                        <p className="text-gray-700 text-base md:text-lg mb-6">
                            EventUp is a platform dedicated to making it easier for local organizers to find passionate volunteers and for people to discover meaningful ways to give back to their community. We believe that small acts of kindness can create big change.
                        </p>
                        <button className="bg-[#FF6B00] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#E66200] transition-colors duration-300">
                            Find Your Next Event
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhatToDo;