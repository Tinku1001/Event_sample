import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';

const SearchForm = ({ onSearch, searching }) => {
  const [searchParams, setSearchParams] = useState({
    src_addr: '',
    dst_addr: '',
    account_id: '',
    action: '',
    src_port: '',
    dst_port: '',
    protocol: '',
    log_status: '',
    start_time: '',
    end_time: '',
    page: 1,
    page_size: 100
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value,
      page: name !== 'page' && name !== 'page_size' ? 1 : prev.page
    }));
  };

  const handleSubmit = () => {
    const filteredParams = Object.entries(searchParams)
      .filter(([key, value]) => value !== '')
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
    
    onSearch(filteredParams);
  };

  const handleClear = () => {
    setSearchParams({
      src_addr: '',
      dst_addr: '',
      account_id: '',
      action: '',
      src_port: '',
      dst_port: '',
      protocol: '',
      log_status: '',
      start_time: '',
      end_time: '',
      page: 1,
      page_size: 100
    });
  };

  const hasFilters = Object.values(searchParams).some(value => 
    value !== '' && value !== 1 && value !== 100
  );

  return (
    <div className="space-y-6">
      {/* Quick Search */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source IP Address
            </label>
            <input
              type="text"
              name="src_addr"
              value={searchParams.src_addr}
              onChange={handleInputChange}
              placeholder="159.62.125.136"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination IP Address
            </label>
            <input
              type="text"
              name="dst_addr"
              value={searchParams.dst_addr}
              onChange={handleInputChange}
              placeholder="30.55.177.194"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account ID
            </label>
            <input
              type="text"
              name="account_id"
              value={searchParams.account_id}
              onChange={handleInputChange}
              placeholder="348935949"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action
            </label>
            <select
              name="action"
              value={searchParams.action}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all"
            >
              <option value="">All Actions</option>
              <option value="ACCEPT">ACCEPT</option>
              <option value="REJECT">REJECT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Log Status
            </label>
            <select
              name="log_status"
              value={searchParams.log_status}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all"
            >
              <option value="">All Statuses</option>
              <option value="OK">OK</option>
              <option value="NODATA">NODATA</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Filter className="h-4 w-4" />
          <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Filters</span>
        </button>
        
        {hasFilters && (
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            Active filters
          </span>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Port
              </label>
              <input
                type="number"
                name="src_port"
                value={searchParams.src_port}
                onChange={handleInputChange}
                placeholder="152"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Port
              </label>
              <input
                type="number"
                name="dst_port"
                value={searchParams.dst_port}
                onChange={handleInputChange}
                placeholder="23475"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Protocol
              </label>
              <input
                type="number"
                name="protocol"
                value={searchParams.protocol}
                onChange={handleInputChange}
                placeholder="8"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Results Per Page
              </label>
              <select
                name="page_size"
                value={searchParams.page_size}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Time Range (Epoch)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="number"
                  name="start_time"
                  value={searchParams.start_time}
                  onChange={handleInputChange}
                  placeholder="1725850449"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="number"
                  name="end_time"
                  value={searchParams.end_time}
                  onChange={handleInputChange}
                  placeholder="1725855086"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <button 
          onClick={handleSubmit}
          disabled={searching}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {searching ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span>Search Events</span>
            </>
          )}
        </button>
        
        {hasFilters && (
          <button 
            onClick={handleClear}
            disabled={searching}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-4 w-4" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchForm;