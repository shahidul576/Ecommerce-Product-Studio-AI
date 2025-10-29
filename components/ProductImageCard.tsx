
import React from 'react';
import type { ProductImage } from '../types';
import { DownloadIcon, TrashIcon, SpinnerIcon, RetryIcon } from './IconComponents';

interface ProductImageCardProps {
  image: ProductImage;
  onRemove: (id: string) => void;
  onDownload: (url: string, filename: string) => void;
  onRetry: (image: ProductImage) => void;
}

const ProductImageCard: React.FC<ProductImageCardProps> = ({ image, onRemove, onDownload, onRetry }) => {

  const renderTransformedContent = () => {
    switch (image.status) {
      case 'pending':
        return <div className="text-center text-gray-500">Ready to transform</div>;
      case 'processing':
        return (
          <div className="flex flex-col items-center justify-center space-y-2">
            <SpinnerIcon className="w-8 h-8 text-teal-500 animate-spin" />
            <span className="text-gray-500 text-sm">Enhancing...</span>
          </div>
        );
      case 'completed':
        return (
            <img src={image.transformedUrl!} alt="Transformed Product" className="w-full h-full object-contain" />
        );
      case 'error':
        return (
          <div className="text-center text-red-500 p-2">
            <p className="font-semibold">Transformation Failed</p>
            <p className="text-xs mt-1">{image.error}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl relative">
      <button 
        onClick={() => onRemove(image.id)}
        className="absolute top-2 right-2 z-10 p-1.5 bg-white/70 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
        aria-label="Remove image"
      >
        <TrashIcon className="w-5 h-5" />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div>
          <h3 className="font-semibold text-center text-gray-600 mb-2">Original</h3>
          <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
            <img src={image.originalUrl} alt="Original Product" className="w-full h-full object-contain" />
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-center text-gray-600 mb-2">Studio Quality</h3>
          <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
            {renderTransformedContent()}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-3 flex justify-center items-center">
        {image.status === 'completed' && image.transformedUrl && (
          <button
            onClick={() => onDownload(image.transformedUrl!, image.originalFile.name)}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm font-medium"
          >
            <DownloadIcon className="w-5 h-5" />
            <span>Download</span>
          </button>
        )}
        {image.status === 'error' && (
           <button
            onClick={() => onRetry(image)}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
          >
            <RetryIcon className="w-5 h-5" />
            <span>Retry</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductImageCard;
