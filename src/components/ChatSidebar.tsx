import { Plus, MessageSquare, LayoutDashboard, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  isOpen: boolean;
  conversations: Conversation[];
  currentConversationId: string;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onToggleView: (view: "chat" | "dashboard") => void;
  currentView: "chat" | "dashboard";
}

export const ChatSidebar = ({
  isOpen,
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onToggleView,
  currentView,
}: ChatSidebarProps) => {
  if (!isOpen) return null;

  return (
    <div className="w-64 border-r border-border bg-card/50 backdrop-blur flex flex-col h-full">
      <div className="p-4 border-b border-border space-y-2">
        <Button
          onClick={onNewChat}
          className="w-full justify-center gap-2"
          variant="default"
        >
          <Plus className="h-4 w-4" />
          Novo Chat
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={() => onToggleView("chat")}
            variant={currentView === "chat" ? "default" : "outline"}
            size="sm"
            className="flex-1 gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Chat
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                "group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors",
                currentConversationId === conv.id
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              )}
            >
              <MessageSquare className="h-4 w-4 flex-shrink-0" />
              <div
                className="flex-1 min-w-0"
                onClick={() => onSelectConversation(conv.id)}
              >
                <p className="text-sm truncate">{conv.title}</p>
                <p className="text-xs text-muted-foreground">
                  {conv.timestamp.toLocaleDateString()}
                </p>
              </div>
              {conversations.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
