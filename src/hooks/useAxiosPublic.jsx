import axios from 'axios';
import React from 'react';

const useAxiosPublic = () => {
    const axiosPublic = axios.create({
        baseURL:'https://event-up-server.vercel.app'
    })
    return axiosPublic;
};

export default useAxiosPublic;