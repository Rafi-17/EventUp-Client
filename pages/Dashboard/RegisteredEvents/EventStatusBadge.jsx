const EventStatusBadge = ({ status }) => {
  const statusConfig = {
    upcoming: { bg: 'bg-green-100', text: 'text-green-800', label: 'Upcoming' },
    ongoing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Ongoing' },
    completed: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Completed' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
  };
  
  const config = statusConfig[status] || statusConfig.upcoming;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};
export default EventStatusBadge;