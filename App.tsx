
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ProductImageCard from './components/ProductImageCard';
import type { ProductImage } from './types';
import { transformImage } from './services/geminiService';
import { SpinnerIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [productImages, setProductImages] = useState<ProductImage[]>([]);

  const isProcessing = productImages.some(img => img.status === 'processing');
  const hasPendingImages = productImages.some(img => img.status === 'pending' || img.status === 'error');

  const handleFilesSelected = (files: FileList) => {
    const newImages: ProductImage[] = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      originalFile: file,
      originalUrl: URL.createObjectURL(file),
      transformedUrl: null,
      status: 'pending',
    }));
    setProductImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (id: string) => {
    setProductImages(prev => prev.filter(img => img.id !== id));
  };

  const handleDownloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    const name = filename.substring(0, filename.lastIndexOf('.')) || filename;
    link.download = `${name}-studio.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const processImage = useCallback(async (image: ProductImage) => {
    setProductImages(prev => prev.map(p => p.id === image.id ? { ...p, status: 'processing', error: undefined } : p));
    try {
        const transformedUrl = await transformImage(image.originalFile);
        setProductImages(prev => prev.map(p => p.id === image.id ? { ...p, status: 'completed', transformedUrl } : p));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        setProductImages(prev => prev.map(p => p.id === image.id ? { ...p, status: 'error', error: errorMessage } : p));
    }
  }, []);

  const handleTransformAll = async () => {
    const imagesToProcess = productImages.filter(img => img.status === 'pending' || img.status === 'error');
    const processingPromises = imagesToProcess.map(image => processImage(image));
    await Promise.all(processingPromises);
  };

  const handleRetryImage = (image: ProductImage) => {
    processImage(image);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {productImages.length === 0 && (
          <ImageUploader onFilesSelected={handleFilesSelected} isDisabled={isProcessing} />
        )}

        {productImages.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <button
                    onClick={handleTransformAll}
                    disabled={isProcessing || !hasPendingImages}
                    className="flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isProcessing ? (
                        <>
                            <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                            Processing...
                        </>
                    ) : (
                        `Transform All (${productImages.filter(img => img.status === 'pending' || img.status === 'error').length})`
                    )}
                </button>
                <div className="w-full sm:w-auto">
                  <ImageUploader onFilesSelected={handleFilesSelected} isDisabled={isProcessing} />
                </div>
            </div>
        )}
        
        {productImages.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {productImages.map(image => (
              <ProductImageCard 
                key={image.id}
                image={image}
                onRemove={handleRemoveImage}
                onDownload={handleDownloadImage}
                onRetry={handleRetryImage}
              />
            ))}
          </div>
        )}
      </main>
      <footer className="py-4 text-center text-sm text-gray-500">
        Powered by Gemini AI
      </footer>
    </div>
  );
};

export default App;
