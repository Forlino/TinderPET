import { useState, useRef, useEffect } from "react";
import { Conversation, Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Send,
  Heart,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ChatConversationProps {
  conversation: Conversation;
  onBack: () => void;
  onSendMessage: (content: string) => void;
}

export const ChatConversation = ({
  conversation,
  onBack,
  onSendMessage,
}: ChatConversationProps) => {
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText("");

      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Hoy";
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    }

    return messageDate.toLocaleDateString();
  };

  // Group messages by date
  const groupedMessages = conversation.messages.reduce(
    (groups: { [key: string]: Message[] }, message) => {
      const dateKey = formatDate(message.timestamp);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
      return groups;
    },
    {},
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 relative overflow-hidden flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-600/30 via-purple-600/20 to-indigo-600/30"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white/20 backdrop-blur-xl border-b border-white/30 p-6"
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 rounded-2xl p-3"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-3 ring-white/30">
                <img
                  src={conversation.petPhoto}
                  alt={conversation.petName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {conversation.petName}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/80">En línea</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 rounded-2xl p-3"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 rounded-2xl p-3"
            >
              <Video className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 rounded-2xl p-3"
            >
              <MoreVertical className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Messages container */}
      <div className="flex-1 relative z-10 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto px-6 py-6 overflow-y-auto">
          <div className="space-y-6">
            {Object.entries(groupedMessages).map(([date, messages]) => (
              <div key={date}>
                {/* Date separator */}
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30">
                    {date}
                  </div>
                </div>

                {/* Messages for this date */}
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "flex mb-4",
                        message.senderId === "user"
                          ? "justify-end"
                          : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-xs lg:max-w-md",
                          message.senderId === "user" ? "order-2" : "order-1",
                        )}
                      >
                        <Card
                          className={cn(
                            "p-4 shadow-lg border-0",
                            message.senderId === "user"
                              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white ml-4"
                              : "bg-white/90 backdrop-blur-md text-gray-800 mr-4",
                          )}
                        >
                          <p className="text-base leading-relaxed break-words">
                            {message.content}
                          </p>
                          <div
                            className={cn(
                              "text-xs mt-2 flex items-center gap-1",
                              message.senderId === "user"
                                ? "text-white/80 justify-end"
                                : "text-gray-600",
                            )}
                          >
                            <span>{formatTime(message.timestamp)}</span>
                            {message.senderId === "user" && <span>✓✓</span>}
                          </div>
                        </Card>
                      </div>

                      {/* Avatar */}
                      <div
                        className={cn(
                          "flex-shrink-0",
                          message.senderId === "user"
                            ? "order-1 ml-3"
                            : "order-2 mr-3",
                        )}
                      >
                        {message.senderId !== "user" && (
                          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30">
                            <img
                              src={conversation.petPhoto}
                              alt={conversation.petName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start mb-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30">
                    <img
                      src={conversation.petPhoto}
                      alt={conversation.petName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Card className="bg-white/90 backdrop-blur-md p-4 border-0">
                    <div className="flex items-center gap-1">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Message input */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white/20 backdrop-blur-xl border-t border-white/30 p-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Escribe un mensaje a ${conversation.petName}...`}
                className="w-full bg-white/90 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-4 text-gray-800 placeholder-gray-500 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent min-h-[60px] max-h-32"
                rows={1}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              size="lg"
              className={cn(
                "rounded-2xl px-8 py-4 transition-all duration-300",
                messageText.trim()
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed",
              )}
            >
              <Send className="w-6 h-6" />
            </Button>
          </div>

          {/* Quick responses */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              "¡Hola! 👋",
              "¿Cómo estás? 😊",
              "Me encanta tu perfil 💕",
              "¿Quieres conocernos? 🐾",
            ].map((quickResponse) => (
              <Button
                key={quickResponse}
                onClick={() => onSendMessage(quickResponse)}
                variant="outline"
                size="sm"
                className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 rounded-full text-sm"
              >
                {quickResponse}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
