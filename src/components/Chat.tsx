import { useState, useEffect } from "react";
import { SwipeAction } from "@/types/pet";
import { Pet } from "@/types/pet";
import { Conversation, Message } from "@/types/chat";
import { ChatConversation } from "./ChatConversation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MessageCircle,
  Heart,
  Search,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ChatProps {
  likedActions: SwipeAction[];
  allPets: Pet[];
  onBack: () => void;
}

export const Chat = ({ likedActions, allPets, onBack }: ChatProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Create mock conversations based on liked pets
  useEffect(() => {
    const likedPets = likedActions
      .map((action) => allPets.find((pet) => pet.id === action.petId))
      .filter(Boolean) as Pet[];

    const mockConversations: Conversation[] = likedPets.map((pet, index) => {
      const conversationId = `conv_${pet.id}`;

      // Create mock messages for some conversations
      const messages: Message[] = [];
      if (index < 3) {
        // Only first 3 pets have messages
        messages.push(
          {
            id: `msg_1_${pet.id}`,
            senderId: pet.id,
            senderName: pet.name,
            content: `¡Hola! Vi que te gustó mi perfil. Me encantaría conocerte 🐾`,
            timestamp: new Date(Date.now() - (index + 1) * 2 * 60 * 60 * 1000),
            isRead: index === 0 ? false : true,
          },
          {
            id: `msg_2_${pet.id}`,
            senderId: "user",
            senderName: "Tú",
            content: `¡Hola ${pet.name}! Me encanta tu perfil, eres adorable 💕`,
            timestamp: new Date(Date.now() - (index + 1) * 90 * 60 * 1000),
            isRead: true,
          },
        );

        if (index === 0) {
          messages.push({
            id: `msg_3_${pet.id}`,
            senderId: pet.id,
            senderName: pet.name,
            content: `¿Te gustaría que nos conozcamos en el parque? Soy muy sociable 🎾`,
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            isRead: false,
          });
        }
      }

      return {
        id: conversationId,
        petId: pet.id,
        petName: pet.name,
        petPhoto: pet.photos[0],
        lastMessage: messages[messages.length - 1],
        messages,
        unreadCount: messages.filter((m) => !m.isRead && m.senderId !== "user")
          .length,
        isActive: true,
      };
    });

    setConversations(mockConversations);
  }, [likedActions, allPets]);

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId,
  );

  const filteredConversations = conversations.filter((conv) =>
    conv.petName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalUnreadCount = conversations.reduce(
    (acc, conv) => acc + conv.unreadCount,
    0,
  );

  const handleConversationSelect = (conversationId: string) => {
    setActiveConversationId(conversationId);
    // Mark messages as read
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              unreadCount: 0,
              messages: conv.messages.map((msg) => ({ ...msg, isRead: true })),
            }
          : conv,
      ),
    );
  };

  const handleSendMessage = (content: string) => {
    if (!activeConversationId) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: "user",
      senderName: "Tú",
      content,
      timestamp: new Date(),
      isRead: true,
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: newMessage,
            }
          : conv,
      ),
    );

    // Simulate pet response after 2-5 seconds
    setTimeout(
      () => {
        const responses = [
          "¡Qué emocionante! 🐕",
          "Me encanta hablar contigo 💕",
          "¿Cuándo podemos conocernos? 🎾",
          "Eres muy amable 🐾",
          "¡Wooof wooof! 🐕‍🦺",
          "Me haces muy feliz 😊",
          "¿Te gusta jugar en el parque? 🌳",
          "Tengo muchas ganas de conocerte 💫",
        ];

        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];

        const petResponse: Message = {
          id: `msg_${Date.now()}_pet`,
          senderId: activeConversation?.petId || "",
          senderName: activeConversation?.petName || "",
          content: randomResponse,
          timestamp: new Date(),
          isRead: true,
        };

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeConversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, petResponse],
                  lastMessage: petResponse,
                }
              : conv,
          ),
        );
      },
      Math.random() * 3000 + 2000,
    );
  };

  if (activeConversation) {
    return (
      <ChatConversation
        conversation={activeConversation}
        onBack={() => setActiveConversationId(null)}
        onSendMessage={handleSendMessage}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-400 via-orange-500 to-purple-600 relative overflow-hidden">
      {/* Static background - no animations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full opacity-15 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 backdrop-blur-md rounded-2xl p-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MessageCircle className="w-12 h-12 text-white drop-shadow-lg" />
              </motion.div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-black text-white drop-shadow-lg">
                  Chats
                </h1>
                <p className="text-xl text-white/90">Habla con tus matches</p>
              </div>
            </div>
          </div>

          {totalUnreadCount > 0 && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg"
            >
              {totalUnreadCount} nuevos
            </motion.div>
          )}
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/60" />
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl pl-14 pr-6 py-4 text-white placeholder-white/60 text-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Conversations list */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {filteredConversations.length === 0 ? (
            <Card className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-12 text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-6"
              >
                💬
              </motion.div>
              <h3 className="text-3xl font-bold text-white mb-4">
                {conversations.length === 0
                  ? "¡No hay matches aún!"
                  : "No se encontraron conversaciones"}
              </h3>
              <p className="text-xl text-white/80">
                {conversations.length === 0
                  ? "Dale like a algunas mascotas para empezar a chatear"
                  : "Intenta con otro término de búsqueda"}
              </p>
            </Card>
          ) : (
            <AnimatePresence>
              {filteredConversations.map((conversation, index) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleConversationSelect(conversation.id)}
                  className="cursor-pointer"
                >
                  <Card className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-6 hover:bg-white/30 transition-all duration-300 group">
                    <div className="flex items-center gap-6">
                      {/* Pet avatar */}
                      <div className="relative">
                        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden ring-4 ring-white/30 group-hover:ring-white/50 transition-all duration-300">
                          <img
                            src={conversation.petPhoto}
                            alt={conversation.petName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        {conversation.unreadCount > 0 && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg border-2 border-white"
                          >
                            {conversation.unreadCount}
                          </motion.div>
                        )}
                      </div>

                      {/* Conversation info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-2xl font-bold text-white truncate group-hover:text-pink-100 transition-colors">
                            {conversation.petName}
                          </h3>
                          {conversation.lastMessage && (
                            <span className="text-white/60 text-sm">
                              {new Date(
                                conversation.lastMessage.timestamp,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>

                        {conversation.lastMessage ? (
                          <p
                            className={cn(
                              "text-lg truncate",
                              conversation.unreadCount > 0
                                ? "text-white font-semibold"
                                : "text-white/70",
                            )}
                          >
                            {conversation.lastMessage.senderId === "user" &&
                              "Tú: "}
                            {conversation.lastMessage.content}
                          </p>
                        ) : (
                          <p className="text-white/60 text-lg italic">
                            ¡Empezar conversación!
                          </p>
                        )}

                        {/* Match indicator */}
                        <div className="flex items-center gap-2 mt-2">
                          <Heart className="w-4 h-4 text-pink-400 fill-current" />
                          <span className="text-pink-300 text-sm font-medium">
                            Match confirmado
                          </span>
                        </div>
                      </div>

                      {/* Arrow indicator */}
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-white/60 group-hover:text-white transition-colors"
                      >
                        <MoreHorizontal className="w-6 h-6" />
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Stats */}
        {conversations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 inline-block">
              <p className="text-white/80 text-lg">
                <span className="font-bold text-white">
                  {conversations.length}
                </span>{" "}
                conversaciones activas
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
