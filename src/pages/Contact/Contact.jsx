import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import SectionTitle from '../../components/SectionTitle/SectionTitle';

const Contact = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            {/* <section className="bg-white py-8 md:py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4">
                        Contact Us
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
                        We'd love to hear from you. Please fill out the form below or reach out to us using the contact information provided.
                    </p>
                </div>
            </section> */}
            <SectionTitle 
                subHeading="Get in Touch"
                heading="Contact Us"
                variant="default"
                alignment="center"
                size="normal"
                showLine={true}
                className=""
                description="Have questions? We're here to help you get started with volunteering"
            />

            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                        {/* Contact Form */}
                        <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12">
                            <SectionTitle
                                subHeading="SEND A MESSAGE"
                                heading="Get in Touch"
                                variant='minimal'
                                alignment='left'
                                size='normal'
                                showLine={true}
                            />
                            <form className="mt-8 space-y-6">
                                <div>
                                    <label htmlFor="name" className="sr-only">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Your Name"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent transition-colors dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="sr-only">Your Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Your Email"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent transition-colors dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="sr-only">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        placeholder="Subject"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent transition-colors dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="sr-only">Your Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="6"
                                        placeholder="Your Message"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#FF6B00] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#E66200] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-opacity-50"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="w-full lg:w-1/2 flex flex-col justify-center lg:items-start text-left p-8 md:p-12">
                            <SectionTitle
                                subHeading="OUR INFORMATION"
                                heading="Reach Out to Us"
                                variant="minimal"
                                alignment='left'
                                size='normal'
                                showLine={true}
                            />
                            <div className="space-y-6 mt-8">
                                <div className="flex items-center space-x-4">
                                    <FaEnvelope className="text-2xl text-[#FF6B00]" />
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-gray-100">Email</p>
                                        <p className="text-gray-600 dark:text-gray-400">contact@eventup.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <FaPhoneAlt className="text-2xl text-[#FF6B00]" />
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-gray-100">Phone</p>
                                        <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <FaMapMarkerAlt className="text-2xl text-[#FF6B00]" />
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-gray-100">Address</p>
                                        <p className="text-gray-600 dark:text-gray-400">123 Volunteer St, Community City, 12345</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;