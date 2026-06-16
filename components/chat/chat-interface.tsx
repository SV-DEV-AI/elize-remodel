"use client";

import { useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { useConfig } from "@/hooks/use-config";
import { useChatHistory } from "@/hooks/use-chat-history";
import { Send, Bot, User, AlertCircle } from "lucide-react";
import { ModelSelector } from "./model-selector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function ChatInterface() {
  const { config } = useConfig();
  const { sessions, currentSessionId, addSession, updateSession, setCurrentSession } = useChatHistory();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Find the current session to load initial messages
  const currentSession = sessions.find((s) => s.id === currentSessionId);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    api: "/api/chat",
    id: currentSessionId || "new",
    initialMessages: currentSession?.messages || [],
    body: {
      provider: config.provider,
      model: config.model,
      config: {
        apiKey: config[`${config.provider}Key` as keyof typeof config],
      },
    },
    onFinish: (message) => {
      // Message finished streaming. We rely on the hook's messages array, 
      // but since we need the full updated list including the new user message + this ai message,
      // it's better handled in a useEffect watching `messages`.
    },
    onError: (err) => {
      toast.error("Generation Error", {
        description: err.message || "Failed to generate a response.",
      });
    },
  });

  // Keep local storage in sync with useChat messages
  useEffect(() => {
    if (messages.length === 0) return;

    if (!currentSessionId) {
      // First message of a new chat
      const newId = uuidv4();
      const firstUserMsg = messages.find(m => m.role === 'user');
      addSession({
        id: newId,
        title: firstUserMsg ? firstUserMsg.content.slice(0, 30) + "..." : "New Chat",
        messages: messages,
        updatedAt: Date.now(),
      });
      // setCurrentSession(newId) is called inside addSession
    } else {
      // Update existing
      updateSession(currentSessionId, messages);
    }
  }, [messages]);

  // When changing sessions via sidebar, update the useChat hook's messages
  useEffect(() => {
    if (currentSessionId && currentSession) {
      setMessages(currentSession.messages);
    } else if (!currentSessionId) {
      setMessages([]);
    }
  }, [currentSessionId, setMessages]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <header className="flex-none h-16 border-b border-white/10 flex items-center justify-between px-6 bg-zinc-950/50 backdrop-blur-md">
        <h2 className="text-lg font-medium text-white/90">
          {currentSession?.title || "New Chat"}
        </h2>
        <ModelSelector />
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-4 opacity-50 select-none">
              <Bot className="w-16 h-16" />
              <h3 className="text-2xl font-semibold">How can I help you today?</h3>
              <p className="text-sm max-w-sm">Select a model from the top right and start typing below.</p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div
                  className={`px-5 py-3.5 rounded-2xl max-w-[85%] text-[15px] leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-zinc-800 text-white rounded-br-sm"
                      : "bg-white/5 border border-white/10 text-zinc-200 rounded-bl-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content as string}</div>
                </div>

                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-4 justify-start fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-zinc-200 rounded-bl-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              </div>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg text-sm max-w-3xl mx-auto">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error.message || "Failed to get response. Please check your API keys in Settings."}</p>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none p-4 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none min-h-[56px] max-h-32 shadow-sm"
              placeholder="Message Elize AI..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 bottom-2 w-10 h-10 rounded-lg bg-white hover:bg-zinc-200 text-black transition-all disabled:opacity-50 disabled:bg-white/20 disabled:text-white/50"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
          <div className="text-center mt-2 text-xs text-zinc-500">
            AI can make mistakes. Always verify important information.
          </div>
        </div>
      </div>
    </div>
  );
}
