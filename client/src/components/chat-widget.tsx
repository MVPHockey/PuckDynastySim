import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import type { User } from "@/lib/auth";

interface ChatMessage {
  id: number;
  leagueId: number;
  userId: number;
  message: string;
  timestamp: Date;
  username: string;
}

interface ChatWidgetProps {
  leagueId: number;
  currentUser: User;
  sendMessage: (message: any) => void;
  isConnected: boolean;
}

export default function ChatWidget({ leagueId, currentUser, sendMessage, isConnected }: ChatWidgetProps) {
  const [messageInput, setMessageInput] = useState("");
  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { data: initialMessages } = useQuery({
    queryKey: [`/api/leagues/${leagueId}/chat`],
  });

  // Combine initial messages with realtime messages
  const allMessages = [...(initialMessages || []), ...realtimeMessages];

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [allMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !isConnected) return;

    // Send message via WebSocket
    sendMessage({
      type: "chat",
      leagueId,
      content: messageInput.trim(),
    });

    // Add optimistic update
    const newMessage: ChatMessage = {
      id: Date.now(), // temporary ID
      leagueId,
      userId: currentUser.id,
      message: messageInput.trim(),
      timestamp: new Date(),
      username: currentUser.username,
    };
    setRealtimeMessages(prev => [...prev, newMessage]);
    setMessageInput("");
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hr ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          League Chat
          <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-64 p-4" ref={scrollAreaRef}>
          <div className="space-y-3">
            {allMessages.map((message) => (
              <div key={message.id} className="flex space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold">
                  {message.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{message.username}</span>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{message.message}</p>
                </div>
              </div>
            ))}
            {allMessages.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                <p>No messages yet</p>
                <p className="text-xs">Start the conversation!</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={isConnected ? "Type a message..." : "Connecting..."}
              disabled={!isConnected}
              className="flex-1"
            />
            <Button 
              type="submit" 
              size="sm" 
              disabled={!messageInput.trim() || !isConnected}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
