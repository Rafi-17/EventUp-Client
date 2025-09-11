import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    // You'll need to install react-icons: npm install react-icons
    const socialLinks = [
        { icon: FaFacebook, link: 'https://www.facebook.com' },
        { icon: FaTwitter, link: 'https://www.twitter.com' },
        { icon: FaInstagram, link: 'https://www.instagram.com' },
        { icon: FaLinkedin, link: 'https://www.linkedin.com' },
    ];

    return (
        <footer className="bg-gray-900 text-gray-300 py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-12">
                    {/* Brand and Mission */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left md:w-1/3">
                        <p className="font-sans text-2xl font-extrabold tracking-tight text-[#FF6B00] mb-2">EventUp</p>
                        <p className="text-sm">Connecting communities, one event at a time.</p>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col items-center md:items-start md:ml-28 lg:ml-40 md:w-1/3">
                        <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-[#FF6B00] transition-colors">Home</Link></li>
                            <li><Link to="/events" className="hover:text-[#FF6B00] transition-colors">Events</Link></li>
                            <li><Link to="/about" className="hover:text-[#FF6B00] transition-colors">About</Link></li>
                            <li><Link to="/contact" className="hover:text-[#FF6B00] transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Social Media Links */}
                    <div className="flex flex-col items-center md:w-1/3">
                        <h3 className="text-white font-semibold text-lg mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <a key={index} href={social.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF6B00] transition-colors text-xl">
                                    <social.icon />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="border-t border-[#FF6B00] mt-8 pt-6 text-center">
                    <p className="text-sm">&copy; {new Date().getFullYear()} EventUp. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;