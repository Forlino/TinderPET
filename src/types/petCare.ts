export interface DailyGoal {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: "time" | "quantity" | "boolean" | "distance" | "weight";
  target: number;
  current: number;
  unit: string;
  completed: boolean;
  completedAt?: Date;
  streak: number;
  category:
    | "exercise"
    | "nutrition"
    | "health"
    | "hygiene"
    | "play"
    | "training";
  priority: "low" | "medium" | "high" | "urgent";
}

export interface PetCareActivity {
  id: string;
  goalId: string;
  timestamp: Date;
  value: number;
  notes?: string;
  photos?: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: "daily" | "weekly" | "monthly";
  nextDue: Date;
  completed: boolean;
  instructions: string;
}

export interface Vaccination {
  id: string;
  name: string;
  lastDate: Date;
  nextDue: Date;
  completed: boolean;
  veterinarian: string;
}

export const defaultDailyGoals: DailyGoal[] = [
  {
    id: "walk",
    title: "Paseo Diario",
    description: "Caminar al menos 30 minutos",
    icon: "🚶‍♂️",
    type: "time",
    target: 30,
    current: 0,
    unit: "minutos",
    completed: false,
    streak: 0,
    category: "exercise",
    priority: "high",
  },
  {
    id: "food-morning",
    title: "Desayuno",
    description: "Dar el desayuno (7:00 AM)",
    icon: "🍽️",
    type: "boolean",
    target: 1,
    current: 0,
    unit: "vez",
    completed: false,
    streak: 0,
    category: "nutrition",
    priority: "high",
  },
  {
    id: "food-evening",
    title: "Cena",
    description: "Dar la cena (6:00 PM)",
    icon: "🥘",
    type: "boolean",
    target: 1,
    current: 0,
    unit: "vez",
    completed: false,
    streak: 0,
    category: "nutrition",
    priority: "high",
  },
  {
    id: "water",
    title: "Agua Fresca",
    description: "Cambiar el agua 2 veces",
    icon: "💧",
    type: "quantity",
    target: 2,
    current: 0,
    unit: "veces",
    completed: false,
    streak: 0,
    category: "nutrition",
    priority: "medium",
  },
  {
    id: "play",
    title: "Tiempo de Juego",
    description: "Jugar al menos 20 minutos",
    icon: "🎾",
    type: "time",
    target: 20,
    current: 0,
    unit: "minutos",
    completed: false,
    streak: 0,
    category: "play",
    priority: "medium",
  },
  {
    id: "brush",
    title: "Cepillado",
    description: "Cepillar el pelo",
    icon: "🪮",
    type: "boolean",
    target: 1,
    current: 0,
    unit: "vez",
    completed: false,
    streak: 0,
    category: "hygiene",
    priority: "medium",
  },
  {
    id: "training",
    title: "Entrenamiento",
    description: "Sesión de entrenamiento",
    icon: "🎯",
    type: "time",
    target: 15,
    current: 0,
    unit: "minutos",
    completed: false,
    streak: 0,
    category: "training",
    priority: "low",
  },
  {
    id: "medication",
    title: "Medicamento",
    description: "Administrar medicamentos",
    icon: "💊",
    type: "boolean",
    target: 1,
    current: 0,
    unit: "vez",
    completed: false,
    streak: 0,
    category: "health",
    priority: "urgent",
  },
];
