import {
    Activity,
    Baby,
    Bone,
    Brain,
    Eye,
    Hand,
    Heart,
    Hospital,
    Stethoscope,
} from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TopSpecialtiesProps {
    topSpecialties: {
        specialty: string;
        appointments: number;
    }[];
}

const getSpecialtyIcon = (specialty: string) => {
    const specialtyLower = specialty.toLowerCase();

    if (specialtyLower.includes("cardiolog")) return Heart;
    if (
        specialtyLower.includes("ginecolog") ||
        specialtyLower.includes("obstetri")
    )
        return Baby;
    if (specialtyLower.includes("pediatr")) return Activity;
    if (specialtyLower.includes("dermatolog")) return Hand;
    if (
        specialtyLower.includes("ortoped") ||
        specialtyLower.includes("traumatolog")
    )
        return Bone;
    if (specialtyLower.includes("oftalmolog")) return Eye;
    if (specialtyLower.includes("neurolog")) return Brain;

    return Stethoscope;
};

const getSpecialtyColor = (specialty: string) => {
    const specialtyLower = specialty.toLowerCase();

    if (specialtyLower.includes("cardiolog")) return "bg-red-500/10 text-red-600";
    if (
        specialtyLower.includes("ginecolog") ||
        specialtyLower.includes("obstetri")
    )
        return "bg-pink-500/10 text-pink-600";
    if (specialtyLower.includes("pediatr")) return "bg-blue-500/10 text-blue-600";
    if (specialtyLower.includes("dermatolog")) return "bg-orange-500/10 text-orange-600";
    if (
        specialtyLower.includes("ortoped") ||
        specialtyLower.includes("traumatolog")
    )
        return "bg-gray-500/10 text-gray-600";
    if (specialtyLower.includes("oftalmolog")) return "bg-green-500/10 text-green-600";
    if (specialtyLower.includes("neurolog")) return "bg-purple-500/10 text-purple-600";

    return "bg-blue-500/10 text-blue-600";
};

export default function TopSpecialties({
    topSpecialties,
}: TopSpecialtiesProps) {
    const maxAppointments = Math.max(
        ...topSpecialties.map((i) => i.appointments),
    );

    return (
        <Card className="mx-auto w-full shadow-sm border-0 bg-white">
            <CardContent className="p-4 sm:p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                            <Hospital className="h-5 w-5 text-purple-600" />
                        </div>
                        <CardTitle className="text-base font-semibold text-gray-900 sm:text-lg">
                            Especialidades
                        </CardTitle>
                    </div>
                </div>

                {/* Specialties List */}
                <div className="space-y-4 sm:space-y-6">
                    {topSpecialties.map((specialty) => {
                        const Icon = getSpecialtyIcon(specialty.specialty);
                        const colorClass = getSpecialtyColor(specialty.specialty);
                        // Porcentagem de ocupação da especialidade baseando-se no maior número de agendamentos
                        const progressValue =
                            (specialty.appointments / maxAppointments) * 100;

                        return (
                            <div
                                key={specialty.specialty}
                                className="flex items-center gap-3 sm:gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 -mx-2"
                            >
                                <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full flex-shrink-0 ${colorClass}`}>
                                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div className="flex w-full flex-col justify-center min-w-0 flex-1 gap-2">
                                    <div className="flex w-full justify-between items-center">
                                        <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                                            {specialty.specialty}
                                        </h3>
                                        <div className="text-right flex-shrink-0 ml-2">
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm sm:text-base font-semibold text-gray-900">
                                                    {specialty.appointments}
                                                </span>
                                                <span className="text-xs text-gray-500 hidden sm:inline">
                                                    agendamentos
                                                </span>
                                                <span className="text-xs text-gray-500 sm:hidden">
                                                    agend.
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Progress
                                        value={progressValue}
                                        className="w-full h-2 sm:h-3"
                                        style={{
                                            '--progress-background': colorClass.includes('red') ? '#ef4444' :
                                                colorClass.includes('pink') ? '#ec4899' :
                                                    colorClass.includes('blue') ? '#3b82f6' :
                                                        colorClass.includes('orange') ? '#f97316' :
                                                            colorClass.includes('gray') ? '#6b7280' :
                                                                colorClass.includes('green') ? '#22c55e' :
                                                                    colorClass.includes('purple') ? '#a855f7' :
                                                                        '#3b82f6'
                                        } as React.CSSProperties}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {topSpecialties.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                            <Hospital className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                            Nenhuma especialidade encontrada
                        </h3>
                        <p className="text-xs text-gray-500">
                            Os dados das especialidades aparecerão aqui quando disponíveis.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

