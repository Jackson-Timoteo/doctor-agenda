"use client";

import { CalendarIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { doctorsTable } from "@/db/schema";
import { formatCurrency } from "@/helpers/currency";

import { getAvailability } from "../_helpers/availability";
import UpsertDoctorForms from "./upsert-doctor-forms";

interface DoctorCardProps {
    doctor: typeof doctorsTable.$inferSelect;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
    const [isUpsertDoctorDialogOpen, setIsUpsertDoctorDialogOpen] = useState(false);
    const DoctorInitials = doctor.name.split(" ").map((name) => name[0]).join("");

    const availability = getAvailability(doctor);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback>{DoctorInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-sm font-medium">{doctor.name}</h3>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    </div>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col gap-2">
                <span>Disponibilidade:</span>
                <Badge variant="outline">
                    <CalendarIcon className="mr-2" />
                    {availability.from.format('dddd')} - {availability.to.format('dddd')}
                </Badge>
                <Badge variant="outline">
                    <ClockIcon className="mr-2" />
                    {availability.from.format('HH:mm')} as {" "} {availability.from.format('HH:mm')}
                </Badge>
                <Badge variant="outline">
                    <DollarSignIcon className="mr-2" />
                    {formatCurrency(doctor.appointmentPriceInCents)}
                </Badge>
            </CardContent>
            <Separator />
            <CardFooter>
                <Dialog open={isUpsertDoctorDialogOpen} onOpenChange={setIsUpsertDoctorDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">Ver detalhes</Button>
                    </DialogTrigger>
                </Dialog>
                <UpsertDoctorForms doctor={{
                    ...doctor,
                    availableFromTime: availability.from.format('HH:mm:ss'),
                    availableToTime: availability.to.format('HH:mm:ss'),
                }} onSuccess={() => setIsUpsertDoctorDialogOpen(false)} />
            </CardFooter>
        </Card>
    );
};

export default DoctorCard;