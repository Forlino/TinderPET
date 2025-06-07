import { useState } from "react";
import { UserProfile } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, User, Save, MapPin, Calendar, Info } from "lucide-react";
import { OptimizedBackground } from "./OptimizedBackground";

interface UserProfileFormProps {
  profile?: UserProfile;
  onSave: (profile: UserProfile) => void;
  onCancel: () => void;
}

export const UserProfileForm = ({
  profile,
  onSave,
  onCancel,
}: UserProfileFormProps) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: profile?.name || "",
    age: profile?.age || "",
    location: profile?.location || "",
    bio: profile?.bio || "",
    petExperience: profile?.petExperience || "",
    livingSpace: profile?.livingSpace || "",
    workSchedule: profile?.workSchedule || "",
    petPreferences: profile?.petPreferences || "",
    hasOtherPets: profile?.hasOtherPets || false,
    email: profile?.email || "",
    phone: profile?.phone || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.age ||
      !formData.location ||
      !formData.email
    ) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    const userProfile: UserProfile = {
      id: profile?.id || `user-${Date.now()}`,
      name: formData.name,
      age: formData.age,
      location: formData.location,
      bio: formData.bio || "",
      petExperience: formData.petExperience || "",
      livingSpace: formData.livingSpace || "",
      workSchedule: formData.workSchedule || "",
      petPreferences: formData.petPreferences || "",
      hasOtherPets: formData.hasOtherPets || false,
      email: formData.email,
      phone: formData.phone || "",
      avatar: profile?.avatar || "",
      createdAt: profile?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(userProfile);
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <OptimizedBackground variant="purple" intensity="medium">
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onCancel}
            size="lg"
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 shadow-xl"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl lg:text-5xl font-black text-white">
            {profile ? "Editar Perfil" : "Crear Perfil"}
          </h1>
          <div></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-6 h-6" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-white">
                    Nombre completo *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/60"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="age" className="text-white">
                    Edad *
                  </Label>
                  <Input
                    id="age"
                    type="text"
                    value={formData.age}
                    onChange={(e) => updateField("age", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/60"
                    placeholder="Tu edad"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email" className="text-white">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/60"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white">
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/60"
                    placeholder="Tu número de teléfono"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="location"
                  className="text-white flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Ubicación *
                </Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-white/60"
                  placeholder="Ciudad, País"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="bio"
                  className="text-white flex items-center gap-2"
                >
                  <Info className="w-4 h-4" />
                  Sobre ti
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-white/60 min-h-24"
                  placeholder="Cuéntanos un poco sobre ti y por qué quieres adoptar una mascota..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Pet Experience */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                🐾 Experiencia con Mascotas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="petExperience" className="text-white">
                  Experiencia previa con mascotas
                </Label>
                <Select
                  value={formData.petExperience}
                  onValueChange={(value) => updateField("petExperience", value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Selecciona tu experiencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin experiencia</SelectItem>
                    <SelectItem value="some">Algo de experiencia</SelectItem>
                    <SelectItem value="experienced">
                      Muy experimentado
                    </SelectItem>
                    <SelectItem value="professional">
                      Profesional (veterinario, etc.)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="livingSpace" className="text-white">
                  Espacio de vivienda
                </Label>
                <Select
                  value={formData.livingSpace}
                  onValueChange={(value) => updateField("livingSpace", value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Selecciona tu tipo de vivienda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartamento</SelectItem>
                    <SelectItem value="house_no_yard">
                      Casa sin jardín
                    </SelectItem>
                    <SelectItem value="house_small_yard">
                      Casa con jardín pequeño
                    </SelectItem>
                    <SelectItem value="house_large_yard">
                      Casa con jardín grande
                    </SelectItem>
                    <SelectItem value="farm">Granja/Campo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="workSchedule" className="text-white">
                  Horario de trabajo
                </Label>
                <Select
                  value={formData.workSchedule}
                  onValueChange={(value) => updateField("workSchedule", value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Selecciona tu horario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Trabajo desde casa</SelectItem>
                    <SelectItem value="part_time">Tiempo parcial</SelectItem>
                    <SelectItem value="full_time">Tiempo completo</SelectItem>
                    <SelectItem value="travel">Viajo frecuentemente</SelectItem>
                    <SelectItem value="retired">Jubilado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="petPreferences" className="text-white">
                  Preferencias de mascota
                </Label>
                <Textarea
                  id="petPreferences"
                  value={formData.petPreferences}
                  onChange={(e) =>
                    updateField("petPreferences", e.target.value)
                  }
                  className="bg-white/10 border-white/20 text-white placeholder-white/60 min-h-20"
                  placeholder="Tamaño preferido, edad, características especiales..."
                />
              </div>

              <div>
                <Label className="text-white">¿Tienes otras mascotas?</Label>
                <div className="flex gap-4 mt-2">
                  <Button
                    type="button"
                    onClick={() => updateField("hasOtherPets", true)}
                    className={`${
                      formData.hasOtherPets
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    } border border-white/20`}
                  >
                    Sí
                  </Button>
                  <Button
                    type="button"
                    onClick={() => updateField("hasOtherPets", false)}
                    className={`${
                      !formData.hasOtherPets
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    } border border-white/20`}
                  >
                    No
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit button */}
          <div className="flex justify-center gap-4">
            <Button
              type="button"
              onClick={onCancel}
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-4"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 hover:from-purple-600 hover:via-violet-600 hover:to-purple-700 text-white px-8 py-4 font-bold shadow-xl"
            >
              <Save className="w-6 h-6 mr-2" />
              {profile ? "Guardar cambios" : "Crear perfil"}
            </Button>
          </div>
        </form>
      </div>
    </OptimizedBackground>
  );
};
