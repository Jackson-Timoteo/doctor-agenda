"use client";

import "dayjs/locale/pt-br";

import dayjs from "dayjs";

dayjs.locale("pt-br");
import { DollarSign } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/helpers/currency";

interface DailyAppointment {
    date: string;
    appointments: number;
    revenue: number | null;
}

interface AppointmentsChartProps {
    dailyAppointmentsData: DailyAppointment[];
}

const AppointmentsChart = ({
    dailyAppointmentsData,
}: AppointmentsChartProps) => {
    // Gerar 21 dias: 10 antes + hoje + 10 depois
    const chartDays = Array.from({ length: 21 }).map((_, i) =>
        dayjs()
            .subtract(10 - i, "days")
            .format("YYYY-MM-DD"),
    );

    const chartData = chartDays.map((date) => {
        const dataForDay = dailyAppointmentsData.find((item) => item.date === date);
        return {
            date: dayjs(date).format("DD/MM"),
            fullDate: date,
            appointments: dataForDay?.appointments || 0,
            revenue: Number(dataForDay?.revenue || 0),
        };
    });

    const chartConfig = {
        appointments: {
            label: "Agendamentos",
            color: "#0B68F7",
        },
        revenue: {
            label: "Faturamento",
            color: "#10B981",
        },
    } satisfies ChartConfig;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-2 p-4 sm:p-6">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
                <CardTitle className="text-sm sm:text-base lg:text-lg">
                    Agendamentos e Faturamento
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
                <ChartContainer 
                    config={chartConfig} 
                    className="min-h-[200px] sm:min-h-[250px] lg:min-h-[300px] w-full"
                >
                    <AreaChart
                        data={chartData}
                        margin={{ 
                            top: 20, 
                            right: window.innerWidth < 640 ? 10 : 30, 
                            left: window.innerWidth < 640 ? 10 : 20, 
                            bottom: 5 
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            fontSize={window.innerWidth < 640 ? 10 : 12}
                            interval={window.innerWidth < 640 ? 2 : 0}
                        />
                        <YAxis
                            yAxisId="left"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            fontSize={window.innerWidth < 640 ? 10 : 12}
                            width={window.innerWidth < 640 ? 30 : 40}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            fontSize={window.innerWidth < 640 ? 10 : 12}
                            width={window.innerWidth < 640 ? 40 : 60}
                            tickFormatter={(value) => 
                                window.innerWidth < 640 
                                    ? `R$${(value / 1000).toFixed(0)}k`
                                    : formatCurrency(value)
                            }
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    formatter={(value, name) => {
                                        if (name === "revenue") {
                                            return (
                                                <>
                                                    <div className="h-3 w-3 rounded bg-[#10B981]" />
                                                    <span className="text-muted-foreground text-xs sm:text-sm">
                                                        Faturamento:
                                                    </span>
                                                    <span className="font-semibold text-xs sm:text-sm">
                                                        {formatCurrency(Number(value))}
                                                    </span>
                                                </>
                                            );
                                        }
                                        return (
                                            <>
                                                <div className="h-3 w-3 rounded bg-[#0B68F7]" />
                                                <span className="text-muted-foreground text-xs sm:text-sm">
                                                    Agendamentos:
                                                </span>
                                                <span className="font-semibold text-xs sm:text-sm">{value}</span>
                                            </>
                                        );
                                    }}
                                    labelFormatter={(label, payload) => {
                                        if (payload && payload[0]) {
                                            return dayjs(payload[0].payload?.fullDate).format(
                                                "DD/MM/YYYY (dddd)",
                                            );
                                        }
                                        return label;
                                    }}
                                />
                            }
                        />
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="appointments"
                            stroke="var(--color-appointments)"
                            fill="var(--color-appointments)"
                            fillOpacity={0.2}
                            strokeWidth={2}
                        />
                        <Area
                            yAxisId="right"
                            type="monotone"
                            dataKey="revenue"
                            stroke="var(--color-revenue)"
                            fill="var(--color-revenue)"
                            fillOpacity={0.2}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default AppointmentsChart;

