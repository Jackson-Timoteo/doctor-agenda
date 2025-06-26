import { Stethoscope } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface TopDoctorsProps {
    doctors: {
        id: string;
        name: string;
        specialty: string;
        appointments: number;
    }[];
}

export default function DoctorsList({ doctors }: TopDoctorsProps) {
    return (
        <Card className="mx-auto w-full shadow-sm border-0 bg-white">
            <CardContent className="p-4 sm:p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                            <Stethoscope className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-base font-semibold text-gray-900 sm:text-lg">
                            Médicos
                        </CardTitle>
                    </div>
                </div>

                {/* Doctors List */}
                <div className="space-y-4 sm:space-y-6">
                    {doctors.map((doctor) => (
                        <div 
                            key={doctor.id} 
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 -mx-2"
                        >
                            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-sm sm:text-base font-semibold text-gray-700">
                                        {doctor.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                                        {doctor.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                                        {doctor.specialty}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-2">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm sm:text-base font-semibold text-gray-900">
                                        {doctor.appointments}
                                    </span>
                                    <span className="text-xs text-gray-500 hidden sm:inline">
                                        Agendamentos
                                    </span>
                                    <span className="text-xs text-gray-500 sm:hidden">
                                        Agend.
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {doctors.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                            <Stethoscope className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                            Nenhum médico encontrado
                        </h3>
                        <p className="text-xs text-gray-500">
                            Os dados dos médicos aparecerão aqui quando disponíveis.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

