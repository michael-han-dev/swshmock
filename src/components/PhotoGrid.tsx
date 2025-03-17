
import { useState } from "react";
import PhotoCard from "./PhotoCard";

// Sample data for our photos
const SAMPLE_PHOTOS = [
  { id: 1, src: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&auto=format&fit=crop&q=60", alt: "Concert photo 1" },
  { id: 2, src: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&auto=format&fit=crop&q=60", alt: "Concert photo 2" },
  { id: 3, src: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=500&auto=format&fit=crop&q=60", alt: "Concert photo 3" },
  { id: 4, src: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&auto=format&fit=crop&q=60", alt: "Concert photo 4" },
  { id: 5, src: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=60", alt: "Concert photo 5" },
  { id: 6, src: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=500&auto=format&fit=crop&q=60", alt: "Concert photo 6" },
  { id: 7, src: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=500&auto=format&fit=crop&q=60", alt: "Concert photo 7" },
  { id: 8, src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60", alt: "Concert photo 8" },
  { id: 9, src: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=60", alt: "Concert photo 9" },
];

interface PhotoGridProps {
  onSelectPhotos?: (selectedPhotos: any[]) => void;
}

const PhotoGrid = ({ onSelectPhotos }: PhotoGridProps) => {
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  
  const handleSelect = (id: number, selected: boolean) => {
    const newSelected = selected 
      ? [...selectedPhotos, id]
      : selectedPhotos.filter(photoId => photoId !== id);
    
    setSelectedPhotos(newSelected);
    
    if (onSelectPhotos) {
      const selectedPhotoObjects = SAMPLE_PHOTOS.filter(photo => newSelected.includes(photo.id));
      onSelectPhotos(selectedPhotoObjects);
    }
  };
  
  // Generate random rotation for tilt effect
  const getRandomRotation = (id: number) => {
    // Use a seed based on the id for consistent rotation
    const seed = id * 10;
    return {
      transform: `rotate(${(seed % 10) - 5}deg)`,
    };
  };
  
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {SAMPLE_PHOTOS.map((photo) => (
          <PhotoCard
            key={photo.id}
            src={photo.src}
            alt={photo.alt}
            style={getRandomRotation(photo.id)}
            onSelect={(selected) => handleSelect(photo.id, selected)}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoGrid;
