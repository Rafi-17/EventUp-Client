import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosPublic from './useAxiosPublic';
const useEvent = ({ num, status, organizerEmail = '', userEmail = '', category = '', search = '', key = false }) => {
    const axiosPublic = useAxiosPublic();

    const params = new URLSearchParams();
    if (num && num > 0) params.append('limit', num);
    if (status) params.append('status', status);
    if (organizerEmail) params.append('organizerEmail', organizerEmail);
    if (userEmail) params.append('userEmail', userEmail);
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (key) params.append('key', 'true');

    const queryString = params.toString();
    const url = `/events${queryString ? `?${queryString}` : ''}`;
    
    const queryKey = ['events', { num, status, organizerEmail, userEmail, category, search, key }];

    const { data: events, refetch, isLoading } = useQuery({
        queryKey: queryKey,
        queryFn: async () => {
            const res = await axiosPublic.get(url);
            return res.data;
        },
        enabled: !!queryString || (!num && !status && !organizerEmail && !userEmail && !category && !search && !key),
    });

    return [events, refetch, isLoading];
};

export default useEvent;