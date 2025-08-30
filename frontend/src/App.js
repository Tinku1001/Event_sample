import React, { useState } from 'react';
import { Activity, FileText, Database, Search } from 'lucide-react';

// Import your separate components
import FileUpload from './components/FileUpload';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';

function App() {
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [stats, setStats] = useState({
    total_events: 0,
    total_files: 0,
    processed_files: 0
  });
  const [currentSearchParams, setCurrentSearchParams] = useState({});

  const handleSearch = async (searchParams) => {
    setSearching(true);
    setCurrentSearchParams(searchParams);
    
    try {
      // Use real API call
      const { searchEvents } = await import('./services/api');
      const response = await searchEvents(searchParams);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback to mock data for demo
      setSearchResults({
        results: [
          {
            id: 1,
            src_addr: '159.62.125.136',
            dst_addr: '30.55.177.194',
            account_id: '348935949',
            action: 'ACCEPT',
            log_status: 'OK',
            file_name: 'events_2024_08_29.log',
            start_time: 1725850449,
            end_time: 1725855086,
            src_port: 152,
            dst_port: 23475,
            protocol: 8,
            packets: 1250,
            bytes_transferred: 2048576
          }
        ],
        search_time: 0.15,
        total_count: 1,
        page: 1,
        total_pages: 1
      });
    } finally {
      setSearching(false);
    }
  };

  const handlePageChange = (newPage) => {
    const updatedParams = { ...currentSearchParams, page: newPage };
    handleSearch(updatedParams);
  };

  const handleUploadComplete = (uploadResults) => {
    if (uploadResults && Array.isArray(uploadResults)) {
      const totalNewEvents = uploadResults.reduce((sum, result) => {
        return sum + (result.events_processed || 0);
      }, 0);
      
      const successfulUploads = uploadResults.filter(result => result.status === 'success').length;
      const removedFiles = uploadResults.filter(result => result.status === 'removed').length;
      const clearedAll = uploadResults.find(result => result.status === 'cleared_all');
      
      if (clearedAll) {
        // Handle clear all operation
        setStats(prev => ({
          total_events: Math.max(0, prev.total_events + (clearedAll.events_processed || 0)),
          total_files: Math.max(0, prev.total_files + (clearedAll.total_files || 0)),
          processed_files: Math.max(0, prev.processed_files + (clearedAll.files_processed || 0))
        }));
      } else {
        // Handle regular uploads and individual removals
        const fileCountChange = successfulUploads - removedFiles;
        const totalFileChange = uploadResults.length - removedFiles;
        
        setStats(prev => ({
          total_events: Math.max(0, prev.total_events + totalNewEvents),
          total_files: Math.max(0, prev.total_files + (totalFileChange > 0 ? totalFileChange : 0)),
          processed_files: Math.max(0, prev.processed_files + fileCountChange)
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl mb-4 shadow-lg">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Event Log Search System
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Efficiently manage and search through your event log files
            </p>
          </div>
          
          {/* Modern Stats Dashboard */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {stats.total_events?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Total Events
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl mb-4">
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {stats.total_files || 0}
                  </div>
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Total Files
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-100 rounded-xl mb-4">
                    <Database className="h-6 w-6 text-violet-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {stats.processed_files || 0}
                  </div>
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Files Processed
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-6">
          
          {/* File Upload Section */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-500">Upload Log Files</h2>
              <p className="text-sm text-gray-400 mt-1">
                Upload your event log files for processing and search
              </p>
            </div>
            <div className="p-6">
              <FileUpload onUploadComplete={handleUploadComplete} />
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-500">Search Events</h2>
              <p className="text-sm text-gray-400 mt-1">
                Filter and search through your log events
              </p>
            </div>
            <div className="p-6">
              <SearchForm onSearch={handleSearch} searching={searching} />
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-500">Search Results</h2>
              {searchResults && (
                <p className="text-sm text-gray-400 mt-1">
                  Found {searchResults.total_count} results in {searchResults.search_time}s
                </p>
              )}
            </div>
            <div className="p-6">
              <SearchResults 
                results={searchResults?.results}
                searchTime={searchResults?.search_time}
                totalCount={searchResults?.total_count}
                currentPage={searchResults?.page}
                totalPages={searchResults?.total_pages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;