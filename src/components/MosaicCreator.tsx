
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Download, Share2, X } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";

interface MosaicCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  templateImageData: string;
  photos: any[];
  cellSize: number;
}

const MosaicCreator = ({ isOpen, onClose, templateImageData, photos, cellSize }: MosaicCreatorProps) => {
  const [mosaicImage, setMosaicImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!isOpen || !templateImageData || photos.length === 0) return;
    
    const createMosaic = async () => {
      setLoading(true);
      
      try {
        // Create a template image element
        const templateImg = new Image();
        templateImg.crossOrigin = "Anonymous";
        templateImg.src = templateImageData;
        
        await new Promise((resolve, reject) => {
          templateImg.onload = resolve;
          templateImg.onerror = reject;
        });
        
        // Create canvas for processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        if (!ctx) throw new Error("Could not get canvas context");
        
        // Set canvas size to match the template image
        canvas.width = templateImg.width;
        canvas.height = templateImg.height;
        
        // Draw template image
        ctx.drawImage(templateImg, 0, 0);
        
        // Get image data to analyze pixels
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Create output canvas
        const outputCanvas = canvasRef.current;
        if (!outputCanvas) throw new Error("Output canvas not available");
        
        const outputCtx = outputCanvas.getContext('2d');
        if (!outputCtx) throw new Error("Could not get output canvas context");
        
        // Set output canvas size
        const scaleFactor = 1;
        outputCanvas.width = canvas.width * scaleFactor;
        outputCanvas.height = canvas.height * scaleFactor;
        
        // Clear the canvas with a transparent background
        outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
        
        // Preload all photos
        const photoElements = await Promise.all(
          photos.map(async (photo) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = photo.src;
            await new Promise((resolve) => {
              img.onload = resolve;
            });
            return img;
          })
        );
        
        // Place photos only where the template has non-transparent pixels
        const cellsX = Math.floor(canvas.width / cellSize);
        const cellsY = Math.floor(canvas.height / cellSize);
        
        for (let cy = 0; cy < cellsY; cy++) {
          for (let cx = 0; cx < cellsX; cx++) {
            const x = cx * cellSize;
            const y = cy * cellSize;
            
            // Check if this cell has any non-transparent pixels
            let hasContent = false;
            
            // Sample center point of the cell
            const centerX = x + cellSize / 2;
            const centerY = y + cellSize / 2;
            
            if (centerX < canvas.width && centerY < canvas.height) {
              const pixelIndex = (Math.floor(centerY) * canvas.width + Math.floor(centerX)) * 4;
              // Use alpha channel (index + 3) to determine if pixel is not transparent
              // For PNG templates with transparency
              if (data[pixelIndex + 3] > 50) {
                hasContent = true;
              }
              // For black silhouettes on white background
              else if (data[pixelIndex] < 100 && data[pixelIndex + 1] < 100 && data[pixelIndex + 2] < 100) {
                hasContent = true;
              }
            }
            
            if (hasContent) {
              // Pick a random photo
              const randomIndex = Math.floor(Math.random() * photoElements.length);
              const photoElement = photoElements[randomIndex];
              
              // Draw the photo
              outputCtx.drawImage(
                photoElement, 
                0, 0, photoElement.width, photoElement.height,
                x * scaleFactor, y * scaleFactor, cellSize * scaleFactor, cellSize * scaleFactor
              );
            }
          }
        }
        
        // Convert the canvas to a data URL
        const dataURL = outputCanvas.toDataURL('image/jpeg', 0.85);
        setMosaicImage(dataURL);
      } catch (error) {
        console.error("Error creating mosaic:", error);
        toast.error("Failed to create mosaic. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    createMosaic();
  }, [isOpen, templateImageData, photos, cellSize]);
  
  const downloadMosaic = () => {
    if (!mosaicImage) return;
    
    const link = document.createElement('a');
    link.href = mosaicImage;
    link.download = 'photo-mosaic.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Mosaic downloaded successfully!");
  };
  
  const shareMosaic = () => {
    if (!mosaicImage) return;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Photo Mosaic',
        text: 'Check out this photo mosaic I created!',
        files: [dataURLtoFile(mosaicImage, 'photo-mosaic.jpg')],
      })
      .then(() => toast.success("Shared successfully!"))
      .catch((error) => {
        console.error("Error sharing:", error);
        toast.error("Failed to share");
      });
    } else {
      toast.info("Sharing not supported on this browser");
    }
  };
  
  // Helper function to convert Data URL to File
  const dataURLtoFile = (dataURL: string, filename: string) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Your Photo Mosaic</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="my-4">
          {loading ? (
            <Skeleton className="w-full h-[60vh]" />
          ) : (
            <div className="flex justify-center">
              <canvas 
                ref={canvasRef}
                className="max-w-full max-h-[60vh] rounded-lg shadow-lg border"
              />
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex-1 flex justify-start">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={shareMosaic}
              disabled={loading || !mosaicImage}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button 
              onClick={downloadMosaic}
              disabled={loading || !mosaicImage}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MosaicCreator;
