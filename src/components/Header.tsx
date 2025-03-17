
import { ImagePlus, Menu, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-swsh-green-dark z-50 flex items-center justify-between p-4">
      <Button variant="ghost" size="icon" className="text-white">
        <Menu className="h-6 w-6" />
      </Button>
      
      <div className="flex items-center gap-2">
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <path d="M17 12c0 2.76-2.24 5-5 5s-5-2.24-5-5 2.24-5 5-5 5 2.24 5 5z" />
        </svg>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-white">
          <Share2 className="h-5 w-5" />
        </Button>
        <Button variant="outline" className="bg-green-600 text-white border-none">
          Select
        </Button>
      </div>
    </header>
  );
};

export default Header;
