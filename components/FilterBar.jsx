import { useState, useEffect, useCallback } from 'react';

export default function FilterBar({ 
  filters = [],
  activeFilters = {},
  onFilterChange,
  className = '',
  loading = false,
  dependencies = {}
}) {
  const [selectedFilters, setSelectedFilters] = useState(activeFilters);

  useEffect(() => {
    const initialFilters = { ...activeFilters };
    filters.forEach(filter => {
      if (!(filter.key in initialFilters)) {
        initialFilters[filter.key] = filter.defaultValue || '';
      }
    });
    setSelectedFilters(initialFilters);
  }, [filters]);

  const handleFilterChange = useCallback((filterKey, value) => {
    setSelectedFilters(prevFilters => {
      const dependentFilters = dependencies 
        ? Object.entries(dependencies)
            .filter(([_, deps]) => deps.includes(filterKey))
            .map(([key]) => key)
        : [];

      const newFilters = {
        ...prevFilters,
        [filterKey]: value,
        ...Object.fromEntries(dependentFilters.map(key => [key, '']))
      };

      onFilterChange?.(newFilters);
      return newFilters;
    });
  }, [dependencies, onFilterChange]);

  const resetFilters = useCallback(() => {
    const resetValues = {};
    filters.forEach(filter => {
      resetValues[filter.key] = filter.defaultValue || '';
    });
    setSelectedFilters(resetValues);
    onFilterChange?.(resetValues);
  }, [filters, onFilterChange]);

  if (!filters.length) return null;

  return (
    <div className={`bg-white p-4 rounded-lg shadow mb-6 overflow-x-auto ${className}`}>
      {loading ? (
        <div className="py-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-500 text-sm">Loading filters...</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 sm:gap-6">
          {filters.map(filter => {
            const isDisabled = filter.dependsOn &&
              (!selectedFilters[filter.dependsOn] || selectedFilters[filter.dependsOn] === '');

            let options = filter.options || [];
            if (filter.getOptionsFrom && typeof filter.getOptionsFrom === 'function') {
              options = filter.getOptionsFrom(selectedFilters) || [];
            }

            return (
              <div
                key={filter.key}
                className="flex flex-col flex-grow min-w-[180px] sm:min-w-[200px] sm:flex-grow-0"
              >
                <label htmlFor={filter.key} className="block text-sm font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>

                {filter.type === 'select' ? (
                  <select
                    id={filter.key}
                    name={filter.key}
                    value={selectedFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    disabled={isDisabled}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                      isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">{filter.placeholder || 'All'}</option>
                    {options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : filter.type === 'date' ? (
                  <input
                    type="date"
                    id={filter.key}
                    name={filter.key}
                    value={selectedFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    disabled={isDisabled}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                      isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                ) : filter.type === 'multiselect' ? (
                  <select
                    id={filter.key}
                    name={filter.key}
                    value={selectedFilters[filter.key] || []}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      handleFilterChange(filter.key, values);
                    }}
                    disabled={isDisabled}
                    multiple
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 min-h-[100px] ${
                      isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  >
                    {options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    id={filter.key}
                    name={filter.key}
                    placeholder={filter.placeholder}
                    value={selectedFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    disabled={isDisabled}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                      isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                )}
              </div>
            );
          })}

          <div className="flex flex-col flex-grow sm:flex-grow-0 min-w-[180px] sm:min-w-[150px] self-end">
            <button
              type="button"
              onClick={resetFilters}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
