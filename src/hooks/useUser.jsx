import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUser = () => {
    const { user, loading } = useAuth(); // Get the authenticated user
    const axiosSecure = useAxiosSecure();

    const { data: dbUser, isLoading, isError, refetch } = useQuery({
        queryKey: ['dbUser', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/users/profile');
            return res.data;
        },
    });

    return [ dbUser, isLoading, isError, refetch ];
};

export default useUser;