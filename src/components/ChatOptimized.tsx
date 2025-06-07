import { useState, useMemo } from "react";
import { Pet } from "@/types/pet";
import { SwipeAction } from "@/types/pet";
import { ChatConversation, Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, Heart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { OptimizedBackground } from "./OptimizedBackground";

interface ChatProps {
  likedActions: SwipeAction[];
  allPets: Pet[];
  onBack: () => void;
}

export const Chat = ({ likedActions, allPets, onBack }: ChatProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);

  // Generate conversations from liked pets
  const conversations = useMemo(() => {
    return likedActions
      .map((action) => {
        const pet = allPets.find((p) => p.id === action.petId);
        if (!pet) return null;

        const messages: Message[] = [
          {
            id: "1",
            senderId: "shelter",
            content: `¡Hola! Nos alegra mucho que te haya gustado ${pet.name}. ¿Te gustaría conocer más sobre él/ella?`,
            timestamp: new Date(action.timestamp.getTime() + 1000 * 60 * 5),
            isRead: false,
          },
        ];

        return {
          id: pet.id,
          petId: pet.id,
          shelterId: "shelter-" + pet.id,
          messages,
          lastMessage: messages[messages.length - 1],
          unreadCount: 1,
          isActive: true,
        } as ChatConversation;
      })
      .filter((conv): conv is ChatConversation => conv !== null);
  }, [likedActions, allPets]);

  const filteredConversations = useMemo(() => {
    if (!searchTerm) return conversations;
    return conversations.filter((conv) => {
      const pet = allPets.find((p) => p.id === conv.petId);
      return pet?.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [conversations, searchTerm, allPets]);

  if (selectedConversation) {
    const conversation = conversations.find(
      (c) => c.id === selectedConversation,
    );
    const pet = allPets.find((p) => p.id === conversation?.petId);

    if (!conversation || !pet) {
      setSelectedConversation(null);
      return null;
    }

    return (
      <OptimizedBackground variant="blue" intensity="medium">
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-8">
          {/* Chat header */}
          <div className="flex items-center justify-between mb-6 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-xl">
            <Button
              onClick={() => setSelectedConversation(null)}
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>

            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-white/30">
                <AvatarImage src={pet.image} alt={pet.name} />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                  {pet.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-white">{pet.name}</h2>
                <p className="text-white/70 text-sm">{pet.location}</p>
              </div>
            </div>

            <div className="w-20"></div>
          </div>

          {/* Messages */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {conversation.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl shadow-lg ${
                    message.senderId === "user"
                      ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white"
                      : "bg-white/20 backdrop-blur-lg text-white border border-white/20"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderId === "user"
                        ? "text-white/80"
                        : "text-white/60"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message input */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-xl">
            <p className="text-white/80 text-center">
              💬 ¡Ponte en contacto con el refugio para conocer más sobre{" "}
              {pet.name}!
            </p>
            <p className="text-white/60 text-sm text-center mt-2">
              Teléfono: (555) 123-4567 | Email: refugio@petmatch.com
            </p>
          </div>
        </div>
      </OptimizedBackground>
    );
  }

  return (
    <OptimizedBackground variant="blue" intensity="medium">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            size="lg"
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 shadow-xl"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Volver
          </Button>
          <h1 className="text-4xl lg:text-6xl font-black text-white">
            💬 Chat
          </h1>
          <div></div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          <Input
            type="text"
            placeholder="Buscar conversaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder-white/60 pl-12 py-6 text-lg rounded-2xl"
          />
        </div>

        {/* Conversations list */}
        {filteredConversations.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">💬</div>
            <h2 className="text-4xl font-bold text-white mb-4">
              {likedActions.length === 0
                ? "No tienes chats aún"
                : "No se encontraron chats"}
            </h2>
            <p className="text-xl text-white/80 mb-8">
              {likedActions.length === 0
                ? "¡Da 'like' a algunas mascotas para empezar a chatear!"
                : "Intenta con otro término de búsqueda"}
            </p>
            {likedActions.length === 0 && (
              <Button
                onClick={onBack}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-xl px-8 py-4 font-bold shadow-xl"
              >
                Explorar mascotas
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConversations.map((conversation) => {
              const pet = allPets.find((p) => p.id === conversation.petId);
              if (!pet) return null;

              return (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl cursor-pointer hover:bg-white/20 transition-all duration-300 hover-scale"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-2 border-white/30">
                        <AvatarImage src={pet.image} alt={pet.name} />
                        <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xl">
                          {pet.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {pet.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                          <span className="text-white/60 text-sm">
                            {conversation.lastMessage.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-white/80 text-sm mb-2 line-clamp-2">
                        {conversation.lastMessage.content}
                      </p>

                      <div className="flex items-center gap-2">
                        <Badge className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">
                          <Heart className="w-3 h-3 mr-1" />
                          Te gustó
                        </Badge>
                        <Badge className="bg-white/20 text-white border border-white/30">
                          {pet.location}
                        </Badge>
                      </div>
                    </div>

                    <MessageCircle className="w-6 h-6 text-white/60" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </OptimizedBackground>
  );
};
