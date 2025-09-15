import React from 'react';
import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import toast from 'react-hot-toast';
import auth from '../../firebase/firebase.config';
import { useNavigate } from 'react-router-dom';

const SocialLogin = () => {
    const {googleUser, updateUser, setUser, user} = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const handleGoogleSignIn = () => {
        googleUser()
        .then(async(res)=>{
            // const userInfo={displayName:res.user?.displayName, photoURL:res.user?.photoURL }
            // updateUser(userInfo)
            // .then(async()=>{
                // await res.user.reload();
                // await setUser(res.user);
                // console.log('after set user in social', user);
                const userDBinfo = {
                    name: res?.user?.displayName,
                    email: res?.user?.email,
                    photoURL: res?.user?.photoURL, // The URL from ImgBB
                    role: 'volunteer',
                    warnings: 0,
                    suspensionEndDate: null,
                    registeredEvents: []
                }
                // console.log(res.user);
                axiosPublic.post('/users',userDBinfo)
                .then(res=>{
                    console.log(res.data);
                })
                toast.success(
                    <div>
                        <h2 className='font-bold'>Logged in successfully!</h2>
                    </div>
                )
                navigate('/')
            // })
        })
    };


    return (
        <div className="mt-6">
            <div className="flex items-center space-x-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="text-gray-500 text-sm font-medium">Or continue with</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
                <button
                    onClick={handleGoogleSignIn}
                    className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                    <FaGoogle className="text-gray-600 text-2xl" />
                </button>
                <button
                    
                    className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                    <FaFacebook className="text-gray-600 text-2xl" />
                </button>
                <button
                    
                    className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                    <FaGithub className="text-gray-600 text-2xl" />
                </button>
            </div>
        </div>
    );
};

export default SocialLogin;