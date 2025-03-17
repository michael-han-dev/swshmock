
import { Wand2 } from "lucide-react";
import { Button } from "./ui/button";

interface CreateTemplateButtonProps {
  onClick?: () => void;
}

const CreateTemplateButton = ({ onClick }: CreateTemplateButtonProps) => {
  return (
    <div className="fixed bottom-24 right-6 z-10">
      <Button 
        className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 py-4 shadow-lg"
        onClick={onClick}
      >
        <Wand2 className="mr-2 h-5 w-5" />
        Create Template
      </Button>
    </div>
  );
};

export default CreateTemplateButton;
