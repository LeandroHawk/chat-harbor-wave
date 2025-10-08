import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  disabled?: boolean;
  onSendMessage: (text: string) => void; // <--- callback do pai
}

export const ChatInput = ({ disabled, onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim()); // envia para o pai
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="container max-w-4xl mx-auto p-4">
        <div className="flex gap-2 items-end">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            disabled={disabled}
            className="min-h-[60px] max-h-[200px] resize-none rounded-2xl border-border focus-visible:ring-primary"
            rows={1}
          />
          <Button
            type="submit"
            disabled={!message.trim() || disabled}
            size="icon"
            className="h-[60px] w-[60px] rounded-2xl bg-primary hover:bg-primary/90 transition-all"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Pressione Enter para enviar, Shift + Enter para nova linha
        </p>
      </div>
    </form>
  );
};
