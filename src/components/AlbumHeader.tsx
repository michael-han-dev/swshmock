
import { Play, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

interface AlbumHeaderProps {
  title: string;
  count?: number;
}

const AlbumHeader = ({ title, count = 0 }: AlbumHeaderProps) => {
  return (
    <div className="py-4 px-6">
      <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20">
          <Share2 className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20">
          <span className="flex items-center gap-1">
            <span>1</span>
          </span>
        </Button>
        
        <Button variant="outline" className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20">
          <span className="flex items-center gap-1">
            <Play className="h-4 w-4 fill-current" />
            <span>Recap</span>
          </span>
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full text-white">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default AlbumHeader;
