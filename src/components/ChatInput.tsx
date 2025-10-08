import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage?: (message: string) => void; // opcional se quiser usar callback
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const enviarParaN8N = async (texto: string) => {
    try {
      const resposta = await fetch(
        "https://n8n.hackathon.souamigu.org.br/webhook-test/90e74c2f-1059-44b3-8f8d-4e447091b4d7",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texto }),
        }
      );

      const data = await resposta.json();
      console.log("Resposta do N8N:", data);
    } catch (err) {
      console.error("Erro ao enviar para N8N:", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      // envia para N8N
      enviarParaN8N(message);

      // se tiver callback externo
      if (onSendMessage) {
        onSendMessage(message);
      }

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
