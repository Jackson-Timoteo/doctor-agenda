import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PageContainer, PageContent, PageDescription, PageTitle } from "@/components/ui/page-container";
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
            {/* Cabeçalho com layout responsivo */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <PageTitle>Dashboard</PageTitle>
                    <PageDescription>
                        Tenha uma visão geral de todas as consultas da sua clínica.
                    </PageDescription>
                </div>

                <div>
                    <DatePicker />
                </div>
            </div>

            {/* Conteúdo principal */}
            <PageContent>
                <StatsCards
                    totalRevenue={totalRevenue.total ? Number(totalRevenue.total) : null}
                    totalAppointments={totalAppointments.total}
                    totalPatients={totalPatients.total}
                    totalDoctors={totalDoctors.total}
                />

                <div className="grid grid-cols-1 lg:grid-cols-[2.25fr_1fr] gap-4 mt-4">
                    <AppointmentsChart dailyAppointmentsData={dailyAppointmentsData} />
                    <DoctorsList doctors={topDoctors} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 mt-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Calendar className="text-muted-foreground" />
                                <CardTitle className="text-base">Agendamentos de hoje</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={appointmentsTableColumns}
                                data={todayAppointments}
                            />
                        </CardContent>
                    </Card>
                    <ListSpecialties topSpecialties={topSpecialties} />
                </div>
            </PageContent>
        </PageContainer>

    );
}

export default DashboardPage;

