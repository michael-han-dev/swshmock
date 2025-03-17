
import { ImagePlus } from "lucide-react";
import { Button } from "./ui/button";

interface AddPhotosButtonProps {
  onClick?: () => void;
}

const AddPhotosButton = ({ onClick }: AddPhotosButtonProps) => {
  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-10">
      <Button 
        className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-6 shadow-lg"
        onClick={onClick}
      >
        <ImagePlus className="mr-2 h-5 w-5" />
        Add pics
      </Button>
    </div>
  );
};

export default AddPhotosButton;
