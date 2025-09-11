import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosPublic from './useAxiosPublic';

const useEvent = ({num=0, status, organizerEmail='', userEmail=''}) => {
    const axiosPublic= useAxiosPublic();
    // console.log(num);
    // const url = num>0 ? `/events?limit=${num}&status=${status}` : `/events?limit=${num}&status=${status}&organizerEmail=${organizerEmail}`;
    // const queryKey = organizerEmail ? ['events', 'organizer', organizerEmail] : ['events', status, num];
    let url;
    let queryKey;
    let enabledCondition;

    if(num>0) {
        url = `/events?limit=${num}&status=${status}`;
        queryKey=['events', status, num];
        enabledCondition = num>0;
    }
    else if (organizerEmail) {
        url = `/events?status=${status}&organizerEmail=${organizerEmail}`;
        queryKey = ['events', 'organizer', organizerEmail];
        enabledCondition = !!organizerEmail;
    } 
    else if(userEmail){
        url=`/events?userEmail=${userEmail}`;
        queryKey= ['events', 'user', userEmail];
        enabledCondition = !!userEmail;
    }
    else{
        url = `/events?status=${status}`;
        queryKey = ['events', status];
        enabledCondition = !!status;
    }
    const {data:events, refetch, isLoading} = useQuery({
        // queryKey:['events', status],
        queryKey:queryKey,
        queryFn:async()=>{
            const res = await axiosPublic.get(url)
            return res.data;
        },
        enabled: enabledCondition,
    })
    // console.log("Hook setup →", { url, queryKey, isLoading });
    return [events, refetch, isLoading];
};

export default useEvent;