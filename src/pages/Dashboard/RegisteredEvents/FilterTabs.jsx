const FilterTabs = ({ activeFilter, onFilterChange, eventCounts }) => {
  const filters = [
    { key: 'all', label: 'All Events', count: eventCounts.all },
    { key: 'upcoming', label: 'Upcoming', count: eventCounts.upcoming },
    { key: 'completed', label: 'Completed', count: eventCounts.completed },
    { key: 'cancelled', label: 'Cancelled', count: eventCounts.cancelled }
  ];

  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="flex space-x-8 overflow-x-auto">
        {filters?.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeFilter === filter.key
                ? 'border-[#FF6B00] text-[#FF6B00]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </nav>
    </div>
  );
};
export default FilterTabs;