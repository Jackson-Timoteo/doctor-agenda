import {
    CalendarIcon,
    DollarSignIcon,
    UserIcon,
    UsersIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/helpers/currency";

interface StatsCardsProps {
    totalRevenue: number | null;
    totalAppointments: number;
    totalPatients: number;
    totalDoctors: number;
}

const StatsCards = ({
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
}: StatsCardsProps) => {
    const stats = [
        {
            title: "Faturamento",
            value: totalRevenue ? formatCurrency(totalRevenue) : "R$ 0,00",
            icon: DollarSignIcon,
        },
        {
            title: "Agendamentos",
            value: totalAppointments.toString(),
            icon: CalendarIcon,
        },
        {
            title: "Pacientes",
            value: totalPatients.toString(),
            icon: UserIcon,
        },
        {
            title: "Médicos",
            value: totalDoctors.toString(),
            icon: UsersIcon,
        },
    ];

    return (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card key={stat.title} className="gap-2">
                        <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                            <div className="bg-primary/10 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full">
                                <Icon className="text-primary h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                            <CardTitle className="text-muted-foreground text-xs sm:text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-lg sm:text-xl lg:text-2xl font-bold break-all">
                                {stat.value}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default StatsCards;

