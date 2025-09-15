import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import auth from '../firebase/firebase.config';
import useAxiosPublic from '../hooks/useAxiosPublic';

export const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();
const AuthProvider = ({children}) => {
    const axiosPublic = useAxiosPublic();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const registerUser = (email, password)=>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const loginUser = (email, password) =>{
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const googleUser = ()=>{
        setLoading(true);
        return signInWithPopup(auth,googleProvider);
    }

    const logoutUser = ()=>{
        setLoading(true);
        return signOut(auth);
    }

    const updateUser = (updatedData) =>{
        // setLoading(true);
        return updateProfile(auth.currentUser, updatedData)
    }

    useEffect(()=>{
        const unSubscribe = onAuthStateChanged(auth, currentUser=>{
            setUser(currentUser);
            console.log(currentUser);
            if(currentUser){
                const userInfo = {email:currentUser?.email}
                axiosPublic.post('/jwt', userInfo)
                .then(res=>{
                    if(res.data.token){
                        localStorage.setItem('access-token',res.data.token)
                        setLoading(false);
                    }
                })
            }
            else{
                localStorage.removeItem('access-token');
                setLoading(false);
            }
        })
        return ()=>{
            unSubscribe();
        }
    },[])

    const authInfo={
        user,
        setUser,
        loading,
        registerUser,
        loginUser,
        googleUser,
        logoutUser,
        updateUser,
    }
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;