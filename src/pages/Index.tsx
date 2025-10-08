import { useState, useRef, useEffect } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Sou o assistente do ChatBot Portuário. Como posso ajudá-lo com informações sobre operações marítimas, documentação de carga ou rastreamento de navios?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const resposta = await fetch(
        "https://n8n.hackathon.souamigu.org.br/webhook-test/90e74c2f-1059-44b3-8f8d-4e447091b4d7",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texto: text }),
        }
      );

      if (!resposta.ok) {
        const erroTexto = await resposta.text();
        console.error("Erro HTTP:", resposta.status, erroTexto);
        throw new Error(`HTTP ${resposta.status}`);
      }

      const respostaTexto = await resposta.text();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: respostaTexto,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const erroBot: Message = {
        id: (Date.now() + 2).toString(),
        text: `❌ Erro ao comunicar com o agente: ${
          error instanceof Error ? error.message : String(error)
        }`,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, erroBot]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-sky">
      <div className="flex flex-col flex-1 min-w-0">
        <ChatHeader onMenuClick={() => {}} />

        <ScrollArea className="flex-1 container max-w-4xl mx-auto">
          <div className="py-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
};

export default Index;
