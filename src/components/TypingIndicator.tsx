import { Bot } from "lucide-react";

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 p-4 animate-fade-in-up">
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg bg-primary">
        <Bot className="h-5 w-5 text-primary-foreground" />
      </div>
      
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-chat-bot-bg border border-border px-4 py-3 shadow-message">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  );
};
