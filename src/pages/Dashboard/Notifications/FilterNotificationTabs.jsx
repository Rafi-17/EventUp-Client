const FilterNotificationTabs = ({ activeFilter, onFilterChange, counts }) => {
  const filters = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'unread', label: 'Unread', count: counts.unread },
    { key: 'warning', label: 'Warnings', count: counts.warning },
    { key: 'sorry', label: 'Important', count: counts.sorry },
    { key: 'success', label: 'Success', count: counts.success },
    { key: 'neutral', label: 'Updates', count: counts.neutral }
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeFilter === filter.key
                ? 'border-[#FF6B00] text-[#FF6B00]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {filter.label} {filter.count > 0 && `(${filter.count})`}
          </button>
        ))}
      </nav>
    </div>
  );
};
export default FilterNotificationTabs