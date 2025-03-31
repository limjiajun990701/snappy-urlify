
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const RedirectPage = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAndRedirect = async () => {
      try {
        // Log the shortcode we're looking for
        console.log('Attempting to redirect with shortCode:', shortCode);
        
        // Simulate API call with a small delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Retrieve stored URLs from localStorage
        const storedUrlsString = localStorage.getItem('shortenedUrls');
        const storedUrls = storedUrlsString ? JSON.parse(storedUrlsString) : [];
        
        // Debug logs
        console.log('Available URLs in storage:', storedUrls);
        
        // Find the URL with matching shortCode
        // First try using the shortCode field directly
        let urlData = storedUrls.find((item: any) => item.shortCode === shortCode);
        
        // If not found, try extracting from the URL as fallback
        if (!urlData) {
          console.log('No direct match found, trying URL extraction method');
          urlData = storedUrls.find((item: any) => {
            // Extract the short code from the URL
            const itemShortCode = item.shortUrl.split('/').pop();
            console.log(`Comparing: "${itemShortCode}" with "${shortCode}"`);
            return itemShortCode === shortCode;
          });
        }
        
        if (urlData) {
          // Success! We found a matching URL
          console.log('Found matching URL:', urlData);
          toast.success('Redirecting to original URL...');
          
          // Redirect to the original URL after a brief delay
          setTimeout(() => {
            window.location.href = urlData.originalUrl;
          }, 500);
        } else {
          // No matching URL found
          console.error('No matching URL found for shortCode:', shortCode);
          setError('The requested short link was not found or has expired.');
          
          // Navigate to home page after showing the error
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 3000);
        }
      } catch (error) {
        console.error('Error during redirect:', error);
        setError('An error occurred while processing your request.');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    if (shortCode) {
      loadAndRedirect();
    }
  }, [shortCode, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <p className="text-muted-foreground">Redirecting to home page in a moment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      <p className="text-lg">Redirecting you to your destination...</p>
    </div>
  );
};

export default RedirectPage;
