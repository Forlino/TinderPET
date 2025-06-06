import { useState, useEffect } from "react";
import { DailyGoal, PetCareActivity, defaultDailyGoals } from "@/types/petCare";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Plus,
  Check,
  Clock,
  Target,
  Calendar,
  Trophy,
  Flame,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface DailyGoalsProps {
  onBack: () => void;
}

export const DailyGoals = ({ onBack }: DailyGoalsProps) => {
  const [goals, setGoals] = useState<DailyGoal[]>(defaultDailyGoals);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAddGoal, setShowAddGoal] = useState(false);

  const categories = [
    { id: "all", name: "Todos", icon: "📋" },
    { id: "exercise", name: "Ejercicio", icon: "🏃‍♂️" },
    { id: "nutrition", name: "Alimentación", icon: "🍽️" },
    { id: "health", name: "Salud", icon: "🏥" },
    { id: "hygiene", name: "Higiene", icon: "🛁" },
    { id: "play", name: "Juego", icon: "🎮" },
    { id: "training", name: "Entrenamiento", icon: "🎓" },
  ];

  const filteredGoals =
    selectedCategory === "all"
      ? goals
      : goals.filter((goal) => goal.category === selectedCategory);

  const completedGoals = goals.filter((goal) => goal.completed).length;
  const totalGoals = goals.length;
  const completionPercentage = Math.round((completedGoals / totalGoals) * 100);

  const updateGoalProgress = (goalId: string, increment: number) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id === goalId) {
          const newCurrent = Math.min(goal.current + increment, goal.target);
          const completed = newCurrent >= goal.target;
          return {
            ...goal,
            current: newCurrent,
            completed,
            completedAt:
              completed && !goal.completed ? new Date() : goal.completedAt,
            streak:
              completed && !goal.completed ? goal.streak + 1 : goal.streak,
          };
        }
        return goal;
      }),
    );
  };

  const toggleGoalCompletion = (goalId: string) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id === goalId) {
          const completed = !goal.completed;
          return {
            ...goal,
            completed,
            current: completed ? goal.target : 0,
            completedAt: completed ? new Date() : undefined,
            streak: completed ? goal.streak + 1 : goal.streak,
          };
        }
        return goal;
      }),
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressColor = (goal: DailyGoal) => {
    const percentage = (goal.current / goal.target) * 100;
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-gray-300";
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-600/30 via-teal-600/20 to-blue-600/30"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-lime-400 to-emerald-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-15 blur-3xl animate-pulse delay-500"></div>

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
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

      <div className="relative z-10 max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="lg"
              onClick={onBack}
              className="w-16 h-16 mr-6 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-8 h-8" />
            </Button>
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl lg:text-6xl font-black text-white drop-shadow-2xl flex items-center gap-4"
              >
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  🎯
                </motion.span>
                Objetivos Diarios
              </motion.h1>
              <p className="text-2xl text-white/90 mt-2 drop-shadow-lg">
                Cuida a tu animal día a día
              </p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setShowAddGoal(true)}
              className="bg-white/20 backdrop-blur-xl hover:bg-white/30 text-white text-xl px-8 py-6 border border-white/30 rounded-2xl shadow-2xl"
            >
              <Plus className="w-6 h-6 mr-3" />
              Agregar Objetivo
            </Button>
          </motion.div>
        </div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 mb-12 bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {completedGoals}/{totalGoals}
                </div>
                <div className="text-lg opacity-90">Objetivos Completados</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {completionPercentage}%
                </div>
                <div className="text-lg opacity-90">Progreso del Día</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  🔥 {Math.max(...goals.map((g) => g.streak))}
                </div>
                <div className="text-lg opacity-90">Mejor Racha</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  ⭐ {goals.filter((g) => g.streak > 7).length}
                </div>
                <div className="text-lg opacity-90">Hábitos Establecidos</div>
              </div>
            </div>
            <div className="mt-6">
              <Progress
                value={completionPercentage}
                className="h-4 bg-white/20"
              />
            </div>
          </Card>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 mb-8 justify-center"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-2xl text-lg font-medium transition-all backdrop-blur-xl border",
                selectedCategory === category.id
                  ? "bg-white/30 text-white shadow-lg scale-105 border-white/50"
                  : "bg-white/10 text-white/80 hover:bg-white/20 shadow-md border-white/20",
              )}
            >
              <span className="text-2xl">{category.icon}</span>
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  className={cn(
                    "p-6 relative overflow-hidden transition-all duration-300 hover:shadow-2xl backdrop-blur-xl border border-white/30",
                    goal.completed
                      ? "bg-white/30 shadow-xl"
                      : "bg-white/20 hover:bg-white/25",
                  )}
                >
                  {/* Priority Badge */}
                  <Badge
                    className={cn(
                      "absolute top-4 right-4",
                      getPriorityColor(goal.priority),
                    )}
                  >
                    {goal.priority === "urgent"
                      ? "🚨"
                      : goal.priority === "high"
                        ? "🔴"
                        : goal.priority === "medium"
                          ? "🟡"
                          : "🟢"}
                    {goal.priority.toUpperCase()}
                  </Badge>

                  {/* Streak Badge */}
                  {goal.streak > 0 && (
                    <Badge className="absolute top-4 left-4 bg-orange-500/80 text-white backdrop-blur-md">
                      <Flame className="w-4 h-4 mr-1" />
                      {goal.streak}
                    </Badge>
                  )}

                  {/* Goal Icon and Title */}
                  <div className="mb-6 mt-8">
                    <div className="text-6xl mb-4 text-center">{goal.icon}</div>
                    <h3 className="text-2xl font-bold text-white text-center drop-shadow-lg">
                      {goal.title}
                    </h3>
                    <p className="text-lg text-white/90 text-center mt-2">
                      {goal.description}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    {goal.type === "boolean" ? (
                      <div className="text-center">
                        <div
                          className={cn(
                            "w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto mb-4 transition-all backdrop-blur-md",
                            goal.completed
                              ? "border-green-400 bg-green-500/50 text-white"
                              : "border-white/50 text-white/60 hover:border-green-400/50",
                          )}
                        >
                          {goal.completed ? (
                            <Check className="w-10 h-10" />
                          ) : (
                            <Clock className="w-10 h-10" />
                          )}
                        </div>
                        <p className="text-lg font-medium text-white">
                          {goal.completed ? "¡Completado!" : "Pendiente"}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between text-lg font-medium mb-2 text-white">
                          <span>
                            {goal.current} {goal.unit}
                          </span>
                          <span className="text-white/70">
                            {goal.target} {goal.unit}
                          </span>
                        </div>
                        <Progress
                          value={(goal.current / goal.target) * 100}
                          className="h-3 mb-2 bg-white/20"
                        />
                        <p className="text-center text-sm text-white/80">
                          {Math.round((goal.current / goal.target) * 100)}%
                          completado
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {goal.type === "boolean" ? (
                      <Button
                        onClick={() => toggleGoalCompletion(goal.id)}
                        className={cn(
                          "flex-1 text-lg py-3 backdrop-blur-md border border-white/30",
                          goal.completed
                            ? "bg-green-500/80 hover:bg-green-600/80 text-white"
                            : "bg-blue-500/80 hover:bg-blue-600/80 text-white",
                        )}
                      >
                        {goal.completed ? (
                          <>
                            <Check className="w-5 h-5 mr-2" />
                            Completado
                          </>
                        ) : (
                          <>
                            <Target className="w-5 h-5 mr-2" />
                            Marcar Listo
                          </>
                        )}
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => updateGoalProgress(goal.id, 1)}
                          disabled={goal.completed}
                          className="flex-1 text-lg py-3 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          +1
                        </Button>
                        <Button
                          onClick={() =>
                            updateGoalProgress(
                              goal.id,
                              goal.target - goal.current,
                            )
                          }
                          disabled={goal.completed}
                          className="flex-1 bg-blue-500/80 hover:bg-blue-600/80 text-white text-lg py-3 backdrop-blur-md"
                        >
                          <Check className="w-5 h-5 mr-2" />
                          Completar
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Completion Time */}
                  {goal.completedAt && (
                    <p className="text-center text-sm text-green-300 mt-3">
                      ✅ Completado a las{" "}
                      {goal.completedAt.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Daily Summary */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card className="mt-12 p-8 bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-lg">
              📊 Resumen del Día
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-300">
                  {
                    goals.filter(
                      (g) => g.category === "exercise" && g.completed,
                    ).length
                  }
                </div>
                <div className="text-white/80">Ejercicio</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-300">
                  {
                    goals.filter(
                      (g) => g.category === "nutrition" && g.completed,
                    ).length
                  }
                </div>
                <div className="text-white/80">Alimentación</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-300">
                  {
                    goals.filter((g) => g.category === "health" && g.completed)
                      .length
                  }
                </div>
                <div className="text-white/80">Salud</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-300">
                  {
                    goals.filter((g) => g.category === "play" && g.completed)
                      .length
                  }
                </div>
                <div className="text-white/80">Juego</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
