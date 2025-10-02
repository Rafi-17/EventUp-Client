const EventStatusBadge = ({ status }) => {
  const statusConfig = {
    upcoming: { 
        bg: 'bg-green-100 dark:bg-green-900', 
        text: 'text-green-800 dark:text-green-300', 
        label: 'Upcoming' 
    },
    ongoing: { 
        bg: 'bg-blue-100 dark:bg-blue-900', 
        text: 'text-blue-800 dark:text-blue-300', 
        label: 'Ongoing' 
    },
    completed: { 
        bg: 'bg-purple-100 dark:bg-purple-900', 
        text: 'text-purple-800 dark:text-purple-300', 
        label: 'Completed' 
    },
    cancelled: { 
        bg: 'bg-red-100 dark:bg-red-900', 
        text: 'text-red-800 dark:text-red-300', 
        label: 'Cancelled' 
    }
};
  
  const config = statusConfig[status] || statusConfig.upcoming;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};
export default EventStatusBadge;