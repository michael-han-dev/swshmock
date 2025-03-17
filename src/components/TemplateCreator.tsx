
import { useState, useRef, useEffect } from "react";
import { X, Upload, Download, Image, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";

interface TemplateCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPhotos: any[];
  onCreateMosaic: (templateImageData: string, photos: any[], cellSize: number) => void;
}

const TemplateCreator = ({ isOpen, onClose, selectedPhotos, onCreateMosaic }: TemplateCreatorProps) => {
  const [templateImage, setTemplateImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [cellSize, setCellSize] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  
  // Sample template shapes
  const templateShapes = [
    "/public/lovable-uploads/d42d246c-503b-4807-a3eb-d2e20b7fcfb2.png",
    "https://cdn-icons-png.flaticon.com/512/1182/1182718.png",
    "https://cdn-icons-png.flaticon.com/512/1077/1077035.png", 
    "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
  ];
  
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        setCanvasContext(context);
      }
    }
  }, [activeTab]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTemplateImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSelectTemplateShape = (imageSrc: string) => {
    setTemplateImage(imageSrc);
  };
  
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasContext) return;
    
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    canvasContext.beginPath();
    canvasContext.arc(x, y, 10, 0, Math.PI * 2);
    canvasContext.fillStyle = '#000000';
    canvasContext.fill();
  };
  
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasContext || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    canvasContext.beginPath();
    canvasContext.arc(x, y, 10, 0, Math.PI * 2);
    canvasContext.fillStyle = '#000000';
    canvasContext.fill();
  };
  
  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };
  
  const clearCanvas = () => {
    if (canvasContext && canvasRef.current) {
      canvasContext.fillStyle = '#ffffff';
      canvasContext.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };
  
  const handleCreateMosaic = () => {
    let imageData: string;
    
    if (activeTab === 'draw' && canvasRef.current) {
      imageData = canvasRef.current.toDataURL('image/png');
    } else if (templateImage) {
      imageData = templateImage;
    } else {
      alert('Please select or draw a template first');
      return;
    }
    
    if (selectedPhotos.length === 0) {
      alert('Please select at least one photo for the mosaic');
      return;
    }
    
    onCreateMosaic(imageData, selectedPhotos, cellSize);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create Photo Template</DialogTitle>
          <DialogDescription>
            Select a template shape or draw your own, then create a mosaic with your photos.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="draw">Draw</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {templateImage ? (
                <div className="relative">
                  <img 
                    src={templateImage} 
                    alt="Template" 
                    className="max-h-64 mx-auto"
                  />
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="absolute top-0 right-0"
                    onClick={() => setTemplateImage(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-gray-500 mb-2">Upload a template image</p>
                  <p className="text-gray-400 text-sm mb-4">PNG with transparent background works best</p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Select File
                  </Button>
                  <Input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {templateShapes.map((shape, index) => (
                <div 
                  key={index}
                  className={`border-2 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${templateImage === shape ? 'border-primary bg-primary/10' : 'border-gray-200'}`}
                  onClick={() => handleSelectTemplateShape(shape)}
                >
                  <img src={shape} alt={`Template ${index + 1}`} className="h-32 w-full object-contain" />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="draw" className="space-y-4">
            <div className="flex justify-end mb-2">
              <Button variant="outline" onClick={clearCanvas}>
                Clear
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <canvas 
                ref={canvasRef}
                width={500}
                height={300}
                className="w-full bg-white"
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
              />
            </div>
            <p className="text-sm text-gray-500">Click and drag to draw your template shape.</p>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Cell Size: {cellSize}px</h3>
            <Slider
              value={[cellSize]}
              min={20}
              max={100}
              step={5}
              onValueChange={(value) => setCellSize(value[0])}
            />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Selected Photos ({selectedPhotos.length})</h3>
            {selectedPhotos.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedPhotos.slice(0, 5).map((photo, index) => (
                  <img 
                    key={index}
                    src={photo.src} 
                    alt={photo.alt}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ))}
                {selectedPhotos.length > 5 && (
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                    +{selectedPhotos.length - 5}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No photos selected</p>
            )}
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            disabled={(!templateImage && activeTab !== 'draw') || selectedPhotos.length === 0}
            onClick={handleCreateMosaic}
          >
            <Check className="mr-2 h-4 w-4" />
            Create Mosaic
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateCreator;
