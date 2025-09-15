import React from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useRole = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const {data : role, refetch} = useQuery({
        queryKey:['role', user?.email],
        queryFn: async()=>{
            const res = await axiosSecure.get(`/users/role/${user?.email}`)
            // console.log(res.data);
            return res.data?.role;
        },
        enabled: !loading
    })
    return [role, refetch];
};

export default useRole;