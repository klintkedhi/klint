import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, X, SendIcon } from "lucide-react";
import { ChatMessage } from "@shared/schema";

type ChatbotProps = {
  placeId?: number;
  onClose: () => void;
};

const Chatbot = ({ placeId, onClose }: ChatbotProps) => {
  const [location] = useLocation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Ciao! Come posso aiutarti oggi?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setMessage("");
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // If we're on a place detail page and have a placeId, use that API
      if (placeId) {
        const response = await apiRequest(
          "POST", 
          `/api/places/${placeId}/chat`,
          {
            message: userMessage,
            history: messages.slice(1) // Skip the initial greeting
          }
        );
        
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        // Generic assistant response for global chatbot
        // Here we could add a different API endpoint for general chat
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "Mi dispiace, posso rispondere solo a domande specifiche sui luoghi. Prova a visitare una pagina di un luogo per fare domande più dettagliate."
        }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Mi dispiace, si è verificato un errore. Riprova più tardi."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Assistente virtuale</h3>
          <p className="text-sm text-white/80">Risponde alle tue domande 24/7</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-primary/20">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
          >
            <div 
              className={`${
                msg.role === 'user' 
                  ? 'bg-primary/10 text-slate-800' 
                  : 'bg-white shadow-sm text-slate-800'
              } p-3 rounded-lg max-w-[80%]`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200">
        <div className="flex">
          <Input
            type="text"
            className="flex-1 p-2 border border-slate-200 rounded-l-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Scrivi un messaggio..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            type="submit"
            className="bg-primary hover:bg-secondary text-white p-2 rounded-r-lg transition"
            disabled={isLoading}
          >
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
