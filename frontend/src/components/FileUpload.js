import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const FileUpload = ({ onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setUploadStatus([]);
  };

  const removeUploadedFile = (indexToRemove) => {
    const removedFile = uploadStatus[indexToRemove];
    
    // Update stats when removing uploaded file
    if (removedFile && removedFile.status === 'success') {
      const eventsToRemove = removedFile.events_processed || 0;
      
      // Call parent component to update stats
      onUploadComplete([{
        status: 'removed',
        events_processed: -eventsToRemove,
        name: removedFile.name
      }]);
    }
    
    setUploadStatus(uploadStatus.filter((_, index) => index !== indexToRemove));
  };

  const clearAllResults = () => {
    // Calculate total events to remove
    const totalEventsToRemove = uploadStatus.reduce((sum, result) => {
      return sum + (result.status === 'success' ? (result.events_processed || 0) : 0);
    }, 0);
    
    const totalFilesToRemove = uploadStatus.filter(result => result.status === 'success').length;
    
    // Update parent stats
    onUploadComplete([{
      status: 'cleared_all',
      events_processed: -totalEventsToRemove,
      files_processed: -totalFilesToRemove,
      total_files: -uploadStatus.length
    }]);
    
    setUploadStatus([]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(droppedFiles);
      setUploadStatus([]);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      return;
    }

    setUploading(true);
    try {
      const { uploadFiles } = await import('../services/api');
      const response = await uploadFiles(files);
      setUploadStatus(response.data);
      onUploadComplete(response.data);
      setFiles([]);
      // Reset file input
      document.getElementById('file-input').value = '';
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus([{
        name: 'Upload Error',
        status: 'error',
        error: error.response?.data?.error || error.message || 'Upload failed'
      }]);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-gray-400 bg-gray-100' 
            : 'border-gray-300 bg-gray-50'
        } ${uploading ? 'opacity-60 pointer-events-none' : 'hover:border-gray-400 hover:bg-gray-100'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Upload Log Files
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Drag and drop files here, or click to browse
            </p>
          </div>
          
          <input
            id="file-input"
            type="file"
            multiple
            accept=".log,.txt,.csv"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          
          <div className="text-xs text-gray-600">
            Supported formats: .log, .txt, .csv
          </div>
        </div>
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-700">Selected Files ({files.length})</h4>
            <button
              onClick={() => setFiles([])}
              className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-600">
                    {(file.size / 1024 / 1024).toFixed(1)}MB
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all text-sm font-medium"
                    title="Remove file"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button 
              onClick={handleUpload} 
              disabled={uploading}
              className="w-full py-2.5 px-4 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        </div>
      )}

      {/* Upload Results */}
      {uploadStatus.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-800">Upload Results</h4>
            <button
              onClick={clearAllResults}
              className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors"
            >
              Clear All Results
            </button>
          </div>
          
          <div className="space-y-2">
            {uploadStatus.map((result, index) => (
              <div key={index} className={`flex items-start gap-3 p-3 rounded-lg border ${
                result.status === 'success' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex-shrink-0 mt-0.5">
                  {result.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-800">{result.name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {result.status === 'success' 
                      ? `Successfully processed ${result.events_processed || 0} events` 
                      : `Error: ${result.error || 'Upload failed'}`}
                  </div>
                </div>

                <button
                  onClick={() => removeUploadedFile(index)}
                  className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all text-sm font-medium flex-shrink-0"
                  title="Remove from results"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;