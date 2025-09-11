import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
    return (
        <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16 md:py-24 mb-16 md:mb-24
        ">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-8">
                    Ready to Make a Difference?
                </h2>
                <Link to="/register">
                    <button className="bg-white text-[#FF6B00] font-bold py-3 px-10 rounded-full shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50">
                        Join Our Community
                    </button>
                </Link>
            </div>
        </section>
    );
};

export default CallToAction;