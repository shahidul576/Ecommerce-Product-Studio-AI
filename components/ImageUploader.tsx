
import React from 'react';
import { UploadIcon } from './IconComponents';

interface ImageUploaderProps {
  onFilesSelected: (files: FileList) => void;
  isDisabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesSelected, isDisabled }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFilesSelected(event.target.files);
      event.target.value = '';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8 px-4">
      <label
        htmlFor="file-upload"
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-colors duration-300
        ${isDisabled 
          ? 'bg-gray-200 border-gray-300 cursor-not-allowed' 
          : 'bg-white border-gray-300 hover:border-teal-500 hover:bg-gray-50 cursor-pointer'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold text-teal-600">Click to upload product photos</span>
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, or WEBP files accepted</p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          multiple
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          disabled={isDisabled}
        />
      </label>
    </div>
  );
};

export default ImageUploader;
