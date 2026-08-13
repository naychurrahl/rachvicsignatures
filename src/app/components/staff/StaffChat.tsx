import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";
import { ApiRequest, baseUrl } from "@/app/contexts/ApiRequest";
import { ChatQueueTicket, ChatTicket } from "@/app/data/interFaces";
import { StaffOwnerHeader } from "@/app/components/layout/StaffOwnerHeader";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { toast } from "sonner";

const POLL_INTERVAL_MS = 4000;

export function StaffChat() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<ChatQueueTicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<ChatTicket | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchQueue = () => {
    ApiRequest({ url: `${baseUrl}/chat/queue` })
      .then((data: { tickets: ChatQueueTicket[] }) => setQueue(data.tickets || []))
      .catch(console.error);
  };

  const fetchActiveTicket = (id: string) => {
    ApiRequest({ url: `${baseUrl}/chat/${id}` })
      .then((data: ChatTicket) => setActiveTicket(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeTicket) return;
    const interval = setInterval(() => fetchActiveTicket(activeTicket.id), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [activeTicket?.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [activeTicket?.messages.length]);

  const handleClaim = async (ticketId: string) => {
    try {
      const ticket: ChatTicket = await ApiRequest({
        url: `${baseUrl}/chat/claim/${ticketId}`,
        method: "POST",
      });
      setActiveTicket(ticket);
      fetchQueue();
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !activeTicket) return;
    setSending(true);
    try {
      await ApiRequest({
        url: `${baseUrl}/chat/${activeTicket.id}`,
        method: "POST",
        body: { message },
      });
      setMessage("");
      fetchActiveTicket(activeTicket.id);
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <StaffOwnerHeader title="Support Chat" onBack={() => navigate("/staff/dashboard")} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <div className="md:col-span-1">
          <h2 className="text-sm mb-3">Queue ({queue.length})</h2>
          {queue.length === 0 ? (
            <p className="text-sm text-gray-500">No customers waiting.</p>
          ) : (
            <div className="space-y-2">
              {queue.map((t) => (
                <div
                  key={t.id}
                  className="bg-white dark:bg-gray-900 rounded-lg border p-3 flex items-center justify-between"
                >
                  <span className="text-xs text-gray-500">Ticket #{t.id.slice(-6)}</span>
                  <Button size="sm" onClick={() => handleClaim(t.id)}>
                    Claim
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          {!activeTicket ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg border p-8 text-center text-sm text-gray-500">
              Claim a ticket from the queue to start chatting.
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-lg border flex flex-col h-[60vh]">
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeTicket.messages.length === 0 ? (
                  <p className="text-sm text-gray-500">No messages yet.</p>
                ) : (
                  activeTicket.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.senderRole === "staff" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                          m.senderRole === "staff"
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
                  placeholder="Type a reply…"
                  disabled={activeTicket.status === "closed"}
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={sending || !message.trim() || activeTicket.status === "closed"}
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
