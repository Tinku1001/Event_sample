import React from 'react';
import { Activity, Search } from 'lucide-react';

const SearchResults = ({ results, searchTime, totalCount, currentPage, totalPages, onPageChange }) => {
  if (!results) return null;

  const formatTime = (epochTime) => {
    return new Date(epochTime * 1000).toLocaleString();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Activity className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Search Results</h3>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
            Search Time: {searchTime} seconds
          </div>
          <div className="text-gray-600">
            Total Results: <span className="font-semibold">{totalCount}</span>
          </div>
          {totalPages > 1 && (
            <div className="text-gray-600">
              Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
            </div>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500">No events match your search criteria. Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden border border-gray-200 rounded-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Range</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ports</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((event, index) => (
                    <tr key={event.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="font-mono font-semibold text-blue-600">{event.src_addr}</span>
                            <span className="text-gray-400">→</span>
                            <span className="font-mono font-semibold text-purple-600">{event.dst_addr}</span>
                          </div>
                          <div className="text-xs text-gray-500">Account: {event.account_id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          event.action === 'ACCEPT' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {event.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          event.log_status === 'OK' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.log_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">{event.file_name}</td>
                      <td className="px-6 py-4 text-xs text-gray-600 space-y-1">
                        <div>Start: {formatTime(event.start_time)}</div>
                        <div>End: {formatTime(event.end_time)}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono">
                        {event.src_port} → {event.dst_port}
                      </td>
                      <td className="px-6 py-4 text-sm">{event.protocol}</td>
                      <td className="px-6 py-4 text-xs text-gray-600 space-y-1">
                        <div>Packets: {event.packets.toLocaleString()}</div>
                        <div>Bytes: {event.bytes_transferred.toLocaleString()}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNum <= totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          pageNum === currentPage 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>

              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;