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
        <Card className="mx-auto w-full">
            <CardContent className="p-4 sm:p-6">
                <div className="mb-6 sm:mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Stethoscope className="text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
                        <CardTitle className="text-sm sm:text-base">Médicos</CardTitle>
                    </div>
                </div>

                {/* Doctors List */}
                <div className="space-y-4 sm:space-y-6">
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                                    <AvatarFallback className="bg-gray-100 text-sm sm:text-lg font-medium text-gray-600">
                                        {doctor.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-xs sm:text-sm font-medium truncate">
                                        {doctor.name}
                                    </h3>
                                    <p className="text-muted-foreground text-xs sm:text-sm truncate">
                                        {doctor.specialty}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <span className="text-muted-foreground text-xs sm:text-sm font-medium whitespace-nowrap">
                                    <span className="hidden sm:inline">
                                        {doctor.appointments} Agend...
                                    </span>
                                    <span className="sm:hidden">
                                        {doctor.appointments}
                                    </span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

