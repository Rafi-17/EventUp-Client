import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import loginAnimation from '../../assets/Login/loginAnimation.json'
import Lottie from 'lottie-react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import SocialLogin from '../../components/SocialLogin/SocialLogin';

// Animation variants for the right column (form)
const formVariants = {
    initial: { x: 200, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } },
};

const lottieVariants = {
    animate:{
        opacity:[0.5,1],
        y: [-30,30], 
        // A smooth transition that repeats infinitely
        transition: {
            duration: 5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
        },
    },
};

const Login = () => {
    const {loginUser} = useAuth();
    const navigate = useNavigate();

    const handleSubmit=e=>{
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        loginUser(email, password)
        .then(()=>{
            toast.success(<div className='text-center'>
        <h2 className='font-bold'>Logged in successfully!</h2>
        <span>Welcome back.</span>
    </div>);
        navigate('/');
        })
        .catch(error=>{
            console.log(error);
            Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error',
            // confirmButtonText: 'Ok'
          })
        })
    }

    return (
        <div className="flex flex-col lg:flex-row justify-center min-h-screen">
            <Link to={'/'}><span className='text-5xl text-[#FF6B00] group relative cursor-pointer'><IoMdArrowRoundBack />
                <span className='text-[#FF6B00] text-sm absolute hidden group-hover:flex pointer-events-none cursor-none whitespace-nowrap'>Return to home</span>
            </span></Link>
            {/* Left Column (Lottie) & Heading - This section will appear first on small screens */}
            <div className="w-full flex flex-col items-center justify-center md:py-4">
                {/* Heading (Visible on all devices) */}
                <div className="lg:hidden text-center mt-8 px-2 py-4">
                    <h2 className="text-3xl md:font-extrabold font-bold tracking-tighter sm:tracking-normal text-gray-900 mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-gray-600">
                        Let's find your next event
                    </p>
                </div>

                {/* Lottie Animation (Visible on all devices, smaller on mobile) */}
                <motion.div
                    className='w-full'
                    variants={lottieVariants}
                    animate="animate"
                >
                    <Lottie
                        className='w-2/3 lg:w-full max-w-sm mx-auto'
                        animationData={loginAnimation}
                        loop={true}
                    />
                </motion.div>
            </div>

            {/* Right Column (Form) */}
            <div
                className="w-full flex items-center justify-center px-8 py-2 md:py-6 md:px-16 lg:py-16 lg:px-8 bg-white"
            >
                <motion.div
                    className="w-full max-w-md"
                    variants={formVariants}
                    initial="initial"
                    animate="animate"
                >
                    {/* The heading is hidden on large screens because it's in the left column */}
                    <div className="hidden lg:block">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-center text-gray-600 mb-8">
                            Let's find your next event
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Form fields */}
                            <div>
                                <label htmlFor="email" className="sr-only">Your Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Your Email"
                                    className="w-full px-4 py-2 sm:py-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    className="w-full px-4 py-2 sm:py-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors"
                                />
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#FF6B00] text-sm text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#E66200] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-opacity-50"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Login Link */}
                    <p className="mt-8 text-center text-gray-600 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[#FF6B00] font-bold hover:underline">
                            Register
                        </Link>
                    </p>
                    <SocialLogin></SocialLogin>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;