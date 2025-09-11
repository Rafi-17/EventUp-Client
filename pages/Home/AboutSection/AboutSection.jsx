import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import aboutImg from '../../../assets/About/aboutSection.png'

const AboutSection = () => {
    return (
        <section className="bg-white py-8 md:py-24">
            <div className="container mx-auto px-4">
                    <div className='md:hidden'>
                            <SectionTitle 
                                subHeading="Our Story"
                                heading="About EventUp"
                                variant="default"
                                alignment="center"
                                size="normal"
                                showLine={true}
                                className=""
                                // description="Connecting volunteers with meaningful opportunities since 2024. We believe in the power of community action."
                            />
                        </div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-16 lg:gap-24">
                    {/* Left Column: Text Content */}
                    <div className="w-full md:w-1/2 text-center md:text-left">
                        {/* <SectionTitle
                            subHeading="OUR MISSION" 
                            heading="Empowering Local Communities" 
                        /> */}
                        <div className='hidden md:block'>
                            <SectionTitle 
                                subHeading="Our Story"
                                heading="About EventUp"
                                variant="default"
                                alignment="left"
                                size="normal"
                                showLine={true}
                                className=""
                                // description="Connecting volunteers with meaningful opportunities since 2024. We believe in the power of community action."
                            />
                        </div>
                        <p className="text-gray-700 text-base md:text-lg mb-6">
                            EventUp is a platform dedicated to making it easier for local organizers to find passionate volunteers and for people to discover meaningful ways to give back to their community. We believe that small acts of kindness can create big change. Our goal is to connect you with opportunities that matter.
                        </p>
                        <p className="text-gray-700 text-base md:text-lg mb-8">
                            Our platform simplifies the process of managing events and volunteers, allowing organizers to focus on what's important: building a better community.
                        </p>
                        <Link to="/about">
                            <button className="bg-[#FF6B00] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#E66200] transition-colors duration-300">
                                Learn More About Us
                            </button>
                        </Link>
                    </div>

                    {/* Right Column: Image */}
                    <div className="w-full md:w-1/2 flex justify-center md:order-last order-first">
                        <img 
                            src={aboutImg} 
                            alt="A group of people working together" 
                            className="rounded-lg shadow-xl object-cover w-full h-auto"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;