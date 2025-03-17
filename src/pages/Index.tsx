
import { useState } from "react";
import Header from "@/components/Header";
import AlbumHeader from "@/components/AlbumHeader";
import PhotoGrid from "@/components/PhotoGrid";
import AddPhotosButton from "@/components/AddPhotosButton";
import CreateTemplateButton from "@/components/CreateTemplateButton";
import TemplateCreator from "@/components/TemplateCreator";
import MosaicCreator from "@/components/MosaicCreator";
import { toast } from "sonner";

const Index = () => {
  const [isTemplateCreatorOpen, setIsTemplateCreatorOpen] = useState(false);
  const [isMosaicCreatorOpen, setIsMosaicCreatorOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<any[]>([]);
  const [templateImageData, setTemplateImageData] = useState("");
  const [cellSize, setCellSize] = useState(50);
  
  const handleOpenTemplateCreator = () => {
    if (selectedPhotos.length === 0) {
      toast.warning("Please select some photos first");
      return;
    }
    setIsTemplateCreatorOpen(true);
  };
  
  const handleCloseTemplateCreator = () => {
    setIsTemplateCreatorOpen(false);
  };
  
  const handleCreateMosaic = (templateImage: string, photos: any[], cellSize: number) => {
    setTemplateImageData(templateImage);
    setCellSize(cellSize);
    setIsMosaicCreatorOpen(true);
  };
  
  const handleSelectPhotos = (photos: any[]) => {
    setSelectedPhotos(photos);
  };
  
  const handleAddPhotos = () => {
    toast.info("This feature is not implemented in the demo");
  };

  return (
    <div className="min-h-screen bg-swsh-green-dark">
      <Header />
      
      <div className="pt-20 pb-24 max-w-6xl mx-auto">
        {/* Album Banner */}
        <div className="relative w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-4 mx-4">
          <div className="absolute inset-0 flex items-center justify-center bg-swsh-green-dark rounded-full overflow-hidden border-8 border-swsh-green">
            <img 
              src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&auto=format&fit=crop&q=60" 
              alt="Concert" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 text-white">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  <path d="M17 12c0 2.76-2.24 5-5 5s-5-2.24-5-5 2.24-5 5-5 5 2.24 5 5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <AlbumHeader title="Concert pics" count={9} />
        
        <PhotoGrid onSelectPhotos={handleSelectPhotos} />
      </div>
      
      <AddPhotosButton onClick={handleAddPhotos} />
      <CreateTemplateButton onClick={handleOpenTemplateCreator} />
      
      <TemplateCreator 
        isOpen={isTemplateCreatorOpen}
        onClose={handleCloseTemplateCreator}
        selectedPhotos={selectedPhotos}
        onCreateMosaic={handleCreateMosaic}
      />
      
      <MosaicCreator 
        isOpen={isMosaicCreatorOpen}
        onClose={() => setIsMosaicCreatorOpen(false)}
        templateImageData={templateImageData}
        photos={selectedPhotos}
        cellSize={cellSize}
      />
    </div>
  );
};

export default Index;
