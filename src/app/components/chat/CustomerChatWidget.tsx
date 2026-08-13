import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { useApp } from "@/app/contexts/AppContext";
import { ApiRequest, baseUrl } from "@/app/contexts/ApiRequest";
import { ChatTicket } from "@/app/data/interFaces";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

const POLL_INTERVAL_MS = 4000;

export function CustomerChatWidget() {
  const { user } = useApp();
  const [open, setOpen] = useState(false);
  const [ticket, setTicket] = useState<ChatTicket | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchTicket = () => {
    ApiRequest({ url: `${baseUrl}/chat/mine` })
      .then((data: ChatTicket) => setTicket(data))
      .catch(console.error);
  };

  useEffect(() => {
    if (!open) return;
    fetchTicket();
    const interval = setInterval(fetchTicket, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [ticket?.messages.length]);

  if (!user || user.role !== "customer") return null;

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await ApiRequest({
        url: `${baseUrl}/chat${ticket?.id ? `/${ticket.id}` : ""}`,
        method: "POST",
        body: { message },
      });
      setMessage("");
      fetchTicket();
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Open support chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex flex-col p-0">
          <SheetHeader className="border-b p-4">
            <SheetTitle>Support Chat</SheetTitle>
            {ticket?.status === "queued" && (
              <p className="text-xs text-gray-500">
                You're in the queue — a staff member will be with you shortly.
              </p>
            )}
          </SheetHeader>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {!ticket || ticket.messages.length === 0 ? (
              <p className="text-sm text-gray-500">
                Send a message to start a conversation with our team.
              </p>
            ) : (
              ticket.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.senderRole === "customer" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      m.senderRole === "customer"
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t p-3 flex items-center gap-2">
            <Input
              value={message}
              onChange={(e: any) => setMessage(e.target.value)}
              onKeyDown={(e: any) => e.key === "Enter" && handleSend()}
              placeholder="Type a message…"
              disabled={ticket?.status === "closed"}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={sending || !message.trim() || ticket?.status === "closed"}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
