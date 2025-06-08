import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Target,
  Check,
  Play,
  Utensils,
  Heart,
  Activity,
  Clock,
  Trophy,
  Star,
} from "lucide-react";
import { OptimizedBackground } from "./OptimizedBackground";

interface DailyGoal {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  progress: number;
  maxProgress: number;
  points: number;
  category: "care" | "exercise" | "nutrition" | "health";
}

interface DailyGoalsProps {
  onBack: () => void;
}

export const DailyGoals = ({ onBack }: DailyGoalsProps) => {
  const [goals, setGoals] = useState<DailyGoal[]>([
    {
      id: "walk",
      title: "Paseo matutino",
      description: "Saca a tu mascota a caminar por 30 minutos",
      icon: <Activity className="w-6 h-6" />,
      completed: false,
      progress: 0,
      maxProgress: 30,
      points: 50,
      category: "exercise",
    },
    {
      id: "feed",
      title: "Alimentación",
      description: "Asegúrate de que tu mascota coma sus 2 comidas",
      icon: <Utensils className="w-6 h-6" />,
      completed: false,
      progress: 1,
      maxProgress: 2,
      points: 30,
      category: "nutrition",
    },
    {
      id: "play",
      title: "Tiempo de juego",
      description: "Dedica 20 minutos a jugar con tu mascota",
      icon: <Play className="w-6 h-6" />,
      completed: false,
      progress: 5,
      maxProgress: 20,
      points: 40,
      category: "care",
    },
    {
      id: "health",
      title: "Chequeo de salud",
      description: "Revisa que tu mascota esté saludable",
      icon: <Heart className="w-6 h-6" />,
      completed: true,
      progress: 1,
      maxProgress: 1,
      points: 60,
      category: "health",
    },
  ]);

  const [totalPoints, setTotalPoints] = useState(60);
  const [streak, setStreak] = useState(7);

  const completedGoals = goals.filter((goal) => goal.completed).length;
  const totalGoals = goals.length;
  const completionPercentage = Math.round((completedGoals / totalGoals) * 100);

  const toggleGoal = (goalId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const newCompleted = !goal.completed;
          const newProgress = newCompleted
            ? goal.maxProgress
            : Math.max(0, goal.progress - goal.maxProgress);

          // Update total points
          if (newCompleted && !goal.completed) {
            setTotalPoints((prev) => prev + goal.points);
          } else if (!newCompleted && goal.completed) {
            setTotalPoints((prev) => Math.max(0, prev - goal.points));
          }

          return {
            ...goal,
            completed: newCompleted,
            progress: newProgress,
          };
        }
        return goal;
      }),
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "exercise":
        return "from-blue-500 to-cyan-600";
      case "nutrition":
        return "from-green-500 to-emerald-600";
      case "care":
        return "from-purple-500 to-violet-600";
      case "health":
        return "from-red-500 to-pink-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case "exercise":
        return "🏃‍♂️";
      case "nutrition":
        return "🍽️";
      case "care":
        return "🎾";
      case "health":
        return "❤️";
      default:
        return "🎯";
    }
  };

  return (
    <OptimizedBackground variant="green" intensity="medium">
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
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-black text-white mb-2">
              🎯 Objetivos Diarios
            </h1>
            <p className="text-xl text-white/80">
              Cuida de tu mascota con rutinas saludables
            </p>
          </div>
          <div></div>
        </div>

        {/* Stats overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl text-center">
            <CardContent className="p-6">
              <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <div className="text-3xl font-black text-white mb-2">
                {completedGoals}/{totalGoals}
              </div>
              <p className="text-white/80 text-sm">Objetivos completados</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl text-center">
            <CardContent className="p-6">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <div className="text-3xl font-black text-white mb-2">
                {totalPoints}
              </div>
              <p className="text-white/80 text-sm">Puntos totales</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl text-center">
            <CardContent className="p-6">
              <Trophy className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <div className="text-3xl font-black text-white mb-2">
                {streak}
              </div>
              <p className="text-white/80 text-sm">Días consecutivos</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl text-center">
            <CardContent className="p-6">
              <Clock className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <div className="text-3xl font-black text-white mb-2">
                {completionPercentage}%
              </div>
              <p className="text-white/80 text-sm">Completado hoy</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress overview */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Progreso del día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={completionPercentage} className="h-4" />
              <div className="text-center text-white/80">
                {completionPercentage === 100 ? (
                  <span className="text-green-400 font-bold">
                    🎉 ¡Excelente! Has completado todos tus objetivos hoy
                  </span>
                ) : (
                  <span>
                    Te faltan {totalGoals - completedGoals} objetivos para
                    completar el día
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals list */}
        <div className="space-y-4">
          {goals.map((goal) => (
            <Card
              key={goal.id}
              className={`cursor-pointer transition-all duration-300 hover-scale ${
                goal.completed
                  ? "bg-white/20 border-green-400/50 shadow-xl"
                  : "bg-white/10 border-white/20 hover:bg-white/15"
              } backdrop-blur-lg`}
              onClick={() => toggleGoal(goal.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Icon and category */}
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-r ${getCategoryColor(goal.category)}`}
                  >
                    {goal.icon}
                  </div>

                  {/* Goal info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {getCategoryEmoji(goal.category)} {goal.title}
                        {goal.completed && (
                          <Check className="w-5 h-5 text-green-400" />
                        )}
                      </h3>
                      <Badge
                        className={`${
                          goal.completed
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-black"
                        }`}
                      >
                        +{goal.points} pts
                      </Badge>
                    </div>

                    <p className="text-white/80 mb-3">{goal.description}</p>

                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-white/70">
                        <span>
                          Progreso: {goal.progress}/{goal.maxProgress}
                        </span>
                        <span>
                          {Math.round((goal.progress / goal.maxProgress) * 100)}
                          %
                        </span>
                      </div>
                      <Progress
                        value={(goal.progress / goal.maxProgress) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div
                    className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ${
                      goal.completed
                        ? "bg-green-500 border-green-400"
                        : "border-white/30 hover:border-white/50"
                    } transition-colors`}
                  >
                    {goal.completed && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Motivational message */}
        <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg border-green-400/30 shadow-xl mt-8">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold text-white mb-2">¡Sigue así!</h3>
            <p className="text-white/80">
              Cada objetivo completado hace a tu mascota más feliz y saludable.
              ¡Mantén la racha de {streak} días!
            </p>
          </CardContent>
        </Card>
      </div>
    </OptimizedBackground>
  );
};
