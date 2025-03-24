import { useState } from "react";
import Chatbot from "./Chatbot";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary hover:bg-secondary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
      
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200">
          <Chatbot onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
};

export default FloatingChatButton;
