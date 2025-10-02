import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure'; // Assuming you'll use axiosSecure
import useAuth from './useAuth';
import useRole from './useRole';

const useEventCount = (options = {}) => {
  const { user } = useAuth();
  const [role] = useRole();
  const axiosSecure = useAxiosSecure();

  const { data: totalEvents = 0, isLoading: isCountLoading, refetch: refetchCount } = useQuery({
    queryKey: ['totalEvents', options.organizerEmail, options.userEmail],
    queryFn: async () => {
      let url = '/events?count=true';
      if (options.organizerEmail) {
        url += `&organizerEmail=${options.organizerEmail}`;
      }
      if (options.userEmail) {
        url += `&userEmail=${options.userEmail}`;
      }
      // You can add other filters here if needed
      
      const res = await axiosSecure.get(url);
      return res.data.count;
    },
    enabled: !!user?.email
  });

  return [totalEvents, isCountLoading, refetchCount];
};

export default useEventCount;