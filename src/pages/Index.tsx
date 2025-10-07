import { useState, useRef, useEffect } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ChatSidebar } from "@/components/ChatSidebar";
import { Dashboard } from "@/components/Dashboard";
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
  const [currentView, setCurrentView] = useState<'chat' | 'dashboard'>('chat');
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];

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
    setConversations(prev => [...prev, newConv]);
    setCurrentConversationId(newConv.id);
    setCurrentView('chat');
  };

  const handleDeleteConversation = (id: string) => {
    if (conversations.length === 1) return;
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(conversations.find(c => c.id !== id)?.id || conversations[0].id);
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? { ...conv, messages: [...conv.messages, userMessage] }
        : conv
    ));
    setIsTyping(true);

    // Simular resposta do bot (integrar com N8N webhook aqui)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Recebi sua mensagem! Em um ambiente de produção, esta resposta viria do seu webhook N8N. Configure a integração na função handleSendMessage para conectar com seu chatbot.",
        isUser: false,
        timestamp: new Date(),
      };
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { ...conv, messages: [...conv.messages, botMessage] }
          : conv
      ));
      setIsTyping(false);
    }, 1500);

    // TODO: Integração com N8N
    // try {
    //   const response = await fetch('SEU_WEBHOOK_N8N_URL', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ message: text })
    //   });
    //   const data = await response.json();
    //   // Processar resposta...
    // } catch (error) {
    //   console.error('Erro ao enviar mensagem:', error);
    // }
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
        onToggleView={setCurrentView}
        currentView={currentView}
      />
      
      <div className="flex flex-col flex-1 min-w-0">
        <ChatHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {currentView === 'dashboard' ? (
          <ScrollArea className="flex-1">
            <Dashboard />
          </ScrollArea>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
