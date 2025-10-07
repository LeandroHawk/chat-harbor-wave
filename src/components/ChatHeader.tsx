import { Anchor } from "lucide-react";
import shipImage from "@/assets/ship-animation.png";

export const ChatHeader = () => {
  return (
    <header className="border-b border-border bg-gradient-ocean text-primary-foreground shadow-elegant sticky top-0 z-10">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/10 rounded-lg backdrop-blur">
              <Anchor className="h-6 w-6 text-accent animate-wave" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">ChatBot Portuário</h1>
              <p className="text-sm text-primary-foreground/80">Assistente inteligente para operações marítimas</p>
            </div>
          </div>
          
          <div className="relative w-32 h-12 overflow-hidden">
            <img
              src={shipImage}
              alt="Navio navegando"
              className="absolute w-full h-full object-contain animate-ship-sail opacity-60"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
