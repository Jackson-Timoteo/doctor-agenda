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
            color: "bg-green-500/10 text-green-600",
        },
        {
            title: "Agendamentos",
            value: totalAppointments.toString(),
            icon: CalendarIcon,
            color: "bg-blue-500/10 text-blue-600",
        },
        {
            title: "Pacientes",
            value: totalPatients.toString(),
            icon: UserIcon,
            color: "bg-purple-500/10 text-purple-600",
        },
        {
            title: "Médicos",
            value: totalDoctors.toString(),
            icon: UsersIcon,
            color: "bg-orange-500/10 text-orange-600",
        },
    ];

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card
                        key={stat.title}
                        className="transition-all duration-200 hover:shadow-md border-0 shadow-sm bg-white"
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4 sm:px-6 sm:pt-6">
                            <CardTitle className="text-sm font-medium text-muted-foreground leading-none">
                                {stat.title}
                            </CardTitle>
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.color} transition-colors`}>
                                <Icon className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                            <div className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                {stat.value}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                                {stat.title === "Faturamento" && "Total do período"}
                                {stat.title === "Agendamentos" && "Consultas marcadas"}
                                {stat.title === "Pacientes" && "Pacientes ativos"}
                                {stat.title === "Médicos" && "Profissionais cadastrados"}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default StatsCards;

