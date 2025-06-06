import { useState, useEffect } from "react";
import { Pet, SwipeAction } from "@/types/pet";
import { UserProfile } from "@/types/user";
import { PremiumPlan } from "@/types/premium";
import { Advertisement } from "@/types/ad";
import { DailyLimit, DailyLimitState } from "@/types/dailyLimit";
import { mockPets } from "@/data/pets";
import { mockAds } from "@/data/ads";
import { PetCard } from "./PetCard";
import { AdCard } from "./AdCard";
import { SwipeableCard } from "./SwipeableCard";
import { PetProfile } from "./PetProfile";
import { MatchedPets } from "./MatchedPets";
import { UserProfileForm } from "./UserProfileForm";
import { UserProfileView } from "./UserProfileView";
import { PremiumSubscription } from "./PremiumSubscription";
import { PremiumSuccess } from "./PremiumSuccess";
import { DailyGoals } from "./DailyGoals";
import { Chat } from "./Chat";
import { Map } from "./Map";
import { OutOfPetsModal } from "./OutOfPetsModal";
import { Button } from "@/components/ui/button";
import {
  Heart,
  X,
  RotateCcw,
  Filter,
  User,
  PawPrint,
  Crown,
  Zap,
  Target,
  Calendar,
  Sparkles,
  Star,
  MessageCircle,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type ViewState =
  | "matching"
  | "profile"
  | "matches"
  | "chat"
  | "user-profile"
  | "edit-user-profile"
  | "premium"
  | "premium-success"
  | "daily-goals"
  | "map"
  | "out-of-pets";

export const PetMatcher = () => {
  const [currentPetIndex, setCurrentPetIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState<SwipeAction[]>([]);
  const [pets] = useState<Pet[]>(mockPets);
  const [ads] = useState<Advertisement[]>(mockAds);
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("matching");
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [premiumPlan, setPremiumPlan] = useState<PremiumPlan | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [totalSwipes, setTotalSwipes] = useState(0);
  const [dailyLimit, setDailyLimit] = useState<DailyLimit>(() => {
    const today = new Date().toISOString().split("T")[0];
    const stored = localStorage.getItem("petmatch_daily_limit");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Reset if it's a new day
      if (parsed.date !== today) {
        return { date: today, adsWatched: 0, extraSwipesUsed: 0 };
      }
      return parsed;
    }
    return { date: today, adsWatched: 0, extraSwipesUsed: 0 };
  });
  const [availableSwipes, setAvailableSwipes] = useState(30); // Base swipes

  // Daily limit functions
  const updateDailyLimit = (newLimit: DailyLimit) => {
    setDailyLimit(newLimit);
    localStorage.setItem("petmatch_daily_limit", JSON.stringify(newLimit));
  };

  const getDailyLimitState = (): DailyLimitState => {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const hoursUntilReset = Math.ceil(
      (tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60),
    );

    return {
      currentLimit: dailyLimit,
      canWatchAd: dailyLimit.adsWatched < 3,
      canGetExtraSwipes: dailyLimit.adsWatched < 3,
      hoursUntilReset,
    };
  };

  const hasSwipesRemaining = () => {
    if (isPremium) return true;
    return totalSwipes < availableSwipes;
  };

  // Calculate if current position should show an ad
  const shouldShowAd = () => {
    return totalSwipes > 0 && totalSwipes % 5 === 0 && !isPremium;
  };

  const getCurrentAd = () => {
    const adIndex = Math.floor((totalSwipes - 1) / 5) % ads.length;
    return ads[adIndex];
  };

  const currentPet = pets[currentPetIndex];
  const hasMorePets = currentPetIndex < pets.length && hasSwipesRemaining();
  const isShowingAd = shouldShowAd();
  const currentAd = isShowingAd ? getCurrentAd() : null;

  // Effect to check and reset daily limits
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (dailyLimit.date !== today) {
      const newLimit = { date: today, adsWatched: 0, extraSwipesUsed: 0 };
      updateDailyLimit(newLimit);
      setAvailableSwipes(30); // Reset to base swipes
    } else {
      // Restore available swipes from previous session
      setAvailableSwipes(30 + dailyLimit.extraSwipesUsed);
    }
  }, [dailyLimit.date]);

  const handleSwipe = (direction: "left" | "right") => {
    if (isAnimating) return;

    // Check if user has swipes remaining (unless premium)
    if (!isPremium && totalSwipes >= availableSwipes) {
      setViewState("out-of-pets");
      return;
    }

    // If showing an ad, just increment swipe count and continue
    if (isShowingAd) {
      setIsAnimating(true);
      setTotalSwipes((prev) => prev + 1);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return;
    }

    // If no pet available, show out of pets modal
    if (!currentPet) {
      setViewState("out-of-pets");
      return;
    }

    setIsAnimating(true);

    const action: SwipeAction = {
      petId: currentPet.id,
      action: direction === "right" ? "like" : "dislike",
      timestamp: new Date(),
    };

    setSwipeHistory((prev) => [...prev, action]);
    setTotalSwipes((prev) => prev + 1);

    setTimeout(() => {
      const nextIndex = currentPetIndex + 1;
      const nextTotalSwipes = totalSwipes + 1;

      setCurrentPetIndex(nextIndex);

      // Check if we've run out of pets or swipes
      if (
        nextIndex >= pets.length ||
        (!isPremium && nextTotalSwipes >= availableSwipes)
      ) {
        setViewState("out-of-pets");
      }

      setIsAnimating(false);
    }, 300);
  };

  const handleUndo = () => {
    if (totalSwipes === 0 || isAnimating) return;

    // If we're currently showing an ad, just go back
    if (isShowingAd) {
      setTotalSwipes((prev) => Math.max(0, prev - 1));
      return;
    }

    // If we have swipe history, remove the last pet swipe
    if (swipeHistory.length > 0) {
      setSwipeHistory((prev) => prev.slice(0, -1));
      setCurrentPetIndex((prev) => Math.max(0, prev - 1));
    }

    setTotalSwipes((prev) => Math.max(0, prev - 1));
  };

  const handleRestart = () => {
    setCurrentPetIndex(0);
    setSwipeHistory([]);
    setTotalSwipes(0);
  };

  const likedPets = swipeHistory.filter((action) => action.action === "like");

  const handleViewProfile = (pet: Pet) => {
    setSelectedPet(pet);
    setViewState("profile");
  };

  const handleViewMatches = () => {
    setViewState("matches");
  };

  const handleViewUserProfile = () => {
    if (userProfile) {
      setViewState("user-profile");
    } else {
      setViewState("edit-user-profile");
    }
  };

  const handleViewPremium = () => {
    setViewState("premium");
  };

  const handleViewDailyGoals = () => {
    setViewState("daily-goals");
  };

  const handleViewChat = () => {
    setViewState("chat");
  };

  const handleViewMap = () => {
    setViewState("map");
  };

  const handleEditUserProfile = () => {
    setViewState("edit-user-profile");
  };

  const handleBackToMatching = () => {
    setViewState("matching");
    setSelectedPet(null);
  };

  const handleSaveUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    setViewState("user-profile");
  };

  const handleSubscribePremium = (plan: PremiumPlan) => {
    setPremiumPlan(plan);
    setIsPremium(true);
    setViewState("premium-success");
  };

  const handlePremiumSuccess = () => {
    setViewState("matching");
  };

  const handleWatchAdForSwipes = () => {
    if (dailyLimit.adsWatched >= 3) return;

    const newLimit = {
      ...dailyLimit,
      adsWatched: dailyLimit.adsWatched + 1,
      extraSwipesUsed: dailyLimit.extraSwipesUsed + 10,
    };

    updateDailyLimit(newLimit);
    setAvailableSwipes((prev) => prev + 10);
    setViewState("matching");
  };

  const handleOutOfPetsRestart = () => {
    setViewState("matches");
  };

  const handleProfileLike = () => {
    if (!selectedPet) return;

    const action: SwipeAction = {
      petId: selectedPet.id,
      action: "like",
      timestamp: new Date(),
    };

    setSwipeHistory((prev) => [...prev, action]);
    handleBackToMatching();
  };

  const handleProfileDislike = () => {
    if (!selectedPet) return;

    const action: SwipeAction = {
      petId: selectedPet.id,
      action: "dislike",
      timestamp: new Date(),
    };

    setSwipeHistory((prev) => [...prev, action]);
    handleBackToMatching();
  };

  // Handle different view states
  if (viewState === "profile" && selectedPet) {
    return (
      <PetProfile
        pet={selectedPet}
        onBack={handleBackToMatching}
        onLike={handleProfileLike}
        onDislike={handleProfileDislike}
      />
    );
  }

  if (viewState === "matches") {
    return (
      <MatchedPets
        likedActions={likedPets}
        allPets={pets}
        onBack={handleBackToMatching}
        onViewProfile={handleViewProfile}
      />
    );
  }

  if (viewState === "user-profile" && userProfile) {
    return (
      <UserProfileView
        profile={userProfile}
        onEdit={handleEditUserProfile}
        onBack={handleBackToMatching}
      />
    );
  }

  if (viewState === "edit-user-profile") {
    return (
      <UserProfileForm
        profile={userProfile || undefined}
        onSave={handleSaveUserProfile}
        onCancel={handleBackToMatching}
      />
    );
  }

  if (viewState === "premium") {
    return (
      <PremiumSubscription
        onBack={handleBackToMatching}
        onSubscribe={handleSubscribePremium}
      />
    );
  }

  if (viewState === "premium-success" && premiumPlan) {
    return (
      <PremiumSuccess plan={premiumPlan} onContinue={handlePremiumSuccess} />
    );
  }

  if (viewState === "daily-goals") {
    return <DailyGoals onBack={handleBackToMatching} />;
  }

  if (viewState === "chat") {
    return (
      <Chat
        likedActions={likedPets}
        allPets={pets}
        onBack={handleBackToMatching}
      />
    );
  }

  if (viewState === "map") {
    return <Map onBack={handleBackToMatching} />;
  }

  if (viewState === "out-of-pets") {
    return (
      <OutOfPetsModal
        dailyLimitState={getDailyLimitState()}
        onWatchAd={handleWatchAdForSwipes}
        onGoToPremium={handleViewPremium}
        onRestart={handleOutOfPetsRestart}
        likedPetsCount={likedPets.length}
      />
    );
  }

  if (!hasMorePets && !isShowingAd) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-800 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-pink-400 to-rose-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-r from-purple-400 to-indigo-600 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-10 blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center w-full max-w-4xl backdrop-blur-lg bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[12rem] mb-8"
            >
              🎉
            </motion.div>
            <h2 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent mb-6">
              ¡Completado!
            </h2>
            <p className="text-3xl lg:text-4xl text-white/90 mb-12">
              Has dado "like" a {likedPets.length} mascota
              {likedPets.length !== 1 ? "s" : ""}
            </p>
            <div className="flex gap-6 justify-center">
              <Button
                onClick={handleRestart}
                size="lg"
                className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white text-2xl px-16 py-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
              >
                <RotateCcw className="w-10 h-10 mr-4" />
                Empezar de nuevo
              </Button>
              <Button
                onClick={handleViewMatches}
                size="lg"
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white text-2xl px-16 py-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/30"
              >
                <Heart className="w-10 h-10 mr-4" />
                Ver favoritos
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 relative overflow-hidden">
      {/* Dynamic animated background */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 w-full h-full bg-gradient-to-br from-pink-600/30 via-purple-600/20 to-indigo-600/30"
          style={{ left: "-14px" }}
        ></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-pink-400 to-rose-500 rounded-full opacity-15 blur-3xl animate-pulse delay-500"></div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-8 py-12">
        {/* Header with glassmorphism effect */}
        <div className="text-center mb-12 pt-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-6"
          >
            {/* Logo PetMatch */}
            <div className="relative">
              <div className="relative w-24 h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40">
                {/* Fondo del logo con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600 rounded-3xl shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-3xl" />
                </div>

                {/* Pata principal */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <PawPrint className="w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 text-white fill-current drop-shadow-lg" />
                  </div>
                </div>

                {/* Sparkles decorativos */}
                <div className="absolute -top-1 -left-1">
                  <Sparkles className="w-6 h-6 text-yellow-300 drop-shadow-lg" />
                </div>

                <div className="absolute -bottom-1 -left-2">
                  <Sparkles className="w-4 h-4 text-pink-200 drop-shadow-lg" />
                </div>
              </div>
            </div>

            <h1 className="text-7xl lg:text-9xl xl:text-[10rem] font-black bg-gradient-to-r from-white via-pink-100 to-rose-200 bg-clip-text text-transparent drop-shadow-2xl">
              PetMatch
            </h1>
            {isPremium && (
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black px-6 py-3 rounded-2xl shadow-2xl border-2 border-white/30"
              >
                <Crown className="w-10 h-10 mr-3" />
                <span className="text-3xl font-black">PREMIUM</span>
                <Sparkles className="w-8 h-8 ml-2" />
              </motion.div>
            )}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl lg:text-4xl text-white/90 mt-6 font-medium drop-shadow-lg"
          >
            Para los amantes de los animales
          </motion.p>
        </div>

        {/* Navigation tabs with glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white/20 backdrop-blur-2xl rounded-3xl p-3 shadow-2xl border border-white/30">
            <div
              className="flex items-center gap-3"
              style={{ marginLeft: "-4px" }}
            >
              {/* Mini logo en la navegación */}
              <div className="hidden lg:flex items-center gap-3 px-4">
                <div className="relative w-8 h-8" />
                <div className="w-px h-8 bg-white/30 mx-2" />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewState("matching")}
                className={cn(
                  "flex items-center gap-4 px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-300",
                  viewState === "matching"
                    ? "bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-2xl"
                    : "text-white/80 hover:text-white hover:bg-white/10",
                )}
              >
                <PawPrint className="w-7 h-7" />
                Explorar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewMatches}
                className={cn(
                  "flex items-center gap-4 px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-300 relative",
                  viewState === "matches"
                    ? "bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-2xl"
                    : "text-white/80 hover:text-white hover:bg-white/10",
                )}
              >
                <Heart className="w-7 h-7" />
                Favoritos
                {likedPets.length > 0 && (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm rounded-full w-8 h-8 flex items-center justify-center font-black shadow-lg"
                  >
                    {likedPets.length}
                  </motion.span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewChat}
                className={cn(
                  "flex items-center gap-4 px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-300 relative",
                  viewState === "chat"
                    ? "bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-2xl"
                    : "text-white/80 hover:text-white hover:bg-white/10",
                )}
              >
                <MessageCircle className="w-7 h-7" />
                Chat
                {likedPets.length > 0 && (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-full w-8 h-8 flex items-center justify-center font-black shadow-lg"
                  >
                    {likedPets.length}
                  </motion.span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewMap}
                className={cn(
                  "flex items-center gap-4 px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-300 relative",
                  viewState === "map"
                    ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-2xl"
                    : "text-white/80 hover:text-white hover:bg-white/10",
                )}
              >
                <MapPin className="w-7 h-7" />
                Mapa
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewUserProfile}
                className={cn(
                  "flex items-center gap-4 px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-300 relative",
                  viewState === "user-profile" ||
                    viewState === "edit-user-profile"
                    ? "bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-2xl"
                    : "text-white/80 hover:text-white hover:bg-white/10",
                )}
              >
                <User className="w-7 h-7" />
                Mi Perfil
                {!userProfile && (
                  <motion.span
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm rounded-full w-8 h-8 flex items-center justify-center font-black shadow-lg"
                  >
                    !
                  </motion.span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewPremium}
                className={cn(
                  "flex items-center gap-4 px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-300 relative",
                  viewState === "premium" || viewState === "premium-success"
                    ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black shadow-2xl"
                    : isPremium
                      ? "bg-gradient-to-r from-yellow-400/30 to-orange-500/30 text-yellow-100 border border-yellow-400/50"
                      : "text-white/80 hover:text-white hover:bg-white/10",
                )}
              >
                <Crown className="w-7 h-7" />
                Premium
                {isPremium && (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 text-black text-sm rounded-full w-8 h-8 flex items-center justify-center font-black shadow-lg"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewDailyGoals}
                className={cn(
                  "flex items-center gap-4 px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-300 relative",
                  viewState === "daily-goals"
                    ? "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white shadow-2xl"
                    : "text-white/80 hover:text-white hover:bg-white/10",
                )}
              >
                <Target className="w-7 h-7" />
                Objetivos
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Promotion banners with glassmorphism */}
        <div className="space-y-6 mb-12">
          {/* Daily Goals promotion banner */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Target className="w-16 h-16 text-white drop-shadow-lg" />
                </motion.div>
                <div>
                  <h3 className="text-3xl font-black text-white mb-2">
                    🎯 ¡Objetivos Diarios para tu Animal!
                  </h3>
                  <p className="text-xl text-white/90">
                    Caminar, alimentar, jugar y más. ¡Crea rutinas saludables!
                  </p>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleViewDailyGoals}
                  className="bg-white text-green-600 hover:bg-gray-100 text-xl px-10 py-6 font-black rounded-2xl shadow-2xl"
                >
                  <Calendar className="w-7 h-7 mr-3" />
                  Ver Objetivos
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Premium promotion banner */}
          {!isPremium && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-3xl p-8 border border-yellow-400/30 shadow-2xl hover:from-yellow-400/30 hover:via-orange-500/30 hover:to-red-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Crown className="w-16 h-16 text-yellow-400 drop-shadow-lg" />
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-2">
                      ¡Desbloquea PetMatch Premium!
                    </h3>
                    <p className="text-xl text-white/90">
                      Likes ilimitados, ver quién te dio like y mucho más
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleViewPremium}
                    className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-xl px-10 py-6 font-black rounded-2xl shadow-2xl"
                  >
                    <Zap className="w-7 h-7 mr-3" />
                    Ver Planes
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Profile creation prompt */}
          {!userProfile && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-gradient-to-r from-orange-400/20 to-yellow-400/20 backdrop-blur-xl border border-orange-400/30 rounded-3xl p-8 shadow-2xl hover:from-orange-400/30 hover:to-yellow-400/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-white mb-2">
                    ¡Completa tu perfil!
                  </h3>
                  <p className="text-xl text-white/90">
                    Crea tu perfil para que los refugios puedan conocerte mejor
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleViewUserProfile}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xl px-10 py-6 font-black rounded-2xl shadow-2xl"
                  >
                    Crear perfil
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Card Stack with enhanced effects */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="relative w-full max-w-5xl mx-auto mb-16"
          style={{ height: "1000px" }}
        >
          <AnimatePresence>
            {(hasMorePets || isShowingAd) && (
              <>
                {/* Show advertisement */}
                {isShowingAd && currentAd && (
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3))",
                    }}
                  >
                    <SwipeableCard
                      key={`ad-${currentAd.id}-${totalSwipes}`}
                      onSwipe={handleSwipe}
                      onTap={() => {}}
                      className="inset-0 w-full"
                    >
                      <AdCard ad={currentAd} className="w-full h-full" />
                    </SwipeableCard>
                  </motion.div>
                )}

                {/* Show pet cards */}
                {!isShowingAd && hasMorePets && (
                  <>
                    {/* Next card (background) with blur */}
                    {pets[currentPetIndex + 1] && (
                      <motion.div
                        key={`bg-${pets[currentPetIndex + 1].id}`}
                        className="absolute inset-0 blur-sm"
                        initial={{ scale: 0.9, opacity: 0.6 }}
                        animate={{ scale: 0.9, opacity: 0.6 }}
                      >
                        <PetCard
                          pet={pets[currentPetIndex + 1]}
                          className="w-full h-full"
                        />
                      </motion.div>
                    )}

                    {/* Current card with glow */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3))",
                      }}
                    >
                      <SwipeableCard
                        key={currentPet.id}
                        onSwipe={handleSwipe}
                        onTap={() => handleViewProfile(currentPet)}
                        className="inset-0 w-full"
                      >
                        <PetCard pet={currentPet} className="w-full h-full" />
                      </SwipeableCard>
                    </motion.div>
                  </>
                )}
              </>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons with enhanced effects */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="flex items-center justify-center gap-20 mt-20"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={() => handleSwipe("left")}
              disabled={isAnimating}
              size="lg"
              className="w-40 h-40 lg:w-48 lg:h-48 rounded-full bg-white/20 backdrop-blur-md border-4 border-red-400/50 hover:border-red-400 hover:bg-red-500/20 shadow-2xl transition-all duration-300 group"
              style={{
                boxShadow: "0 0 30px rgba(239, 68, 68, 0.3)",
              }}
            >
              <X
                className="w-36 h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 text-red-500 group-hover:text-red-400 transition-colors"
                strokeWidth={3}
              />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={handleUndo}
              disabled={totalSwipes === 0 || isAnimating}
              size="lg"
              className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-white/20 backdrop-blur-md border-3 border-gray-400/50 hover:border-gray-400 hover:bg-gray-500/20 shadow-xl transition-all duration-300 group"
            >
              <RotateCcw
                className="w-28 h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 text-gray-400 group-hover:text-gray-300 transition-colors"
                strokeWidth={3}
              />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={() => handleSwipe("right")}
              disabled={isAnimating}
              size="lg"
              className="w-40 h-40 lg:w-48 lg:h-48 rounded-full bg-white/20 backdrop-blur-md border-4 border-green-400/50 hover:border-green-400 hover:bg-green-500/20 shadow-2xl transition-all duration-300 group"
              style={{
                boxShadow: "0 0 30px rgba(34, 197, 94, 0.3)",
              }}
            >
              <Heart
                className="w-36 h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 text-green-500 group-hover:text-green-400 transition-colors fill-current"
                strokeWidth={3}
              />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
