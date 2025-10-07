import { Anchor, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onMenuClick: () => void;
}

export const ChatHeader = ({ onMenuClick }: ChatHeaderProps) => {
  return (
    <header className="border-b border-border bg-gradient-ocean text-primary-foreground shadow-elegant sticky top-0 z-10">
      <div className="container max-w-full mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="p-2 bg-primary-foreground/10 rounded-lg backdrop-blur">
            <Anchor className="h-5 w-5 text-accent animate-wave" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">ChatBot Portuário</h1>
            <p className="text-xs text-primary-foreground/80">Assistente inteligente para operações marítimas</p>
          </div>
        </div>
      </div>
    </header>
  );
};
