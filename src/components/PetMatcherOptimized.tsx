import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
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
import { Button } from "@/components/ui/button";
import {
  Heart,
  X,
  RotateCcw,
  User,
  PawPrint,
  Crown,
  Zap,
  Target,
  Calendar,
  Sparkles,
  MessageCircle,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Lazy load components - using original working versions for Chat and MatchedPets
const PetProfile = lazy(() =>
  import("./PetProfile").then((m) => ({ default: m.PetProfile })),
);
const MatchedPets = lazy(() =>
  import("./MatchedPets").then((m) => ({ default: m.MatchedPets })),
);
const UserProfileForm = lazy(() =>
  import("./UserProfileForm").then((m) => ({ default: m.UserProfileForm })),
);
const UserProfileView = lazy(() =>
  import("./UserProfileView").then((m) => ({ default: m.UserProfileView })),
);
const PremiumSubscription = lazy(() =>
  import("./PremiumSubscription").then((m) => ({
    default: m.PremiumSubscription,
  })),
);
const PremiumSuccess = lazy(() =>
  import("./PremiumSuccess").then((m) => ({ default: m.PremiumSuccess })),
);
const DailyGoals = lazy(() =>
  import("./DailyGoals").then((m) => ({ default: m.DailyGoals })),
);
const Chat = lazy(() => import("./Chat").then((m) => ({ default: m.Chat })));
const Map = lazy(() => import("./Map").then((m) => ({ default: m.Map })));
const OutOfPetsModal = lazy(() =>
  import("./OutOfPetsModal").then((m) => ({ default: m.OutOfPetsModal })),
);

// Lazy load framer-motion for better initial load
const LazyMotion = lazy(() =>
  import("framer-motion").then((m) => ({ default: m.motion })),
);
const LazyAnimatePresence = lazy(() =>
  import("framer-motion").then((m) => ({ default: m.AnimatePresence })),
);

// Loading component for lazy loaded components
const ComponentLoader = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen w-full bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-800 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white text-xl">Cargando...</p>
    </div>
  </div>
);

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
      if (parsed.date !== today) {
        return { date: today, adsWatched: 0, extraSwipesUsed: 0 };
      }
      return parsed;
    }
    return { date: today, adsWatched: 0, extraSwipesUsed: 0 };
  });
  const [availableSwipes, setAvailableSwipes] = useState(30);

  // Memoized calculations to avoid unnecessary re-renders
  const likedPets = useMemo(
    () => swipeHistory.filter((action) => action.action === "like"),
    [swipeHistory],
  );

  const currentPet = useMemo(
    () => pets[currentPetIndex],
    [pets, currentPetIndex],
  );

  const hasMorePets = useMemo(
    () =>
      currentPetIndex < pets.length &&
      (isPremium || totalSwipes < availableSwipes),
    [currentPetIndex, pets.length, isPremium, totalSwipes, availableSwipes],
  );

  const shouldShowAd = useMemo(
    () => totalSwipes > 0 && totalSwipes % 5 === 0 && !isPremium,
    [totalSwipes, isPremium],
  );

  const currentAd = useMemo(() => {
    if (!shouldShowAd) return null;
    const adIndex = Math.floor((totalSwipes - 1) / 5) % ads.length;
    return ads[adIndex];
  }, [shouldShowAd, totalSwipes, ads]);

  // Daily limit functions
  const updateDailyLimit = useCallback((newLimit: DailyLimit) => {
    setDailyLimit(newLimit);
    localStorage.setItem("petmatch_daily_limit", JSON.stringify(newLimit));
  }, []);

  const getDailyLimitState = useCallback((): DailyLimitState => {
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
  }, [dailyLimit]);

  // Effect to check and reset daily limits
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (dailyLimit.date !== today) {
      const newLimit = { date: today, adsWatched: 0, extraSwipesUsed: 0 };
      updateDailyLimit(newLimit);
      setAvailableSwipes(30);
    } else {
      setAvailableSwipes(30 + dailyLimit.extraSwipesUsed);
    }
  }, [dailyLimit.date, updateDailyLimit]);

  // Optimized swipe handler with useCallback
  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (isAnimating) return;

      if (!isPremium && totalSwipes >= availableSwipes) {
        setViewState("out-of-pets");
        return;
      }

      if (shouldShowAd) {
        setIsAnimating(true);
        setTotalSwipes((prev) => prev + 1);
        setTimeout(() => setIsAnimating(false), 300);
        return;
      }

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

        if (
          nextIndex >= pets.length ||
          (!isPremium && nextTotalSwipes >= availableSwipes)
        ) {
          setViewState("out-of-pets");
        }

        setIsAnimating(false);
      }, 300);
    },
    [
      isAnimating,
      isPremium,
      totalSwipes,
      availableSwipes,
      shouldShowAd,
      currentPet,
      currentPetIndex,
      pets.length,
    ],
  );

  // Other handlers with useCallback for optimization
  const handleUndo = useCallback(() => {
    if (totalSwipes === 0 || isAnimating) return;

    if (shouldShowAd) {
      setTotalSwipes((prev) => Math.max(0, prev - 1));
      return;
    }

    if (swipeHistory.length > 0) {
      setSwipeHistory((prev) => prev.slice(0, -1));
      setCurrentPetIndex((prev) => Math.max(0, prev - 1));
    }

    setTotalSwipes((prev) => Math.max(0, prev - 1));
  }, [totalSwipes, isAnimating, shouldShowAd, swipeHistory.length]);

  const handleRestart = useCallback(() => {
    setCurrentPetIndex(0);
    setSwipeHistory([]);
    setTotalSwipes(0);
  }, []);

  const handleViewProfile = useCallback((pet: Pet) => {
    setSelectedPet(pet);
    setViewState("profile");
  }, []);

  const handleBackToMatching = useCallback(() => {
    setViewState("matching");
    setSelectedPet(null);
  }, []);

  // Navigation handlers
  const navigationHandlers = useMemo(
    () => ({
      handleViewMatches: () => setViewState("matches"),
      handleViewUserProfile: () =>
        setViewState(userProfile ? "user-profile" : "edit-user-profile"),
      handleViewPremium: () => setViewState("premium"),
      handleViewDailyGoals: () => setViewState("daily-goals"),
      handleViewChat: () => setViewState("chat"),
      handleViewMap: () => setViewState("map"),
    }),
    [userProfile],
  );

  // Render different view states with lazy loading
  if (viewState === "profile" && selectedPet) {
    return (
      <Suspense fallback={<ComponentLoader children={undefined} />}>
        <PetProfile
          pet={selectedPet}
          onBack={handleBackToMatching}
          onLike={() => {
            if (!selectedPet) return;
            const action: SwipeAction = {
              petId: selectedPet.id,
              action: "like",
              timestamp: new Date(),
            };
            setSwipeHistory((prev) => [...prev, action]);
            handleBackToMatching();
          }}
          onDislike={() => {
            if (!selectedPet) return;
            const action: SwipeAction = {
              petId: selectedPet.id,
              action: "dislike",
              timestamp: new Date(),
            };
            setSwipeHistory((prev) => [...prev, action]);
            handleBackToMatching();
          }}
        />
      </Suspense>
    );
  }

  if (viewState === "matches") {
    return (
      <Suspense fallback={<ComponentLoader children={undefined} />}>
        <MatchedPets
          likedActions={likedPets}
          allPets={pets}
          onBack={handleBackToMatching}
          onViewProfile={handleViewProfile}
        />
      </Suspense>
    );
  }

  if (viewState === "user-profile" && userProfile) {
    return (
      <Suspense fallback={<ComponentLoader children={undefined} />}>
        <UserProfileView
          profile={userProfile}
          onEdit={() => setViewState("edit-user-profile")}
          onBack={handleBackToMatching}
        />
      </Suspense>
    );
  }

  if (viewState === "edit-user-profile") {
    return (
      <Suspense fallback={<ComponentLoader children={undefined} />}>
        <UserProfileForm
          profile={userProfile || undefined}
          onSave={(profile) => {
            setUserProfile(profile);
            setViewState("user-profile");
          }}
          onCancel={handleBackToMatching}
        />
      </Suspense>
    );
  }

  if (viewState === "premium") {
    return (
      <Suspense fallback={<ComponentLoader children={undefined} />}>
        <PremiumSubscription
          onBack={handleBackToMatching}
          onSubscribe={(plan) => {
            setPremiumPlan(plan);
            setIsPremium(true);
            setViewState("premium-success");
          }}
        />
      </Suspense>
    );
  }

  if (viewState === "premium-success" && premiumPlan) {
    return (
      <Suspense fallback={<ComponentLoader children={undefined} />}>
        <PremiumSuccess
          plan={premiumPlan}
          onContinue={() => setViewState("matching")}
        />
      </Suspense>
    );
  }

  if (viewState === "daily-goals") {
    return (
      <Suspense fallback={<ComponentLoader children={undefined} />}>
        <DailyGoals onBack={handleBackToMatching} />
      </Suspense>
    );
  }

  if (viewState === "chat") {
    return (
      <Suspense fallback={<ComponentLoader children={undefined} />}>
        <Chat
          likedActions={likedPets}
          allPets={pets}
          onBack={handleBackToMatching}
        />
      </Suspense>
    );
  }

  if (viewState === "map") {
    return (
      <Suspense fallback={<ComponentLoader children={undefined} />}>
        <Map onBack={handleBackToMatching} />
      </Suspense>
    );
  }

  if (viewState === "out-of-pets") {
    return (
      <Suspense fallback={<ComponentLoader children={undefined} />}>
        <OutOfPetsModal
          dailyLimitState={getDailyLimitState()}
          onWatchAd={() => {
            if (dailyLimit.adsWatched >= 3) return;
            const newLimit = {
              ...dailyLimit,
              adsWatched: dailyLimit.adsWatched + 1,
              extraSwipesUsed: dailyLimit.extraSwipesUsed + 10,
            };
            updateDailyLimit(newLimit);
            setAvailableSwipes((prev) => prev + 10);
            setViewState("matching");
          }}
          onGoToPremium={() => setViewState("premium")}
          onRestart={() => setViewState("matches")}
          likedPetsCount={likedPets.length}
        />
      </Suspense>
    );
  }

  // Optimized completion screen with CSS animations instead of JS
  if (!hasMorePets && !shouldShowAd) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-pink-400 to-rose-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-r from-purple-400 to-indigo-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
          <div className="text-center w-full max-w-4xl backdrop-blur-lg bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl">
            <div className="text-[12rem] mb-8">🎉</div>
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
                onClick={navigationHandlers.handleViewMatches}
                size="lg"
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white text-2xl px-16 py-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/30"
              >
                <Heart className="w-10 h-10 mr-4" />
                Ver favoritos
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main matching interface - heavily optimized
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 relative overflow-hidden">
      {/* Ultra-simplified static background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full opacity-15 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-8 py-12">
        {/* Simplified header */}
        <div className="text-center mb-12 pt-8">
          <div className="flex items-center justify-center gap-6">
            <div className="relative w-24 h-24 lg:w-32 lg:h-32">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600 rounded-3xl shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-3xl" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <PawPrint className="w-12 h-12 lg:w-16 lg:h-16 text-white fill-current drop-shadow-lg" />
              </div>
            </div>

            <h1 className="text-7xl lg:text-9xl font-black bg-gradient-to-r from-white via-pink-100 to-rose-200 bg-clip-text text-transparent drop-shadow-2xl">
              PetMatch
            </h1>

            {isPremium && (
              <div className="flex items-center bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black px-6 py-3 rounded-2xl shadow-2xl border-2 border-white/30">
                <Crown className="w-10 h-10 mr-3" />
                <span className="text-3xl font-black">PREMIUM</span>
                <Sparkles className="w-8 h-8 ml-2" />
              </div>
            )}
          </div>
          <p className="text-3xl lg:text-4xl text-white/90 mt-6 font-medium drop-shadow-lg">
            Para los amantes de los animales
          </p>
        </div>

        {/* Simplified navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/20 backdrop-blur-2xl rounded-3xl p-3 shadow-2xl border border-white/30">
            <div className="flex items-center gap-3">
              <button
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
              </button>

              <button
                onClick={navigationHandlers.handleViewMatches}
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
                  <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm rounded-full w-8 h-8 flex items-center justify-center font-black shadow-lg">
                    {likedPets.length}
                  </span>
                )}
              </button>

              <button
                onClick={navigationHandlers.handleViewChat}
                className="flex items-center gap-4 px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-300 text-white/80 hover:text-white hover:bg-white/10"
              >
                <MessageCircle className="w-7 h-7" />
                Chat
              </button>

              <button
                onClick={navigationHandlers.handleViewMap}
                className="flex items-center gap-4 px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-300 text-white/80 hover:text-white hover:bg-white/10"
              >
                <MapPin className="w-7 h-7" />
                Mapa
              </button>

              <button
                onClick={navigationHandlers.handleViewUserProfile}
                className="flex items-center gap-4 px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-300 text-white/80 hover:text-white hover:bg-white/10"
              >
                <User className="w-7 h-7" />
                Mi Perfil
                {!userProfile && (
                  <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm rounded-full w-8 h-8 flex items-center justify-center font-black shadow-lg">
                    !
                  </span>
                )}
              </button>

              <button
                onClick={navigationHandlers.handleViewPremium}
                className={cn(
                  "flex items-center gap-4 px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-300",
                  isPremium
                    ? "bg-gradient-to-r from-yellow-400/30 to-orange-500/30 text-yellow-100 border border-yellow-400/50"
                    : "text-white/80 hover:text-white hover:bg-white/10",
                )}
              >
                <Crown className="w-7 h-7" />
                Premium
              </button>

              <button
                onClick={navigationHandlers.handleViewDailyGoals}
                className="flex items-center gap-4 px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-300 text-white/80 hover:text-white hover:bg-white/10"
              >
                <Target className="w-7 h-7" />
                Objetivos
              </button>
            </div>
          </div>
        </div>

        {/* Simplified promotion banners */}
        <div className="space-y-6 mb-12">
          {!isPremium && (
            <div className="bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-3xl p-8 border border-yellow-400/30 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Crown className="w-16 h-16 text-yellow-400 drop-shadow-lg" />
                  <div>
                    <h3 className="text-3xl font-black text-white mb-2">
                      ¡Desbloquea PetMatch Premium!
                    </h3>
                    <p className="text-xl text-white/90">
                      Likes ilimitados, ver quién te dio like y mucho más
                    </p>
                  </div>
                </div>
                <Button
                  onClick={navigationHandlers.handleViewPremium}
                  className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-xl px-10 py-6 font-black rounded-2xl shadow-2xl"
                >
                  <Zap className="w-7 h-7 mr-3" />
                  Ver Planes
                </Button>
              </div>
            </div>
          )}

          {!userProfile && (
            <div className="bg-gradient-to-r from-orange-400/20 to-yellow-400/20 backdrop-blur-xl border border-orange-400/30 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-white mb-2">
                    ¡Completa tu perfil!
                  </h3>
                  <p className="text-xl text-white/90">
                    Crea tu perfil para que los refugios puedan conocerte mejor
                  </p>
                </div>
                <Button
                  onClick={navigationHandlers.handleViewUserProfile}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xl px-10 py-6 font-black rounded-2xl shadow-2xl"
                >
                  Crear perfil
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Simplified card stack */}
        <div
          className="relative w-full max-w-5xl mx-auto mb-16"
          style={{ height: "1000px" }}
        >
          {(hasMorePets || shouldShowAd) && (
            <>
              {shouldShowAd && currentAd && (
                <div
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
                </div>
              )}

              {!shouldShowAd && hasMorePets && (
                <>
                  {pets[currentPetIndex + 1] && (
                    <div className="absolute inset-0 blur-sm opacity-60 scale-90">
                      <PetCard
                        pet={pets[currentPetIndex + 1]}
                        className="w-full h-full"
                      />
                    </div>
                  )}

                  <div
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
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Simplified action buttons */}
        <div className="flex items-center justify-center gap-20 mt-20">
          <Button
            onClick={() => handleSwipe("left")}
            disabled={isAnimating}
            size="lg"
            className="w-40 h-40 lg:w-48 lg:h-48 rounded-full bg-white/20 backdrop-blur-md border-4 border-red-400/50 hover:border-red-400 hover:bg-red-500/20 shadow-2xl transition-all duration-300 group"
          >
            <X
              className="w-36 h-36 lg:w-40 lg:h-40 text-red-500 group-hover:text-red-400 transition-colors"
              strokeWidth={3}
            />
          </Button>

          <Button
            onClick={handleUndo}
            disabled={totalSwipes === 0 || isAnimating}
            size="lg"
            className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-white/20 backdrop-blur-md border-3 border-gray-400/50 hover:border-gray-400 hover:bg-gray-500/20 shadow-xl transition-all duration-300 group"
          >
            <RotateCcw
              className="w-28 h-28 lg:w-32 lg:h-32 text-gray-400 group-hover:text-gray-300 transition-colors"
              strokeWidth={3}
            />
          </Button>

          <Button
            onClick={() => handleSwipe("right")}
            disabled={isAnimating}
            size="lg"
            className="w-40 h-40 lg:w-48 lg:h-48 rounded-full bg-white/20 backdrop-blur-md border-4 border-green-400/50 hover:border-green-400 hover:bg-green-500/20 shadow-2xl transition-all duration-300 group"
          >
            <Heart
              className="w-36 h-36 lg:w-40 lg:h-40 text-green-500 group-hover:text-green-400 transition-colors fill-current"
              strokeWidth={3}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
