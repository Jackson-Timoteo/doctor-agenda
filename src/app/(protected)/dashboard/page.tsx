import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container";
import { getDashboard } from "@/data/get-dashboard";
import { auth } from "@/lib/auth";

import { appointmentsTableColumns } from "../appointments/_components/table-columns";
import AppointmentsChart from "./_components/appointments-chart";
import { DatePicker } from "./_components/date-picker";
import DoctorsList from "./_components/list-doctors";
import ListSpecialties from "./_components/list-specialties";
import StatsCards from "./_components/stats-card";

interface DashboardPageProps {
    searchParams: Promise<{
        from: string;
        to: string;
    }>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) {
        redirect("/authentication")
    }

    if (!session.user.clinic) {
        redirect("/clinic-form");
    }

    if (!session.user.plan) {
        redirect("/new-subscription");
    }

    const { from, to } = await searchParams;
    if (!from || !to) {
        redirect(`/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs().add(1, "month").format("YYYY-MM-DD")}`);
    }

    const {
        totalRevenue,
        totalAppointments,
        totalPatients,
        totalDoctors,
        topDoctors,
        topSpecialties,
        todayAppointments,
        dailyAppointmentsData } = await getDashboard({
            from, to, session: {
                user: {
                    clinic: {
                        id: session.user.clinic?.id
                    }
                }
            }
        });

    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Dashboard</PageTitle>
                    <PageDescription>
                        Tenha uma visão geral de todas as consultas da sua clínica.
                    </PageDescription>
                </PageHeaderContent>
                <PageActions>
                    <DatePicker />
                </PageActions>
            </PageHeader>
            <PageContent>
                {/* Stats Cards - Responsivo: 1 col (mobile) → 2 cols (tablet) → 4 cols (desktop) */}
                <StatsCards
                    totalRevenue={totalRevenue.total ? Number(totalRevenue.total) : null}
                    totalAppointments={totalAppointments.total}
                    totalPatients={totalPatients.total}
                    totalDoctors={totalDoctors.total}
                />

                {/* Chart and Doctors Section - Responsivo: empilhado (mobile/tablet) → lado a lado (desktop) */}
                <div className="grid gap-6 lg:grid-cols-[2.25fr_1fr]">
                    <AppointmentsChart
                        dailyAppointmentsData={dailyAppointmentsData}
                    />
                    <DoctorsList doctors={topDoctors} />
                </div>

                {/* Today's Appointments and Specialties - Responsivo: empilhado (mobile) → lado a lado (tablet+) */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="shadow-sm border-0 bg-white">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                </div>
                                <CardTitle className="text-base font-semibold text-gray-900 sm:text-lg">
                                    Agendamentos de hoje
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            {/* DataTable com scroll horizontal em mobile */}
                            <div className="overflow-x-auto -mx-4 sm:mx-0">
                                <div className="min-w-full px-4 sm:px-0">
                                    <DataTable
                                        columns={appointmentsTableColumns}
                                        data={todayAppointments}
                                    />
                                </div>
                            </div>

                            {/* Empty state para quando não há agendamentos */}
                            {todayAppointments.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                                        <Calendar className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                                        Nenhum agendamento hoje
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Os agendamentos de hoje aparecerão aqui.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <ListSpecialties topSpecialties={topSpecialties} />
                </div>
            </PageContent>
        </PageContainer>
    );
}

export default DashboardPage;

