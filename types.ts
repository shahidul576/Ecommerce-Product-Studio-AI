
export interface ProductImage {
  id: string;
  originalFile: File;
  originalUrl: string;
  transformedUrl: string | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}
