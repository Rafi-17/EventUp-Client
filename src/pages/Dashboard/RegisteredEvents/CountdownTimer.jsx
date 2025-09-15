const CountdownTimer = ({ eventDate }) => {
  const now = new Date();
  const eventTime = new Date(eventDate);
  const timeDiff = eventTime.getTime() - now.getTime();
  
  if (timeDiff <= 0) return null;
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))-6;
  
  if (days > 7) return null;
  
  return (
    <div className="bg-[#FF6B00] bg-opacity-10 text-[#FF6B00] px-2 py-1 rounded text-xs font-medium">
      {days > 0 ? `${days}d ${hours}h left` : `${hours}h left`}
    </div>
  );
};
export default CountdownTimer;