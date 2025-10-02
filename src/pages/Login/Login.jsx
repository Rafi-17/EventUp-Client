import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import loginAnimation from '../../assets/Login/loginAnimation.json'
import Lottie from 'lottie-react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import SocialLogin from '../../components/SocialLogin/SocialLogin';
import useTheme from '../../hooks/useTheme';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { TiEye } from 'react-icons/ti';

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
    const location = useLocation();
    const {darkMode} = useTheme();
    const [show,setShow] = useState(false);
    const [typed,setTyped]=useState("");
    const from = location?.state || '/';
    const handleSubmit=e=>{
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        loginUser(email, password)
        .then(()=>{
            toast.success(<div className='text-center'>
                <h2 className='font-bold'>Logged in successfully!</h2>
                <span>Welcome back.</span>
            </div>,{
                style: {
                background: darkMode ? '#1F2937' : 'white',
                color: darkMode ? '#F9FAFB' : '#111827',
                },
            });
        navigate(from);
        })
        .catch(error=>{
            // console.log(error);
            toast.error(error.message,{
                style: {
            background: darkMode ? '#1F2937' : 'white',
            color: darkMode ? '#F9FAFB' : '#111827',
            },
            });
        })
    }
    const handlePassword=e=>{
        setTyped(e.target.value)
    }

    return (
        <div className="flex flex-col lg:flex-row justify-center dark:bg-gray-900 min-h-screen">
            <Link className='h-16' to={'/'}><span className='text-5xl text-[#FF6B00] group relative cursor-pointer xl:left-6'><IoMdArrowRoundBack />
                <span className='text-[#FF6B00] text-sm absolute hidden group-hover:flex pointer-events-none cursor-none whitespace-nowrap'>Return to home</span>
            </span></Link>
            {/* Left Column (Lottie) & Heading - This section will appear first on small screens */}
            <div className="w-full flex flex-col items-center justify-center md:py-4">
                {/* Heading (Visible on all devices) */}
                <div className="lg:hidden text-center mt-8 px-2 py-4">
                    <h2 className="text-3xl md:font-extrabold font-bold tracking-tighter sm:tracking-normal text-gray-900 dark:text-gray-100 mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
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
                className="w-full flex items-center justify-center px-8 py-2 md:py-6 md:px-16 lg:py-16 lg:px-8 bg-white dark:bg-gray-900"
            >
                <motion.div
                    className="w-full max-w-md"
                    variants={formVariants}
                    initial="initial"
                    animate="animate"
                >
                    {/* The heading is hidden on large screens because it's in the left column */}
                    <div className="hidden lg:block">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 text-center mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
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
                                    className="w-full px-4 py-2 sm:py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                                />
                            </div>
                            <div className='relative'>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    onChange={handlePassword}
                                    type={`${show?"text" : "password"}`}
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    className="w-full px-4 py-2 sm:py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                                />
                                {typed && <span onClick={()=>setShow(!show)} className='absolute cursor-pointer text-lg text-gray-700 dark:text-gray-300 
                                top-[28%] right-4'>{show?<AiFillEyeInvisible />: <TiEye />}</span>}
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#FF6B00] dark:bg-[#FF6B00] text-sm text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#E66200] dark:hover:bg-[#E66200] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-opacity-50"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Login Link */}
                    <p className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[#FF6B00] dark:text-[#FF8533] font-bold hover:underline">
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