import { useState, useRef, useEffect, useMemo } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ChatSidebar } from "@/components/ChatSidebar";
import { Dashboard, DashboardStats } from "@/components/Dashboard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

type QueryCategory = "rastreamento" | "documentacao" | "operacoes";

const categorizeQuery = (text: string): QueryCategory => {
  const lowerText = text.toLowerCase();

  if (
    lowerText.match(
      /\b(navio|rastrear|rastro|localização|posição|vessel|ship|carga|container|tracking)\b/i
    )
  ) {
    return "rastreamento";
  }

  if (
    lowerText.match(
      /\b(documento|documentação|certidão|certificado|papéis|licença|autorização|manifest|bl|conhecimento)\b/i
    )
  ) {
    return "documentacao";
  }

  return "operacoes";
};

const Index = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Conversa inicial",
      timestamp: new Date(),
      messages: [
        {
          id: "1",
          text: "Olá! Sou o assistente do ChatBot Portuário. Como posso ajudá-lo com informações sobre operações marítimas, documentação de carga ou rastreamento de navios?",
          isUser: false,
          timestamp: new Date(),
        },
      ],
    },
  ]);

  const [currentConversationId, setCurrentConversationId] = useState("1");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(
    (c) => c.id === currentConversationId
  );
  const messages = currentConversation?.messages || [];

  const dashboardStats = useMemo((): DashboardStats => {
    const allUserMessages = conversations.flatMap((conv) =>
      conv.messages.filter((m) => m.isUser)
    );

    const categoryCounts = {
      rastreamento: 0,
      documentacao: 0,
      operacoes: 0,
    };

    allUserMessages.forEach((msg) => {
      const category = categorizeQuery(msg.text);
      categoryCounts[category]++;
    });

    return {
      totalConversations: conversations.length,
      totalQueries: allUserMessages.length,
      categoryCounts,
      recentQueries: allUserMessages
        .slice(-10)
        .reverse()
        .map((m) => m.text),
    };
  }, [conversations]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleNewChat = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: `Nova conversa ${conversations.length + 1}`,
      timestamp: new Date(),
      messages: [
        {
          id: Date.now().toString(),
          text: "Olá! Sou o assistente do ChatBot Portuário. Como posso ajudá-lo com informações sobre operações marítimas, documentação de carga ou rastreamento de navios?",
          isUser: false,
          timestamp: new Date(),
        },
      ],
    };
    setConversations((prev) => [...prev, newConv]);
    setCurrentConversationId(newConv.id);
  };

  const handleDeleteConversation = (id: string) => {
    if (conversations.length === 1) return;
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (currentConversationId === id) {
      const fallbackId = conversations.find((c) => c.id !== id)?.id || "1";
      setCurrentConversationId(fallbackId);
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    // Adiciona a mensagem do usuário
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === currentConversationId
          ? { ...conv, messages: [...conv.messages, userMessage] }
          : conv
      )
    );
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

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? { ...conv, messages: [...conv.messages, botMessage] }
            : conv
        )
      );
    } catch (error) {
      const erroBot: Message = {
        id: (Date.now() + 2).toString(),
        text: `❌ Erro ao comunicar com o agente: ${
          error instanceof Error ? error.message : String(error)
        }`,
        isUser: false,
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? { ...conv, messages: [...conv.messages, erroBot] }
            : conv
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-sky">
      <ChatSidebar
        isOpen={isSidebarOpen}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={setCurrentConversationId}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <ChatHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

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
