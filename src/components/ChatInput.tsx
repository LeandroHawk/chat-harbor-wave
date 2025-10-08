import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { ChatMessage } from "./ChatMessage"; // ajuste o path

interface ChatInputProps {
  disabled?: boolean;
}

type ChatEntry = {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
};

export const ChatInput = ({ disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const enviarParaN8N = async (texto: string) => {
    setLoading(true); // inicia carregamento

    // Adiciona mensagem do usuário
    const userMessage: ChatEntry = {
      id: crypto.randomUUID(),
      message: texto,
      isUser: true,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);

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

      if (data && data[0]?.output) {
        const botMessage: ChatEntry = {
          id: crypto.randomUUID(),
          message: data[0].output,
          isUser: false,
          timestamp: new Date(),
        };

        setChatMessages((prev) => [...prev, botMessage]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            message: "❌ Erro: resposta inesperada do agente.",
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error("Erro ao enviar para N8N:", err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          message: "❌ Erro ao comunicar com o agente.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false); // encerra carregamento
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !loading) {
      enviarParaN8N(message);
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
    <div className="flex flex-col">
      {/* Mensagens do chat */}
      <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto px-4 py-2">
        {chatMessages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg.message}
            isUser={msg.isUser}
            timestamp={msg.timestamp}
          />
        ))}

        {/* Loading typing indicator */}
        {loading && (
          <ChatMessage
            message="Digitando..."
            isUser={false}
            timestamp={new Date()}
          />
        )}
      </div>

      {/* Input */}
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
              disabled={disabled || loading}
              className="min-h-[60px] max-h-[200px] resize-none rounded-2xl border-border focus-visible:ring-primary"
              rows={1}
            />
            <Button
              type="submit"
              disabled={!message.trim() || disabled || loading}
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
    </div>
  );
};
