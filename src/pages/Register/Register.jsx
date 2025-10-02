import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import regImg from '../../assets/Register/regLottie.json'
import Lottie from 'lottie-react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import useAuth from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import auth from '../../firebase/firebase.config';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import SocialLogin from '../../components/SocialLogin/SocialLogin';
import useTheme from '../../hooks/useTheme';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { TiEye } from 'react-icons/ti';
import toast from 'react-hot-toast';

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
const image_hosting_key= import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`
const Register = () => {
    //state
    const [show,setShow] = useState(false);
    //hooks
    const {darkMode} = useTheme();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const {registerUser, updateUser, setUser} = useAuth();
    const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const photoFile = watch("photoURL");
  const passwordTyped= watch("password");

  const onSubmit = async(data) => {
    // console.log(data);
    // console.log(photoFile);
    const imageFile = {image: data?.photoURL[0]}
    // console.log(imageFile);
    let photo='';
    if(data.photoURL.length>0){
        const res = await axios.post(image_hosting_api, imageFile,{
            headers:{
                'content-type' : 'multipart/form-data'
            }
        })
        if(res.data.success){
            photo = res.data.data.display_url;
        }
    }
    registerUser(data.email, data.password)
    .then(res=>{
        const userInfo={displayName:data.name, photoURL:photo }
        updateUser(userInfo)
        .then(async()=>{
            await res.user.reload();
            setUser({...auth.currentUser})
            const userDBinfo = {
                name: data.name,
                email: data.email,
                photoURL: photo, // The URL from ImgBB
                role: 'volunteer',
                warnings: 0,
                suspensionEndDate: null,
                registeredEvents: []
            }
            axiosPublic.post('/users',userDBinfo)
            .then(res=>{
                if(res.data.insertedId){
                    Swal.fire({
                        text: "Account Created Successfully",
                        icon: "success",
                        // Add these custom classes for dark mode styling
                        customClass: {
                            popup: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-xl',
                            title: 'text-gray-900 dark:text-gray-100',
                            content: 'text-gray-700 dark:text-gray-300',
                            confirmButton: 'bg-[#FF6B00] hover:bg-[#E55A00] text-white'
                        },
                    });
                    navigate('/');
                }
            })
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
    })
    .catch()
  }

    return (
        <div className="flex flex-col lg:flex-row justify-center dark:bg-gray-900 min-h-screen">
            <Link className='h-16' to={'/'}><span className='text-5xl text-[#FF6B00] group relative cursor-pointer xl:left-6'><IoMdArrowRoundBack />
                <span className='text-[#FF6B00] text-sm absolute hidden group-hover:flex pointer-events-none cursor-none whitespace-nowrap'>Return to home</span>
            </span></Link>
            {/* Left Column (Lottie) & Heading - This section will appear first on small screens */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4">
                {/* Heading (Visible on all devices) */}
                <div className="lg:hidden text-center md:mt-8 p-2">
                    <h2 className="text-3xl md:font-extrabold font-bold tracking-tighter sm:tracking-normal text-gray-900 dark:text-gray-100 mb-2">
                        Create Your Account
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Join our community and start volunteering today.
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
                        animationData={regImg}
                        loop={true}
                    />
                </motion.div>
            </div>

            {/* Right Column (Form) */}
            <div
                className="w-full lg:w-1/2 flex items-center justify-center px-8 py-2 md:py-6 md:px-16 lg:p-16 bg-white dark:bg-gray-900"
            >
                <motion.div
                    className="w-full max-w-md"
                    variants={formVariants}
                    initial="initial"
                    animate="animate"
                >
                    {/* The heading is visible to larhe device but hidden on small and mid devices */}
                    <div className="hidden lg:block">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 text-center mb-2">
                            Create Your Account
                        </h2>
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                            Join our community and start volunteering today.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-6">
                            {/* Form fields */}
                            <div>
                                <label htmlFor="name" className="sr-only">Your Name</label>
                                <input
                                    type="text"
                                    {...register("name", {required:true})}
                                    id="name"
                                    name="name"
                                    placeholder="Your Name"
                                    className="w-full px-4 py-2 sm:py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                />
                                {errors.name && <span className='text-red-600 dark:text-red-400'>This field is required</span>}
                            </div>
                            <div>
                                <label htmlFor="email" className="sr-only">Your Email</label>
                                <input
                                    type="email"
                                    {...register("email", {required:true})}
                                    id="email"
                                    name="email"
                                    placeholder="Your Email"
                                    className="w-full px-4 py-2 sm:py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                />
                                {errors.email && <span className='text-red-600 dark:text-red-400'>This field is required</span>}
                            </div>
                            
                            <div className='relative'>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    type={`${show?"text" : "password"}`}
                                    {...register("password", {required:true, minLength:6})}
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    className="w-full px-4 py-2 sm:py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                />
                                {passwordTyped && <span onClick={()=>setShow(!show)} className='absolute cursor-pointer text-lg text-gray-700 dark:text-gray-300 top-[28%] right-4'>{show?<AiFillEyeInvisible />: <TiEye />}</span>}
                                {errors.password?.type==='required' && <span className='text-red-600 dark:text-red-400'>This field is required</span>}
                                {errors.password?.type==='minLength' && <span className='text-red-600 dark:text-red-400'>Password must be 6 characters</span>}
                            </div>
                            <div>
                                <label htmlFor="photoURL" className="sr-only">Photo URL</label>
                                <input
                                    type="file"
                                    {...register("photoURL")}
                                    id="photoURL"
                                    name="photoURL"
                                    placeholder="Photo URL (Optional)"
                                    className="text-sm hidden"
                                />
                                <label
                                    htmlFor="photoURL"
                                    className="w-full flex items-center justify-between cursor-pointer px-4 py-2 sm:py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 transition-colors bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    <span className={`${photoFile && photoFile[0] ? 'text-black dark:text-white font-medium line-clamp-1' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {/* You can display the file name here if you wish */}
                                        {photoFile && photoFile[0] ? photoFile[0].name : "Upload Profile Photo (Optional)"}
                                    </span>
                                    <span className=" text-gray-500 dark:text-gray-400 border border-gray-400 dark:border-gray-500 ml-1 md:ml-0 px-3 py-1 rounded-md text-[10px] md:text-xs font-semibold">
                                        Browse...
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#FF6B00] dark:bg-[#FF6B00] text-sm text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#E66200] dark:hover:bg-[#E66200] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-opacity-50"
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Login Link */}
                    <p className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#FF6B00] dark:text-[#FF8533] font-bold hover:underline">
                            Log in
                        </Link>
                    </p>
                    <SocialLogin></SocialLogin>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;