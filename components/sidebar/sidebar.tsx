"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquarePlus, Settings, MessageSquare, Bot, Trash2 } from "lucide-react";
import { useChatHistory } from "@/hooks/use-chat-history";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { sessions, currentSessionId, setCurrentSession, deleteSession } = useChatHistory();

  return (
    <div className="w-64 bg-zinc-950/50 border-r border-white/10 flex flex-col h-full backdrop-blur-xl shrink-0">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">Elize AI</span>
        </div>

        <Link href="/chat" onClick={() => setCurrentSession(null)} className="w-full">
          <Button
            variant="secondary"
            className="w-full justify-start gap-2 bg-white/5 hover:bg-white/10 border border-white/5 shadow-sm"
          >
            <MessageSquarePlus className="w-4 h-4" />
            New Chat
          </Button>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-1">
          <div className="px-2 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Recent Chats
          </div>
          {sessions.length === 0 ? (
            <div className="px-2 py-4 text-sm text-muted-foreground/50 text-center italic">
              No recent chats
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "group flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-all hover:bg-white/5",
                  currentSessionId === session.id ? "bg-white/10 text-white" : "text-zinc-400"
                )}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <button
                  className="flex-1 truncate text-left focus:outline-none"
                  onClick={() => setCurrentSession(session.id)}
                >
                  {session.title || "New Conversation"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity p-1 focus:outline-none"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/10">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-all hover:bg-white/5",
            pathname === "/settings" ? "bg-white/10 text-white" : "text-zinc-400"
          )}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </div>
  );
}
