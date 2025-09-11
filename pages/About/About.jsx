import React from 'react';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import { Link } from 'react-router-dom';
import teamImg from '../../assets/About/aboutPage.png'
import p1 from '../../assets/About/johnDoe.png'
import p2 from '../../assets/About/johnSmith.png'
import p3 from '../../assets/About/emily.png'

const teamMembers = [
    {
        name: "Jane Doe",
        role: "Co-Founder & CEO",
        bio: "Jane has over 10 years of experience in community organizing and is passionate about connecting people with a purpose.",
        image: 'https://i.ibb.co.com/qMcw1Yzc/johnDoe.png'
    },
    {
        name: "John Smith",
        role: "Lead Developer",
        bio: "With a background in full-stack development, John is the architect behind the EventUp platform and its powerful features.",
        image: 'https://i.ibb.co.com/RGKcYvB8/john-Smith.png'
    },
    {
        name: "Emily White",
        role: "Community Manager",
        bio: "Emily is dedicated to helping our organizers and volunteers succeed. She loves seeing communities grow through our platform.",
        image: 'https://i.ibb.co.com/23vZhTt2/emily.png'
    }
];

const About = () => {
    return (
        <div className="bg-gray-50">
            {/* Header Section */}
            {/* <section className="bg-white py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4">
                        Our Story
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
                        We are passionate about empowering people to make a difference in their communities.
                    </p>
                </div>
            </section> */}
            <SectionTitle 
    subHeading="Learn More About Us"
    heading="Our Mission"
    variant="default"
    alignment="center"
    size="normal"
    showLine={true}
    className=""
    description="Building stronger communities through volunteer engagement and social impact"
/>

            {/* Mission & Vision Section */}
            <section className="py-4 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-16 lg:gap-24">
                        <div className="w-full md:w-1/2 text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
                            <p className="text-gray-700 text-base mb-6">
                                Our mission is to connect individuals with meaningful volunteer opportunities and to simplify the process for event organizers to find the help they need. We believe that technology can be a powerful tool for social good.
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 mt-8">Our Vision</h2>
                            <p className="text-gray-700 text-base">
                                We envision a world where every community has the resources it needs to thrive, and every person has a simple way to contribute to positive change.
                            </p>
                        </div>
                        <div className="w-full md:w-1/2 flex justify-center">
                            <img 
                                src={teamImg}
                                alt="Mission and Vision" 
                                className="rounded-lg shadow-xl object-cover w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Team Section */}
            <section className="bg-white py-16 md:py-24">
                <div className="container mx-auto px-4">
                    {/* <SectionTitle
                        subHeading="OUR TEAM"
                        heading="Meet the People Behind EventUp"
                    /> */}
                    <div className=''><SectionTitle 
                        subHeading="Meet the Team"
                        heading="Our People"
                        variant="minimal"
                        alignment="center"
                        size="normal"
                        showLine={true}
                        className=""
                        description=""
                    /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mt-12">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="flex flex-col items-center text-center">
                                <img 
                                    src={member.image} 
                                    alt={member.name} 
                                    className="w-40 h-40 rounded-full object-cover shadow-lg mb-4"
                                />
                                <h4 className="text-xl font-bold text-gray-900">{member.name}</h4>
                                <p className="text-sm font-semibold text-[#FF6B00]">{member.role}</p>
                                <p className="text-gray-600 text-sm mt-2 max-w-xs">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA Section */}
            <section className="bg-gray-50 py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
                        Have a Question?
                    </h2>
                    <p className="text-gray-700 text-base md:text-lg mb-8">
                        We'd love to hear from you. Get in touch to learn more about our platform.
                    </p>
                    <Link to="/contact">
                        <button className="bg-[#FF6B00] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#E66200] transition-colors duration-300">
                            Contact Us
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default About;