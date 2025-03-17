
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PhotoCardProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
}

const PhotoCard = ({ 
  src, 
  alt, 
  className, 
  onClick,
  style,
  selected = false,
  onSelect
}: PhotoCardProps) => {
  const [isSelected, setIsSelected] = useState(selected);
  
  const handleClick = () => {
    if (onSelect) {
      const newState = !isSelected;
      setIsSelected(newState);
      onSelect(newState);
    }
    if (onClick) onClick();
  };
  
  return (
    <div 
      className={cn(
        "photo-card relative overflow-hidden rounded-lg cursor-pointer",
        isSelected && "ring-2 ring-white ring-offset-2 ring-offset-swsh-green-dark",
        className
      )}
      onClick={handleClick}
      style={style}
    >
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover"
      />
      {isSelected && (
        <div className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-swsh-green-dark">
          ✓
        </div>
      )}
    </div>
  );
};

export default PhotoCard;
