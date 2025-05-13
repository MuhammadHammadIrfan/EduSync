import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';

const MultiSelectFilter = ({ label, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (searchTerm) {
      setFilteredOptions(options.filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options]);

  const toggleOption = (option) => {
    const newSelected = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  const removeOption = (option, e) => {
    e.stopPropagation();
    const newSelected = selected.filter(item => item !== option);
    onChange(newSelected);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div 
        className="relative cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm">
          <div className="flex flex-wrap gap-1">
            {selected.length > 0 ? (
              selected.map(option => (
                <span 
                  key={option} 
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {option}
                  <button 
                    onClick={(e) => removeOption(option, e)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <FiX size={12} />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-500">Select {label.toLowerCase()}</span>
            )}
          </div>
          <FiChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </div>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
            <div className="px-3 py-2 sticky top-0 bg-white">
              <input
                type="text"
                placeholder={`Search ${label.toLowerCase()}...`}
                className="w-full p-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  className={`px-3 py-2 cursor-pointer hover:bg-blue-50 flex items-center ${selected.includes(option) ? 'bg-blue-50' : ''}`}
                  onClick={() => toggleOption(option)}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    readOnly
                    className="mr-2 h-4 w-4 text-blue-600 rounded"
                  />
                  <span>{option}</span>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500">No options found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectFilter;